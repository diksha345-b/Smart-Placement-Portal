import api from './api';

export const jobService = {
  list: (params) => api.get('/jobs', { params }).then((r) => r.data.data),
  get: (id) => api.get(`/jobs/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/jobs', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/jobs/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/jobs/${id}`).then((r) => r.data.data),
  myJobs: () => api.get('/jobs/hr/mine').then((r) => r.data.data),
};
