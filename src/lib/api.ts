import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL)
  : '/api/v1';

export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors?: ApiError[];
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add token from localStorage for incognito mode
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 🛑 FIX: Don't try to refresh token if the error came from the LOGIN endpoint
    // This prevents the redirect loop when user enters wrong password
    if (originalRequest.url?.includes('/auth/login')) {
       return Promise.reject(error);
    }

    // Handle 401 (Unauthorized) - Attempt Refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
            }
          }
        );

        const { accessToken, refreshToken } = refreshResponse.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect only if refresh fails
        return Promise.reject(refreshError);
      }
    }

    // Handle generic errors (Optional: You can remove this toast if you want to handle it manually in components)
    // const message = error.response?.data?.message || 'Something went wrong';
    // toast.error(message);
    
    return Promise.reject(error);
  }
);

// Matches 'PaymentType' Mongoose Model
export interface APIPaymentType {
  _id: string;
  type: "CASH" | "ONLINE" | "DUES";
  amount: number;
  status?: "PENDING" | "PAID" | "PARTIAL"; // specific to DUES
  duesDetails?: {
    name?: string;        // Customer Name
    phoneNumber?: string; // Customer Phone
    dueDate?: string;
  };
}

// Matches 'Transaction' Mongoose Model
export interface APITransaction {
  _id: string;
  type: "SALE" | "EXPENSE";
  amount: number; // Total amount
  createdAt: string; // ISO Date string
  
  // Populated Staff Field
  staffId: {
    _id: string;
    name: string;
  };

  // The Snapshot
  productSnapshot?: {
    name: string;
    category: string;
    subCategory: string;
    url?: string; // Image
  };

  // Payment Breakdown
  paymentBreakdown: {
    cash: number;
    online: number;
    dues: number;
  };

  // The Detailed Payment Records
  paymentTypes: APIPaymentType[]; 
}