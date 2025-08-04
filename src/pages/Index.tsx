import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { MapView } from '@/components/map/MapView';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { PropertyPanel } from '@/components/property/PropertyPanel';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  buildingOwner: string;
  lastModified: string;
  compliance: {
    zoning: string;
    currentOccupancy: string;
    byRightStatus: string;
    fireSprinklerStatus: string;
  };
  propertyDetails: {
    parcelNumber: string;
    squareFeet: number;
    owner: string;
  };
  reference: {
    county: string;
    page: string;
    block: string;
    book: string;
    created: string;
    updated: string;
  };
  status: 'qualified' | 'review' | 'disqualified';
  // Legacy fields for compatibility
  taxValue: number;
  taxYearly: number;
  occupancyRate: number;
  sqft: number;
  type: string;
}

const generateProperties = (city: string, count = 75): Property[] => {
  return Array.from({ length: count }, (_, i) => {
    const compliance = {
      zoning: ['P-NP', 'C-1', 'R-2', 'M-1'][Math.floor(Math.random() * 4)],
      currentOccupancy: Math.random() > 0.3 ? 'Unknown' : ['Retail', 'Office', 'Mixed'][Math.floor(Math.random() * 3)],
      byRightStatus: Math.random() > 0.7 ? 'Compliant' : 'Unknown',
      fireSprinklerStatus: Math.random() > 0.6 ? 'Compliant' : 'Unknown'
    };

    // Calculate status based on compliance
    const hasUnknownCompliance = compliance.currentOccupancy === 'Unknown' || 
                                 compliance.byRightStatus === 'Unknown' || 
                                 compliance.fireSprinklerStatus === 'Unknown';
    
    let status: 'qualified' | 'review' | 'disqualified';
    if (!hasUnknownCompliance) {
      status = 'qualified';
    } else {
      status = Math.random() > 0.8 ? 'disqualified' : 'review';
    }

    return {
      id: `prop_${i + 1}`,
      address: `${2700 + i} ${['Canterbury', 'Oak', 'Elm', 'Park', 'Main'][i % 5]} St`,
      city: city.split(',')[0],
      state: city.split(',')[1]?.trim() || 'MA',
      lat: 42.3601 + (Math.random() - 0.5) * 0.05,
      lng: -71.0589 + (Math.random() - 0.5) * 0.05,
      buildingOwner: 'Unassigned',
      lastModified: '2 days ago',
      compliance,
      propertyDetails: {
        parcelNumber: `${1217346 + i}`,
        squareFeet: Math.floor(5000 + Math.random() * 50000),
        owner: ['CITY OF AUSTIN', 'PRIVATE OWNER', '123 MAIN LLC'][Math.floor(Math.random() * 3)]
      },
      reference: {
        county: 'Travis',
        page: 'Not specified',
        block: 'G, 6',
        book: 'Not specified',
        created: 'Jul 28, 2025, 1:40 PM',
        updated: 'Jul 28, 2025, 1:40 PM'
      },
      status,
      // Legacy fields for compatibility
      taxValue: Math.floor(800000 + Math.random() * 2000000),
      taxYearly: 0,
      occupancyRate: Math.floor(60 + Math.random() * 40),
      sqft: Math.floor(5000 + Math.random() * 20000),
      type: ['Office', 'Retail', 'Industrial', 'Mixed-use'][Math.floor(Math.random() * 4)]
    };
  });
};

const Index = () => {
  const [isEmptyState, setIsEmptyState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleCitySearch = () => {
    // This will be called when overlay closes
    setIsLoading(true);
    
    // Show loading state briefly, then exit empty state and generate properties
    setTimeout(() => {
      setIsLoading(false);
      setIsEmptyState(false);
    }, 1500);
  };

  const handleCitySelected = (city: string) => {
    console.log('City selected:', city);
    
    // Generate properties for the selected city
    const newProperties = generateProperties(city);
    setProperties(newProperties);
    
    // Select the first property by default
    setSelectedProperty(newProperties[0]);
  };

  const handleAddressSearch = () => {
    console.log('Address search clicked');
    setIsEmptyState(false);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const showPropertiesView = !isEmptyState && !isLoading && properties.length > 0;

  return (
    <div className="h-screen bg-background relative">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Map View */}
        <MapView 
          className="z-0"
          style={{
            filter: (isEmptyState && !isLoading) ? 'grayscale(100%) brightness(1.2)' : 'none',
            opacity: (isEmptyState && !isLoading) ? 0.3 : 1
          }}
          properties={showPropertiesView ? properties : []}
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertySelect}
          showPanel={showPropertiesView}
        />

        {/* Property Panel - Only show when we have properties */}
        {showPropertiesView && (
          <PropertyPanel property={selectedProperty} />
        )}
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="bg-card rounded-lg shadow-large p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-foreground">Loading properties...</span>
          </div>
        </div>
      )}

      {/* Search Overlay - Only show in empty state and not loading */}
      {isEmptyState && !isLoading && (
        <SearchOverlay
          onCitySearchClick={handleCitySearch}
          onAddressSearchClick={handleAddressSearch}
          onCitySelected={handleCitySelected}
        />
      )}
    </div>
  );
};

export default Index;