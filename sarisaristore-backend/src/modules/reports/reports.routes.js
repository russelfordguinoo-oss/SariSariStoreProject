const express = require('express');
const { getReport, exportReport } = require('./reports.controller');
const { verifyToken } = require('../auth/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getReport);
router.get('/export', verifyToken, exportReport);

module.exports = router;