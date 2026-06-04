import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  getMe: () => api.get('/auth/me').then((r) => r.data.data),
  updateProfile: (payload) => api.put('/users/profile', payload).then((r) => r.data.data),
};
