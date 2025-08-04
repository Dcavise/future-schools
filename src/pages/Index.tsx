import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { MapView } from '@/components/map/MapView';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { PropertyPanel } from '@/components/property/PropertyPanel';
import { FilterPanel } from '@/components/filters/FilterPanel';

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

interface FilterCriteria {
  status: string[];
  compliance: string[];
  propertyType: string[];
  minSquareFeet: string;
  maxSquareFeet: string;
}

const defaultFilters: FilterCriteria = {
  status: [],
  compliance: [],
  propertyType: [],
  minSquareFeet: '',
  maxSquareFeet: ''
};

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
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);

  // Filter logic
  const applyFilters = () => {
    let filtered = [...properties];
    
    // Status filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(p => filters.status.includes(p.status));
    }
    
    // Compliance filters
    if (filters.compliance.length > 0) {
      filtered = filtered.filter(p => {
        return filters.compliance.every(filterType => {
          switch (filterType) {
            case 'zoning': return p.compliance.zoning !== 'Unknown';
            case 'occupancy': return p.compliance.currentOccupancy !== 'Unknown';
            case 'byRight': return p.compliance.byRightStatus === 'Compliant';
            case 'sprinkler': return p.compliance.fireSprinklerStatus === 'Compliant';
            default: return true;
          }
        });
      });
    }
    
    // Property type filters
    if (filters.propertyType.length > 0) {
      filtered = filtered.filter(p => {
        return filters.propertyType.includes(p.compliance.currentOccupancy) ||
               (filters.propertyType.includes('Unknown') && p.compliance.currentOccupancy === 'Unknown');
      });
    }
    
    // Size filters
    if (filters.minSquareFeet) {
      filtered = filtered.filter(p => p.propertyDetails.squareFeet >= parseInt(filters.minSquareFeet));
    }
    if (filters.maxSquareFeet) {
      filtered = filtered.filter(p => p.propertyDetails.squareFeet <= parseInt(filters.maxSquareFeet));
    }
    
    setFilteredProperties(filtered);
    
    // Check if we have active filters
    const isActive = filters.status.length > 0 || 
                    filters.compliance.length > 0 || 
                    filters.propertyType.length > 0 ||
                    filters.minSquareFeet !== '' ||
                    filters.maxSquareFeet !== '';
    setHasActiveFilters(isActive);
  };

  const getActiveFilterCount = () => {
    return filters.status.length + 
           filters.compliance.length + 
           filters.propertyType.length + 
           (filters.minSquareFeet ? 1 : 0) + 
           (filters.maxSquareFeet ? 1 : 0);
  };

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
    setFilteredProperties(newProperties);
    
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

  const handleFiltersToggle = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleFiltersChange = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setIsFilterPanelOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setFilteredProperties(properties);
    setHasActiveFilters(false);
  };

  const showPropertiesView = !isEmptyState && !isLoading && properties.length > 0;
  const displayProperties = hasActiveFilters ? filteredProperties : properties;

  return (
    <div className="h-screen bg-background relative">
      {/* Header */}
      <Header 
        onFiltersClick={showPropertiesView ? handleFiltersToggle : undefined}
        activeFilterCount={getActiveFilterCount()}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClose={() => setIsFilterPanelOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="fixed top-[294px] left-0 right-0 z-30 bg-yellow-100 border-b border-yellow-200 px-6 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-800">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
            </span>
            <button 
              onClick={handleClearFilters}
              className="text-sm text-yellow-800 hover:text-yellow-900 underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div 
        className="flex" 
        style={{ 
          height: 'calc(100vh - 56px)',
          marginTop: isFilterPanelOpen ? '280px' : hasActiveFilters ? '36px' : '0'
        }}
      >
        {/* Map View */}
        <MapView 
          className="z-0"
          style={{
            filter: (isEmptyState && !isLoading) ? 'grayscale(100%) brightness(1.2)' : 'none',
            opacity: (isEmptyState && !isLoading) ? 0.3 : 1
          }}
          properties={showPropertiesView ? displayProperties : []}
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