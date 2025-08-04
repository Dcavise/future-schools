import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockProperties, generateMockProperties } from '@/data/mockProperties';
import { Property } from '@/types/property';
import { PropertyPanel } from '@/components/property/PropertyPanel';
import { MapView } from '@/components/map/MapView';
import { Header } from '@/components/shared/Header';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get properties from state (passed from search page) or generate them
  const allProperties = useState<Property[]>(() => {
    const state = location.state as { properties?: Property[] } | null;
    if (state?.properties) {
      return state.properties;
    }
    // If no properties in state, generate a default set
    return [...mockProperties, ...generateMockProperties(75)];
  })[0];
  
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return allProperties.findIndex(p => p.id === id) || 0;
  });
  
  const [property, setProperty] = useState<Property | null>(() => {
    return allProperties.find(p => p.id === id) || null;
  });

  if (!property) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Property Not Found</h1>
            <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyUpdate = (updatedProperty: Property) => {
    setProperty(updatedProperty);
  };

  const handlePreviousProperty = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newProperty = allProperties[newIndex];
      setCurrentIndex(newIndex);
      setProperty(newProperty);
      navigate(`/property/${newProperty.id}`, { replace: true });
    }
  };

  const handleNextProperty = () => {
    if (currentIndex < allProperties.length - 1) {
      const newIndex = currentIndex + 1;
      const newProperty = allProperties[newIndex];
      setCurrentIndex(newIndex);
      setProperty(newProperty);
      navigate(`/property/${newProperty.id}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Main content with map taking full width, sidebar will overlay */}
      <div className="flex-1 h-[calc(100vh-3.5rem)]">
        <MapView 
          selectedProperty={property}
          properties={allProperties}
          className="w-full h-full"
        />

        {/* Property Panel - Fixed overlay on right side */}
        <PropertyPanel
          property={property}
          onPropertyUpdate={handlePropertyUpdate}
          onClose={() => navigate('/')}
          onPreviousProperty={currentIndex > 0 ? handlePreviousProperty : undefined}
          onNextProperty={currentIndex < allProperties.length - 1 ? handleNextProperty : undefined}
        />
      </div>
    </div>
  );
};

export default PropertyDetail;