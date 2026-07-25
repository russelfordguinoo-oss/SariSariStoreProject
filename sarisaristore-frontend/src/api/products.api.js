import axiosClient from './axiosClient';

export async function getProducts({ search, categoryId } = {}) {
  const params = {};
  if (search) params.search = search;
  if (categoryId) params.categoryId = categoryId;
  const response = await axiosClient.get('/products', { params });
  return response.data;
}

export async function createProduct(data) {
  const response = await axiosClient.post('/products', data);
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await axiosClient.put(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id) {
  await axiosClient.delete(`/products/${id}`);
}
export async function getLowStock() {
  const response = await axiosClient.get('/inventory/low-stock');
  return response.data;
}

export async function getStockHistory(productId) {
  const response = await axiosClient.get(`/inventory/history/${productId}`);
  return response.data;
}