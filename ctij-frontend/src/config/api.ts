import Axios from 'axios';
import retry from 'async-retry';

// Create an Axios instance
const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  timeout: 20000, // Set timeout of 20 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add a request interceptor to include the Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle timeout and other errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return Promise.reject(new Error('Request timed out. Please check your network connection.'));
    }

    // Retry logic for certain types of errors
    if (error.response && error.response.status >= 500) {
      // Retry for server errors (5xx)
      return await retry(async () => {
        return axiosInstance.request(error.config);
      }, {
        retries: 3,
        minTimeout: 1000,
        factor: 2,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
