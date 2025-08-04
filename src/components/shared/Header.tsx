import React from 'react';
import { ChevronDown, Filter, Upload, Map, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onFiltersClick?: () => void;
  activeFilterCount?: number;
  cityContext?: string;
  propertyCount?: number;
  currentView?: 'map' | 'table';
  onViewToggle?: (view: 'map' | 'table') => void;
  showViewToggle?: boolean;
}

export function Header({ 
  onFiltersClick, 
  activeFilterCount = 0,
  cityContext,
  propertyCount,
  currentView = 'map',
  onViewToggle,
  showViewToggle = false
}: HeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-14 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Primer
          </h1>
        </div>
        
        {/* Center Section - City Context Badge */}
        <div className="flex-1 flex justify-center">
          {cityContext && propertyCount !== undefined && (
            <div className="bg-gray-100 rounded-md px-3 py-1.5">
              <span className="text-sm text-gray-600">
                {cityContext} • {propertyCount.toLocaleString()} properties
              </span>
            </div>
          )}
        </div>
        
        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          
          {/* Filter Button */}
          {onFiltersClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFiltersClick}
              className="flex items-center gap-2 relative"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </Button>
          )}
          
          {/* Import Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/import')}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          
          {/* View Toggle */}
          {showViewToggle && onViewToggle && (
            <div className="flex bg-gray-100 rounded-md p-1">
              <Button
                variant={currentView === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewToggle('map')}
                className="h-8 px-3 rounded-sm"
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
              <Button
                variant={currentView === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewToggle('table')}
                className="h-8 px-3 rounded-sm"
              >
                <List className="h-4 w-4 mr-1" />
                Table
              </Button>
            </div>
          )}
          
          {/* User Menu */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              JS
            </div>
            <span className="text-sm font-medium text-gray-900 ml-2 mr-1">
              John Smith
            </span>
            <ChevronDown className="w-4 h-4 text-gray-900" />
          </div>
        </div>
      </div>
    </header>
  );
}