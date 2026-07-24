const categoriesService = require('./categories.service');

async function listCategories(req, res, next) {
  try {
    const categories = await categoriesService.getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function addCategory(req, res, next) {
  try {
    const category = await categoriesService.createCategory(req.body.name);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, addCategory };