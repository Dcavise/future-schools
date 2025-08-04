import { useState, useMemo } from 'react';
import { Property, FilterCriteria } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { PropertyMap } from '@/components/property/PropertyMap';
import { PropertyDetailsPanel } from '@/components/property/PropertyDetailsPanel';
import { FilterMenu } from '@/components/property/FilterMenu';
import { SearchOverlay } from '@/components/search/SearchOverlay';

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedCity, setSelectedCity] = useState<string>('boston');
  const [isEmptyState, setIsEmptyState] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterCriteria>({
    zoningByRight: null,
    fireSprinklers: null,
    currentOccupancy: [],
    minSquareFootage: 0,
    maxSquareFootage: 100000,
    status: [],
    assignedTo: null
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Zoning filter
      if (filters.zoningByRight !== null && property.zoningByRight !== filters.zoningByRight) {
        return false;
      }
      
      // Fire sprinklers filter
      if (filters.fireSprinklers !== null && property.fireSprinklers !== filters.fireSprinklers) {
        return false;
      }
      
      // Current occupancy filter
      if (filters.currentOccupancy.length > 0 && 
          (!property.currentOccupancy || !filters.currentOccupancy.includes(property.currentOccupancy))) {
        return false;
      }
      
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(property.status)) {
        return false;
      }

      // Assigned analyst filter
      if (filters.assignedTo && property.assignedTo !== filters.assignedTo) {
        return false;
      }
      
      // Square footage filter
      if (property.squareFootage < filters.minSquareFootage || 
          property.squareFootage > filters.maxSquareFootage) {
        return false;
      }
      
      return true;
    });
  }, [properties, filters]);

  const qualifiedCount = filteredProperties.filter(p => p.status === 'qualified').length;

  const handlePropertyUpdate = (updatedProperty: Property) => {
    setProperties(prev => 
      prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
    );
    setSelectedProperty(updatedProperty);
  };

  const handleCitySearch = () => {
    // TODO: Implement city search autocomplete
    console.log('City search clicked');
    setIsEmptyState(false);
  };

  const handleAddressSearch = () => {
    // TODO: Implement address search input
    console.log('Address search clicked');
    setIsEmptyState(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <TopNavigation
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Map Section - Full width in empty state, 70% otherwise */}
        <div className={`${isEmptyState ? 'flex-1' : 'flex-[7]'} min-h-0 relative`}>
          <div className={isEmptyState ? 'opacity-30 grayscale' : ''}>
            <PropertyMap
              properties={isEmptyState ? [] : filteredProperties}
              selectedProperty={selectedProperty}
              selectedCity={selectedCity}
              onPropertySelect={(property) => {
                console.log('Property selected in Index:', property?.id, property?.address);
                setSelectedProperty(property);
              }}
            />
          </div>
          {!isEmptyState && (
            <FilterMenu
              filters={filters}
              onFiltersChange={setFilters}
              qualifiedCount={qualifiedCount}
              totalCount={filteredProperties.length}
            />
          )}
        </div>

        {/* Property Details Panel - Only show when not in empty state */}
        {!isEmptyState && (
          <div className="flex-[3] min-h-0">
            <PropertyDetailsPanel
              property={selectedProperty}
              onPropertyUpdate={handlePropertyUpdate}
              onClose={() => setSelectedProperty(null)}
            />
          </div>
        )}
      </div>

      {/* Search Overlay - Only show in empty state */}
      {isEmptyState && (
        <SearchOverlay
          onCitySearchClick={handleCitySearch}
          onAddressSearchClick={handleAddressSearch}
        />
      )}
    </div>
  );
};

export default Index;