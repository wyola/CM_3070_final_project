import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import axios from 'axios';
import {
  CustomFormField,
  CustomModal,
  CustomSelect,
  RichTextEditorFormField,
} from '@/components';
import { KindsOfNeeds, NeedI } from '@/types';
import { getFormFieldError, mapKindToLabel } from '@/utils';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import './addEditNeedModal.scss';

type AddEditNeedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
  onSuccess: () => void;
  defaultValues?: {
    kind: KindsOfNeeds;
    description: string;
    priority: boolean;
  };
  isEditing?: boolean;
  needId?: number;
};

export const AddEditNeedModal = ({
  isOpen,
  onClose,
  organizationId,
  onSuccess,
  defaultValues,
  isEditing,
  needId,
}: AddEditNeedModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<
    { field: string; message: string }[]
  >([]);

  const methods = useForm<NeedI>({
    defaultValues: defaultValues || {
      kind: '' as KindsOfNeeds,
      description: '',
      priority: false,
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const kind = watch('kind');
  const description = watch('description');

  const isFormValid = Boolean(kind) && Boolean(description?.trim());
  const isButtonDisabled = !isFormValid || (isEditing && !isDirty);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isOpen) {
      if (!isEditing) {
        reset({
          kind: '' as KindsOfNeeds,
          description: '',
          priority: false,
        });
      }
    }
  }, [isOpen, isEditing, reset]);

  const onSubmit = async (data: NeedI) => {
    setError(null);
    setFormErrors([]);
    try {
      if (isEditing && needId) {
        await axiosInstance.put(
          API_ENDPOINTS.NEEDS.UPDATE(organizationId, needId),
          data
        );
      } else {
        await axiosInstance.post(
          API_ENDPOINTS.NEEDS.CREATE(organizationId),
          data
        );
      }
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
      title={isEditing ? 'Edit need' : 'Add new need'}
      description={
        isEditing
          ? 'Edit the form to update the need'
          : 'Fill in the form to add a new need'
      }
      buttonLabel={isEditing ? 'Save changes' : 'Add need'}
      onConfirm={handleSubmit(onSubmit)}
      className="add-need"
      buttonDisabled={isButtonDisabled}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="add-need__form">
          <CustomSelect
            name="kind"
            placeholder="Select need..."
            options={needsOptions}
            required
            label="Need"
            errorMessage={getFormFieldError('kind', formErrors, error)}
          />

          <RichTextEditorFormField
            name="description"
            label="Description"
            required
            placeholder="Enter detailed description of this need..."
            formErrors={formErrors}
          />

          <CustomFormField
            label="High priority"
            type="checkbox"
            name="priority"
            className="add-need__form--checkbox"
          />
        </form>
      </FormProvider>
    </CustomModal>
  );
};
