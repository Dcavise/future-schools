import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[100] h-14 bg-white flex items-center justify-between px-6"
      style={{ 
        borderBottom: '1px solid #E0E0E0',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Left side - Logo */}
      <div className="flex items-center">
        <h1 
          className="text-xl font-semibold cursor-pointer"
          style={{ 
            fontSize: '20px',
            color: '#1A1A1A'
          }}
        >
          Primer
        </h1>
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