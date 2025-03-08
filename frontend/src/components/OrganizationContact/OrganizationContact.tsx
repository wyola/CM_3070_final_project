import { CustomCard, IconLabel } from '@/components';
import './organizationContact.scss';

type OrganizationContactProps = {
  website: string;
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
      <div className="organization-contact__contact">
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
      </div>

      <div className="organization-contact__address">
        <IconLabel
          iconSrc="/pin.svg"
          className="organization-contact__address--street"
        >
          {streetNumber}, {postalCode} {city}, {voivodeship}
        </IconLabel>
      </div>
    </CustomCard>
  );
};
