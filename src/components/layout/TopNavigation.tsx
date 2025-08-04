import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface TopNavigationProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const cities = [
  { value: 'boston', label: 'Boston, MA' },
  { value: 'chicago', label: 'Chicago, IL' },
  { value: 'denver', label: 'Denver, CO' },
  { value: 'austin', label: 'Austin, TX' },
  { value: 'seattle', label: 'Seattle, WA' },
];

export function TopNavigation({ selectedCity, onCityChange }: TopNavigationProps) {
  return (
    <div className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">Property Evaluation Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg z-50">
              {cities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}