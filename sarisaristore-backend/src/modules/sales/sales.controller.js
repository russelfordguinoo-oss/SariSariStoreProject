const salesService = require('./sales.service');

async function checkout(req, res, next) {
  try {
    const result = await salesService.checkout(req.user.userId, req.body.items, req.body.credit);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { checkout };
