import React from 'react';
import { MapPin, Building } from 'lucide-react';

interface SearchOverlayProps {
  onCitySearchClick: () => void;
  onAddressSearchClick: () => void;
}

export function SearchOverlay({ onCitySearchClick, onAddressSearchClick }: SearchOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-[420px] bg-card rounded-lg shadow-large p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
          What are you looking for?
        </h2>
        
        <div className="space-y-4">
          {/* City Search Option */}
          <button
            onClick={onCitySearchClick}
            className="w-full h-16 bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-accent hover:border-ring transition-colors"
          >
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">Search by City</div>
              <div className="text-sm text-muted-foreground">Generate lists of qualified properties</div>
            </div>
          </button>

          {/* Address Search Option */}
          <button
            onClick={onAddressSearchClick}
            className="w-full h-16 bg-background border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-accent hover:border-ring transition-colors"
          >
            <div className="flex-shrink-0">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground">Search by Address</div>
              <div className="text-sm text-muted-foreground">Look up compliance for specific property</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}