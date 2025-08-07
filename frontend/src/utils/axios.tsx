import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Interceptor to check and refresh token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: Handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post('http://127.0.0.1:8000/users/token/refresh/', {
          refresh: localStorage.getItem('refresh_token'),
        });

        localStorage.setItem('access_token', res.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;

        return api(originalRequest); // Retry with new token
      } catch (e) {
        console.error('Refresh token expired. Redirecting to login.');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;