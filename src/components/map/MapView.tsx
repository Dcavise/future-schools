import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3J1YmNsdWIxMjMiLCJhIjoiY203bmszdnFsMDF5czJxbjFuampiNXUwOSJ9.YixeEGA2iZd5yFhbyKv9Vg';

interface Property {
  id: string;
  address: string;
  lat: number;
  lng: number;
  status: 'qualified' | 'review' | 'disqualified';
  taxValue: number;
  taxYearly: number;
  occupancyRate: number;
  sqft: number;
  type: string;
}

interface MapViewProps {
  className?: string;
  style?: React.CSSProperties;
  properties?: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  showPanel?: boolean;
}

export function MapView({ 
  className = '', 
  style = {}, 
  properties = [], 
  selectedProperty = null,
  onPropertySelect,
  showPanel = false
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

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

  // Update property markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    properties.forEach(property => {
      const isSelected = selectedProperty?.id === property.id;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'property-marker';
      el.style.width = isSelected ? '20px' : '16px';
      el.style.height = isSelected ? '20px' : '16px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = isSelected ? '3px solid #fff' : '2px solid #fff';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      el.style.transition = 'all 0.2s ease';
      
      // Set color based on status
      const colors = {
        qualified: '#10B981',
        review: '#F59E0B', 
        disqualified: '#EF4444'
      };
      el.style.backgroundColor = colors[property.status];

      // Add hover effects
      el.addEventListener('mouseenter', () => {
        if (!isSelected) {
          el.style.width = '20px';
          el.style.height = '20px';
        }
      });

      el.addEventListener('mouseleave', () => {
        if (!isSelected) {
          el.style.width = '16px';
          el.style.height = '16px';
        }
      });

      // Add click handler
      el.addEventListener('click', () => {
        onPropertySelect?.(property);
      });

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.lng, property.lat])
        .addTo(map.current!);

      markersRef.current[property.id] = marker;
    });

    // Fit bounds to show all properties
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach(property => {
        bounds.extend([property.lng, property.lat]);
      });
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: showPanel ? 470 : 50 }
      });
    }

  }, [properties, selectedProperty, onPropertySelect, showPanel]);

  // Trigger resize when style changes or panel visibility changes
  useEffect(() => {
    if (map.current) {
      console.log('Triggering map resize due to style/panel change');
      setTimeout(() => {
        map.current?.resize();
      }, 100);
    }
  }, [style, showPanel]);

  return (
    <div 
      ref={mapContainer}
      className={`${showPanel ? 'w-[calc(100%-420px)]' : 'w-full'} h-full ${className}`}
      style={style}
    />
  );
}

export default MapView;