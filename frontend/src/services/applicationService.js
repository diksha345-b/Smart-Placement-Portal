import api from './api';

export const applicationService = {
  apply: (jobId, payload) =>
    api.post(`/applications/${jobId}`, payload).then((r) => r.data.data),
  mine: () => api.get('/applications/mine').then((r) => r.data.data),
  forJob: (jobId) => api.get(`/applications/job/${jobId}`).then((r) => r.data.data),
  updateStatus: (id, status) =>
    api.patch(`/applications/${id}/status`, { status }).then((r) => r.data.data),
};
