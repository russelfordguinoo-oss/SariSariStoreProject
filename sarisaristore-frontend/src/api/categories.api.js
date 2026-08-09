import axiosClient from './axiosClient';

export async function getCategories() {
  const response = await axiosClient.get('/categories');
  return response.data;
}

export async function createCategory(name) {
  const response = await axiosClient.post('/categories', { name });
  return response.data;
}
