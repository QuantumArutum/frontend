import axios from 'axios';

// 根据环境确定 API URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // 生产环境 - 使用 Next.js API routes 或禁用
    return '/api/v2/barong';
  }
  // 本地开发环境
  return 'http://localhost:3001/api/v2/barong';
};

export const barongAPI = axios.create({
  baseURL: getApiBaseUrl(),
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
