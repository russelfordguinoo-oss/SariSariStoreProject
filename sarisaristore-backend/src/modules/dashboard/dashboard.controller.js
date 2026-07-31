const dashboardService = require('./dashboard.service');

async function getSummary(req, res, next) {
  try {
    const summary = await dashboardService.getSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };