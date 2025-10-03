import axios from 'axios';
import { Cache } from './cache';


const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', // Your API base URL
  // timeout: 10000, // Timeout in milliseconds (optional)
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  withCredentials: true,
});


http.interceptors.request.use(
  (config) => {

    //Attach tokens if exists (skip if session-based)
    const token = Cache.get('token')
    if (token && token !== 'session') {
      config.headers['Authorization'] = `Bearer ${token}`
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