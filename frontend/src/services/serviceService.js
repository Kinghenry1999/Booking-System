import api from './api';
export const getAllServices = async () => (await api.get('/services')).data;
export const getServiceById = async (id) => (await api.get(`/services/${id}`)).data;
export const createService = async (serviceData) => (await api.post('/services', serviceData)).data;
export const updateService = async (id, serviceData) => (await api.put(`/services/${id}`, serviceData)).data;
export const deleteService = async (id) => (await api.delete(`/services/${id}`)).data;
export const getMyServices = async () => (await api.get('/services/mine')).data;