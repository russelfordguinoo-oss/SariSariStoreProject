const express = require('express');
const { lowStock, history, adjust } = require('./inventory.controller');
const { verifyToken } = require('../auth/auth.middleware');

const router = express.Router();

router.get('/low-stock', verifyToken, lowStock);
router.get('/history/:productId', verifyToken, history);
router.post('/adjust/:productId', verifyToken, adjust);

module.exports = router;