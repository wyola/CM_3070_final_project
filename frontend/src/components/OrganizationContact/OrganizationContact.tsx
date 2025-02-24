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
      {website && <IconLabel iconSrc="/website.svg" label={website} />}
      <IconLabel iconSrc="/phone.svg" label={phone} />
      <IconLabel iconSrc="/email.svg" label={email} />
      <div className="organization-contact__address">
        <IconLabel
          iconSrc="/pin.svg"
          label={streetNumber}
          className="organization-contact__address--street"
        />
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
