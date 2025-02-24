import { CustomCard } from '../CustomCard/CustomCard';
import { IconLabel } from '../IconLabel/IconLabel';

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
    <CustomCard className="organization-header">
      {website && <IconLabel iconSrc="/website.svg" label={website} />}
      <IconLabel iconSrc="/phone.svg" label={phone} />
      <IconLabel iconSrc="/email.svg" label={email} />
      <div className="organization-header__address">
        <IconLabel iconSrc="/pin.svg" label={streetNumber} />
        <p>
          {postalCode} {city}
        </p>
        <p>{voivodeship}</p>
      </div>
    </CustomCard>
  );
};
