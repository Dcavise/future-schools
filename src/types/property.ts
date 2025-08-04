export interface Property {
  id: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  squareFootage: number;
  zoningByRight: boolean | null;
  fireSprinklers: boolean | null;
  occupancyType: string | null;
  qualificationStatus: 'qualified' | 'review' | 'disqualified' | 'unknown';
  lastUpdated: string;
  notes?: string;
  buildingYear?: number;
  parkingSpaces?: number;
  price?: number;
  lotSize?: number;
}

export interface PropertyCluster {
  id: string;
  coordinates: [number, number];
  qualifiedCount: number;
  totalCount: number;
  properties: Property[];
}

export interface FilterCriteria {
  zoningByRight: boolean | null;
  fireSprinklers: boolean | null;
  occupancyType: string[];
  minSquareFootage: number;
  maxSquareFootage: number;
}