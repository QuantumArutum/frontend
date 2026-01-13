import axios from 'axios';

export const barongAPI = axios.create({
  baseURL: 'http://localhost:3001/api/v2/barong',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
barongAPI.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors (optional)
barongAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401
    return Promise.reject(error);
  }
);
