import axios from 'axios';
import { Cache } from './cache';


const http = axios.create({
  baseURL: '/api', // Use Vite proxy instead of direct URL
  // timeout: 10000, // Timeout in milliseconds (optional)
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  // withCredentials not needed for JWT - tokens sent via Authorization header
  withCredentials: false,
});


http.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage or Cache
    const token = localStorage.getItem('token') || Cache.get('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config
  },
  error => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401)  {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export default http