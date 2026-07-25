import axiosClient from './axiosClient';

export async function checkout(items) {
  const response = await axiosClient.post('/sales/checkout', { items });
  return response.data;
}