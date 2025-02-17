import { CustomFormField } from '@/components';
import { useForm, FormProvider } from 'react-hook-form';

interface RegistrationData {
  name: string;
  email: string;
  krs: string;
  phone: string;
  city: string;
  postalCode: string;
  voivodeship: string;
  address: string;
  geolocation: string;
  logo: string;
  description: string;
  website: string;
  acceptsReports: boolean;
}

export const Register = () => {
  const methods = useForm<RegistrationData>({
    defaultValues: {
      name: '',
      email: '',
      krs: '',
      phone: '',
      city: '',
      postalCode: '00-001',
      voivodeship: 'MAZOWIECKIE',
      address: '',
      geolocation: '',
      logo: '',
      description: '',
      website: '',
      acceptsReports: false,
    },
  });

  const onSubmit = (data: RegistrationData) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <FormProvider {...methods}>
      <section className="content">
        <h1>Register Organization</h1>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="registration-form"
        >
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
            label="KRS Number"
            type="text"
            name="krs"
            id="krs"
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
            label="Geolocation"
            type="text"
            name="geolocation"
            id="geolocation"
            placeholder="Latitude, Longitude"
          />

          <CustomFormField label="Logo URL" type="url" name="logo" id="logo" />

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
          />

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </section>
    </FormProvider>
  );
};
