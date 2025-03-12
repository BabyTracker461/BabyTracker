export type FeedingType = 'breast' | 'bottle' | 'solid';

export type BreastSide = 'left' | 'right' | 'both';

export type MilkType = 'breast milk' | 'formula';

export type VolumeUnit = 'oz' | 'mL';

export type SolidFoodUnit = 'tbsp' | 'tsp' | 'grams' | 'oz' | 'cups';

export interface FeedingEntry {
  id: string;
  type: FeedingType;
  startTime: Date;
  endTime?: Date;
  // For breast feeding
  side?: BreastSide;
  duration?: number; // in minutes
  // For bottle feeding
  milkType?: MilkType;
  volume?: number;
  volumeUnit?: VolumeUnit;
  // For solid foods
  foodName?: string;
  quantity?: number;
  quantityUnit?: SolidFoodUnit;
  // Common fields
  notes?: string;
  childId: string;
}

export interface FeedingSchedule {
  id: string;
  type: FeedingType;
  recurringTimes: string[]; // Array of times in 24h format
  enabled: boolean;
  childId: string;
}

export interface FoodIntroduction {
  id: string;
  foodName: string;
  dateIntroduced: Date;
  reaction?: string;
  isAllergen: boolean;
  childId: string;
}
