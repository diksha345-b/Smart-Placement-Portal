import api from './api';

export const resumeService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api
      .post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data);
  },
  getScore: () => api.get('/users/resume-score').then((r) => r.data.data),
};
