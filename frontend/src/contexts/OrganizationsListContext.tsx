import { createContext, useContext, useState, ReactNode } from 'react';
import { OrganizationI, OrganizationSearchFilterFormDataI } from '@/types';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { useSearchParams } from 'react-router';

type OrganizationsListContextType = {
  organizations: OrganizationI[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  fetchOrganizations: (
    filters?: OrganizationSearchFilterFormDataI
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  updateCurrentPage: (page: number) => void;
  currentPage: number;
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
  const [pagination, setPagination] =
    useState<OrganizationsListContextType['pagination']>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromSearchParams = searchParams.get('page')
    ? Math.max(1, parseInt(searchParams.get('page') || '1'))
    : 1;
  const [currentPage, setCurrentPage] = useState(pageFromSearchParams);

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

      if (filters?.animals && filters.animals.length > 0) {
        params.append('animals', filters.animals.join(','));
      }

      if (filters?.needs) {
        params.append('needs', filters.needs);
      }

      params.append('page', currentPage.toString());

      const { data: response } = await axiosInstance.get(
        `${API_ENDPOINTS.ORGANIZATIONS.ALL}?${params.toString()}`
      );

      setOrganizations(response.data.organizations);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentPage = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const value = {
    organizations,
    pagination,
    fetchOrganizations,
    isLoading,
    error,
    updateCurrentPage,
    currentPage,
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
