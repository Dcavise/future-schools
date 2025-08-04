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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Map View */}
      <div className={isEmptyState ? 'opacity-30 grayscale' : ''}>
        <MapView />
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