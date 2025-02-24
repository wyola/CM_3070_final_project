import { OrganizationHeader } from '@/components/OrganizationHeader/OrganizationHeader';
import { Organization as OrganizationI } from '@/types/organization.types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const Organization = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState<OrganizationI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/organizations/${id}`
        );
        if (!response.ok) {
          throw new Error('Organization not found');
        }
        const data = await response.json();
        setOrganization(data.organization);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load organization'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  // TODO success / fail screens
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!organization) return <div>Organization not found</div>;

  return (
    <section className="content organization">
      <OrganizationHeader
        logo={organization.logo}
        name={organization.name}
        description={organization.description}
      />
      <div>contact info</div>
      <div>current needs</div>
      <div>volunteering options</div>
    </section>
  );
};
