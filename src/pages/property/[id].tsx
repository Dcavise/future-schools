import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProperties } from '@/data/mockProperties';
import { Property } from '@/types/property';
import { PropertyDetailsPanel } from '@/components/property/PropertyDetailsPanel';
import { MapView } from '@/components/map/MapView';
import { Header } from '@/components/shared/Header';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(() => {
    return mockProperties.find(p => p.id === id) || null;
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

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Map Section - 70% */}
        <div className="flex-[7] min-h-0 relative">
          <MapView
            properties={[property]}
            selectedProperty={property}
            selectedCity="boston"
            onPropertySelect={() => {}}
          />
        </div>

        {/* Property Details Panel - 30% */}
        <div className="flex-[3] min-h-0">
          <PropertyDetailsPanel
            property={property}
            onPropertyUpdate={handlePropertyUpdate}
            onClose={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;