import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { MapView } from '@/components/map/MapView';
import { SearchOverlay } from '@/components/search/SearchOverlay';

const Index = () => {
  const [isEmptyState, setIsEmptyState] = useState<boolean>(true);

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
    <div className="h-screen bg-background relative">
      {/* Header */}
      <Header />

      {/* Map Layer - Behind everything */}
      <MapView 
        className="z-0 pt-14"
        style={{
          filter: isEmptyState ? 'grayscale(100%) brightness(1.2)' : 'none',
          opacity: isEmptyState ? 0.3 : 1
        }}
      />

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