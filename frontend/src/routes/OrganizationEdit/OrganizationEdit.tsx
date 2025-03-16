import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { RegisterEditOrganizationForm } from '@/components';
import { API_ENDPOINTS, ORGANIZATION } from '@/constants';
import axios from 'axios';
import { axiosInstance } from '@/lib/axios';
import { OrganizationI } from '@/types';
import { useOwnership } from '@/hooks';
import './organizationEdit.scss';

export const OrganizationEdit = () => {
  const [organization, setOrganization] = useState<OrganizationI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: idFromParams } = useParams();
  const isOwner = useOwnership();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOwner) {
      navigate(`${ORGANIZATION}/${idFromParams}`);
      return;
    }

    const fetchOrganization = async () => {
      try {
        const orgResponse = await axiosInstance.get(
          API_ENDPOINTS.ORGANIZATIONS.BY_ID(Number(idFromParams))
        );
        setOrganization(orgResponse.data.organization);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message || 'Failed to load organization'
          );
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [idFromParams]);

  return (
    <section className="content edit-organization">
      <h1 className="heading-primary">Edit organization information</h1>
      {organization ? (
        <RegisterEditOrganizationForm
          isEditing
          defaultData={organization}
          organizationId={organization?.id}
        />
      ) : null}
    </section>
  );
};
