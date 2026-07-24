const express = require('express');
const { loginController } = require('./auth.controller');
const { verifyToken } = require('./auth.middleware');

const router = express.Router();

router.post('/login', loginController);

// Temporary test route — we'll remove this once Products/Sales exist
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = router;