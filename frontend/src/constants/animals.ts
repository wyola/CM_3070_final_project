import { OrganizationAnimals } from '@/types';

export const ANIMAL_OPTIONS = Object.values(OrganizationAnimals).map(
  (value) => ({
    value,
    label: value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  })
);
