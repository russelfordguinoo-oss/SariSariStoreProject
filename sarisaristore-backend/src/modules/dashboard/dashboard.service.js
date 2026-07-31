const dashboardRepository = require('./dashboard.repository');

async function getSummary() {
  const [today, month, totalProducts, lowStockCount, recentTransactions, salesTrend] = await Promise.all([
    dashboardRepository.getTodaySales(),
    dashboardRepository.getMonthSales(),
    dashboardRepository.getTotalProducts(),
    dashboardRepository.getLowStockCount(),
    dashboardRepository.getRecentTransactions(),
    dashboardRepository.getSalesLast7Days(),
  ]);

  return {
    todaySales: { total: today.total, count: today.count },
    monthSales: { total: month.total, count: month.count },
    totalProducts,
    lowStockCount,
    recentTransactions,
    salesTrend,
  };
}

module.exports = { getSummary };