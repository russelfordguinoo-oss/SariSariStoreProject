import { useState, useEffect } from 'react';
import { getProducts } from '../../api/products.api';
import { checkout } from '../../api/sales.api';
import { getCreditCustomers } from '../../api/credits.api';

function SalesPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [paymentType, setPaymentType] = useState('full');
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [confirmLimitExceeded, setConfirmLimitExceeded] = useState(false);

  useEffect(() => {
    getProducts({ search }).then(setProducts);
  }, [search]);
  useEffect(() => { getCreditCustomers().then(setCustomers); }, []);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Don't let cart quantity exceed what's actually in stock
        if (existing.quantity >= product.current_stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function changeQuantity(productId, delta) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  async function handleCheckout() {
    setError('');
    setSuccessMessage('');
    setProcessing(true);
    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      const credit = paymentType === 'credit' ? { paymentType: 'credit', customerId, dueDate: dueDate || null, confirmLimitExceeded } : undefined;
      if (paymentType === 'credit' && !customerId) { setError('Select a customer before recording credit.'); setProcessing(false); return; }
      const result = await checkout(items, credit);
      setSuccessMessage(`Sale #${result.id} completed — total ₱${result.totalAmount.toFixed(2)}`);
      setCart([]);
      // Refresh product list so stock numbers reflect the sale
      getProducts({ search }).then(setProducts);
    } catch (err) {
      if (err.response?.data?.code === 'CREDIT_LIMIT_EXCEEDED') { setError(`${err.response.data.message} Tick the confirmation box to continue.`); return; }
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-3 lg:p-8">
      {/* Product search + grid */}
      <div className="lg:col-span-2">
        <div className="mb-4"><p className="text-sm font-bold uppercase tracking-wide text-red-700">Quick checkout</p><h1 className="text-3xl font-extrabold">New Sale</h1></div>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.current_stock === 0}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-yellow-400 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">
                ₱{parseFloat(p.price).toFixed(2)} • Stock: {p.current_stock}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
        <h2 className="text-lg font-bold mb-3">Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm">No items yet</p>
        ) : (
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-gray-500">₱{parseFloat(item.product.price).toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQuantity(item.product.id, -1)}
                    className="w-6 h-6 border rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => changeQuantity(item.product.id, 1)}
                    className="w-6 h-6 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-3 mb-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
        <fieldset className="mb-4 rounded-xl border border-slate-200 p-3"><legend className="px-1 text-sm font-bold">Payment type</legend><div className="flex gap-3 text-sm"><label className="flex items-center gap-2"><input type="radio" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} /> Pay in full</label><label className="flex items-center gap-2"><input type="radio" checked={paymentType === 'credit'} onChange={() => setPaymentType('credit')} /> Customer credit (Utang)</label></div>{paymentType === 'credit' && <div className="mt-3 space-y-2"><select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-lg border p-2 text-sm"><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name} — balance ₱{Number(customer.outstanding_balance).toFixed(2)}</option>)}</select><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border p-2 text-sm" /><label className="flex gap-2 text-xs text-slate-600"><input type="checkbox" checked={confirmLimitExceeded} onChange={(e) => setConfirmLimitExceeded(e.target.checked)} /> I confirm this sale can proceed if it exceeds the customer’s credit limit.</label><a href="/credits" className="block text-xs font-bold text-red-700">+ Add or manage customers</a></div>}</fieldset>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">{error}</p>
        )}
        {successMessage && (
          <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-3">{successMessage}</p>
        )}

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || processing}
          className="w-full rounded-lg bg-red-700 py-3 font-bold text-white hover:bg-red-800 disabled:opacity-50"
        >
          {processing ? 'Processing...' : paymentType === 'credit' ? 'Record Credit Sale' : 'Complete Sale'}
        </button>
      </div>
    </div>
  );
}

export default SalesPage;
