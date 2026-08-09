const salesRepository = require('./sales.repository');

function validateCart(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Cart cannot be empty');
    error.statusCode = 400;
    throw error;
  }
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      const error = new Error('Each item needs a valid productId and quantity');
      error.statusCode = 400;
      throw error;
    }
  }
}

async function checkout(userId, items, credit) {
  validateCart(items);
  if (credit && (!credit.customerId || credit.paymentType !== 'credit')) {
    const error = new Error('A customer is required for credit sales'); error.statusCode = 400; throw error;
  }
  return salesRepository.createSale(userId, items, credit);
}

module.exports = { checkout };
