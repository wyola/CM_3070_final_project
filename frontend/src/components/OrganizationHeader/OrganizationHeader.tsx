import { useState } from 'react';
import {
  Button,
  CustomCard,
  CustomModal,
  RegisterEditOrganizationForm,
} from '@/components';
import { OrganizationAnimals, OrganizationI } from '@/types';
import { useOwnership } from '@/hooks';
import './organizationHeader.scss';
import { O } from 'vitest/dist/chunks/reporters.66aFHiyX.js';

type OrganizationHeaderProps = {
  // logo: string;
  // name: string;
  // description: string;
  // animals: OrganizationAnimals[];
  organization: OrganizationI;
};

export const OrganizationHeader = ({
  organization,
}: OrganizationHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = useOwnership();

  return (
    <>
      <CustomCard className="organization-header">
        <div className="organization-header__title">
          <img
            src={`http://localhost:3000/${organization.logo}`}
            alt={`logo of ${organization.name}`}
          />
          <h1 className="heading-primary">{organization.name}</h1>
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
          We take care of: {organization.animals.join(', ')}
        </div>
        <p className="organization-header__description">
          {organization.description}
        </p>
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
          <RegisterEditOrganizationForm
            isEditing={true}
            defaultData={organization}
            organizationId={organization.id}
          />
        </CustomModal>
      )}
    </>
  );
};
