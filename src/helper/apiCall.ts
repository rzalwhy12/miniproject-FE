
import axios from 'axios';
import AppError from './AppError';

export const apiCall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_DATABASE || 'http://localhost:4004'
});

// Add request interceptor for token (SSR safe)
if (typeof window !== 'undefined') {
  apiCall.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

// Add response interceptor for error handling
apiCall.interceptors.response.use(
  (res) => res,
  (error) => {
    // Support both { result: { message } } and { message }
    const data = error.response?.data;
    const message = data?.result?.message || data?.message || 'Unknown error';
    throw new AppError(message, error.response?.status);
  }
);
