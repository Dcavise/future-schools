import React from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGJ4eTI3M3QwMDVjM3ZycXd6dWF4d2FpIn0.example';

// Boston, MA coordinates
const INITIAL_VIEW_STATE = {
  latitude: 42.3601,
  longitude: -71.0589,
  zoom: 12
};

export function MapView() {
  return (
    <div style={{ height: 'calc(100vh - 56px)', width: '100%' }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        dragRotate={false}
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