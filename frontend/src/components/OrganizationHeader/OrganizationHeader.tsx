import { Link } from 'react-router';
import DOMPurify from 'dompurify';
import { CustomCard } from '@/components';
import { OrganizationAnimals } from '@/types';
import { useOwnership } from '@/hooks';
import './organizationHeader.scss';

type OrganizationHeaderProps = {
  logo: string;
  name: string;
  description: string;
  animals: OrganizationAnimals[];
  organizationId: number;
};

export const OrganizationHeader = ({
  logo,
  name,
  description,
  animals,
  organizationId,
}: OrganizationHeaderProps) => {
  const isOwner = useOwnership();

  return (
    <CustomCard className="organization-header">
      <div className="organization-header__title">
        <img src={`http://localhost:3000/${logo}`} alt={`logo of ${name}`} />
        <h1 className="heading-primary">{name}</h1>
        {isOwner && (
          <Link
            to={`/organizations/${organizationId}/edit`}
            aria-label="Go to edit organization form"
          >
            <img src="/edit.svg" alt="" />
          </Link>
        )}
      </div>
      <div className="organization-header__animals">
        We take care of: {animals.join(', ')}
      </div>
      <p
        className="organization-header__description"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(description, {
            USE_PROFILES: { html: true },
          }),
        }}
      ></p>
    </CustomCard>
  );
};
