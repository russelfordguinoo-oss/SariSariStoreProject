const pool = require('../../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
  return rows;
}

async function create(name) {
  const [result] = await pool.query(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  );
  return { id: result.insertId, name };
}

module.exports = { findAll, create };