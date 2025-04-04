import { z } from 'zod';
import { KindsOfNeeds } from './need.types';

export const VALID_ANIMALS = [
  'dogs',
  'cats',
  'farm animals',
  'wild animals',
  'exotic animals',
  'birds',
  'horses',
  'other',
] as const;

export const organizationSchema = z.object({
  name: z.string().min(2).max(100),
  voivodeship: z.string().min(2).max(100),
  krs: z.string().regex(/^[0-9]{10}$/, 'KRS must be exactly 10 digits'),
  email: z.string().email(),
  password: z.string().min(8, 'Must be at least 8 characters long'),
  phone: z.string().regex(/^\+?[0-9\s-]{9,}$/, 'Invalid phone number format'),
  city: z.string().min(2).max(100),
  postalCode: z
    .string()
    .regex(/^[0-9]{2}-[0-9]{3}$/, 'Postal code must be in format XX-XXX'),
  address: z
    .string()
    .min(2, 'Must be at least 2 characters long')
    .max(200, 'Must be at most 200 characters long'),
  geolocation: z.string().optional(),
  description: z.string().min(20, 'Must be at least 20 characters long'),
  website: z.string().url().optional(),
  acceptsReports: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .default(false),
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
          errorMap: () => ({ message: 'Select at least one' }),
        })
      )
      .min(1, 'At least one animal type must be selected')
  ),
});

export type OrganizationRegistrationDto = z.infer<typeof organizationSchema>;

// Common organization response type
export interface OrganizationResponse {
  id: number;
  name: string;
  email: string;
  krs: string;
  phone: string;
  city: string;
  postalCode: string;
  address: string;
  voivodeship: string;
  geolocation: string | null;
  logo: string;
  description: string | null;
  website: string | null;
  acceptsReports: boolean;
}

export interface RegistrationResult {
  organization: OrganizationResponse;
  user: {
    id: number;
    email: string;
  };
}

export const organizationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  voivodeship: z.string().optional(),
  acceptsReports: z.preprocess(
    (val) =>
      'undefined' === typeof val || '' === val
        ? undefined
        : val === 'true' || val === true,
    z.boolean().optional()
  ),
  animals: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((s) => s.trim()) : undefined
    ),
  needs: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const needs = val.split(',').map((s) => s.trim());
      return needs.filter((need) =>
        Object.values(KindsOfNeeds).includes(need as KindsOfNeeds)
      );
    }),
  lat: z.coerce.number().optional(),
  long: z.coerce.number().optional(),
});

export type OrganizationQueryDto = z.infer<typeof organizationQuerySchema>;

export interface PaginatedOrganizationsResult {
  organizations: OrganizationResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
