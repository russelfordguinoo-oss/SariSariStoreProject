const pool = require('../../config/db');

async function getTodaySales() {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(total_amount), 0) AS total, COUNT(*) AS count
     FROM sales
     WHERE DATE(created_at) = CURDATE()`
  );
  return rows[0];
}

async function getMonthSales() {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(total_amount), 0) AS total, COUNT(*) AS count
     FROM sales
     WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())`
  );
  return rows[0];
}

async function getTotalProducts() {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM products');
  return rows[0].count;
}

async function getLowStockCount() {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS count FROM products WHERE current_stock <= low_stock_threshold'
  );
  return rows[0].count;
}

async function getRecentTransactions(limit = 5) {
  const [rows] = await pool.query(
    `SELECT s.id, s.total_amount, s.created_at, u.name AS cashier_name
     FROM sales s
     JOIN users u ON s.user_id = u.id
     ORDER BY s.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}

// Last 7 days of sales totals, for the chart — fills in zero for days with no sales
async function getSalesLast7Days() {
  const [rows] = await pool.query(
    `SELECT DATE(created_at) AS date, SUM(total_amount) AS total
     FROM sales
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     GROUP BY DATE(created_at)
     ORDER BY date ASC`
  );
  return rows;
}

module.exports = {
  getTodaySales,
  getMonthSales,
  getTotalProducts,
  getLowStockCount,
  getRecentTransactions,
  getSalesLast7Days,
};