const ExcelJS = require('exceljs');
const reportsRepository = require('./reports.repository');

function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    const error = new Error('startDate and endDate are required (YYYY-MM-DD)');
    error.statusCode = 400;
    throw error;
  }
}

async function getReport(startDate, endDate) {
  validateDateRange(startDate, endDate);
  const [summary, sales, bestSellers] = await Promise.all([
    reportsRepository.getSummaryByDateRange(startDate, endDate),
    reportsRepository.getSalesByDateRange(startDate, endDate),
    reportsRepository.getBestSellers(startDate, endDate),
  ]);
  return { summary, sales, bestSellers };
}

async function generateExcelReport(startDate, endDate) {
  validateDateRange(startDate, endDate);
  const { summary, sales, bestSellers } = await getReport(startDate, endDate);

  const workbook = new ExcelJS.Workbook();

  // Sheet 1: Summary
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 25 },
    { header: 'Value', key: 'value', width: 20 },
  ];
  summarySheet.addRow({ metric: 'Date Range', value: `${startDate} to ${endDate}` });
  summarySheet.addRow({ metric: 'Total Revenue', value: summary.totalRevenue });
  summarySheet.addRow({ metric: 'Total Transactions', value: summary.totalTransactions });

  // Sheet 2: Sales detail
  const salesSheet = workbook.addWorksheet('Sales');
  salesSheet.columns = [
    { header: 'Sale ID', key: 'id', width: 10 },
    { header: 'Date', key: 'created_at', width: 20 },
    { header: 'Cashier', key: 'cashier_name', width: 20 },
    { header: 'Total', key: 'total_amount', width: 15 },
  ];
  sales.forEach((s) => salesSheet.addRow(s));

  // Sheet 3: Best sellers
  const bestSheet = workbook.addWorksheet('Best Sellers');
  bestSheet.columns = [
    { header: 'Product', key: 'name', width: 30 },
    { header: 'Units Sold', key: 'unitsSold', width: 15 },
    { header: 'Revenue', key: 'revenue', width: 15 },
  ];
  bestSellers.forEach((b) => bestSheet.addRow(b));

  return workbook;
}

module.exports = { getReport, generateExcelReport };