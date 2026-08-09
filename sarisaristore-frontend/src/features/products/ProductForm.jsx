import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function ProductForm({ initialData, categories, onSubmit, onCancel, onCreateCategory }) {
  const [form, setForm] = useState({
    name: '',
    barcode: '',
    category_id: '',
    price: '',
    cost: '',
    current_stock: '',
    low_stock_threshold: '5',
  });
  const [showCategoryCreator, setShowCategoryCreator] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // If editing an existing product, pre-fill the form
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        barcode: initialData.barcode || '',
        category_id: initialData.category_id || '',
        price: initialData.price || '',
        cost: initialData.cost || '',
        current_stock: initialData.current_stock ?? '',
        low_stock_threshold: initialData.low_stock_threshold ?? '5',
      });
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      category_id: form.category_id || null,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost) || 0,
      current_stock: parseInt(form.current_stock) || 0,
      low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
    });
  }

  async function handleCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    setSavingCategory(true);
    setCategoryError('');
    try {
      const category = await onCreateCategory(name);
      setForm((current) => ({ ...current, category_id: String(category.id) }));
      setNewCategoryName('');
      setShowCategoryCreator(false);
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Unable to add this category.');
    } finally {
      setSavingCategory(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 sm:p-6">
      <div className="flex min-h-full items-start justify-center sm:items-center">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="my-0 w-full max-w-md rounded-lg bg-white p-6 shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Product' : 'Add Product'}
        </h2>

        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="off"
          className="w-full border rounded p-2 mb-3"
          required
        />

        <label className="block text-sm font-medium mb-1">Barcode</label>
        <input
          name="barcode"
          value={form.barcode}
          onChange={handleChange}
          autoComplete="off"
          className="w-full border rounded p-2 mb-3"
        />

        <div className="mb-1 flex items-center justify-between gap-3">
          <label className="text-sm font-medium">Category</label>
          <button type="button" onClick={() => { setShowCategoryCreator((visible) => !visible); setCategoryError(''); }} className="text-xs font-bold text-red-700 hover:text-red-800">{showCategoryCreator ? 'Cancel' : '+ New category'}</button>
        </div>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {showCategoryCreator && <div className="mb-3 rounded-lg border border-red-100 bg-red-50 p-3"><div className="flex gap-2"><input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category name" autoComplete="off" className="min-w-0 flex-1 rounded border border-slate-300 bg-white p-2 text-sm" /><button type="button" onClick={handleCreateCategory} disabled={savingCategory || !newCategoryName.trim()} className="rounded bg-red-700 px-3 text-sm font-bold text-white disabled:opacity-50">{savingCategory ? 'Adding...' : 'Add'}</button></div>{categoryError && <p className="mt-2 text-xs font-semibold text-red-700">{categoryError}</p>}</div>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              autoComplete="off"
              className="w-full border rounded p-2 mb-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost</label>
            <input
              name="cost"
              type="number"
              step="0.01"
              value={form.cost}
              onChange={handleChange}
              autoComplete="off"
              className="w-full border rounded p-2 mb-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              name="current_stock"
              type="number"
              value={form.current_stock}
              onChange={handleChange}
              autoComplete="off"
              className="w-full border rounded p-2 mb-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Low Stock At</label>
            <input
              name="low_stock_threshold"
              type="number"
              value={form.low_stock_threshold}
              onChange={handleChange}
              autoComplete="off"
              className="w-full border rounded p-2 mb-4"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 py-2 rounded font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>,
    document.body
  );
}

export default ProductForm;
