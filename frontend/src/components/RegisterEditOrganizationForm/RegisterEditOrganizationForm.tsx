import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ANIMAL_OPTIONS, API_ENDPOINTS } from '@/constants';
import axios from 'axios';
import { axiosInstance, organizationRegistrationApi } from '@/lib/axios';
import { OrganizationI, OrganizationRegistrationI } from '@/types';
import {
  SuccessMessage,
  CustomFormField,
  CustomMultiSelect,
  Button,
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
  const [isKRSValid, setIsKRSValid] = useState(false);

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
      geolocation: null,
      logo: '',
      description: defaultData?.description || '',
      website: defaultData?.website || '',
      acceptsReports: defaultData?.acceptsReports || false,
      password: '',
      animals: defaultData?.animals || [],
    },
  });

  const { watch, setValue } = methods;
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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: OrganizationRegistrationI) => {
    setIsLoading(true);
    setError(null);
    setFormErrors([]);

    try {
      if (isEditing && organizationId) {
        await axiosInstance.put(
          API_ENDPOINTS.ORGANIZATIONS.EDIT(organizationId),
          data
        );
        setIsSuccess(true);
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
      {isSuccess ? (
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
                id="krs"
                required
                placeholder={isEditing ? '' : 'Enter KRS number to validate it'}
                errorMessage={
                  error ||
                  formErrors.find((error) => error.field === 'krs')?.message
                }
                disabled={isEditing}
              />

              <CustomFormField
                label="Organization Name"
                type="text"
                name="name"
                id="name"
                required
                disabled
                placeholder={placeholderDisabled}
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'name')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="City"
                type="text"
                name="city"
                id="city"
                required
                disabled
                placeholder={placeholderDisabled}
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'city')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Voivodeship"
                type="text"
                name="voivodeship"
                id="voivodeship"
                required
                disabled
                placeholder={placeholderDisabled}
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'voivodeship')
                        ?.message
                    : ''
                }
              />
              <CustomFormField
                label="Email"
                type="email"
                name="email"
                id="email"
                required
                disabled={!isKRSValid}
                placeholder={isKRSValid ? 'Email address' : placeholderEnabled}
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'email')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Password"
                type="password"
                name="password"
                id="password"
                required
                disabled={!isKRSValid}
                placeholder={
                  isKRSValid ? 'Minimum 8 characters' : placeholderEnabled
                }
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'password')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Phone Number"
                type="tel"
                name="phone"
                id="phone"
                required
                disabled={!isKRSValid}
                placeholder={
                  isKRSValid ? 'Phone number 9 digits' : placeholderEnabled
                }
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'phone')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Postal Code"
                type="text"
                name="postalCode"
                id="postalCode"
                pattern="[0-9]{2}-[0-9]{3}"
                required
                disabled={!isKRSValid}
                placeholder={
                  isKRSValid
                    ? 'Postal code in format 00-000'
                    : placeholderEnabled
                }
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'postalCode')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Address"
                type="text"
                name="address"
                id="address"
                required
                disabled={!isKRSValid}
                placeholder={
                  isKRSValid
                    ? 'Street, building number, apartment number'
                    : placeholderEnabled
                }
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'address')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Upload Logo"
                type="file"
                name="logo"
                id="logo"
                required
                disabled={!isKRSValid}
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'logo')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Description"
                type="textarea"
                name="description"
                id="description"
                required
                disabled={!isKRSValid}
                placeholder={
                  isKRSValid
                    ? 'Short description of your organization'
                    : placeholderEnabled
                }
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'description')
                        ?.message
                    : ''
                }
              />

              <CustomMultiSelect
                name="animals"
                id="animals"
                placeholder={
                  isKRSValid ? 'Select at least one' : placeholderEnabled
                }
                options={ANIMAL_OPTIONS}
                label="Animals you take care of"
                required
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'animals.0')
                        ?.message
                    : ''
                }
                disabled={!isKRSValid}
              />

              <CustomFormField
                label="Website"
                type="url"
                name="website"
                id="website"
                disabled={!isKRSValid}
                placeholder={
                  isKRSValid ? 'Address of your website' : placeholderEnabled
                }
                errorMessage={
                  isKRSValid
                    ? formErrors.find((error) => error.field === 'website')
                        ?.message
                    : ''
                }
              />

              <CustomFormField
                label="Accept Reports"
                type="checkbox"
                name="acceptsReports"
                id="acceptsReports"
                className="register-form__checkbox"
                disabled={!isKRSValid}
                placeholder={placeholderEnabled}
              />

              <Button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
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
