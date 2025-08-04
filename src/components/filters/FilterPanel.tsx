import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Building, GraduationCap, Users, Home } from 'lucide-react';

interface FilterCriteria {
  status: string[];
  compliance: string[];
  propertyType: string[];
  minSquareFeet: string;
  maxSquareFeet: string;
  sizeRange: string[];
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

  const handleSizeRangeChange = (range: string, checked: boolean) => {
    const newRanges = checked 
      ? [...(filters.sizeRange || []), range]
      : (filters.sizeRange || []).filter(r => r !== range);
    onFiltersChange({ ...filters, sizeRange: newRanges });
  };

  const getSizeRangeLabel = (range: string) => {
    switch (range) {
      case 'under10k': return 'Under 10k';
      case '10k-25k': return '10k-25k';
      case '25k-50k': return '25k-50k';
      case '50k+': return '50k+';
      default: return range;
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'Educational': return <GraduationCap className="h-4 w-4 text-gray-500" />;
      case 'Assembly': return <Users className="h-4 w-4 text-gray-500" />;
      case 'Other': return <Building className="h-4 w-4 text-gray-500" />;
      case 'Unknown': return <Home className="h-4 w-4 text-gray-500" />;
      default: return <Building className="h-4 w-4 text-gray-500" />;
    }
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
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Compliance Status</h3>
            <div className="space-y-3">
              {[
                { value: 'qualified', label: 'Qualified (all compliant)', color: 'bg-green-500' },
                { value: 'review', label: 'Needs Review (has unknowns)', color: 'bg-amber-500' },
                { value: 'disqualified', label: 'Disqualified (non-compliant)', color: 'bg-red-500' }
              ].map(({ value, label, color }) => (
                <div key={value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`status-${value}`}
                    checked={filters.status.includes(value)}
                    onCheckedChange={(checked) => handleStatusChange(value, checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${color}`}></div>
                    <label htmlFor={`status-${value}`} className="text-sm cursor-pointer text-gray-700">
                      {label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Compliance Fields */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Compliance Fields</h3>
            <div className="space-y-3">
              {[
                { value: 'zoning', label: 'Has complete zoning data', subtext: 'By-right status known' },
                { value: 'occupancy', label: 'Has occupancy data', subtext: 'Current use verified' },
                { value: 'byRight', label: 'By-right compliant', subtext: 'Permitted use confirmed' },
                { value: 'sprinkler', label: 'Has fire sprinklers', subtext: 'System present and functional' }
              ].map(({ value, label, subtext }) => (
                <div key={value} className="flex items-start space-x-2">
                  <Checkbox
                    id={`compliance-${value}`}
                    checked={filters.compliance.includes(value)}
                    onCheckedChange={(checked) => handleComplianceChange(value, checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <label htmlFor={`compliance-${value}`} className="text-sm cursor-pointer text-gray-700 block">
                      {label}
                    </label>
                    <div className="text-xs text-[#6B7280] mt-1">{subtext}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 - Property Type */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900">Property Type</h3>
            <div className="space-y-3">
              {[
                { value: 'Educational', label: 'Educational (E)' },
                { value: 'Assembly', label: 'Assembly (A)' },
                { value: 'Other', label: 'Other' },
                { value: 'Unknown', label: 'Unknown' }
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`type-${value}`}
                    checked={filters.propertyType.includes(value)}
                    onCheckedChange={(checked) => handlePropertyTypeChange(value, checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    {getPropertyTypeIcon(value)}
                    <label htmlFor={`type-${value}`} className="text-sm cursor-pointer text-gray-700">
                      {label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 - Property Size & Actions */}
          <div className="flex flex-col">
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-4 text-gray-900">Square Footage</h3>
              
              {/* Input Fields */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minSquareFeet}
                      onChange={(e) => handleSizeChange('minSquareFeet', e.target.value)}
                      className="w-full pr-12"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">sq ft</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Max</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="999,999"
                      value={filters.maxSquareFeet}
                      onChange={(e) => handleSizeChange('maxSquareFeet', e.target.value)}
                      className="w-full pr-12"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">sq ft</span>
                  </div>
                </div>
              </div>

              {/* Quick Range Pills */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 block">Quick ranges</label>
                <div className="flex flex-wrap gap-2">
                  {['under10k', '10k-25k', '25k-50k', '50k+'].map((range) => (
                    <Button
                      key={range}
                      variant={filters.sizeRange?.includes(range) ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleSizeRangeChange(range, !filters.sizeRange?.includes(range))}
                      className={`text-xs px-3 py-1 h-auto ${
                        filters.sizeRange?.includes(range) 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {getSizeRangeLabel(range)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
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