import { OrganizationAnimals } from './organization.types';

interface BaseReportFormDataI {
  title: string;
  description: string;
  animals: OrganizationAnimals[];
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  image?: string;
}

export interface ReportWithGeolocationFormDataI extends BaseReportFormDataI {
  geolocation: string;
}

export interface ReportWithAddressFormDataI extends BaseReportFormDataI {
  address: string;
  city: string;
  postalCode: string;
}

export type ReportFormDataI =
  | ReportWithGeolocationFormDataI
  | ReportWithAddressFormDataI;
