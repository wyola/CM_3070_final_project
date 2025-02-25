import { CustomCard } from '@/components/CustomCard/CustomCard';
import { OrganizationContact } from '@/components/OrganizationContact/OrganizationContact';
import { OrganizationHeader } from '@/components/OrganizationHeader/OrganizationHeader';
import { Organization as OrganizationI } from '@/types/organization.types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './organization.scss';
import { API_ENDPOINTS } from '@/constants';

export const Organization = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState<OrganizationI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(
          API_ENDPOINTS.ORGANIZATIONS.BY_ID(Number(id))
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

  const {
    logo,
    name,
    description,
    website,
    phone,
    email,
    address,
    voivodeship,
    postalCode,
    city,
  } = organization;

  return (
    <section className="content organization">
      <OrganizationHeader logo={logo} name={name} description={description} />
      <OrganizationContact
        website={website}
        phone={phone}
        email={email}
        streetNumber={address}
        postalCode={postalCode}
        city={city}
        voivodeship={voivodeship}
      />
      <CustomCard>current needs</CustomCard>
      <CustomCard>volunteering options</CustomCard>
    </section>
  );
};
