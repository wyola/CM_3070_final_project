import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  CustomCard,
  OrganizationContact,
  OrganizationHeader,
} from '@/components';
import { OrganizationI } from '@/types';
import { axiosInstance } from '@/lib/axios';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants';
import { OrganizationMap } from '@/components/OrganizationMap/OrganizationMap';
import './organization.scss';
import { MOCKED_NEEDS } from '@/constants/mockedNeeds';
import { OrganizationsNeed } from '@/components/OrganizationsNeed/OrganizationsNeed';
import { KindsOfNeeds } from '@/types/needs.type';

export const Organization = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState<OrganizationI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const { data: response } = await axiosInstance.get(
          API_ENDPOINTS.ORGANIZATIONS.BY_ID(Number(id))
        );
        setOrganization(response.organization);
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
      {organization.geolocation && (
        <OrganizationMap
          geolocation={organization.geolocation}
          name={name}
          address={`${address}, ${postalCode} ${city}`}
        />
      )}
      <div className="organization__needs">
        <h2 className="heading-secondary">Current needs</h2>
        {MOCKED_NEEDS.map((need) => (
          <OrganizationsNeed
            key={need.id}
            id={need.id}
            kind={need.kind as KindsOfNeeds}
            priority={need.priority}
            description={need.description}
          />
        ))}
      </div>
      <CustomCard>volunteering options</CustomCard>
    </section>
  );
};
