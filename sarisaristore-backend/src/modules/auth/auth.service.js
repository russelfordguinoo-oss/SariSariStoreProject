const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

async function login(email, password) {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = ?',
    [email]
  );

  const user = rows[0];
  if (!user) {
    // Same error for "no such user" and "wrong password" — don't reveal
    // which one it was, that helps attackers enumerate valid emails
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

module.exports = { login };