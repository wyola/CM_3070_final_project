export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  ORGANIZATIONS: {
    ALL: '/api/organizations',
    BY_ID: (id: number) => `/api/organizations/${id}`,
    BY_KRS: (krs: string) => `/api/organizations/krs/${krs}`,
    EDIT: (id: number) => `/api/organizations/${id}`,
  },
  AUTH: {
    LOGIN: `/api/auth/login`,
    REFRESH: `/api/auth/refresh`,
    ME: `/api/auth/me`,
  },
  NEEDS: {
    CREATE: (organizationId: number) =>
      `/api/organizations/${organizationId}/needs`,
    ALL: (organizationId: number) =>
      `/api/organizations/${organizationId}/needs`,
    DELETE: (organizationId: number, needId: number) =>
      `/api/organizations/${organizationId}/needs/${needId}`,
    UPDATE: (organizationId: number, needId: number) =>
      `/api/organizations/${organizationId}/needs/${needId}`,
  },
};
