const inventoryService = require('./inventory.service');

async function lowStock(req, res, next) {
  try {
    const products = await inventoryService.getLowStock();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function history(req, res, next) {
  try {
    const logs = await inventoryService.getHistory(req.params.productId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

async function adjust(req, res, next) {
  try {
    const { quantityChange, reason } = req.body;
    const result = await inventoryService.adjustStock(req.params.productId, quantityChange, reason);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { lowStock, history, adjust };