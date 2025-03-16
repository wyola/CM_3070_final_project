import { OrganizationRegistrationI } from '@/types';
import axiosInstance from './axios.instance';
import { API_ENDPOINTS } from '@/constants';

export const organizationRegistrationApi = {
  register: async (data: OrganizationRegistrationI) => {
    const formData = new FormData();

    if (data.logo instanceof FileList && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'logo' && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await axiosInstance.post(
      API_ENDPOINTS.ORGANIZATIONS.ALL,
      formData
    );
    return response.data;
  },
  editOrganization: async (data: OrganizationRegistrationI, id: number) => {
    const formData = new FormData();

    if (data.logo instanceof FileList && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'logo' && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await axiosInstance.put(
      API_ENDPOINTS.ORGANIZATIONS.EDIT(id),
      formData
    );
    return response.data;
  },
};
