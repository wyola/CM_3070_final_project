import { useState } from 'react';
import { Button, CustomCard, CustomModal } from '@/components';
import { OrganizationAnimals } from '@/types';
import { useOwnership } from '@/hooks';
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
  animals,
}: OrganizationHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = useOwnership();

  return (
    <>
      <CustomCard className="organization-header">
        <div className="organization-header__title">
          <img src={`http://localhost:3000/${logo}`} alt={`logo of ${name}`} />
          <h1 className="heading-primary">{name}</h1>
          {isOwner && (
            <Button
              variant="ghost"
              aria-label="Edit need"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <img src="/edit.svg" alt="" />
            </Button>
          )}
        </div>
        <div className="organization-header__animals">
          We take care of: {animals.join(', ')}
        </div>
        <p className="organization-header__description">{description}</p>
      </CustomCard>

      {isOwner && (
        <CustomModal
          title="Edit organization"
          description="Edit your organization details. KRS number can't be changed."
          buttonLabel="Save changes"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {}} // TODO
        >
          <div>Form</div>
        </CustomModal>
      )}
    </>
  );
};
