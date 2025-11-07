import axios from 'axios';

// Get backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL || 
                   import.meta.env.BACKEND_URL || 
                   '';

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,            
});

export default api;
