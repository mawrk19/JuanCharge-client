import axios from 'axios';

// Get backend URL from environment variables
// Vite only exposes variables with VITE_ prefix to client code
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

console.log('🔧 Backend URL:', backendUrl); // Debug log

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,            
});

export default api;
