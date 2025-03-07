export enum OrganizationAnimals {
  Dogs = 'dogs',
  Cats = 'cats',
  FarmAnimals = 'farm animals',
  WildAnimals = 'wild animals',
  ExoticAnimals = 'exotic animals',
  Birds = 'birds',
  Horses = 'horses',
  Other = 'other',
}

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
  animals: OrganizationAnimals[];
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

export interface OrganizationSearchFilterFormDataI {
  search?: string;
  voivodeship?: string;
  acceptsReports?: boolean;
  animals?: string[];
}
