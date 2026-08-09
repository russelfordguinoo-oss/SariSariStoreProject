const fs = require('fs/promises');
const path = require('path');
const pool = require('../config/db');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    const statements = sql.split(/;\s*(?:\r?\n|$)/).filter((statement) => statement.trim());

    for (const statement of statements) {
      await pool.query(statement);
    }
  }
}

module.exports = { runMigrations };
