export interface Property {
  id: string; // UUID
  address: string; // VARCHAR(255)
  city: string; // VARCHAR(100)  
  state: string; // CHAR(2)
  zip: string; // VARCHAR(10)
  latitude: number | null; // DECIMAL(10,8)
  longitude: number | null; // DECIMAL(11,8)
  parcel_number: string | null; // VARCHAR(50)
  square_feet: number | null; // INTEGER
  zoning_code: string | null; // VARCHAR(20)
  zoning_by_right: boolean | null; // BOOLEAN
  current_occupancy: string | null; // VARCHAR(50) - E, A, Other
  fire_sprinkler_status: string | null; // VARCHAR(20) - Yes, No
  assigned_to: string | null; // UUID (FK)
  status: string; // VARCHAR(50) - unreviewed, reviewing, qualified, disqualified, on_hold
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
  notes: string | null; // TEXTAREA
}

export interface FilterCriteria {
  zoning_by_right: boolean | null;
  fire_sprinkler_status: string | null;
  current_occupancy: string[];
  min_square_feet: number;
  max_square_feet: number;
  status: string[];
  assigned_to: string | null;
}

export interface PropertyCluster {
  id: string;
  coordinates: [number, number];
  qualifiedCount: number;
  totalCount: number;
  properties: Property[];
}