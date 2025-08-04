import React, { useState, useCallback, useMemo } from 'react';
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
  const allProperties = useMemo(() => {
    const state = location.state as { properties?: Property[] } | null;
    console.log('PropertyDetail - location state:', state);
    if (state?.properties) {
      console.log('PropertyDetail - using state properties:', state.properties.length);
      return state.properties;
    }
    // If no properties in state, generate a default set
    const fallbackProperties = [...mockProperties, ...generateMockProperties(75)];
    console.log('PropertyDetail - using fallback properties:', fallbackProperties.length);
    return fallbackProperties;
  }, [location.state]);
  
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const foundIndex = allProperties.findIndex(p => p.id === id);
    console.log('PropertyDetail - found property index:', foundIndex, 'for id:', id);
    return foundIndex !== -1 ? foundIndex : 0;
  });
  
  const [property, setProperty] = useState<Property | null>(() => {
    const foundProperty = allProperties.find(p => p.id === id);
    console.log('PropertyDetail - found property:', foundProperty?.address || 'NOT FOUND', 'for id:', id);
    return foundProperty || null;
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
      navigate(`/property/${newProperty.id}`, { 
        replace: true,
        state: { properties: allProperties }
      });
    }
  };

  const handleNextProperty = () => {
    if (currentIndex < allProperties.length - 1) {
      const newIndex = currentIndex + 1;
      const newProperty = allProperties[newIndex];
      setCurrentIndex(newIndex);
      setProperty(newProperty);
      navigate(`/property/${newProperty.id}`, { 
        replace: true,
        state: { properties: allProperties }
      });
    }
  };

  const handlePropertySelect = useCallback((newProperty: Property) => {
    console.log('PropertyDetail - navigating to:', newProperty.id);
    // Navigate to the new property while maintaining the properties list
    navigate(`/property/${newProperty.id}`, { 
      state: { properties: allProperties }
    });
  }, [navigate, allProperties]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Main content with map taking full width, sidebar will overlay */}
      <div className="flex-1 h-[calc(100vh-3.5rem)]">
        <MapView 
          selectedProperty={property}
          properties={allProperties}
          className="w-full h-full"
          showPanel={true}
          onPropertySelect={handlePropertySelect}
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