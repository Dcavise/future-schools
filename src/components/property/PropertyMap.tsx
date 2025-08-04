import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types/property';
import { cities } from '@/components/layout/TopNavigation';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
  selectedCity: string;
}

export function PropertyMap({ properties, selectedProperty, onPropertySelect, selectedCity }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = 'pk.eyJ1IjoiZ3J1YmNsdWIxMjMiLCJhIjoiY203bmszdnFsMDF5czJxbjFuampiNXUwOSJ9.YixeEGA2iZd5yFhbyKv9Vg';
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      console.log('Initializing map with token:', mapboxToken.substring(0, 20) + '...');
      mapboxgl.accessToken = mapboxToken;
      
      // Find the selected city or default to Boston
      const city = cities.find(c => c.value === selectedCity) || cities[0];
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: city.coordinates,
        zoom: 11,
        pitch: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        console.log('Map loaded, adding property markers');
        addPropertyMarkers();
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      alert('Invalid Mapbox token. Please check your token and try again.');
    }
  };

  const addPropertyMarkers = () => {
    if (!map.current) return;

    console.log('Adding markers for', properties.length, 'properties');

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create individual markers for each property
    properties.forEach((property) => {
      console.log('Creating single marker for property:', property.id, property.address);
      const marker = createPropertyMarker(property);
      markersRef.current.push(marker);
    });

    console.log('Total markers created:', markersRef.current.length);
  };

  const createPropertyMarker = (property: Property) => {
    const el = document.createElement('div');
    el.className = 'property-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    el.style.pointerEvents = 'auto';
    el.style.zIndex = '100';
    
    const colors = {
      qualified: '#10b981',
      review: '#f59e0b', 
      disqualified: '#dc2626',
      unknown: '#dc2626'
    };
    
    el.style.backgroundColor = colors[property.qualificationStatus];

    if (selectedProperty?.id === property.id) {
      el.style.transform = 'scale(1.2)';
      el.style.zIndex = '1000';
    }

    // Create the marker first
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(property.coordinates)
      .addTo(map.current!);

    // Add click handler with multiple approaches
    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Marker clicked for property:', property.id, property.address);
      console.log('Property selected in Index:', property.id, property.address);
      onPropertySelect(property);
    };

    // Try multiple event types
    el.addEventListener('click', handleClick, true);
    el.addEventListener('mousedown', handleClick, true);
    el.addEventListener('touchstart', handleClick, true);

    return marker;
  };


  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (mapboxToken && map.current) {
      addPropertyMarkers();
    }
  }, [properties, selectedProperty]);

  useEffect(() => {
    if (selectedProperty && map.current) {
      map.current.easeTo({
        center: selectedProperty.coordinates,
        zoom: 15
      });
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (map.current && selectedCity) {
      const city = cities.find(c => c.value === selectedCity);
      if (city) {
        console.log('Moving map to city:', city.label, city.coordinates);
        map.current.easeTo({
          center: city.coordinates,
          zoom: 11,
          duration: 1000
        });
      }
    }
  }, [selectedCity]);

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden shadow-medium" />
      <style>{`
        .property-marker:hover {
          transform: scale(1.1) !important;
        }
      `}</style>
    </div>
  );
}