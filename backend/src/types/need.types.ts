import { z } from 'zod';

export enum KindsOfNeeds {
  accessories = 'accessories',
  bedding = 'bedding',
  cleaning = 'cleaning',
  food = 'food',
  grooming = 'grooming',
  medication = 'medication',
  other = 'other',
  toys = 'toys',
  vet = 'vet',
}

export const needSchema = z.object({
  kind: z.nativeEnum(KindsOfNeeds, {
    errorMap: () => ({ message: 'Select kind of need' }),
  }),
  priority: z.boolean().default(false),
  description: z.string().min(5, 'Must be at least 5 characters long'),
  organizationId: z.number().int().positive(),
});

export type NeedDto = z.infer<typeof needSchema>;

export interface NeedResponse {
  id: number;
  kind: KindsOfNeeds;
  priority: boolean;
  description: string;
  organizationId: number;
}
