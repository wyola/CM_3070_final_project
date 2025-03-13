export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  ORGANIZATIONS: {
    ALL: '/api/organizations',
    BY_ID: (id: number) => `/api/organizations/${id}`,
    BY_KRS: (krs: string) => `/api/organizations/krs/${krs}`,
  },
  AUTH: {
    LOGIN: `/api/auth/login`,
    REFRESH: `/api/auth/refresh`,
  },
  NEEDS: {
    CREATE: (organizationId: number) =>
      `/api/organizations/${organizationId}/needs`,
    ALL: (organizationId: number) =>
      `/api/organizations/${organizationId}/needs`,
  },
};
