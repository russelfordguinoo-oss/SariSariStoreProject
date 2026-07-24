const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('./products.controller');
const { verifyToken } = require('../auth/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, listProducts);
router.get('/:id', verifyToken, getProduct);
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;