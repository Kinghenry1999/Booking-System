import api from './api';
export const getAvailability = async (providerId) => {
  const params = providerId ? { providerId } : {};
  return (await api.get('/availability', { params })).data;
};
export const saveAvailability = async (slots, providerId) => {
  const payload = { slots, providerId };
  return (await api.post('/availability', payload)).data;
};