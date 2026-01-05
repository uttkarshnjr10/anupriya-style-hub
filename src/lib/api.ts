import axios from 'axios';
import { toast } from 'sonner';

// 1. Dynamic Base URL Logic
// Uses environment variable if present, otherwise defaults to localhost
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
// const BASE_URL = import.meta.env.PROD 
//   ? (import.meta.env.VITE_API_URL || 'https://your-production-backend.com/api/v1')
//   : '/api/v1';

const BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL) // Remove the fallback string OR put your REAL backend URL there
  : '/api/v1';
// Error object returned by backend
export interface ApiError {
  field?: string;
  message: string;
}

// Standard Backend Response Format
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors?: ApiError[];
}

// Pagination Metadata
export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Transaction Interface (Matches Backend Schema)
export interface Transaction {
  _id: string;
  type: 'SALE' | 'EXPENSE';
  amount: number;
  productSnapshot?: {
    name: string;
    category: string;
    subCategory?: string;
  };
  staffId?: {
    name: string;
    staffId: string;
  };
  createdAt: string;
}

export const api = axios.create({
  baseURL: BASE_URL, // <--- Updated to use dynamic URL
  withCredentials: true, // Enables Cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global Error Handler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 (Unauthorized) - Attempt Refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // <--- Updated to use dynamic URL
        await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);
