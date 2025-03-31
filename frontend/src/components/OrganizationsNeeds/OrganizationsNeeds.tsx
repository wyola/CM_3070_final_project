import { useEffect, useState } from 'react';
import {
  AddEditNeedModal,
  AddIcon,
  Button,
  Need,
} from '@/components';
import { API_ENDPOINTS } from '@/constants';
import axios from 'axios';
import { axiosInstance } from '@/lib/axios';
import { KindsOfNeeds, NeedI } from '@/types';
import { useOwnership } from '@/hooks';
import './organizationNeeds.scss';

type OrganizationNeedsProps = {
  organizationId: number;
};

export const OrganizationsNeeds = ({
  organizationId,
}: OrganizationNeedsProps) => {
  const [_error, setError] = useState<string | null>(null);
  const [needs, setNeeds] = useState<NeedI[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOwner = useOwnership();

  const fetchNeeds = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.NEEDS.ALL(organizationId)
      );
      setNeeds(data.needs);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to load needs');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const needs = await axiosInstance.get(
          API_ENDPOINTS.NEEDS.ALL(organizationId)
        );
        setNeeds(needs.data.needs);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Failed to load needs');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  return (
    <div className="needs">
      <div className="needs__header">
        <h2 className="heading-secondary">Current needs</h2>
        {isOwner && (
          <Button
            variant="ghost"
            className="needs__add-button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Add new need"
          >
            <AddIcon width={32} height={32} className="add-icon" />
          </Button>
        )}
      </div>
      {needs.length > 0 ? (
        <div className="needs__list">
          {needs.map((need) => (
            <Need
              key={need.id}
              needId={need.id}
              organizationId={organizationId}
              kind={need.kind as KindsOfNeeds}
              priority={need.priority}
              description={need.description}
              onActionCompleted={fetchNeeds}
            />
          ))}
        </div>
      ) : (
        <p>No needs were posted for now!</p>
      )}

      {isOwner && (
        <AddEditNeedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          organizationId={organizationId}
          onSuccess={fetchNeeds}
        />
      )}
    </div>
  );
};
