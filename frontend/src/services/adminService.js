import api from './api';

export const adminService = {
  analytics: () => api.get('/admin/analytics').then((r) => r.data.data),
  users: (params) => api.get('/admin/users', { params }).then((r) => r.data.data),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/status`).then((r) => r.data.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data.data),
  jobs: (params) => api.get('/admin/jobs', { params }).then((r) => r.data.data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`).then((r) => r.data.data),
};

export const metaService = {
  skills: () => api.get('/meta/skills').then((r) => r.data.data.skills),
};
