import { useEffect, useState } from 'react';
import { getProducts } from '../../api/products.api';
import { getLowStock } from '../../api/inventory.api';
import StockHistoryModal from '../products/StockHistoryModal';
import { usePreferences } from '../../context/PreferencesContext';

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyProduct, setHistoryProduct] = useState(null);
  const { preferences } = usePreferences();
  const { inventory } = preferences;

  useEffect(() => {
    Promise.all([getProducts({}), getLowStock()]).then(([items, lowItems]) => {
      setProducts(items);
      setLowStock(lowItems);
      setLoading(false);
    });
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (inventory.sort === 'price') return Number(a.price) - Number(b.price);
    if (inventory.sort === 'stock') return Number(a.current_stock) - Number(b.current_stock);
    if (inventory.sort === 'date') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    return a.name.localeCompare(b.name);
  }).slice(0, Number(inventory.pageSize) || 25);
  const personalAlerts = products.filter((product) => Number(product.current_stock) <= Number(inventory.alertThreshold));

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-wide text-red-700">Stock control</p>
        <h1 className="text-3xl font-extrabold">Inventory</h1>
        <p className="mt-1 text-slate-500">Check stock levels and view each product's movement history.</p>
      </div>
      {(lowStock.length > 0 || personalAlerts.length > 0) && <div className="mb-5 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900"><strong>{Math.max(lowStock.length, personalAlerts.length)} item{Math.max(lowStock.length, personalAlerts.length) === 1 ? '' : 's'} need attention.</strong> Your saved alert level is {inventory.alertThreshold} unit(s).</div>}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? <p className="p-6 text-slate-500">Loading inventory...</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className={inventory.view === 'compact' ? 'p-2' : 'p-4'}>Product</th><th className={inventory.view === 'compact' ? 'p-2' : 'p-4'}>Category</th><th className={inventory.view === 'compact' ? 'p-2' : 'p-4'}>In stock</th><th className={inventory.view === 'compact' ? 'p-2' : 'p-4'}>Minimum</th><th className={inventory.view === 'compact' ? 'p-2' : 'p-4'}></th></tr></thead><tbody>{sortedProducts.map((product) => { const low = product.current_stock <= Number(inventory.alertThreshold); const padding = inventory.view === 'compact' ? 'p-2' : 'p-4'; return <tr key={product.id} className="border-t border-slate-100"><td className={`${padding} font-semibold`}>{product.name}</td><td className={`${padding} text-slate-500`}>{product.category_name || 'Uncategorized'}</td><td className={`${padding} font-bold ${low ? 'text-red-700' : 'text-slate-700'}`}>{product.current_stock}</td><td className={`${padding} text-slate-500`}>{product.low_stock_threshold}</td><td className={`${padding} text-right`}><button onClick={() => setHistoryProduct(product)} className="rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700 hover:bg-red-100">History</button></td></tr>; })}</tbody></table></div>
        )}
      </div>
      {historyProduct && <StockHistoryModal product={historyProduct} onClose={() => setHistoryProduct(null)} />}
    </div>
  );
}

export default InventoryPage;
