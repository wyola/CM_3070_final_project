import { Button, CustomFormField } from '@/components';
import { Organization } from '@/types/organization.types';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import './register.scss';

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<Organization>({
    defaultValues: {
      name: '',
      email: '',
      krs: '',
      phone: '',
      city: '',
      postalCode: '',
      voivodeship: '',
      address: '',
      geolocation: null,
      logo: '',
      description: '',
      website: '',
      acceptsReports: false,
      password: '',
    },
  });

  const onSubmit = async (data: Organization) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      console.log(data.logo);

      if (data.logo instanceof FileList && data.logo.length > 0) {
        formData.append('logo', data.logo[0]);
      }

      (
        Object.entries(data) as [keyof Organization, string | boolean | null][]
      ).forEach(([key, value]) => {
        if (key !== 'logo' && value !== null) {
          formData.append(key, String(value));
        }
        console.log(data);
      });

      const response = await fetch('http://localhost:3000/api/organizations', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Registration successful:', result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <section className="content register">
        <h1 className="heading-primary">Register Organization</h1>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="register__form"
        >
          <CustomFormField
            label="KRS Number"
            type="text"
            name="krs"
            id="krs"
            required
          />

          <CustomFormField
            label="Organization Name"
            type="text"
            name="name"
            id="name"
            required
          />

          <CustomFormField
            label="Email"
            type="email"
            name="email"
            id="email"
            required
          />

          <CustomFormField
            label="Password"
            type="password"
            name="password"
            id="password"
            required
          />

          <CustomFormField
            label="Phone Number"
            type="tel"
            name="phone"
            id="phone"
            required
          />

          <CustomFormField
            label="City"
            type="text"
            name="city"
            id="city"
            required
          />

          <CustomFormField
            label="Postal Code"
            type="text"
            name="postalCode"
            id="postalCode"
            pattern="[0-9]{2}-[0-9]{3}"
            required
          />

          <CustomFormField
            label="Voivodeship"
            type="text"
            name="voivodeship"
            id="voivodeship"
            required
          />

          <CustomFormField
            label="Address"
            type="text"
            name="address"
            id="address"
            required
          />

          <CustomFormField
            label="Upload Logo"
            type="file"
            name="logo"
            id="logo"
          />

          <CustomFormField
            label="Description"
            type="textarea"
            name="description"
            id="description"
            required
          />

          <CustomFormField
            label="Website"
            type="url"
            name="website"
            id="website"
          />

          <CustomFormField
            label="Accept Reports"
            type="checkbox"
            name="acceptsReports"
            id="acceptsReports"
            className="register__form-checkbox"
          />

          <Button type="submit" className="submit-button">
            Register
          </Button>
        </form>
      </section>
    </FormProvider>
  );
};
