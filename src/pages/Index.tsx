import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { MapView } from '@/components/map/MapView';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { PropertyPanel } from '@/components/property/PropertyPanel';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { QuickFilterOverlay } from '@/components/filters/QuickFilterOverlay';
import { PropertyTable } from '@/components/table/PropertyTable';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';

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

const generateProperties = (city: string, count?: number): Property[] => {
  // New York gets 500+ properties, others get ~75
  const propertyCount = city === 'New York, NY' ? 523 : (count || 75);
  
  return Array.from({ length: propertyCount }, (_, i) => {
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

    // Coordinate adjustments for different cities
    let baseLat = 42.3601;
    let baseLng = -71.0589;
    let spread = 0.05;

    if (city === 'New York, NY') {
      baseLat = 40.7128;
      baseLng = -74.0060;
      spread = 0.1; // Larger spread for NYC
    } else if (city === 'Chicago, IL') {
      baseLat = 41.8781;
      baseLng = -87.6298;
    } else if (city === 'Denver, CO') {
      baseLat = 39.7392;
      baseLng = -104.9903;
    } else if (city === 'Austin, TX') {
      baseLat = 30.2672;
      baseLng = -97.7431;
    } else if (city === 'Seattle, WA') {
      baseLat = 47.6062;
      baseLng = -122.3321;
    }

    return {
      id: `prop_${i + 1}`,
      address: `${2700 + i} ${['Canterbury', 'Oak', 'Elm', 'Park', 'Main'][i % 5]} St`,
      city: city.split(',')[0],
      state: city.split(',')[1]?.trim() || 'MA',
      lat: baseLat + (Math.random() - 0.5) * spread,
      lng: baseLng + (Math.random() - 0.5) * spread,
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
  const [currentView, setCurrentView] = useState<'map' | 'table'>('map');
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [isOverloadMode, setIsOverloadMode] = useState<boolean>(false);
  const [showQuickFilter, setShowQuickFilter] = useState<boolean>(false);
  const [quickFilterEstimate, setQuickFilterEstimate] = useState<number>(0);

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
    
    // Check for overload scenario (500+ properties)
    if (newProperties.length >= 500) {
      setIsOverloadMode(true);
      setShowQuickFilter(true);
      setCurrentView('map'); // Force map view for overload
    } else {
      setIsOverloadMode(false);
    }
    
    // Select the first property by default (if not in overload mode)
    if (newProperties.length < 500) {
      setSelectedProperty(newProperties[0]);
    }
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

  const handleViewToggle = (view: 'map' | 'table') => {
    setCurrentView(view);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedPropertyIds(selectedIds);
  };

  // Quick filter functions
  const calculateQuickFilterEstimate = (quickFilters: any) => {
    let estimate = properties.length;
    
    // Apply rough estimation logic
    if (quickFilters.status.length > 0) {
      estimate = Math.floor(estimate * (quickFilters.status.length / 3));
    }
    if (quickFilters.propertyType.length > 0) {
      estimate = Math.floor(estimate * (quickFilters.propertyType.length / 3));
    }
    if (quickFilters.sizeRange.length > 0) {
      estimate = Math.floor(estimate * (quickFilters.sizeRange.length / 3));
    }
    
    return Math.max(1, estimate);
  };

  const handleQuickFiltersChange = (quickFilters: any) => {
    const estimate = calculateQuickFilterEstimate(quickFilters);
    setQuickFilterEstimate(estimate);
  };

  const handleApplyQuickFilters = () => {
    // Convert quick filters to regular filters and apply
    setShowQuickFilter(false);
    setIsOverloadMode(false);
    
    // You would implement the actual filtering logic here
    // For now, just show a subset of properties
    const subset = properties.slice(0, Math.min(200, quickFilterEstimate));
    setFilteredProperties(subset);
    setHasActiveFilters(true);
    setSelectedProperty(subset[0]);
  };

  const handleShowHeatmap = () => {
    setShowQuickFilter(false);
    // Keep overload mode active to show heatmap
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

      {/* View Toggle - Hide in overload mode */}
      {showPropertiesView && !isOverloadMode && (
        <div 
          className="fixed top-14 z-40 flex bg-white border rounded-md shadow-lg p-1 transition-all duration-300"
          style={{
            right: (showPropertiesView && currentView === 'map' && !isOverloadMode) ? '540px' : '120px'
          }}
        >
          <Button
            variant={currentView === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewToggle('map')}
            className="rounded-r-none"
          >
            <Map className="h-4 w-4 mr-1" />
            Map
          </Button>
          <Button
            variant={currentView === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewToggle('table')}
            className="rounded-l-none border-l-0"
          >
            <List className="h-4 w-4 mr-1" />
            Table
          </Button>
        </div>
      )}

      {/* Quick Filter Overlay */}
      <QuickFilterOverlay
        isOpen={showQuickFilter}
        totalProperties={properties.length}
        onFiltersChange={handleQuickFiltersChange}
        onApplyFilters={handleApplyQuickFilters}
        onShowHeatmap={handleShowHeatmap}
        onClose={() => setShowQuickFilter(false)}
        estimatedCount={quickFilterEstimate}
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
        {/* Map or Table View */}
        {currentView === 'map' || isOverloadMode ? (
          /* Always show MapView - grayed out in empty state, interactive with properties */
          <MapView 
            className="z-0"
            style={{
              filter: (isEmptyState && !isLoading) ? 'grayscale(100%) brightness(1.1)' : 'none',
              opacity: (isEmptyState && !isLoading) ? 0.25 : 1,
              pointerEvents: (isEmptyState && !isLoading) ? 'none' : 'auto'
            }}
            properties={showPropertiesView ? displayProperties : []}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            showPanel={showPropertiesView && !isOverloadMode}
            isHeatmapMode={isOverloadMode}
            showPerformanceMessage={isOverloadMode}
          />
        ) : (
          <div className="flex-1">
            <PropertyTable
              properties={displayProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
              selectedProperties={selectedPropertyIds}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        )}

        {/* Property Panel - Only show when we have properties, in map view, and not in overload mode */}
        {showPropertiesView && currentView === 'map' && !isOverloadMode && (
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