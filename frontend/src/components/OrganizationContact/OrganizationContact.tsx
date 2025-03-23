import { IconLabel, LocationMap } from '@/components';
import './organizationContact.scss';

type OrganizationContactProps = {
  website: string;
  phone: string;
  email: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  voivodeship: string;
  geolocation: {
    lat: number;
    lon: number;
  } | null;
};

export const OrganizationContact = ({
  website,
  phone,
  email,
  streetNumber,
  city,
  postalCode,
  voivodeship,
  geolocation,
}: OrganizationContactProps) => {
  return (
    <section className="organization-contact">
      {geolocation && (
        <LocationMap geolocation={geolocation} mapContainerHeight="200px" />
      )}
      <div className="organization-contact__data">
        <IconLabel iconSrc="/website.svg">
          <a href={website} target="_blank">
            Go to website
          </a>
        </IconLabel>

        <IconLabel iconSrc="/phone.svg">
          <a href={`tel:${phone}`}>{phone}</a>
        </IconLabel>

        <IconLabel iconSrc="/email.svg">
          <a href={`mailto:${email}`}>{email}</a>
        </IconLabel>

        <IconLabel
          iconSrc="/pin.svg"
          className="organization-contact__data--address"
        >
          {streetNumber}, {postalCode} {city}, {voivodeship}
        </IconLabel>
      </div>
    </section>
  );
};
