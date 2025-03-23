import { Link } from 'react-router';
import DOMPurify from 'dompurify';
import { EditIcon, Separator } from '@/components';
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
    <section className="organization-header">
      <div className="organization-header__title">
        <img src={`http://localhost:3000/${logo}`} alt={`logo of ${name}`} />
        <h1 className="heading-primary">{name}</h1>
        {isOwner && (
          <Link
            to={`/organizations/${organizationId}/edit`}
            aria-label="Go to edit organization form"
          >
            <EditIcon width={32} height={32} className="edit-icon" />
          </Link>
        )}
      </div>

      <p
        className="organization-header__description"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(description, {
            USE_PROFILES: { html: true },
          }),
        }}
      ></p>
      <Separator className="organization-header__separator" />
      <div className="organization-header__animals">
        We take care of: {animals.join(', ')}
      </div>
    </section>
  );
};
