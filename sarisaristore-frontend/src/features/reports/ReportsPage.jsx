import { useState } from 'react';
import { getReport, exportReport } from '../../api/reports.api';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}
function firstOfMonthStr() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
}

function ReportsPage() {
  const [startDate, setStartDate] = useState(firstOfMonthStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const data = await getReport(startDate, endDate);
    setReport(data);
    setLoading(false);
  }

  async function handleExport() {
    setExporting(true);
    await exportReport(startDate, endDate);
    setExporting(false);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="flex items-end gap-3 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
        {report && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export to Excel'}
          </button>
        )}
      </div>

      {report && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">₱{parseFloat(report.summary.totalRevenue).toFixed(2)}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold">{report.summary.totalTransactions}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h2 className="font-bold mb-3">Best Sellers</h2>
              {report.bestSellers.length === 0 ? (
                <p className="text-gray-400 text-sm">No sales in this range</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-600">
                      <th className="py-2">Product</th>
                      <th className="py-2">Units</th>
                      <th className="py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.bestSellers.map((b) => (
                      <tr key={b.id} className="border-b last:border-0">
                        <td className="py-2">{b.name}</td>
                        <td className="py-2">{b.unitsSold}</td>
                        <td className="py-2">₱{parseFloat(b.revenue).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="font-bold mb-3">Transactions</h2>
              {report.sales.length === 0 ? (
                <p className="text-gray-400 text-sm">No sales in this range</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {report.sales.map((s) => (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="py-2">
                          <p className="font-medium">Sale #{s.id}</p>
                          <p className="text-xs text-gray-400">{s.cashier_name}</p>
                        </td>
                        <td className="py-2 text-right">
                          <p className="font-medium">₱{parseFloat(s.total_amount).toFixed(2)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(s.created_at).toLocaleString()}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsPage;