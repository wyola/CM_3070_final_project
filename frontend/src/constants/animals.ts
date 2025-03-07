import { OrganizationAnimals } from '@/types';

export const ANIMAL_OPTIONS = Object.entries(OrganizationAnimals).map(
  ([key, value]) => ({
    value: value,
    label: value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  })
);
