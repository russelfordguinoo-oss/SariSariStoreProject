import axiosClient from './axiosClient';

export async function getLowStock() {
  const response = await axiosClient.get('/inventory/low-stock');
  return response.data;
}

export async function getStockHistory(productId) {
  const response = await axiosClient.get(`/inventory/history/${productId}`);
  return response.data;
}