import { useState, useMemo } from 'react';
import { Property, FilterCriteria } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { FilterBar } from '@/components/property/FilterBar';
import { PropertyMap } from '@/components/property/PropertyMap';
import { PropertyDetailsPanel } from '@/components/property/PropertyDetailsPanel';

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [filters, setFilters] = useState<FilterCriteria>({
    zoningByRight: null,
    fireSprinklers: null,
    occupancyType: [],
    minSquareFootage: 0,
    maxSquareFootage: 100000
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
      
      // Occupancy type filter
      if (filters.occupancyType.length > 0 && 
          (!property.occupancyType || !filters.occupancyType.includes(property.occupancyType))) {
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

  const qualifiedCount = filteredProperties.filter(p => p.qualificationStatus === 'qualified').length;

  const handlePropertyUpdate = (updatedProperty: Property) => {
    setProperties(prev => 
      prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
    );
    setSelectedProperty(updatedProperty);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Filter Bar */}
      <div className="p-4 border-b bg-background">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          qualifiedCount={qualifiedCount}
          totalCount={filteredProperties.length}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Map Section - 70% */}
        <div className="flex-[7] min-h-0">
          <PropertyMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
          />
        </div>

        {/* Property Details Panel - 30% */}
        <div className="flex-[3] min-h-0">
          <PropertyDetailsPanel
            property={selectedProperty}
            onPropertyUpdate={handlePropertyUpdate}
            onClose={() => setSelectedProperty(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;