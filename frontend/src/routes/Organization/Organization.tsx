import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  CustomCard,
  OrganizationContact,
  OrganizationHeader,
  OrganizationMap,
  OrganizationsNeeds,
  ReportsTable,
} from '@/components';
import { OrganizationI } from '@/types';
import { axiosInstance } from '@/lib/axios';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants';
import { useOwnership } from '@/hooks';
import './organization.scss';

export const Organization = () => {
  const [organization, setOrganization] = useState<OrganizationI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = useOwnership();

  const { id: idFromParams } = useParams();

  useEffect(() => {
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

  // TODO success / fail screens
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!organization) return <div>Organization not found</div>;

  const {
    id,
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
    animals,
  } = organization;

  return (
    <section className="content organization">
      <OrganizationHeader
        logo={logo}
        name={name}
        description={description}
        animals={animals}
        organizationId={id}
      />

      <OrganizationContact
        website={website}
        phone={phone}
        email={email}
        streetNumber={address}
        postalCode={postalCode}
        city={city}
        voivodeship={voivodeship}
      />

      {organization.geolocation && (
        <OrganizationMap
          geolocation={organization.geolocation}
          name={name}
          address={`${address}, ${postalCode} ${city}`}
        />
      )}

      <OrganizationsNeeds organizationId={Number(id)} />

      {isOwner && <ReportsTable />}

      <div className="organization__volunteering">
        <h2 className="heading-secondary">Volunteering options</h2>
        <CustomCard>volunteering options</CustomCard>
      </div>
    </section>
  );
};
