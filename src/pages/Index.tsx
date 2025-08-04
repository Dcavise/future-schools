import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { MapView } from '@/components/map/MapView';
import { SearchOverlay } from '@/components/search/SearchOverlay';

const Index = () => {
  const [isEmptyState, setIsEmptyState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCitySearch = () => {
    // This will be called when overlay closes
    setIsLoading(true);
    
    // Show loading state briefly, then exit empty state
    setTimeout(() => {
      setIsLoading(false);
      setIsEmptyState(false);
    }, 1500);
  };

  const handleCitySelected = (city: string) => {
    console.log('City selected:', city);
    // Here we would typically fetch properties for the selected city
  };

  const handleAddressSearch = () => {
    console.log('Address search clicked');
    setIsEmptyState(false);
  };

  return (
    <div className="h-screen bg-background relative">
      {/* Header */}
      <Header />

      {/* Map Layer - Behind everything */}
      <MapView 
        className="z-0 pt-14"
        style={{
          filter: (isEmptyState && !isLoading) ? 'grayscale(100%) brightness(1.2)' : 'none',
          opacity: (isEmptyState && !isLoading) ? 0.3 : 1
        }}
      />
      
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