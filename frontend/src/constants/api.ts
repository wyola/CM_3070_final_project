export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  ORGANIZATIONS: {
    ALL: `${API_BASE_URL}/api/organizations`,
    BY_ID: (id: number) => `${API_BASE_URL}/api/organizations/${id}`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,
  },
} as const;
