import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  OrganizationContact,
  OrganizationHeader,
  OrganizationsNeeds,
  ReportsTable,
  Separator,
  FeedbackMessage,
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
            error.response?.data?.message ||
              'Failed to load organization. Please try again later...'
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

  if (isLoading)
    return (
      <FeedbackMessage
        message="Loading organization details..."
        imageSrc="/images/dog-question.svg"
        className="organization__feedback"
      />
    );

  if (error)
    return (
      <FeedbackMessage
        message={error}
        imageSrc="/images/dog-question.svg"
        className="organization__feedback"
      />
    );

  if (!organization)
    return (
      <FeedbackMessage
        message="Organization not found"
        imageSrc="/images/dog-question.svg"
        className="organization__feedback"
      />
    );

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
    geolocation,
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

      <Separator />

      <OrganizationContact
        website={website}
        phone={phone}
        email={email}
        streetNumber={address}
        postalCode={postalCode}
        city={city}
        voivodeship={voivodeship}
        geolocation={geolocation}
      />

      <Separator className="organization__separator--map" />

      <OrganizationsNeeds organizationId={id} />

      {isOwner && <ReportsTable organizationId={id} />}

      <div className="organization__volunteering">
        <h2 className="heading-secondary">Volunteering options</h2>
        <p>Coming soon!</p>
      </div>
    </section>
  );
};
