import api from './api';

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  localStorage.setItem('userInfo', JSON.stringify(data));
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  localStorage.setItem('userInfo', JSON.stringify(data));
  return data;
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};