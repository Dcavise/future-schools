export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  coordinates: [number, number]; // [lng, lat]
  parcelNumber?: string;
  squareFootage: number;
  zoningCode?: string;
  zoningByRight: boolean | null;
  currentOccupancy: 'E' | 'A' | 'Other' | null; // E=Educational, A=Assembly, Other
  fireSprinklers: boolean | null;
  assignedTo?: string; // User ID
  assignedAnalyst?: string; // Analyst name for display
  status: 'unreviewed' | 'reviewing' | 'qualified' | 'disqualified' | 'on_hold';
  lastUpdated: string;
  buildingYear?: number;
  parkingSpaces?: number;
  price?: number;
  lotSize?: number;
  notes?: PropertyNote[];
}

export interface PropertyNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  type: 'research' | 'site_visit' | 'compliance' | 'general';
}

export interface FilterCriteria {
  zoningByRight: boolean | null;
  fireSprinklers: boolean | null;
  currentOccupancy: ('E' | 'A' | 'Other')[];
  minSquareFootage: number;
  maxSquareFootage: number;
  status: string[];
  assignedTo: string | null;
}

export interface PropertyCluster {
  id: string;
  coordinates: [number, number];
  qualifiedCount: number;
  totalCount: number;
  properties: Property[];
}