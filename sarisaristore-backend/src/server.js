require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const { runMigrations } = require('./scripts/migrate');
const { ensureAdmin } = require('./scripts/createAdmin');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully');
    connection.release();

    await runMigrations();
    const adminReady = await ensureAdmin();
    console.log(adminReady ? 'Admin account is ready.' : 'Admin seeding skipped.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
  
}

start();
