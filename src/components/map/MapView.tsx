import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3J1YmNsdWIxMjMiLCJhIjoiY203bmszdnFsMDF5czJxbjFuampiNXUwOSJ9.YixeEGA2iZd5yFhbyKv9Vg';

interface MapViewProps {
  className?: string;
  style?: React.CSSProperties;
}

export function MapView({ className = '', style = {} }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      console.log('Initializing Mapbox map...');
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-71.0589, 42.3601], // Boston, MA coordinates
        zoom: 12,
        dragRotate: false
      });

      // Add navigation controls positioned top-right
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        console.log('Cleaning up map...');
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Trigger resize when style changes (especially when filters are removed)
  useEffect(() => {
    if (map.current) {
      console.log('Triggering map resize due to style change');
      setTimeout(() => {
        map.current?.resize();
      }, 100);
    }
  }, [style]);

  return (
    <div 
      ref={mapContainer}
      className={`fixed inset-0 ${className}`}
      style={style}
    />
  );
}

export default MapView;