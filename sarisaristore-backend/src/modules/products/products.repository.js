const pool = require('../../config/db');

async function findAll({ search, categoryId }) {
  let query = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ' AND p.name LIKE ?';
    params.push(`%${search}%`);
  }

  if (categoryId) {
    query += ' AND p.category_id = ?';
    params.push(categoryId);
  }

  query += ' ORDER BY p.name';

  const [rows] = await pool.query(query, params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
}

async function create(product) {
  const { name, barcode, category_id, price, cost, current_stock, low_stock_threshold, image_url } = product;
  const [result] = await pool.query(
    `INSERT INTO products (name, barcode, category_id, price, cost, current_stock, low_stock_threshold, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, barcode || null, category_id || null, price, cost || 0, current_stock || 0, low_stock_threshold || 5, image_url || null]
  );
  return findById(result.insertId);
}

async function update(id, product) {
  const { name, barcode, category_id, price, cost, current_stock, low_stock_threshold, image_url } = product;
  await pool.query(
    `UPDATE products
     SET name = ?, barcode = ?, category_id = ?, price = ?, cost = ?, current_stock = ?, low_stock_threshold = ?, image_url = ?
     WHERE id = ?`,
    [name, barcode || null, category_id || null, price, cost || 0, current_stock, low_stock_threshold, image_url || null, id]
  );
  return findById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };