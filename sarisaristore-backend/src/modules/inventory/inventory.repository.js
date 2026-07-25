const pool = require('../../config/db');

async function findLowStock() {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.current_stock <= p.low_stock_threshold
     ORDER BY p.current_stock ASC`
  );
  return rows;
}

async function findHistoryByProduct(productId) {
  const [rows] = await pool.query(
    `SELECT * FROM inventory_logs
     WHERE product_id = ?
     ORDER BY created_at DESC`,
    [productId]
  );
  return rows;
}

// Manual stock adjustment — separate from the sale-based decrement in sales.repository.js
async function adjustStock(productId, quantityChange, reason) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT current_stock FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );
    const product = rows[0];
    if (!product) {
      throw Object.assign(new Error('Product not found'), { statusCode: 404 });
    }

    const newStock = product.current_stock + quantityChange;
    if (newStock < 0) {
      throw Object.assign(new Error('Adjustment would result in negative stock'), { statusCode: 400 });
    }

    await connection.query('UPDATE products SET current_stock = ? WHERE id = ?', [newStock, productId]);

    await connection.query(
      `INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_stock, new_stock, reference_sale_id)
       VALUES (?, ?, ?, ?, ?, NULL)`,
      [productId, reason, quantityChange, product.current_stock, newStock]
    );

    await connection.commit();
    return { productId, previousStock: product.current_stock, newStock };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = { findLowStock, findHistoryByProduct, adjustStock };