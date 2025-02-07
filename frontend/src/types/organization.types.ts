export interface Organization {
  id: number;
  name: string;
  email: string;
  krs: string;
  phone: string;
  city: string;
  address: string;
  geolocation: string | null;
  logo: string;
  description: string;
  website: string | null;
  acceptsReports: boolean;
}

export interface RegistrationResult {
  organization: Organization;
  user: {
    id: number;
    email: string;
  };
}
