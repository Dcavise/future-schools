import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property, PropertyCluster } from '@/types/property';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
}

export function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = 'pk.eyJ1IjoiZ3J1YmNsdWIxMjMiLCJhIjoiY203bmszdnFsMDF5czJxbjFuampiNXUwOSJ9.YixeEGA2iZd5yFhbyKv9Vg';
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-71.0589, 42.3601], // Boston
        zoom: 11,
        pitch: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        addPropertyMarkers();
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      alert('Invalid Mapbox token. Please check your token and try again.');
    }
  };

  const addPropertyMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Group properties for clustering (simplified clustering)
    const clusters = createClusters(properties);

    clusters.forEach(cluster => {
      if (cluster.properties.length === 1) {
        // Single property marker
        const property = cluster.properties[0];
        const marker = createPropertyMarker(property);
        markersRef.current.push(marker);
      } else {
        // Cluster marker
        const marker = createClusterMarker(cluster);
        markersRef.current.push(marker);
      }
    });
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

    el.addEventListener('click', () => {
      onPropertySelect(property);
    });

    const marker = new mapboxgl.Marker(el)
      .setLngLat(property.coordinates)
      .addTo(map.current!);

    return marker;
  };

  const createClusterMarker = (cluster: PropertyCluster) => {
    const el = document.createElement('div');
    el.className = 'cluster-marker';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    el.style.backgroundColor = '#374151';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = '10px';
    el.style.fontWeight = 'bold';
    el.style.color = 'white';
    
    el.innerHTML = `${cluster.qualifiedCount}✓/${cluster.totalCount}`;

    el.addEventListener('click', () => {
      if (map.current) {
        map.current.easeTo({
          center: cluster.coordinates,
          zoom: map.current.getZoom() + 2
        });
      }
    });

    const marker = new mapboxgl.Marker(el)
      .setLngLat(cluster.coordinates)
      .addTo(map.current!);

    return marker;
  };

  const createClusters = (properties: Property[]): PropertyCluster[] => {
    // Simple distance-based clustering
    const clusters: PropertyCluster[] = [];
    const processed = new Set<string>();

    properties.forEach(property => {
      if (processed.has(property.id)) return;

      const cluster: PropertyCluster = {
        id: `cluster-${property.id}`,
        coordinates: property.coordinates,
        qualifiedCount: property.qualificationStatus === 'qualified' ? 1 : 0,
        totalCount: 1,
        properties: [property]
      };

      // Find nearby properties (within ~500m at this zoom level)
      properties.forEach(otherProperty => {
        if (otherProperty.id !== property.id && !processed.has(otherProperty.id)) {
          const distance = getDistance(property.coordinates, otherProperty.coordinates);
          if (distance < 0.01) { // roughly 1km
            cluster.properties.push(otherProperty);
            cluster.totalCount++;
            if (otherProperty.qualificationStatus === 'qualified') {
              cluster.qualifiedCount++;
            }
            processed.add(otherProperty.id);
          }
        }
      });

      processed.add(property.id);
      clusters.push(cluster);
    });

    return clusters;
  };

  const getDistance = (coord1: [number, number], coord2: [number, number]) => {
    const dx = coord1[0] - coord2[0];
    const dy = coord1[1] - coord2[1];
    return Math.sqrt(dx * dx + dy * dy);
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

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden shadow-medium" />
      <style>{`
        .property-marker:hover {
          transform: scale(1.1) !important;
        }
        .cluster-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}