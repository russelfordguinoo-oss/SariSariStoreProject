import axiosClient from './axiosClient';
export const getCreditDashboard = async () => (await axiosClient.get('/credits/dashboard')).data;
export const getCreditCustomers = async (params) => (await axiosClient.get('/credits/customers', { params })).data;
export const createCreditCustomer = async (data) => (await axiosClient.post('/credits/customers', data)).data;
export const updateCreditCustomer = async (id, data) => (await axiosClient.put(`/credits/customers/${id}`, data)).data;
export const archiveCreditCustomer = async (id) => (await axiosClient.delete(`/credits/customers/${id}`)).data;
export const getCreditProfile = async (id) => (await axiosClient.get(`/credits/customers/${id}`)).data;
export const recordCreditPayment = async (id, data) => (await axiosClient.post(`/credits/credits/${id}/payments`, data)).data;
