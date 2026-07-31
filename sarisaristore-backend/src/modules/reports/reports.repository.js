const pool = require('../../config/db');

// startDate/endDate as 'YYYY-MM-DD' strings
async function getSalesByDateRange(startDate, endDate) {
  const [rows] = await pool.query(
    `SELECT s.id, s.total_amount, s.created_at, u.name AS cashier_name
     FROM sales s
     JOIN users u ON s.user_id = u.id
     WHERE DATE(s.created_at) BETWEEN ? AND ?
     ORDER BY s.created_at DESC`,
    [startDate, endDate]
  );
  return rows;
}

async function getSummaryByDateRange(startDate, endDate) {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue, COUNT(*) AS totalTransactions
     FROM sales
     WHERE DATE(created_at) BETWEEN ? AND ?`,
    [startDate, endDate]
  );
  return rows[0];
}

async function getBestSellers(startDate, endDate, limit = 10) {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, SUM(si.quantity) AS unitsSold, SUM(si.subtotal) AS revenue
     FROM sale_items si
     JOIN sales s ON si.sale_id = s.id
     JOIN products p ON si.product_id = p.id
     WHERE DATE(s.created_at) BETWEEN ? AND ?
     GROUP BY p.id, p.name
     ORDER BY unitsSold DESC
     LIMIT ?`,
    [startDate, endDate, limit]
  );
  return rows;
}

module.exports = { getSalesByDateRange, getSummaryByDateRange, getBestSellers };