import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Attach the JWT to every request if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear the stored session so the app falls back to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Let AuthContext detect the missing token on the next render.
      if (!window.location.pathname.startsWith('/login')) {
        // Avoid redirect loops; a soft signal is enough.
        window.dispatchEvent(new Event('spp:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
