import axios from 'axios';
import { Cache } from './cache';

// Get API base URL from environment variables
// For production (Vercel), use variables without VITE_ prefix
// For development, use VITE_ prefix
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
                   import.meta.env.API_BASE_URL || 
                   '/api';

const http = axios.create({
  baseURL: apiBaseUrl,
  // timeout: 10000, // Timeout in milliseconds (optional)
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  // withCredentials not needed for JWT - tokens sent via Authorization header
  withCredentials: false,
});

// Configure axios with token from localStorage on initialization
const token = localStorage.getItem('token');
if (token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

http.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage or Cache
    const token = localStorage.getItem('token') || Cache.get('token');
    
    if (token) {
      // Always set Authorization header if token exists
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // If no token, remove Authorization header
      delete config.headers['Authorization'];
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only redirect to login if we're not already on login page
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
    return Promise.reject(error)
  }
)

export default http