import axiosClient from './axiosClient';

export async function getReport(startDate, endDate) {
  const response = await axiosClient.get('/reports', { params: { startDate, endDate } });
  return response.data;
}

export async function exportReport(startDate, endDate) {
  const response = await axiosClient.get('/reports/export', {
    params: { startDate, endDate },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `sales-report-${startDate}-to-${endDate}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}