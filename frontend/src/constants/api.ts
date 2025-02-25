export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  ORGANIZATIONS: {
    ALL: '/api/organizations',
    BY_ID: (id: number) => `/api/organizations/${id}`,
  },
  AUTH: {
    LOGIN: `/api/auth/login`,
    REFRESH: `/api/auth/refresh`,
  },
};
