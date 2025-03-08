export interface NeedI {
  id: number;
  kind: KindsOfNeeds;
  priority: boolean;
  description: string;
}

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
