import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterCriteria } from '@/types/property';
import { X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterCriteria;
  onFiltersChange: (filters: FilterCriteria) => void;
  qualifiedCount: number;
  totalCount: number;
}

export function FilterBar({ filters, onFiltersChange, qualifiedCount, totalCount }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleZoningChange = (value: string) => {
    const zoningValue = value === 'any' ? null : value === 'true';
    onFiltersChange({ ...filters, zoningByRight: zoningValue });
  };

  const handleSprinklersChange = (value: string) => {
    const sprinklersValue = value === 'any' ? null : value === 'true';
    onFiltersChange({ ...filters, fireSprinklers: sprinklersValue });
  };

  const handleOccupancyChange = (value: string) => {
    const currentTypes = filters.occupancyType;
    if (value && !currentTypes.includes(value)) {
      onFiltersChange({ ...filters, occupancyType: [...currentTypes, value] });
    }
  };

  const removeOccupancyType = (typeToRemove: string) => {
    onFiltersChange({
      ...filters,
      occupancyType: filters.occupancyType.filter(type => type !== typeToRemove)
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      zoningByRight: null,
      fireSprinklers: null,
      occupancyType: [],
      minSquareFootage: 0,
      maxSquareFootage: 100000
    });
  };

  const hasActiveFilters = filters.zoningByRight !== null || 
                          filters.fireSprinklers !== null || 
                          filters.occupancyType.length > 0 ||
                          filters.minSquareFootage > 0 ||
                          filters.maxSquareFootage < 100000;

  return (
    <Card className="p-4 space-y-4 shadow-subtle">
      {/* Header with results count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">
            <span className="text-qualified text-xl">{qualifiedCount}</span>
            <span className="text-muted-foreground mx-1">qualified of</span>
            <span className="text-foreground">{totalCount}</span>
            <span className="text-muted-foreground ml-1">properties</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {((qualifiedCount / totalCount) * 100).toFixed(1)}% qualification rate
          </div>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Primary filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Zoning by Right</label>
          <Select value={filters.zoningByRight === null ? 'any' : filters.zoningByRight.toString()} onValueChange={handleZoningChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fire Sprinklers</label>
          <Select value={filters.fireSprinklers === null ? 'any' : filters.fireSprinklers.toString()} onValueChange={handleSprinklersChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Occupancy Type</label>
          <Select onValueChange={handleOccupancyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Warehouse">Warehouse</SelectItem>
              <SelectItem value="Mixed Use">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
          {filters.occupancyType.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.occupancyType.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                  <button 
                    onClick={() => removeOccupancyType(type)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Square Footage</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minSquareFootage || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                minSquareFootage: parseInt(e.target.value) || 0
              })}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxSquareFootage === 100000 ? '' : filters.maxSquareFootage}
              onChange={(e) => onFiltersChange({
                ...filters,
                maxSquareFootage: parseInt(e.target.value) || 100000
              })}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Quick filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.zoningByRight === true && filters.fireSprinklers === true ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({
            ...filters,
            zoningByRight: true,
            fireSprinklers: true
          })}
        >
          School Ready
        </Button>
        <Button
          variant={filters.zoningByRight === null && filters.fireSprinklers === null ? "outline" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({
            ...filters,
            zoningByRight: null,
            fireSprinklers: null
          })}
        >
          Needs Research
        </Button>
        <Button
          variant={filters.minSquareFootage >= 20000 ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({
            ...filters,
            minSquareFootage: 20000
          })}
        >
          Large Buildings (20k+ sq ft)
        </Button>
      </div>
    </Card>
  );
}