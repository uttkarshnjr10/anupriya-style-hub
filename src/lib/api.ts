import axios from 'axios';
import { toast } from 'sonner';

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
  baseURL: 'http://localhost:8000/api/v1',
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
        await axios.post('http://localhost:8000/api/v1/auth/refresh-token', {}, { withCredentials: true });
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