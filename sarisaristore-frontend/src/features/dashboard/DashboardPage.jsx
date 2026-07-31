import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../api/dashboard.api';

function StatCard({ label, value, sublabel }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
    </div>
  );
}

function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
  }, []);

  if (!summary) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }

  const maxTrendValue = Math.max(...summary.salesTrend.map((d) => parseFloat(d.total)), 1);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Today's Sales"
          value={`₱${parseFloat(summary.todaySales.total).toFixed(2)}`}
          sublabel={`${summary.todaySales.count} transaction${summary.todaySales.count === 1 ? '' : 's'}`}
        />
        <StatCard
          label="This Month"
          value={`₱${parseFloat(summary.monthSales.total).toFixed(2)}`}
          sublabel={`${summary.monthSales.count} transaction${summary.monthSales.count === 1 ? '' : 's'}`}
        />
        <StatCard label="Total Products" value={summary.totalProducts} />
        <StatCard
          label="Low Stock"
          value={summary.lowStockCount}
          sublabel={summary.lowStockCount > 0 ? 'needs attention' : 'all good'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales trend chart */}
        <div className="border rounded-lg p-4">
          <h2 className="font-bold mb-4">Sales — Last 7 Days</h2>
          <div className="flex items-end gap-2 h-40">
            {summary.salesTrend.length === 0 ? (
              <p className="text-gray-400 text-sm">No sales data yet</p>
            ) : (
              summary.salesTrend.map((day) => {
                const heightPct = (parseFloat(day.total) / maxTrendValue) * 100;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${heightPct}%`, minHeight: day.total > 0 ? '4px' : '0' }}
                      title={`₱${parseFloat(day.total).toFixed(2)}`}
                    />
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="border rounded-lg p-4">
          <h2 className="font-bold mb-4">Recent Transactions</h2>
          {summary.recentTransactions.length === 0 ? (
            <p className="text-gray-400 text-sm">No transactions yet</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {summary.recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-2">
                      <p className="font-medium">Sale #{t.id}</p>
                      <p className="text-xs text-gray-400">{t.cashier_name}</p>
                    </td>
                    <td className="py-2 text-right">
                      <p className="font-medium">₱{parseFloat(t.total_amount).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(t.created_at).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;