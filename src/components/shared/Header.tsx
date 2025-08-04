import React from 'react';
import { ChevronDown, Filter, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onFiltersClick?: () => void;
  activeFilterCount?: number;
}

export function Header({ onFiltersClick, activeFilterCount = 0 }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[100] h-14 bg-white flex items-center justify-between px-6"
      style={{ 
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Left side - Logo and Filters */}
      <div className="flex items-center gap-6">
        <h1 
          className="text-xl font-semibold cursor-pointer"
          style={{ 
            fontSize: '20px',
            color: '#1A1A1A'
          }}
        >
          Primer
        </h1>
        
        {onFiltersClick && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={onFiltersClick}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Add Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
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
      </div>
      
      {/* Right side - User Menu */}
      <div className="flex items-center">
        <div 
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          style={{ 
            padding: '8px',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F5F5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {/* User Avatar */}
          <div 
            className="flex items-center justify-center text-white font-semibold rounded-full"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#0066CC',
              fontSize: '14px'
            }}
          >
            JS
          </div>
          
          {/* User Name */}
          <span 
            className="font-medium"
            style={{
              fontSize: '14px',
              color: '#1A1A1A',
              marginLeft: '8px',
              marginRight: '4px'
            }}
          >
            John Smith
          </span>
          
          {/* Dropdown Arrow */}
          <ChevronDown 
            className="w-4 h-4"
            style={{ color: '#1A1A1A' }}
          />
        </div>
      </div>
    </header>
  );
}