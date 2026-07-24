const categoriesRepository = require('./categories.repository');

async function getAllCategories() {
  return categoriesRepository.findAll();
}

async function createCategory(name) {
  if (!name || !name.trim()) {
    const error = new Error('Category name is required');
    error.statusCode = 400;
    throw error;
  }
  return categoriesRepository.create(name.trim());
}

module.exports = { getAllCategories, createCategory };