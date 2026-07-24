import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products.api';
import { getCategories } from '../../api/categories.api';
import ProductForm from './ProductForm';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts({ search, categoryId: categoryFilter });
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Re-fetch whenever search or category filter changes
  useEffect(() => {
    loadProducts();
  }, [search, categoryFilter]);

  async function handleSave(formData) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await createProduct(formData);
    }
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await deleteProduct(id);
    loadProducts();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Price</th>
              <th className="py-2">Stock</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.category_name || '—'}</td>
                <td className="py-2">₱{parseFloat(p.price).toFixed(2)}</td>
                <td className="py-2">
                  <span className={p.current_stock <= p.low_stock_threshold ? 'text-red-600 font-semibold' : ''}>
                    {p.current_stock}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => { setEditingProduct(p); setShowForm(true); }}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}

export default ProductsPage;