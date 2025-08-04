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
import { Property } from '@/types/property';

interface FilterCriteria {
  status: string[];
  compliance: string[];
  propertyType: string[];
  minSquareFeet: string;
  maxSquareFeet: string;
  sizeRange: string[];
}

const defaultFilters: FilterCriteria = {
  status: [],
  compliance: [],
  propertyType: [],
  minSquareFeet: '',
  maxSquareFeet: '',
  sizeRange: []
};

const generateProperties = (city: string, count?: number): Property[] => {
  // New York gets 500+ properties, others get ~75
  const propertyCount = city === 'New York, NY' ? 523 : (count || 75);
  
  return Array.from({ length: propertyCount }, (_, i) => {
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

    const lng = baseLng + (Math.random() - 0.5) * spread;
    const lat = baseLat + (Math.random() - 0.5) * spread;
    
    // Generate compliance data
    const zoningByRight = Math.random() > 0.3 ? true : Math.random() > 0.5 ? false : null;
    const fireSprinklers = Math.random() > 0.4 ? true : Math.random() > 0.6 ? false : null;
    const currentOccupancy = Math.random() > 0.3 ? (['E', 'A', 'Other'] as const)[Math.floor(Math.random() * 3)] : null;

    // Calculate status based on compliance
    let status: 'unreviewed' | 'reviewing' | 'qualified' | 'disqualified' | 'on_hold';
    if (zoningByRight === true && fireSprinklers === true && currentOccupancy !== null) {
      status = 'qualified';
    } else if (zoningByRight === false || fireSprinklers === false) {
      status = 'disqualified';
    } else if (Math.random() > 0.8) {
      status = 'on_hold';
    } else if (Math.random() > 0.6) {
      status = 'reviewing';
    } else {
      status = 'unreviewed';
    }

    return {
      id: `prop_${i + 1}`,
      address: `${2700 + i} ${['Canterbury', 'Oak', 'Elm', 'Park', 'Main'][i % 5]} St`,
      city: city.split(',')[0],
      state: city.split(',')[1]?.trim() || 'MA',
      zip: `${Math.floor(Math.random() * 90000) + 10000}`,
      coordinates: [lng, lat] as [number, number],
      parcelNumber: `${1217346 + i}`,
      squareFootage: Math.floor(5000 + Math.random() * 50000),
      zoningCode: ['P-NP', 'C-1', 'R-2', 'M-1'][Math.floor(Math.random() * 4)],
      zoningByRight,
      currentOccupancy,
      fireSprinklers,
      assignedTo: Math.random() > 0.7 ? `user_${Math.floor(Math.random() * 5) + 1}` : undefined,
      assignedAnalyst: Math.random() > 0.7 ? ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Chen'][Math.floor(Math.random() * 4)] : undefined,
      status,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      buildingYear: Math.random() > 0.3 ? 1950 + Math.floor(Math.random() * 70) : undefined,
      parkingSpaces: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 5 : undefined,
      price: Math.random() > 0.6 ? Math.floor(800000 + Math.random() * 2000000) : undefined,
      lotSize: Math.random() > 0.4 ? Math.floor(5000 + Math.random() * 20000) : undefined
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

  // Filter logic with live preview
  const applyFilters = (tempFilters: FilterCriteria = filters) => {
    let filtered = [...properties];
    
    // Status filters
    if (tempFilters.status.length > 0) {
      filtered = filtered.filter(p => tempFilters.status.includes(p.status));
    }
    
    // Compliance filters
    if (tempFilters.compliance.length > 0) {
      filtered = filtered.filter(p => {
        return tempFilters.compliance.every(filterType => {
          switch (filterType) {
            case 'zoning': return p.zoningByRight === true;
            case 'occupancy': return p.currentOccupancy !== null;
            case 'byRight': return p.zoningByRight === true;
            case 'sprinkler': return p.fireSprinklers === true;
            default: return true;
          }
        });
      });
    }
    
    // Property type filters
    if (tempFilters.propertyType.length > 0) {
      filtered = filtered.filter(p => {
        const occupancyLabel = p.currentOccupancy === 'E' ? 'Educational' : 
                              p.currentOccupancy === 'A' ? 'Assembly' : 
                              p.currentOccupancy === 'Other' ? 'Other' : 'Unknown';
        return tempFilters.propertyType.includes(occupancyLabel);
      });
    }
    
    // Size filters
    if (tempFilters.minSquareFeet) {
      filtered = filtered.filter(p => p.squareFootage >= parseInt(tempFilters.minSquareFeet));
    }
    if (tempFilters.maxSquareFeet) {
      filtered = filtered.filter(p => p.squareFootage <= parseInt(tempFilters.maxSquareFeet));
    }
    
    // Size range filters
    if (tempFilters.sizeRange && tempFilters.sizeRange.length > 0) {
      filtered = filtered.filter(p => {
        return tempFilters.sizeRange!.some(range => {
          switch (range) {
            case 'under10k': return p.squareFootage < 10000;
            case '10k-25k': return p.squareFootage >= 10000 && p.squareFootage < 25000;
            case '25k-50k': return p.squareFootage >= 25000 && p.squareFootage < 50000;
            case '50k+': return p.squareFootage >= 50000;
            default: return false;
          }
        });
      });
    }
    
    return filtered;
  };

  const updateFilteredProperties = () => {
    const filtered = applyFilters();
    setFilteredProperties(filtered);
    
    // Check if we have active filters
    const isActive = filters.status.length > 0 || 
                    filters.compliance.length > 0 || 
                    filters.propertyType.length > 0 ||
                    (filters.sizeRange?.length || 0) > 0 ||
                    filters.minSquareFeet !== '' ||
                    filters.maxSquareFeet !== '';
    setHasActiveFilters(isActive);
  };

  // Calculate preview count for live feedback
  const getPreviewCount = (tempFilters: FilterCriteria) => {
    return applyFilters(tempFilters).length;
  };

  const getActiveFilterCount = () => {
    return filters.status.length + 
           filters.compliance.length + 
           filters.propertyType.length + 
           (filters.sizeRange?.length || 0) +
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
    
    // Start loading state
    setIsLoading(true);
    
    // Generate properties for the selected city
    const newProperties = generateProperties(city);
    
    // Set properties after a brief delay to ensure smooth loading
    setTimeout(() => {
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
      
      // Exit loading state
      setIsLoading(false);
      setIsEmptyState(false);
    }, 500); // Half second delay for smooth transition
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
    updateFilteredProperties();
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
        cityContext={showPropertiesView ? `${properties[0]?.city}, ${properties[0]?.state}` : undefined}
        propertyCount={showPropertiesView ? displayProperties.length : undefined}
        currentView={currentView}
        onViewToggle={handleViewToggle}
        showViewToggle={showPropertiesView && !isOverloadMode}
      />


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
        totalProperties={properties.length}
        previewCount={getPreviewCount(filters)}
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