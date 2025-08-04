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
    <div className={`fixed top-14 left-0 right-0 w-full h-[280px] bg-white border-b border-[#E5E7EB] z-30 transition-transform duration-200 ease-out ${
      isOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
    }`} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
      <div className="max-w-[1200px] mx-auto h-full px-6 py-6">
        <div className="grid grid-cols-4 gap-8 h-full">
          {/* Column 1 - Compliance Status */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-900">Compliance Status</h3>
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
                  <label htmlFor={`status-${value}`} className="text-sm cursor-pointer text-gray-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Compliance Fields */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-900">Compliance Fields</h3>
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
                  <label htmlFor={`compliance-${value}`} className="text-sm cursor-pointer text-gray-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 - Property Type */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-900">Property Type</h3>
            <div className="space-y-3">
              {[
                { value: 'Educational', label: 'Educational' },
                { value: 'Assembly', label: 'Assembly' },
                { value: 'Other', label: 'Other' },
                { value: 'Unknown', label: 'Unknown' }
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${value}`}
                    checked={filters.propertyType.includes(value)}
                    onCheckedChange={(checked) => handlePropertyTypeChange(value, checked as boolean)}
                  />
                  <label htmlFor={`type-${value}`} className="text-sm cursor-pointer text-gray-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 - Property Size & Actions */}
          <div className="flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-4 text-gray-900">Property Size</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Min sq ft</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minSquareFeet}
                    onChange={(e) => handleSizeChange('minSquareFeet', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Max sq ft</label>
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
            
            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
              <button 
                onClick={onClear}
                className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Clear All
              </button>
              <Button 
                onClick={onApply}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;