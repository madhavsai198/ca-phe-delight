import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if deployed
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401s (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and optionally redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not already on the auth page, we could redirect here, 
      // but it's often better to handle it in components or a global context.
    }
    return Promise.reject(error);
  }
);

export default api;
