require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Change these two values to your actual admin credentials
const ADMIN_NAME = 'Store Owner';
const ADMIN_EMAIL = 'owner@sarisaristore.com';
const ADMIN_PASSWORD = 'ChangeMe123!';

async function createAdmin() {
  try {
    // 10 salt rounds is a solid default: strong enough to resist
    // brute-force attempts, fast enough not to slow down login noticeably
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [ADMIN_NAME, ADMIN_EMAIL, passwordHash]
    );

    console.log('Admin user created with id:', result.insertId);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
  }
}

createAdmin();