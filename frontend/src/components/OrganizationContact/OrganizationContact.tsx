import { CustomCard } from '../CustomCard/CustomCard';
import { IconLabel } from '../IconLabel/IconLabel';
import './organizationContact.scss';

type OrganizationContactProps = {
  website?: string | null;
  phone: string;
  email: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  voivodeship: string;
};

export const OrganizationContact = ({
  website,
  phone,
  email,
  streetNumber,
  city,
  postalCode,
  voivodeship,
}: OrganizationContactProps) => {
  return (
    <CustomCard className="organization-contact">
      {website && (
        <IconLabel iconSrc="/website.svg">
          <a href={website} target="_blank">
            Go to website
          </a>
        </IconLabel>
      )}
      <IconLabel iconSrc="/phone.svg">
        <a href={`tel:${phone}`}>{phone}</a>
      </IconLabel>
      <IconLabel iconSrc="/email.svg">
        <a href={`mailto:${email}`}>{email}</a>
      </IconLabel>
      <div className="organization-contact__address">
        <IconLabel
          iconSrc="/pin.svg"
          className="organization-contact__address--street"
        >
          {streetNumber}
        </IconLabel>
        <p className="organization-contact__address--city">
          {postalCode} {city}
        </p>
        <p className="organization-contact__address--voivodeship">
          {voivodeship}
        </p>
      </div>
    </CustomCard>
  );
};
