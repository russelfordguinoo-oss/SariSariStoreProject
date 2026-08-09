import axiosClient from './axiosClient';

export async function checkout(items, credit) {
  const response = await axiosClient.post('/sales/checkout', { items, credit });
  return response.data;
}
