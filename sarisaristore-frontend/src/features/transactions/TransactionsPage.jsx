import { useEffect, useState } from 'react';
import { getReport } from '../../api/reports.api';

function today() { return new Date().toISOString().slice(0, 10); }
function firstOfMonth() { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10); }

function TransactionsPage() {
  const [startDate, setStartDate] = useState(firstOfMonth());
  const [endDate, setEndDate] = useState(today());
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTransactions() { setLoading(true); try { const data = await getReport(startDate, endDate); setSales(data.sales); } finally { setLoading(false); } }
  useEffect(() => { loadTransactions(); }, []);

  return <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-wide text-red-700">Sales record</p><h1 className="text-3xl font-extrabold">Transactions</h1><p className="mt-1 text-slate-500">Review completed sales for any date range.</p></div><div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end"><label className="text-sm font-semibold">From<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 p-2" /></label><label className="text-sm font-semibold">To<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 p-2" /></label><button onClick={loadTransactions} disabled={loading} className="rounded-lg bg-red-700 px-5 py-2.5 font-bold text-white hover:bg-red-800 disabled:opacity-50">{loading ? 'Loading...' : 'Show transactions'}</button></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Sale</th><th className="p-4">Cashier</th><th className="p-4">Date & time</th><th className="p-4 text-right">Amount</th></tr></thead><tbody>{!loading && sales.length === 0 ? <tr><td colSpan="4" className="p-6 text-center text-slate-500">No transactions found for this period.</td></tr> : sales.map((sale) => <tr key={sale.id} className="border-t border-slate-100"><td className="p-4 font-bold text-red-700">Sale #{sale.id}</td><td className="p-4">{sale.cashier_name}</td><td className="p-4 text-slate-500">{new Date(sale.created_at).toLocaleString()}</td><td className="p-4 text-right font-bold">₱{parseFloat(sale.total_amount).toFixed(2)}</td></tr>)}</tbody></table></div></div></div>;
}

export default TransactionsPage;
