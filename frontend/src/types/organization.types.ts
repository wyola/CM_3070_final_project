export interface Organization {
  id: number;
  name: string;
  email: string;
  krs: string;
  phone: string;
  city: string;
  postalCode: string;
  voivodeship: string;
  address: string;
  geolocation: string | null;
  logo: File | null | '';
  description: string;
  website: string | null;
  acceptsReports: boolean;
  password: string;
}

export interface RegistrationResult {
  organization: Organization;
  user: {
    id: number;
    email: string;
  };
}
