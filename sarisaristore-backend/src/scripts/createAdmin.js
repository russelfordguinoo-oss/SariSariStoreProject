require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdmin() {
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return false;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)`,
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash]
  );

  return true;
}

async function createAdmin() {
  try {
    if (!(await ensureAdmin())) {
      throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set');
    }
    console.log('Admin account is ready.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  createAdmin();
}

module.exports = { ensureAdmin };
