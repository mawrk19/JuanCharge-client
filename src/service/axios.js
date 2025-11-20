import axios from 'axios';
import { Cache } from './cache';

// Base URL for API
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.API_BASE_URL || '/api';

// Create Axios instance
const http = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // JWT does not require cookies
});

// Add token from localStorage on initialization
const token = localStorage.getItem('token');
if (token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor to always attach token
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || Cache.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle 401 errors
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        localStorage.removeItem('is_first_login');
        Cache.remove('token');
        Cache.remove('user');
        Cache.remove('user_type');
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default http;
