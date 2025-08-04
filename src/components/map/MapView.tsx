import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3J1YmNsdWIxMjMiLCJhIjoiY203bmszdnFsMDF5czJxbjFuampiNXUwOSJ9.YixeEGA2iZd5yFhbyKv9Vg';

interface Property {
  id: string;
  address: string;
  lat: number;
  lng: number;
  status: 'qualified' | 'review' | 'disqualified';
  city: string;
  state: string;
  buildingOwner: string;
  lastModified: string;
  compliance: {
    zoning: string;
    currentOccupancy: string;
    byRightStatus: string;
    fireSprinklerStatus: string;
  };
  propertyDetails: {
    parcelNumber: string;
    squareFeet: number;
    owner: string;
  };
  reference: {
    county: string;
    page: string;
    block: string;
    book: string;
    created: string;
    updated: string;
  };
}

interface MapViewProps {
  className?: string;
  style?: React.CSSProperties;
  properties?: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  showPanel?: boolean;
  isHeatmapMode?: boolean;
  showPerformanceMessage?: boolean;
}

export function MapView({ 
  className = '', 
  style = {}, 
  properties = [], 
  selectedProperty = null,
  onPropertySelect,
  showPanel = false,
  isHeatmapMode = false,
  showPerformanceMessage = false
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [currentZoom, setCurrentZoom] = useState(12);

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

      // Add zoom change listener
      map.current.on('zoom', () => {
        if (map.current) {
          setCurrentZoom(map.current.getZoom());
        }
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

  // Add heatmap layer function
  const addHeatmapLayer = () => {
    if (!map.current || properties.length === 0) return;

    // Create GeoJSON data for heatmap
    const heatmapData = {
      type: 'FeatureCollection' as const,
      features: properties.map(property => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [property.lng, property.lat]
        },
        properties: {
          id: property.id,
          weight: 1
        }
      }))
    };

    // Remove existing sources and layers
    if (map.current.getSource('properties-heat')) {
      if (map.current.getLayer('properties-heatmap')) {
        map.current.removeLayer('properties-heatmap');
      }
      if (map.current.getLayer('properties-points')) {
        map.current.removeLayer('properties-points');
      }
      map.current.removeSource('properties-heat');
    }

    // Add heatmap source
    map.current.addSource('properties-heat', {
      type: 'geojson',
      data: heatmapData
    });

    // Add heatmap layer
    map.current.addLayer({
      id: 'properties-heatmap',
      type: 'heatmap',
      source: 'properties-heat',
      maxzoom: 15,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'weight'],
          0, 0,
          1, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          15, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(134, 239, 172, 0)',
          0.2, 'rgba(134, 239, 172, 0.8)',
          0.4, 'rgba(252, 211, 77, 0.8)',
          0.6, 'rgba(249, 115, 22, 0.8)',
          0.8, 'rgba(239, 68, 68, 0.8)',
          1, 'rgba(239, 68, 68, 1)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          15, 20
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          15, 0
        ]
      }
    });

    // Add points layer for high zoom levels
    map.current.addLayer({
      id: 'properties-points',
      type: 'circle',
      source: 'properties-heat',
      minzoom: 14,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          14, 4,
          18, 8
        ],
        'circle-color': '#EF4444',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
        'circle-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          14, 0,
          15, 1
        ]
      }
    });

    // Fit bounds for heatmap
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach(property => {
        bounds.extend([property.lng, property.lat]);
      });
      map.current.fitBounds(bounds, { 
        padding: 50,
        maxZoom: 12
      });
    }
  };

  // Remove heatmap layers
  const removeHeatmapLayer = () => {
    if (!map.current) return;
    
    if (map.current.getSource('properties-heat')) {
      if (map.current.getLayer('properties-heatmap')) {
        map.current.removeLayer('properties-heatmap');
      }
      if (map.current.getLayer('properties-points')) {
        map.current.removeLayer('properties-points');
      }
      map.current.removeSource('properties-heat');
    }
  };

  // Add individual markers
  const addMarkers = () => {
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
  };

  // Update property visualization when properties change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Remove existing heatmap
    removeHeatmapLayer();

    if (properties.length === 0) return;

    if (isHeatmapMode) {
      // Use heatmap for large datasets
      addHeatmapLayer();
    } else {
      // Use individual markers for smaller datasets
      addMarkers();
      
      // Fit bounds to show all properties
      if (properties.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        properties.forEach(property => {
          bounds.extend([property.lng, property.lat]);
        });
        map.current.fitBounds(bounds, { 
          padding: showPanel ? { right: 440, top: 50, bottom: 50, left: 50 } : 50,
          maxZoom: 15
        });
      }
    }
  }, [properties, selectedProperty, onPropertySelect, showPanel, isHeatmapMode]);

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
      className={`relative ${className}`} 
      style={{ 
        ...style,
        width: showPanel && !isHeatmapMode ? 'calc(100% - 420px)' : '100%'
      }}
    >
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Performance/Heatmap Message */}
      {(isHeatmapMode || showPerformanceMessage) && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border">
          <p className="text-sm text-muted-foreground">
            {isHeatmapMode 
              ? `Showing density view for ${properties.length.toLocaleString()}+ properties`
              : 'Performance mode - zoom in to see details'
            }
          </p>
        </div>
      )}
      
      {/* Zoom level indicator for debugging */}
      {isHeatmapMode && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
          Zoom: {currentZoom.toFixed(1)} {currentZoom >= 14 ? '(Individual view)' : '(Density view)'}
        </div>
      )}
    </div>
  );
}

export default MapView;