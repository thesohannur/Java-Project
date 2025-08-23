import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (loginData) => api.post('/auth/login', loginData),
  registerDonor: (donorData) => api.post('/auth/register/donor', donorData),
  registerNGO: (ngoData) => api.post('/auth/register/ngo', ngoData),
  registerAdmin: (adminData) => api.post('/auth/register/admin', adminData),
};

export const profileAPI = {
  getDonorProfile: () => api.get('/donor/profile'),
  getNGOProfile: () => api.get('/ngo/profile'),
  getAdminProfile: () => api.get('/admin/profile'),
};

export default api;