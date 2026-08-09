const pool = require('../../config/db');

// Fetches a product's current stock and price, "locking" that row so no
// other simultaneous sale can read/change it until this transaction finishes
async function getProductForUpdate(connection, productId) {
  const [rows] = await connection.query(
    'SELECT id, name, price, current_stock FROM products WHERE id = ? FOR UPDATE',
    [productId]
  );
  return rows[0];
}

async function createSale(userId, items, credit) {
  // items: [{ productId, quantity }]
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let totalAmount = 0;
    const saleItemsData = [];

    // Step 1: validate stock and calculate totals for every item first,
    // before writing anything — if any item fails, nothing has been saved yet
    for (const item of items) {
      const product = await getProductForUpdate(connection, item.productId);

      if (!product) {
        throw Object.assign(new Error(`Product ${item.productId} not found`), { statusCode: 404 });
      }
      if (product.current_stock < item.quantity) {
        throw Object.assign(
          new Error(`Insufficient stock for ${product.name}. Available: ${product.current_stock}`),
          { statusCode: 400 }
        );
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      saleItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
        previousStock: product.current_stock,
        newStock: product.current_stock - item.quantity,
      });
    }

    // Step 2: insert the sale record
    const [saleResult] = await connection.query(
      'INSERT INTO sales (user_id, total_amount) VALUES (?, ?)',
      [userId, totalAmount]
    );
    const saleId = saleResult.insertId;

    let creditId = null;
    if (credit?.paymentType === 'credit') {
      const [[customer]] = await connection.query('SELECT id, credit_limit FROM customers WHERE id = ? AND is_archived = 0 FOR UPDATE', [credit.customerId]);
      if (!customer) throw Object.assign(new Error('Customer not found or archived'), { statusCode: 404 });
      const [[balanceRow]] = await connection.query('SELECT COALESCE(SUM(balance), 0) AS balance FROM customer_credits WHERE customer_id = ? FOR UPDATE', [customer.id]);
      const projectedBalance = Number(balanceRow.balance) + totalAmount;
      if (customer.credit_limit !== null && projectedBalance > Number(customer.credit_limit) && !credit.confirmLimitExceeded) {
        throw Object.assign(new Error('This sale exceeds the customer credit limit. Confirm to continue.'), { statusCode: 409, code: 'CREDIT_LIMIT_EXCEEDED', projectedBalance, creditLimit: Number(customer.credit_limit) });
      }
      const [creditResult] = await connection.query('INSERT INTO customer_credits (customer_id, sale_id, original_amount, balance, due_date) VALUES (?, ?, ?, ?, ?)', [customer.id, saleId, totalAmount, totalAmount, credit.dueDate || null]);
      creditId = creditResult.insertId;
    }

    // Step 3: insert each sale item, update stock, and log the inventory change
    for (const item of saleItemsData) {
      await connection.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [saleId, item.productId, item.quantity, item.unitPrice, item.subtotal]
      );

      await connection.query(
        'UPDATE products SET current_stock = ? WHERE id = ?',
        [item.newStock, item.productId]
      );

      await connection.query(
        `INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_stock, new_stock, reference_sale_id)
         VALUES (?, 'sale', ?, ?, ?, ?)`,
        [item.productId, -item.quantity, item.previousStock, item.newStock, saleId]
      );
    }

    // Everything succeeded — make it permanent
    await connection.commit();

    return { id: saleId, totalAmount, itemCount: saleItemsData.length, creditId };
  } catch (err) {
    // Anything failed above — undo all of it, as if none of it happened
    await connection.rollback();
    throw err;
  } finally {
    // Always release the connection back to the pool, success or failure
    connection.release();
  }
}

module.exports = { createSale };
