import { z } from 'zod';
import { VALID_ANIMALS } from './organization.types';

export enum ReportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  HANDLED = 'HANDLED',
}

export const reportSchema = z
  .object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters long')
      .max(100),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters long'),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z
      .string()
      .regex(/^[0-9]{2}-[0-9]{3}$/, 'Postal code must be in format XX-XXX')
      .optional(),
    geolocation: z.string().optional(),
    contactName: z.string().optional(),
    contactEmail: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.string().email().optional()
    ),
    contactPhone: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z
        .string()
        .regex(/^\+?[0-9\s-]{9,}$/, 'Invalid phone number format')
        .optional()
    ),
    animals: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return val.split(',').map((s) => s.trim());
          }
        }
        return val;
      },
      z
        .array(
          z.enum(VALID_ANIMALS, {
            errorMap: () => ({ message: 'Select at least one animal type' }),
          })
        )
        .min(1, 'At least one animal type must be selected')
    ),
  })
  .refine((data) => (data.address && data.city) || data.geolocation, {
    message:
      'Either complete address (street and city) or geolocation must be provided',
    path: ['address'],
  });

export type ReportDto = z.infer<typeof reportSchema>;

export interface ReportResponse {
  id: number;
  title: string;
  description: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  geolocation: { lat: number; lon: number } | null;
  image: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: ReportStatus;
  createdAt: string;
  assignments: ReportAssignmentResponse[];
  animals: string[];
}

export interface ReportAssignmentResponse {
  id: number;
  organizationId: number;
  organizationName: string;
  viewedAt: string | null;
  createdAt: string;
}
