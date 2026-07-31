const express = require('express');
const { getSummary } = require('./dashboard.controller');
const { verifyToken } = require('../auth/auth.middleware');

const router = express.Router();

router.get('/summary', verifyToken, getSummary);

module.exports = router;