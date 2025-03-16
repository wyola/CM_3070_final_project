import axios from 'axios';
import { API_BASE_URL, LOGIN, API_ENDPOINTS } from '@/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface QueueItem {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

let isRefreshingToken = false;
let waitingForRefreshTokenQueue: QueueItem[] = [];

// Process the queue of failed requests
const processWaitingRequestsQueue = (error: Error | null, token = null) => {
  waitingForRefreshTokenQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  waitingForRefreshTokenQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 unauthorized and we no token refresh attempt yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshingToken) {
        // refresh is already in progress -> add this request to the queue
        return new Promise((resolve, reject) => {
          waitingForRefreshTokenQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = LOGIN;
        return Promise.reject(new Error('No refresh token available'));
      }

      try {
        originalRequest._retry = true;
        isRefreshingToken = true;

        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        processWaitingRequestsQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processWaitingRequestsQueue(refreshError as Error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = LOGIN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshingToken = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
