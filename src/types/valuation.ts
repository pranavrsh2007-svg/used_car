export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'EV' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic';
export type OwnershipType = '1st Owner' | '2nd Owner' | '3rd+ Owner';
export type ConditionGrade = 'Excellent' | 'Good' | 'Fair';

export interface VehicleSpec {
  make: string;
  model: string;
  variant: string;
  year: number;
  rtoCode: string;
  rtoCity: string;
  kilometers: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  ownership: OwnershipType;
  condition: ConditionGrade;
  hasFactoryWarranty: boolean;
  hasCleanServiceHistory: boolean;
  hasScuffsOrDents: boolean;
  hasHighNCB: boolean;
}

export interface ValuationVector {
  id: string;
  title: string;
  description: string;
  impactAmount: number; // positive or negative INR
  impactType: 'positive' | 'negative';
  category: 'odometer' | 'ownership' | 'regional' | 'warranty' | 'condition' | 'market';
  weightPercent?: number;
}

export interface ValuationResult {
  spec: VehicleSpec;
  medianFairValue: number;
  minLiquidity: number;
  maxRetail: number;
  confidenceScore: number;
  marketSpreadPercent: number;
  dossierId: string;
  timestamp: string;
  sha256Seal: string;
  vectors: ValuationVector[];
  netVectorInfluence: number;
  regionalIndex: {
    city: string;
    clusterName: string;
    multiplier: number;
    demandTrend: string;
    demandNote: string;
  };
  segment: string;
  conditionScore: number; // e.g. 9.4
  mlModelInfo?: {
    modelName: string;
    modelVersion: string;
    isRealMl: boolean;
    currency: string;
  };
}

export interface ModelData {
  name: string;
  segment: string;
  variants: {
    name: string;
    basePriceNew: number; // in INR
    engine: string;
    defaultFuel: FuelType;
    defaultTransmission: TransmissionType;
  }[];
}

export interface MakeData {
  make: string;
  models: ModelData[];
}
