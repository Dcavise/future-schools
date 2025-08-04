import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGJ4eTI3M3QwMDVjM3ZycXd6dWF4d2FpIn0.example';

// Boston, MA coordinates
const BOSTON_COORDINATES: [number, number] = [-71.0589, 42.3601];

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: BOSTON_COORDINATES,
        zoom: 12,
        dragRotate: false
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Clean up on unmount
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        height: 'calc(100vh - 56px)', 
        width: '100%' 
      }}
      className="relative"
    />
  );
}

export default MapView;