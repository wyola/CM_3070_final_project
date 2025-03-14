import { useState } from 'react';
import { KindsOfNeeds } from '@/types';
import { Button, CustomCard, IconLabel } from '@/components';
import { mapKindToLabel } from '@/utils';
import axios from 'axios';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import './need.scss';

type OrganizationsNeedProps = {
  needId: number;
  organizationId: number;
  kind: KindsOfNeeds;
  priority: boolean;
  description: string;
  onDelete: () => void;
};

export const Need = ({
  needId,
  organizationId,
  kind,
  priority,
  description,
  onDelete,
}: OrganizationsNeedProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await axiosInstance.delete(
        API_ENDPOINTS.NEEDS.DELETE(organizationId, needId)
      );
      onDelete?.();
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
      <p className="need__description">{description}</p>
      <div className="need__actions">
        <Button className="need__actions--button" variant="ghost">
          <img src="/edit.svg" />
        </Button>
        <Button
          className="need__actions--button"
          variant="ghost"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <img src="/bin.svg" />
        </Button>
      </div>
    </CustomCard>
  );
};
