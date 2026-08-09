import { useState, useEffect } from 'react';

function ProductForm({ initialData, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    barcode: '',
    category_id: '',
    price: '',
    cost: '',
    current_stock: '',
    low_stock_threshold: '5',
  });

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

  return (
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

        <label className="block text-sm font-medium mb-1">Category</label>
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
    </div>
  );
}

export default ProductForm;
