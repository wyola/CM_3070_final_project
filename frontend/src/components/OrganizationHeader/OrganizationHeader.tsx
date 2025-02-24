import { Card } from '@/components/ui/card';
import './organizationHeader.scss';

type OrganizationHeaderProps = {
  logo: string;
  name: string;
  description: string;
};

export const OrganizationHeader = ({
  logo,
  name,
  description,
}: OrganizationHeaderProps) => {
  return (
    <Card className="organization-header">
      <div className="organization-header__title">
        <img src={`http://localhost:3000/${logo}`} alt={`logo of ${name}`} />
        <h1 className="heading-primary">{name}</h1>
      </div>
      <p className="organization-header__description">{description}</p>
    </Card>
  );
};
