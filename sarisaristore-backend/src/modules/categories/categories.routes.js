const express = require('express');
const { listCategories, addCategory } = require('./categories.controller');
const { verifyToken } = require('../auth/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, listCategories);
router.post('/', verifyToken, addCategory);

module.exports = router;