import axiosClient from './axiosClient';

export async function getDashboardSummary() {
  const response = await axiosClient.get('/dashboard/summary');
  return response.data;
}