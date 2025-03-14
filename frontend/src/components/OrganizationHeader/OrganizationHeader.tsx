import { CustomCard } from '@/components';
import { OrganizationAnimals } from '@/types';
import './organizationHeader.scss';

type OrganizationHeaderProps = {
  logo: string;
  name: string;
  description: string;
  animals: OrganizationAnimals[];
};

export const OrganizationHeader = ({
  logo,
  name,
  description,
  animals
}: OrganizationHeaderProps) => {
  return (
    <CustomCard className="organization-header">
      <div className="organization-header__title">
        <img src={`http://localhost:3000/${logo}`} alt={`logo of ${name}`} />
        <h1 className="heading-primary">{name}</h1>
      </div>
      <div className="organization-header__animals">We take care of: {animals.join(', ')}</div>
      <p className="organization-header__description">{description}</p>
    </CustomCard>
  );
};
