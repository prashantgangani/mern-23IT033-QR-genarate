
import axios from 'axios';

// Create an axios instance with baseURL (in production, this should be your backend URL)
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update with your backend URL in production
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
