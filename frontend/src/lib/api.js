import axios from "axios";
import.meta.env

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  timeout: 10000,
});

// Add JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/auth"; 
    }
    return Promise.reject(error);
  }
);

export default api;
