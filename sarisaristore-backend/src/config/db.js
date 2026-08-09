const mysql = require('mysql2/promise');
require('dotenv').config();

const ssl = process.env.DB_SSL === 'true'
  ? {
      ca: process.env.DB_SSL_CA,
      rejectUnauthorized: true,
    }
  : undefined;

// A connection pool, not a single connection: Express handles many
// requests concurrently, and a pool lets multiple queries run in
// parallel without waiting on one shared connection.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
