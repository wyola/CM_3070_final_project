import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import axios from 'axios';
import { CustomFormField, CustomModal, CustomSelect } from '@/components';
import { KindsOfNeeds, NeedI } from '@/types';
import { mapKindToLabel } from '@/utils';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import './addNeedModal.scss';

type AddNeedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
  onSuccess: () => void;
};

export const AddNeedModal = ({
  isOpen,
  onClose,
  organizationId,
  onSuccess
}: AddNeedModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<
    { field: string; message: string }[]
  >([]);

  const methods = useForm<NeedI>({
    defaultValues: {
      kind: '' as KindsOfNeeds,
      description: '',
      priority: false,
    },
  });

  const { handleSubmit, reset, watch } = methods;

  const kind = watch('kind');
  const description = watch('description');

  const isFormValid = Boolean(kind) && Boolean(description?.trim());

  const onSubmit = async (data: NeedI) => {
    setError(null);
    setFormErrors([]);
    try {
      await axiosInstance.post(API_ENDPOINTS.NEEDS.CREATE(organizationId), {
        kind: data.kind,
        description: data.description,
        priority: data.priority,
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          setFormErrors(error.response.data.errors);
        } else {
          setError(
            error.response?.data?.message ||
              'Failed to add need. Please try again.'
          );
        }
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const needsOptions = Object.values(KindsOfNeeds).map((value) => ({
    value,
    label: mapKindToLabel(value),
  }));

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add new need"
      description="Fill in the form to add a new need"
      buttonLabel="Add need"
      onConfirm={handleSubmit(onSubmit)}
      className="add-need"
      buttonDisabled={!isFormValid}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="add-need__form">
          <CustomSelect
            name="kind"
            id="kind"
            placeholder="Select need..."
            options={needsOptions}
            required
            label="Need"
            errorMessage={
              error ||
              formErrors.find((error) => error.field === 'kind')?.message
            }
          />

          <CustomFormField
            label="Description"
            type="text"
            name="description"
            id="description"
            required
            errorMessage={
              error ||
              formErrors.find((error) => error.field === 'description')?.message
            }
          />

          <CustomFormField
            label="High priority"
            type="checkbox"
            name="priority"
            id="priority"
            className="add-need__form--checkbox"
          />
        </form>
      </FormProvider>
    </CustomModal>
  );
};
