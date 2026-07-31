const reportsService = require('./reports.service');

async function getReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportsService.getReport(startDate, endDate);
    res.json(report);
  } catch (err) {
    next(err);
  }
}

async function exportReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const workbook = await reportsService.generateExcelReport(startDate, endDate);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="sales-report-${startDate}-to-${endDate}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getReport, exportReport };