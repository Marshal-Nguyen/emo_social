import axios from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";

// Base API URL - có thể thay đổi theo môi trường
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - Thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi và refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Token expired, logout user
      store.dispatch(logout());

      // Redirect to login (sẽ được handle bởi component)
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
