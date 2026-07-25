const express = require('express');
const { checkout } = require('./sales.controller');
const { verifyToken } = require('../auth/auth.middleware');

const router = express.Router();

router.post('/checkout', verifyToken, checkout);

module.exports = router;