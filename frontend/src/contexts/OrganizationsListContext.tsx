import { createContext, useContext, useState, ReactNode } from 'react';
import { OrganizationI, OrganizationSearchFilterFormDataI } from '@/types';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

type OrganizationsListContextType = {
  organizations: OrganizationI[];
  fetchOrganizations: (
    filters?: OrganizationSearchFilterFormDataI
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const OrganizationsListContext = createContext<
  OrganizationsListContextType | undefined
>(undefined);

export const OrganizationsListProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [organizations, setOrganizations] = useState<OrganizationI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async (
    filters?: OrganizationSearchFilterFormDataI
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.voivodeship && filters.voivodeship !== 'all') {
        params.append('voivodeship', filters.voivodeship);
      }
      if (filters?.acceptsReports) {
        params.append('acceptsReports', String(filters.acceptsReports));
      }

      const { data: response } = await axiosInstance.get(
        `${API_ENDPOINTS.ORGANIZATIONS.ALL}?${params.toString()}`
      );

      setOrganizations(response.data.organizations);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    organizations,
    fetchOrganizations,
    isLoading,
    error,
  };

  return (
    <OrganizationsListContext.Provider value={value}>
      {children}
    </OrganizationsListContext.Provider>
  );
};

export const useOrganizationsList = () => {
  const context = useContext(OrganizationsListContext);
  if (context === undefined) {
    throw new Error(
      'useOrganizationsList hook must be used in OrganizationsListProvider'
    );
  }
  return context;
};
