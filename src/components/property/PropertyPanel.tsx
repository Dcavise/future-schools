import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Check, HelpCircle, X as XIcon, User, ChevronLeft, ChevronRight, UserPlus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyPanelProps {
  property: Property | null;
  onClose?: () => void;
  onNextProperty?: () => void;
  onPreviousProperty?: () => void;
  onMarkQualified?: (property: Property) => void;
  onAssignAnalyst?: (property: Property) => void;
  onPropertyUpdate?: (property: Property) => void;
}

const teamMembers = [
  'Unassigned',
  'Jarnail T',
  'David H', 
  'Aly A',
  'Ryan D',
  'Chris W',
  'JB',
  'Stephen B'
];

export function PropertyPanel({ 
  property, 
  onClose, 
  onNextProperty, 
  onPreviousProperty, 
  onMarkQualified, 
  onAssignAnalyst,
  onPropertyUpdate 
}: PropertyPanelProps) {
  const [selectedAssignee, setSelectedAssignee] = useState<string>(property?.assigned_to || 'Unassigned');

  // Update selectedAssignee when property changes
  React.useEffect(() => {
    setSelectedAssignee(property?.assigned_to || 'Unassigned');
  }, [property?.assigned_to]);

  if (!property) {
    return (
      <div className="fixed top-[56px] right-0 w-[420px] bottom-0 bg-white border-l border-[#E5E7EB] shadow-[-2px_0_8px_rgba(0,0,0,0.05)] flex items-center justify-center z-40">
        <div className="text-center text-[#6B7280]">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a property to view details</p>
        </div>
      </div>
    );
  }

  const handleAssignmentChange = (value: string) => {
    setSelectedAssignee(value);
    if (onPropertyUpdate) {
      const updatedProperty = {
        ...property,
        assigned_to: value === 'Unassigned' ? null : value,
        updated_at: new Date().toISOString()
      };
      onPropertyUpdate(updatedProperty);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-[#10B981] text-white';
      case 'reviewing': return 'bg-[#3B82F6] text-white';
      case 'not_qualified': return 'bg-[#EF4444] text-white';
      case 'new': return 'bg-[#6B7280] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getHeaderClass = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-[#F0FDF4] border-b-2 border-[#10B981]';
      case 'reviewing':
      case 'unreviewed': return 'bg-[#FFFBEB] border-b-2 border-[#F59E0B]';
      case 'disqualified': return 'bg-[#FEF2F2] border-b-2 border-[#EF4444]';
      default: return 'bg-[#F9FAFB] border-b border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'qualified': return <Check className="h-4 w-4" />;
      case 'reviewing':
      case 'unreviewed': return <Clock className="h-4 w-4" />;
      case 'disqualified': return <XIcon className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (status: string, property: Property) => {
    const unknownCount = [
      property.zoning_by_right === null,
      property.fire_sprinkler_status === null,
      property.current_occupancy === null
    ].filter(Boolean).length;

    switch (status) {
      case 'qualified': return 'All requirements met';
      case 'reviewing':
      case 'unreviewed': return `${unknownCount} item${unknownCount !== 1 ? 's' : ''} need verification`;
      case 'disqualified': return 'Does not meet requirements';
      default: return 'Status unknown';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'synced': return 'Synced';
      case 'reviewing': return 'Reviewing';
      case 'new': return 'New';
      case 'not_qualified': return 'Not Qualified';
      default: return 'Unknown';
    }
  };

  const getComplianceIcon = (value: boolean | string | null) => {
    if (value === true || value === 'Yes') return <Check className="h-4 w-4 text-green-600" />;
    if (value === false || value === 'No') return <XIcon className="h-4 w-4 text-red-600" />;
    return <HelpCircle className="h-4 w-4 text-yellow-600" />;
  };

  const getComplianceStatus = (value: boolean | string | null) => {
    if (value === true || value === 'Yes') return "Compliant";
    if (value === false || value === 'No') return "Non-compliant"; 
    return "Unknown";
  };

  const getOccupancyLabel = (occupancy: string | null) => {
    switch (occupancy) {
      case 'E': return 'Educational';
      case 'A': return 'Assembly';
      case 'Other': return 'Other';
      default: return 'Unknown';
    }
  };

  const getPrimaryAction = (status: string) => {
    switch (status) {
      case 'qualified':
        return (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Site Visit
          </Button>
        );
      case 'reviewing':
      case 'unreviewed':
        return (
          <div className="space-y-2">
            <Button className="w-full bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold py-3">
              Complete Review
            </Button>
            {!property?.assigned_to && (
              <Button 
                onClick={() => onAssignAnalyst?.(property!)}
                variant="outline"
                className="w-full bg-transparent border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50 py-3"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Analyst
              </Button>
            )}
          </div>
        );
      case 'disqualified':
        return (
          <div>
            <Button variant="secondary" className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-3">
              Find Alternative
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">View similar properties</p>
          </div>
        );
      default:
        return (
          <Button variant="outline" className="w-full py-3">
            Review Property
          </Button>
        );
    }
  };

  return (
    <div className="fixed top-[56px] right-0 w-[420px] bottom-0 bg-white border-l border-[#E5E7EB] shadow-[-2px_0_8px_rgba(0,0,0,0.05)] z-40 overflow-y-auto">
      {/* Panel Header */}
      <div className={`h-[200px] p-6 relative ${getHeaderClass(property.status)}`}>
        {/* Navigation Arrows */}
        <div className="absolute top-4 left-4 flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onPreviousProperty}
            className="h-8 w-8 p-0 bg-white shadow-sm hover:bg-gray-50"
            disabled={!onPreviousProperty}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNextProperty}
            className="h-8 w-8 p-0 bg-white shadow-sm hover:bg-gray-50"
            disabled={!onNextProperty}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Close Button */}
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 p-0 bg-white shadow-sm hover:bg-gray-50"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
        
        {/* Address Block */}
        <div className="mt-8 mb-3">
          <h2 className="text-xl font-semibold text-[#1A1A1A] leading-tight">
            {property.address}
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">
            {property.city}, {property.state}
          </p>
        </div>

        {/* Assignment Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-gray-700" />
            <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Assigned To</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-900">
              {property.assigned_to || 'Unassigned'}
              {!property.assigned_to && (
                <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">Needs Assignment</Badge>
              )}
            </div>
            
            {/* Assignment Dropdown */}
            <Select 
              value={selectedAssignee} 
              onValueChange={handleAssignmentChange}
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`${getStatusColor(property.status)} absolute top-4 right-16 px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5`}>
          {getStatusIcon(property.status)}
          {getStatusLabel(property.status)}
        </div>

      </div>

      <div className="p-6">
        {/* Property Details Grid */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Property Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Square Feet</div>
              <div className="text-sm text-[#1A1A1A]">{property.square_feet?.toLocaleString() || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">ZIP Code</div>
              <div className="text-sm text-[#1A1A1A]">{property.zip || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Parcel Number</div>
              <div className="text-sm text-[#1A1A1A]">{property.parcel_number || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Zoning Code</div>
              <div className="text-sm text-[#1A1A1A]">{property.zoning_code || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-4">Compliance Requirements</h3>
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#F9FAFB] rounded-lg">
            {/* Zoning By-Right */}
            <div className={`flex items-center gap-2 p-3 bg-white rounded border-l-3 ${
              property.zoning_by_right === true ? 'border-l-[#10B981] bg-[#F0FDF4]' :
              property.zoning_by_right === false ? 'border-l-[#EF4444] bg-[#FEF2F2]' : 
              'border-l-[#F59E0B] bg-[#FFFBEB] cursor-pointer hover:border-l-[#D97706] hover:shadow-sm'
            }`}>
              {getComplianceIcon(property.zoning_by_right)}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-gray-900">Zoning By-Right</div>
                <div className="text-xs text-gray-600">{getComplianceStatus(property.zoning_by_right)}</div>
                {property.zoning_by_right === false && (
                  <div className="text-xs text-[#DC2626] mt-1">Non-conforming use</div>
                )}
                {property.zoning_by_right === null && property.status === 'new' && (
                  <div className="text-xs text-[#D97706] mt-1">Click to update</div>
                )}
              </div>
            </div>
            
            {/* Fire Sprinklers */}
            <div className={`flex items-center gap-2 p-3 bg-white rounded border-l-3 ${
              property.fire_sprinkler_status === 'Yes' ? 'border-l-[#10B981] bg-[#F0FDF4]' :
              property.fire_sprinkler_status === 'No' ? 'border-l-[#EF4444] bg-[#FEF2F2]' : 
              'border-l-[#F59E0B] bg-[#FFFBEB] cursor-pointer hover:border-l-[#D97706] hover:shadow-sm'
            }`}>
              {getComplianceIcon(property.fire_sprinkler_status)}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-gray-900">Fire Sprinklers</div>
                <div className="text-xs text-gray-600">{getComplianceStatus(property.fire_sprinkler_status)}</div>
                {property.fire_sprinkler_status === 'No' && (
                  <div className="text-xs text-[#DC2626] mt-1">System not present</div>
                )}
                {property.fire_sprinkler_status === null && property.status === 'new' && (
                  <div className="text-xs text-[#D97706] mt-1">Click to update</div>
                )}
              </div>
            </div>
            
            {/* Current Occupancy */}
            <div className={`flex items-center gap-2 p-3 bg-white rounded border-l-3 ${
              property.current_occupancy !== null ? 'border-l-[#10B981] bg-[#F0FDF4]' : 
              'border-l-[#F59E0B] bg-[#FFFBEB] cursor-pointer hover:border-l-[#D97706] hover:shadow-sm'
            }`}>
              {getComplianceIcon(property.current_occupancy !== null)}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-gray-900">Current Occupancy</div>
                <div className="text-xs text-gray-600">{getOccupancyLabel(property.current_occupancy)}</div>
                {property.current_occupancy === null && property.status === 'new' && (
                  <div className="text-xs text-[#D97706] mt-1">Click to update</div>
                )}
              </div>
            </div>
            
            {/* Building Access */}
            <div className="flex items-center gap-2 p-3 bg-white rounded border-l-3 border-l-gray-200">
              <HelpCircle className="h-4 w-4 text-gray-400" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-gray-900">Building Access</div>
                <div className="text-xs text-gray-600">Pending Review</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Coordinates</div>
            <div className="text-sm text-[#1A1A1A]">
              {property.latitude && property.longitude 
                ? `${property.latitude}, ${property.longitude}` 
                : 'N/A'}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Created</div>
            <div className="text-sm text-[#1A1A1A]">{new Date(property.created_at).toLocaleDateString()}</div>
          </div>
          
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Last Updated</div>
            <div className="text-sm text-[#1A1A1A]">{new Date(property.updated_at).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Notes</h3>
          <Textarea 
            placeholder="Add notes about this property..."
            value={property.notes || ''}
            className="min-h-[100px] resize-none border-gray-200"
            readOnly
          />
        </div>

        {/* Action Section */}
        <div className="pt-4 border-t border-gray-200">
          {getPrimaryAction(property.status)}
        </div>
      </div>
    </div>
  );
}

export default PropertyPanel;