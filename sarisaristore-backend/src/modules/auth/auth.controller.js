const authService = require('./auth.service');

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err); // passes to a shared error handler, which we'll add next
  }
}

module.exports = { loginController };