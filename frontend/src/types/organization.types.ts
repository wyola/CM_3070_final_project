export interface OrganizationI {
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
  logo: string;
  description: string;
  website: string | null;
  acceptsReports: boolean;
  password: string;
}

export interface OrganizationRegistrationI
  extends Omit<OrganizationI, 'id' | 'logo'> {
  logo: File | null | '';
}

export interface RegistrationResultI {
  organization: OrganizationI;
  user: {
    id: number;
    email: string;
  };
}
