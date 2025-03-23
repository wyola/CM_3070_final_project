import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
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
  LightBulbIcon,
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
        <div className="register-form__success">
          <SuccessMessage
            message="Registration was successful!"
            imageSrc="./images/dog-high-five.svg"
          />
          <Link to="/login" className="register-form__login-link">
            Go to login page &rarr;
          </Link>
        </div>
      ) : (
        <>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={
                isKRSValid ? 'register-form__validated' : 'register-form'
              }
            >
              <div className="register-form__info">
                {isEditing ? (
                  "Update your organization's information using the form below."
                ) : (
                  <>
                    <p>
                      Register your animal welfare organization by entering your
                      KRS number. Once validated, you can complete the
                      registration process.
                    </p>

                    <CustomFormField
                      label="KRS Number"
                      type="text"
                      name="krs"
                      required
                      placeholder={
                        isEditing ? '' : 'Enter KRS number to validate it'
                      }
                      errorMessage={getFormFieldError('krs', formErrors, error)}
                      disabled={isEditing}
                    />

                    {!isKRSValid && (
                      <div className="register-form__info--explain">
                        <LightBulbIcon width={80} height={80} />
                        <p>
                          <strong>What is KRS validation?</strong> We verify
                          your organization's KRS number against the National
                          Institute of Freedom registry to confirm it's a
                          registered Public Benefit Organization entitled to
                          receive 1.5% of Personal Income Tax. Only
                          organizations listed in the official registry can
                          register.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              {!isKRSValid && !isEditing && (
                <img
                  src="./images/dog-high-five.svg"
                  alt=""
                  width="500"
                  className="register-form__image"
                />
              )}

              {(isKRSValid || isEditing) && (
                <>
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
                    placeholder={
                      isEditing ? 'Voivodeship' : placeholderDisabled
                    }
                    errorMessage={
                      isKRSValid
                        ? getFormFieldError('voivodeship', formErrors)
                        : ''
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
                      isKRSValid
                        ? getFormFieldError('postalCode', formErrors)
                        : ''
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
                          isKRSValid
                            ? getFormFieldError('email', formErrors)
                            : ''
                        }
                      />

                      <CustomFormField
                        label="Password"
                        type="password"
                        name="password"
                        required
                        disabled={!isKRSValid}
                        placeholder={
                          isKRSValid
                            ? 'Minimum 8 characters'
                            : placeholderEnabled
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
                    label="Upload Logo"
                    type="file"
                    name="logo"
                    required
                    disabled={!isKRSValid && !isEditing}
                    errorMessage={
                      isKRSValid ? getFormFieldError('logo', formErrors) : ''
                    }
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
                      isKRSValid
                        ? getFormFieldError('animals.0', formErrors)
                        : ''
                    }
                    disabled={!isKRSValid && !isEditing}
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
                  <CustomFormField
                    label="Website"
                    type="url"
                    name="website"
                    required
                    disabled={!isKRSValid && !isEditing}
                    placeholder={
                      isKRSValid
                        ? 'Address of your website'
                        : placeholderEnabled
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
                  <p className="register-form__accept-reports-info">
                    By enabling this option, your organization will be listed as
                    available to receive animal abuse reports from users. When a
                    report matches your organization's location and animals you
                    care for, it will be forwarded to you. This means your
                    organization should have inspectors or staff who can
                    investigate and act on these reports. You can view all
                    assigned reports in your dashboard.
                  </p>

                  {isEditing ? (
                    <div className="register-form__button-group">
                      <Button
                        type="button"
                        variant="outline"
                        className="register-form__cancel-button"
                        onClick={() =>
                          navigate(`${ORGANIZATION}/${organizationId}`)
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="register-form__submit-button"
                        disabled={isSubmitting || !isDirty}
                      >
                        Save changes
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className="register-form__submit-button"
                      disabled={isSubmitting}
                    >
                      Register
                    </Button>
                  )}
                </>
              )}
            </form>
          </FormProvider>
        </>
      )}
    </>
  );
};
