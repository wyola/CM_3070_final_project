import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Button,
  CustomCard,
  OrganizationContact,
  OrganizationHeader,
  OrganizationMap,
  OrganizationsNeed,
  AddNeedModal,
} from '@/components';
import { OrganizationI, KindsOfNeeds } from '@/types';
import { axiosInstance } from '@/lib/axios';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants';
import { MOCKED_NEEDS } from '@/constants/mockedNeeds'; // TO BE REMOVED AFTER INTEGRATION
import './organization.scss';

export const Organization = () => {
  const [organization, setOrganization] = useState<OrganizationI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();

  const isOwner = true; // TODO: add to organization ownerId and check if user is owner

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
        <div className="organization__needs--header">
          <h2 className="heading-secondary">Current needs</h2>
          <Button
            variant="link"
            className="organization__needs--add-button"
            onClick={() => setIsModalOpen(true)}
          >
            <img src="/add.svg" alt="add new need" />
          </Button>
        </div>
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

      <div className="organization__volunteering">
        <h2 className="heading-secondary">Volunteering options</h2>
        <CustomCard>volunteering options</CustomCard>
      </div>

      <AddNeedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizationId={Number(id)}
      />
    </section>
  );
};
