import { useState, useEffect } from 'react';
import { getStockHistory } from '../../api/inventory.api';

function StockHistoryModal({ product, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockHistory(product.id).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, [product.id]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Stock History — {product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400 text-sm">No stock changes recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Change</th>
                <th className="py-2">Stock After</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="py-2">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="py-2 capitalize">{log.change_type}</td>
                  <td className={`py-2 font-medium ${log.quantity_change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {log.quantity_change > 0 ? '+' : ''}{log.quantity_change}
                  </td>
                  <td className="py-2">{log.new_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StockHistoryModal;