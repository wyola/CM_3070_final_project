import { CustomFormField, CustomModal, CustomSelect } from '@/components';
import { KindsOfNeeds } from '@/types';
import { mapKindToLabel } from '@/utils';
import { FormProvider, useForm } from 'react-hook-form';
import './addNeedModal.scss';

type AddNeedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
};

export const AddNeedModal = ({
  isOpen,
  onClose,
  organizationId,
}: AddNeedModalProps) => {
  const methods = useForm<any>({
    //TODO: Add type
    defaultValues: {
      need: '',
      description: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = () => {
    console.log('submit', organizationId);
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
      onConfirm={() => {
        console.log('Need added');
        handleSubmit(onSubmit)();
      }}
      className="add-need"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="add-need__form">
          <CustomSelect
            name="need"
            id="nedd"
            placeholder="Select need..."
            options={needsOptions}
            required
            label="Need"
          />

          <CustomFormField
            label="Description"
            type="text"
            name="need-description"
            id="need-id"
            required
            // errorMessage={error}
          />

          <CustomFormField
            label="High priority"
            type="checkbox"
            name="need-priority"
            id="need-priority"
            className="add-need__form--checkbox"
            // errorMessage={error}
          />
        </form>
      </FormProvider>
    </CustomModal>
  );
};
