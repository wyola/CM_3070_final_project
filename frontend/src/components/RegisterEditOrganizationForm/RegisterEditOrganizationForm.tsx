import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ANIMAL_OPTIONS, API_ENDPOINTS, ORGANIZATION } from '@/constants';
import axios from 'axios';
import { axiosInstance, organizationRegistrationApi } from '@/lib/axios';
import { OrganizationI, OrganizationRegistrationI } from '@/types';
import { getFormFieldError } from '@/utils';
import {
  SuccessMessage,
  CustomFormField,
  CustomMultiSelect,
  Button,
  RichTextEditorFormField,
} from '@/components';
import './registerEditOrganizationForm.scss';

interface RegisterEditOrganizationFormProps {
  isEditing?: boolean;
  defaultData?: OrganizationI;
  organizationId?: number;
}

export const RegisterEditOrganizationForm = ({
  isEditing,
  defaultData,
  organizationId,
}: RegisterEditOrganizationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<
    { field: string; message: string }[]
  >([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isKRSValid, setIsKRSValid] = useState(isEditing || false);

  const navigate = useNavigate();

  const methods = useForm<OrganizationRegistrationI>({
    defaultValues: {
      name: defaultData?.name || '',
      email: defaultData?.email || '',
      krs: defaultData?.krs || '',
      phone: defaultData?.phone || '',
      city: defaultData?.city || '',
      postalCode: defaultData?.postalCode || '',
      voivodeship: defaultData?.voivodeship || '',
      address: defaultData?.address || '',
      logo: '',
      description: defaultData?.description || '',
      website: defaultData?.website || '',
      acceptsReports: defaultData?.acceptsReports || false,
      password: '',
      animals: defaultData?.animals || [],
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const krsNumber = watch('krs');

  useEffect(() => {
    if (isEditing) return; // KRS can't be edited

    const validateKRS = async () => {
      setValue('name', '');
      setValue('city', '');
      setValue('voivodeship', '');
      setIsKRSValid(false);
      setError(null);
      setFormErrors([]);
      if (krsNumber?.length === 10) {
        try {
          const { data: response } = await axiosInstance.get(
            API_ENDPOINTS.ORGANIZATIONS.BY_KRS(krsNumber)
          );

          setIsKRSValid(true);
          setValue('name', response.data.name);
          setValue('city', response.data.city);
          setValue('voivodeship', response.data.voivodeship);
        } catch (error) {
          setIsKRSValid(false);
          if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || 'KRS validation failed');
          } else {
            setError('Failed to validate KRS number');
          }
        }
      } else {
        setIsKRSValid(false);
      }
    };

    validateKRS();
  }, [krsNumber, setValue, isEditing]);

  const placeholderDisabled = 'This field will be filled automatically';
  const placeholderEnabled = 'Validate KRS to enable this field';

  const onSubmit = async (data: OrganizationRegistrationI) => {
    setIsLoading(true);
    setError(null);
    setFormErrors([]);

    try {
      if (isEditing && organizationId) {
        await organizationRegistrationApi.editOrganization(
          data,
          organizationId
        );
        setIsSuccess(true);
        navigate(`${ORGANIZATION}/${organizationId}`);
      } else {
        await organizationRegistrationApi.register(data);
        setIsSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors) {
          setFormErrors(error.response.data.errors);
        } else {
          setError(
            error.response?.data?.message ||
              `${isEditing ? 'Update' : 'Registration'} failed`
          );
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isSuccess && !isEditing ? (
        <SuccessMessage
          message="Registration was successful!"
          imageSrc="./success_dog.png"
        />
      ) : (
        <>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="register-form">
              <CustomFormField
                label="KRS Number"
                type="text"
                name="krs"
                required
                placeholder={isEditing ? '' : 'Enter KRS number to validate it'}
                errorMessage={getFormFieldError('krs', formErrors, error)}
                disabled={isEditing}
              />

              <CustomFormField
                label="Organization Name"
                type="text"
                name="name"
                required
                disabled={!isEditing}
                placeholder={
                  isEditing ? 'Organization name' : placeholderDisabled
                }
                errorMessage={
                  isKRSValid ? getFormFieldError('name', formErrors) : ''
                }
              />

              <CustomFormField
                label="City"
                type="text"
                name="city"
                required
                disabled={!isEditing}
                placeholder={isEditing ? 'City' : placeholderDisabled}
                errorMessage={
                  isKRSValid ? getFormFieldError('city', formErrors) : ''
                }
              />

              <CustomFormField
                label="Voivodeship"
                type="text"
                name="voivodeship"
                required
                disabled={!isEditing}
                placeholder={isEditing ? 'Voivodeship' : placeholderDisabled}
                errorMessage={
                  isKRSValid ? getFormFieldError('voivodeship', formErrors) : ''
                }
              />

              {!isEditing && (
                <>
                  <CustomFormField
                    label="Email"
                    type="email"
                    name="email"
                    required
                    disabled={!isKRSValid || isEditing}
                    placeholder={
                      isKRSValid ? 'Email address' : placeholderEnabled
                    }
                    errorMessage={
                      isKRSValid ? getFormFieldError('email', formErrors) : ''
                    }
                  />

                  <CustomFormField
                    label="Password"
                    type="password"
                    name="password"
                    required
                    disabled={!isKRSValid}
                    placeholder={
                      isKRSValid ? 'Minimum 8 characters' : placeholderEnabled
                    }
                    errorMessage={
                      isKRSValid
                        ? getFormFieldError('password', formErrors)
                        : ''
                    }
                  />
                </>
              )}

              <CustomFormField
                label="Phone Number"
                type="tel"
                name="phone"
                required
                disabled={!isKRSValid && !isEditing}
                placeholder={
                  isKRSValid ? 'Phone number 9 digits' : placeholderEnabled
                }
                errorMessage={
                  isKRSValid ? getFormFieldError('phone', formErrors) : ''
                }
              />

              <CustomFormField
                label="Postal Code"
                type="text"
                name="postalCode"
                pattern="[0-9]{2}-[0-9]{3}"
                required
                disabled={!isKRSValid && !isEditing}
                placeholder={
                  isKRSValid
                    ? 'Postal code in format 00-000'
                    : placeholderEnabled
                }
                errorMessage={
                  isKRSValid ? getFormFieldError('postalCode', formErrors) : ''
                }
              />

              <CustomFormField
                label="Address"
                type="text"
                name="address"
                required
                disabled={!isKRSValid && !isEditing}
                placeholder={
                  isKRSValid
                    ? 'Street, building number, apartment number'
                    : placeholderEnabled
                }
                errorMessage={
                  isKRSValid ? getFormFieldError('address', formErrors) : ''
                }
              />

              <CustomFormField
                label="Upload Logo"
                type="file"
                name="logo"
                required
                disabled={!isKRSValid && !isEditing}
                errorMessage={
                  isKRSValid ? getFormFieldError('logo', formErrors) : ''
                }
              />

              <RichTextEditorFormField
                name="description"
                label="Description"
                required
                placeholder={
                  isKRSValid
                    ? 'Short description of your organization'
                    : placeholderEnabled
                }
                disabled={!isKRSValid && !isEditing}
                formErrors={formErrors}
              />

              <CustomMultiSelect
                name="animals"
                placeholder={
                  isKRSValid ? 'Select at least one' : placeholderEnabled
                }
                options={ANIMAL_OPTIONS}
                label="Animals you take care of"
                required
                errorMessage={
                  isKRSValid ? getFormFieldError('animals.0', formErrors) : ''
                }
                disabled={!isKRSValid && !isEditing}
              />

              <CustomFormField
                label="Website"
                type="url"
                name="website"
                disabled={!isKRSValid && !isEditing}
                placeholder={
                  isKRSValid ? 'Address of your website' : placeholderEnabled
                }
                errorMessage={
                  isKRSValid ? getFormFieldError('website', formErrors) : ''
                }
              />

              <CustomFormField
                label="Accept Reports"
                type="checkbox"
                name="acceptsReports"
                className="register-form__checkbox"
                disabled={!isKRSValid && !isEditing}
                placeholder={placeholderEnabled}
              />

              <Button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || (isEditing && !isDirty)}
              >
                {isEditing ? 'Save changes' : 'Register'}
              </Button>
            </form>
          </FormProvider>
        </>
      )}
    </>
  );
};
