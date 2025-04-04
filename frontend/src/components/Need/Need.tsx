import { useState } from 'react';
import { KindsOfNeeds } from '@/types';
import {
  AddEditNeedModal,
  BinIcon,
  Button,
  CustomAlertDialog,
  CustomCard,
  EditIcon,
  IconLabel,
} from '@/components';
import { mapKindToLabel } from '@/utils';
import axios from 'axios';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { useOwnership } from '@/hooks';
import DOMPurify from 'dompurify';
import './need.scss';

type NeedProps = {
  needId: number;
  organizationId: number;
  kind: KindsOfNeeds;
  priority: boolean;
  description: string;
  onActionCompleted: () => void;
};

export const Need = ({
  needId,
  organizationId,
  kind,
  priority,
  description,
  onActionCompleted,
}: NeedProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOwner = useOwnership();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await axiosInstance.delete(
        API_ENDPOINTS.NEEDS.DELETE(organizationId, needId)
      );
      onActionCompleted?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to delete need');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <CustomCard className="need">
        <div className="need__header">
          <IconLabel iconSrc={`/needs/${kind}.svg`}>
            {mapKindToLabel(kind)}
          </IconLabel>
          {priority && (
            <img
              src="/megaphone.svg"
              alt="high priority"
              className="need__priority"
            />
          )}
        </div>
        <p
          className="need__description"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description, {
              USE_PROFILES: { html: true },
            }),
          }}
        ></p>

        {isOwner && (
          <div className="need__actions">
            <Button
              className="need__actions--button"
              variant="ghost"
              aria-label="Edit need"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <EditIcon width={32} height={32} className="edit-icon" />
            </Button>
            <Button
              className="need__actions--button"
              variant="ghost"
              onClick={() => {
                setIsDeleting(true);
                setIsAlertOpen(true);
              }}
              disabled={isDeleting}
              aria-label="Delete need"
            >
              <BinIcon width={32} height={32} className="bin-icon" />
            </Button>
          </div>
        )}
      </CustomCard>

      {isOwner && (
        <>
          <CustomAlertDialog
            title="Are you sure you want to delete this need?"
            description="This action cannot be undone, it will permanently delete need."
            cancelButtonLabel="Cancel"
            confirmButtonLabel="Remove"
            isOpen={isAlertOpen}
            onCancel={() => {
              setIsAlertOpen(false);
              setIsDeleting(false);
            }}
            onConfirm={handleDelete}
          />

          <AddEditNeedModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
            organizationId={organizationId}
            onSuccess={onActionCompleted}
            defaultValues={{
              kind,
              description,
              priority,
            }}
            isEditing={true}
            needId={needId}
          />
        </>
      )}
    </>
  );
};
