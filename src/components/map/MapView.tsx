import React from 'react';

interface MapViewProps {
  className?: string;
  style?: React.CSSProperties;
}

export function MapView({ className = '', style = {} }: MapViewProps) {
  return (
    <div 
      className={`fixed inset-0 bg-gray-100 flex items-center justify-center ${className}`}
      style={style}
    >
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Map View</h3>
        <p className="text-gray-600 text-sm mb-4">
          Map will display here with a valid Mapbox token
        </p>
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>For production:</strong> Add your Mapbox token to Supabase Secrets
        </div>
      </div>
    </div>
  );
}

export default MapView;