import React, { useState } from 'react';
import { FilterCriteria } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface FilterMenuProps {
  filters: FilterCriteria;
  onFiltersChange: (filters: FilterCriteria) => void;
  qualifiedCount: number;
  totalCount: number;
}

export function FilterMenu({ filters, onFiltersChange, qualifiedCount, totalCount }: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      zoningByRight: null,
      fireSprinklers: null,
      occupancyType: [],
      minSquareFootage: 0,
      maxSquareFootage: 100000
    });
  };

  const hasActiveFilters = 
    filters.zoningByRight !== null ||
    filters.fireSprinklers !== null ||
    filters.occupancyType.length > 0 ||
    filters.minSquareFootage > 0 ||
    filters.maxSquareFootage < 100000;

  return (
    <div className="absolute top-4 left-4 z-10">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="bg-background/95 backdrop-blur-sm border shadow-lg hover:bg-background/90"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
            {[
              filters.zoningByRight !== null,
              filters.fireSprinklers !== null,
              filters.occupancyType.length > 0,
              filters.minSquareFootage > 0 || filters.maxSquareFootage < 100000
            ].filter(Boolean).length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="mt-2 p-4 space-y-4 w-80 bg-background/95 backdrop-blur-sm border shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Property Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Results Summary */}
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Qualified Properties:</span>
                <span className="font-semibold text-qualified">{qualifiedCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Shown:</span>
                <span className="font-medium">{totalCount}</span>
              </div>
            </div>

            {/* Zoning by Right */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zoning by Right</label>
              <Select
                value={filters.zoningByRight?.toString() || "all"}
                onValueChange={(value) => handleFilterChange('zoningByRight', value === "all" ? null : value === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fire Sprinklers */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fire Sprinklers</label>
              <Select
                value={filters.fireSprinklers?.toString() || "all"}
                onValueChange={(value) => handleFilterChange('fireSprinklers', value === "all" ? null : value === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Occupancy Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Occupancy Type</label>
              <Select
                value={filters.occupancyType.length > 0 ? filters.occupancyType[0] : "all"}
                onValueChange={(value) => handleFilterChange('occupancyType', value === "all" ? [] : [value])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Institutional">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Square Footage */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Square Footage: {filters.minSquareFootage.toLocaleString()} - {filters.maxSquareFootage.toLocaleString()} sq ft
              </label>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Minimum</div>
                <Slider
                  value={[filters.minSquareFootage]}
                  onValueChange={(value) => handleFilterChange('minSquareFootage', value[0])}
                  max={50000}
                  step={1000}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">Maximum</div>
                <Slider
                  value={[filters.maxSquareFootage]}
                  onValueChange={(value) => handleFilterChange('maxSquareFootage', value[0])}
                  min={10000}
                  max={100000}
                  step={5000}
                  className="w-full"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}