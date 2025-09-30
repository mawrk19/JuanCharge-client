import axios from 'axios';

const api = axios.create({
  baseURL: '', // Use relative URLs with proxy
  withCredentials: true,            
});

export default api;
