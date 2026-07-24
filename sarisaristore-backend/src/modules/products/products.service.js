const productsRepository = require('./products.repository');

async function listProducts(filters) {
  return productsRepository.findAll(filters);
}

async function getProduct(id) {
  const product = await productsRepository.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return product;
}

function validateProduct(data) {
  if (!data.name || !data.name.trim()) {
    const error = new Error('Product name is required');
    error.statusCode = 400;
    throw error;
  }
  if (data.price === undefined || data.price < 0) {
    const error = new Error('A valid price is required');
    error.statusCode = 400;
    throw error;
  }
}

async function createProduct(data) {
  validateProduct(data);
  return productsRepository.create(data);
}

async function updateProduct(id, data) {
  await getProduct(id); // throws 404 if it doesn't exist
  validateProduct(data);
  return productsRepository.update(id, data);
}

async function deleteProduct(id) {
  await getProduct(id); // throws 404 if it doesn't exist
  return productsRepository.remove(id);
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };