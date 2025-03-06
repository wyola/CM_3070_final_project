import { KindsOfNeeds } from '@/types/needs.type';

export const mapKindToLabel = (kind: KindsOfNeeds) => {
  switch (kind) {
    case KindsOfNeeds.accessories:
      return 'Accessories';
    case KindsOfNeeds.bedding:
      return 'Bedding';
    case KindsOfNeeds.cleaning:
      return 'Cleaning supplies';
    case KindsOfNeeds.food:
      return 'Pet food';
    case KindsOfNeeds.grooming:
      return 'Grooming';
    case KindsOfNeeds.medication:
      return 'Medication';
    case KindsOfNeeds.other:
      return 'Other';
    case KindsOfNeeds.toys:
      return 'Toys';
    case KindsOfNeeds.vet:
      return 'Veterinary assistance';
  }
};
