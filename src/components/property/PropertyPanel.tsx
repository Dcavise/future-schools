import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Building, Check, HelpCircle, X as XIcon, User } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyPanelProps {
  property: Property | null;
  onClose?: () => void;
}

export function PropertyPanel({ property, onClose }: PropertyPanelProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800 border border-green-200';
      case 'reviewing': 
      case 'unreviewed': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'disqualified': return 'bg-red-100 text-red-800 border border-red-200';
      case 'on_hold': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'qualified': return 'Qualified';
      case 'reviewing': return 'Under Review';
      case 'unreviewed': return 'Needs Review';
      case 'disqualified': return 'Disqualified';
      case 'on_hold': return 'On Hold';
      default: return 'Unknown';
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case 'qualified':
        return <Button className="w-full bg-blue-600 hover:bg-blue-700">Schedule Site Visit</Button>;
      case 'reviewing':
      case 'unreviewed':
        return <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">Complete Review</Button>;
      case 'disqualified':
        return <Button variant="secondary" className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200">Find Alternative</Button>;
      default:
        return <Button variant="outline" className="w-full">Review Property</Button>;
    }
  };

  const getComplianceIcon = (value: boolean | null) => {
    if (value === true) return <Check className="h-4 w-4 text-green-600" />;
    if (value === false) return <XIcon className="h-4 w-4 text-red-600" />;
    return <HelpCircle className="h-4 w-4 text-yellow-600" />;
  };

  const getComplianceStatus = (value: boolean | null) => {
    if (value === true) return "Compliant";
    if (value === false) return "Non-compliant"; 
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

  return (
    <div className="fixed top-[56px] right-0 w-[420px] bottom-0 bg-white border-l border-[#E5E7EB] shadow-[-2px_0_8px_rgba(0,0,0,0.05)] z-40 overflow-y-auto">
      {/* Panel Header */}
      <div className="h-[180px] p-6 bg-[#F9FAFB] relative">
        {/* Close Button */}
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-6 right-6 h-6 w-6 p-0"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
        
        {/* Address Block */}
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-[#1A1A1A] leading-tight">
            {property.address}
          </h2>
          <p className="text-sm text-[#6B7280] mt-2">
            {property.city}, {property.state}
          </p>
        </div>
        
        {/* Status Badge */}
        <Badge className={`${getStatusColor(property.status)} absolute top-6 right-12 px-3 py-1 text-xs font-medium rounded`}>
          {getStatusLabel(property.status)}
        </Badge>
      </div>

      <div className="p-6">
        {/* Building Owner Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-[#6B7280]" />
            <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Building Owner</span>
          </div>
          <div className="text-sm text-[#1A1A1A]">
            {property.assignedAnalyst || 'Unassigned'}
            {!property.assignedAnalyst && (
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">Needs Review</Badge>
            )}
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Property Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Square Feet</div>
              <div className="text-sm text-[#1A1A1A]">{property.squareFootage?.toLocaleString() || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Building Year</div>
              <div className="text-sm text-[#1A1A1A]">{property.buildingYear || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Lot Size</div>
              <div className="text-sm text-[#1A1A1A]">{property.lotSize ? `${property.lotSize.toLocaleString()} sq ft` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Parking</div>
              <div className="text-sm text-[#1A1A1A]">{property.parkingSpaces ? `${property.parkingSpaces} spaces` : 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-4">Compliance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getComplianceIcon(property.zoningByRight)}
                <span className="text-sm text-[#1A1A1A]">Zoning By-Right</span>
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                {getComplianceStatus(property.zoningByRight)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getComplianceIcon(property.fireSprinklers)}
                <span className="text-sm text-[#1A1A1A]">Fire Sprinklers</span>
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                {getComplianceStatus(property.fireSprinklers)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getComplianceIcon(property.currentOccupancy !== null)}
                <span className="text-sm text-[#1A1A1A]">Current Occupancy</span>
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                {getOccupancyLabel(property.currentOccupancy)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4 mb-6">
          {property.parcelNumber && (
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Parcel Number</div>
              <div className="text-sm text-[#1A1A1A]">{property.parcelNumber}</div>
            </div>
          )}
          
          {property.price && (
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Estimated Value</div>
              <div className="text-sm text-[#1A1A1A]">${property.price.toLocaleString()}</div>
            </div>
          )}
          
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Last Updated</div>
            <div className="text-sm text-[#1A1A1A]">{property.lastUpdated}</div>
          </div>
        </div>

        {/* Notes Section */}
        {property.notes && property.notes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Research Notes</h3>
            <div className="space-y-3">
              {property.notes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#6B7280]">{note.author}</span>
                    <span className="text-xs text-[#6B7280]">{note.createdAt}</span>
                  </div>
                  <p className="text-sm text-[#1A1A1A]">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoping Notes */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Scoping Notes</h3>
          <Textarea 
            placeholder="Add notes about this property..."
            className="min-h-[100px] resize-none border-gray-200"
          />
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200">
          {getActionButton(property.status)}
        </div>
      </div>
    </div>
  );
}

export default PropertyPanel;