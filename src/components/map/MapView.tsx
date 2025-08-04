import React from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface MapViewProps {
  className?: string;
  style?: React.CSSProperties;
}

export function MapView({ className = '', style = {} }: MapViewProps) {
  return (
    <div 
      className={`fixed inset-0 ${className}`}
      style={style}
    >
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          latitude: 42.3601,
          longitude: -71.0589,
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        dragRotate={false}
        interactive={true}
      >
        <NavigationControl 
          position="top-right"
          style={{ margin: '20px' }}
        />
      </Map>
    </div>
  );
}

export default MapView;