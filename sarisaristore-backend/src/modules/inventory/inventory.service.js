const inventoryRepository = require('./inventory.repository');

async function getLowStock() {
  return inventoryRepository.findLowStock();
}

async function getHistory(productId) {
  return inventoryRepository.findHistoryByProduct(productId);
}

async function adjustStock(productId, quantityChange, reason) {
  if (!quantityChange || quantityChange === 0) {
    const error = new Error('Quantity change cannot be zero');
    error.statusCode = 400;
    throw error;
  }
  const validReasons = ['restock', 'correction', 'damaged', 'other'];
  if (!validReasons.includes(reason)) {
    const error = new Error(`Reason must be one of: ${validReasons.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
  return inventoryRepository.adjustStock(productId, quantityChange, reason);
}

module.exports = { getLowStock, getHistory, adjustStock };