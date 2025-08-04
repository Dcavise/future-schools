import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

interface FilterCriteria {
  status: string[];
  compliance: string[];
  propertyType: string[];
  minSquareFeet: string;
  maxSquareFeet: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  filters: FilterCriteria;
  onFiltersChange: (filters: FilterCriteria) => void;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}

export function FilterPanel({ 
  isOpen, 
  filters, 
  onFiltersChange, 
  onClose, 
  onApply, 
  onClear 
}: FilterPanelProps) {
  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked 
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleComplianceChange = (compliance: string, checked: boolean) => {
    const newCompliance = checked 
      ? [...filters.compliance, compliance]
      : filters.compliance.filter(c => c !== compliance);
    onFiltersChange({ ...filters, compliance: newCompliance });
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.propertyType, type]
      : filters.propertyType.filter(t => t !== type);
    onFiltersChange({ ...filters, propertyType: newTypes });
  };

  const handleSizeChange = (field: 'minSquareFeet' | 'maxSquareFeet', value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 animate-slide-down">
      <Card className="h-[280px] bg-white shadow-lg rounded-none border-t-0">
        <div className="p-6 h-full">
          <div className="grid grid-cols-4 gap-8 h-full">
            {/* Column 1 - Compliance Status */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Compliance Status</h3>
              <div className="space-y-3">
                {[
                  { value: 'qualified', label: 'Qualified (all compliant)' },
                  { value: 'review', label: 'Needs Review (has unknowns)' },
                  { value: 'disqualified', label: 'Disqualified (non-compliant)' }
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${value}`}
                      checked={filters.status.includes(value)}
                      onCheckedChange={(checked) => handleStatusChange(value, checked as boolean)}
                    />
                    <label htmlFor={`status-${value}`} className="text-sm cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 - Compliance Fields */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Compliance Fields</h3>
              <div className="space-y-3">
                {[
                  { value: 'zoning', label: 'Zoning Compliant' },
                  { value: 'occupancy', label: 'Current Occupancy Known' },
                  { value: 'byRight', label: 'By-Right Status Compliant' },
                  { value: 'sprinkler', label: 'Fire Sprinkler Compliant' }
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`compliance-${value}`}
                      checked={filters.compliance.includes(value)}
                      onCheckedChange={(checked) => handleComplianceChange(value, checked as boolean)}
                    />
                    <label htmlFor={`compliance-${value}`} className="text-sm cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3 - Property Type */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Property Type</h3>
              <div className="space-y-3">
                {[
                  { value: 'Retail', label: 'Retail' },
                  { value: 'Office', label: 'Office' },
                  { value: 'Mixed', label: 'Mixed Use' },
                  { value: 'Unknown', label: 'Unknown' }
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${value}`}
                      checked={filters.propertyType.includes(value)}
                      onCheckedChange={(checked) => handlePropertyTypeChange(value, checked as boolean)}
                    />
                    <label htmlFor={`type-${value}`} className="text-sm cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4 - Property Size */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Property Size</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Min sq ft</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minSquareFeet}
                    onChange={(e) => handleSizeChange('minSquareFeet', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Max sq ft</label>
                  <Input
                    type="number"
                    placeholder="999,999"
                    value={filters.maxSquareFeet}
                    onChange={(e) => handleSizeChange('maxSquareFeet', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="absolute bottom-6 right-6 flex items-center gap-4">
            <button 
              onClick={onClear}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Clear All
            </button>
            <Button onClick={onApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FilterPanel;