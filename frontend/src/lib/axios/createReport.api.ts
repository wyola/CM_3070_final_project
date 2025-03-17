import {
  ReportFormDataI,
  ReportWithAddressFormDataI,
  ReportWithGeolocationFormDataI,
} from '@/types';
import { API_ENDPOINTS } from '@/constants';
import { axiosInstance } from '@/lib/axios';

export const createReportApi = {
  createReport: async (
    data: ReportFormDataI,
    addressType: 'map' | 'address'
  ) => {
    const formData = new FormData();

    // Append basic data
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('animals', JSON.stringify(data.animals));

    // Handle location based on type
    if (addressType === 'address') {
      formData.append('address', (data as ReportWithAddressFormDataI).address);
      formData.append('city', (data as ReportWithAddressFormDataI).city);
      formData.append(
        'postalCode',
        (data as ReportWithAddressFormDataI).postalCode
      );
    } else {
      const geolocation = (data as ReportWithGeolocationFormDataI).geolocation;
      formData.append('geolocation', geolocation);
    }

    // Handle optional contact info
    if (data.contactName) formData.append('contactName', data.contactName);
    if (data.contactEmail) formData.append('contactEmail', data.contactEmail);
    if (data.contactPhone) formData.append('contactPhone', data.contactPhone);

    // Handle image upload
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    const response = await axiosInstance.post(
      API_ENDPOINTS.REPORT.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};
