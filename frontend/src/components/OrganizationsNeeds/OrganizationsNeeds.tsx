import { useEffect, useState } from 'react';
import { AddNeedModal, Button, CustomCard, Need } from '@/components';
import { API_ENDPOINTS } from '@/constants';
import axios from 'axios';
import { axiosInstance } from '@/lib/axios';
import { KindsOfNeeds, NeedI } from '@/types';
import './organizationNeeds.scss';

type OrganizationNeedsProps = {
  organizationId: number;
};

export const OrganizationsNeeds = ({
  organizationId,
}: OrganizationNeedsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [needs, setNeeds] = useState<NeedI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Button
          variant="ghost"
          className="needs__add-button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new need"
        >
          <img src="/add.svg" alt="" />
        </Button>
      </div>
      {needs.length > 0 ? (
        needs.map((need) => (
          <Need
            key={need.id}
            needId={need.id}
            organizationId={organizationId}
            kind={need.kind as KindsOfNeeds}
            priority={need.priority}
            description={need.description}
            onDelete={fetchNeeds}
          />
        ))
      ) : (
        <CustomCard className="needs__empty">
          <p>No needs posted yet. Add first need using add button above!</p>
        </CustomCard>
      )}

      <AddNeedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizationId={organizationId}
        onSuccess={fetchNeeds}
      />
    </div>
  );
};
