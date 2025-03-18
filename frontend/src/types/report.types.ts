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

export enum ReportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  HANDLED = 'HANDLED',
}

interface ReportGeolocationI {
  lat: number;
  lon: number;
}

export interface ReportAssignmentI {
  id: number;
  organizationId: number;
  organizationName: string;
  viewedAt: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface ReportI {
  id: number;
  title: string;
  description: string;
  address?: string;
  city?: string;
  postalCode?: string;
  geolocation: ReportGeolocationI;
  image?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: ReportStatus;
  createdAt: string; // ISO date string
  assignments: ReportAssignmentI[];
  animals: OrganizationAnimals[];
  viewed: boolean;
}
