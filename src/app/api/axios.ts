// api/axios.ts
import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to handle tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Handle forbidden error specifically
      toast.error("Access denied. Please check your credentials.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
