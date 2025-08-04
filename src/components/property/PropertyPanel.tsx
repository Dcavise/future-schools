import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Building, MapPin, DollarSign, Users, ChevronDown, X } from 'lucide-react';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  buildingOwner: string;
  lastModified: string;
  compliance: {
    zoning: string;
    currentOccupancy: string;
    byRightStatus: string;
    fireSprinklerStatus: string;
  };
  propertyDetails: {
    parcelNumber: string;
    squareFeet: number;
    owner: string;
  };
  reference: {
    county: string;
    page: string;
    block: string;
    book: string;
    created: string;
    updated: string;
  };
  status: 'qualified' | 'review' | 'disqualified';
}

interface PropertyPanelProps {
  property: Property | null;
  onClose?: () => void;
}

export function PropertyPanel({ property, onClose }: PropertyPanelProps) {
  if (!property) {
    return (
      <div className="w-[420px] h-full bg-white border-l border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a property to view details</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-500 text-white';
      case 'review': return 'bg-yellow-500 text-white';
      case 'disqualified': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'qualified': return 'Qualified';
      case 'review': return 'Needs Review';
      case 'disqualified': return 'Disqualified';
      default: return 'Unknown';
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case 'qualified':
        return <Button className="w-full">Schedule Site Visit</Button>;
      case 'review':
        return <Button variant="outline" className="w-full">Complete Review</Button>;
      case 'disqualified':
        return <Button variant="secondary" className="w-full">Find Alternative</Button>;
      default:
        return <Button variant="outline" className="w-full">Review Property</Button>;
    }
  };

  const ComplianceField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{value}</span>
        {value === 'Unknown' && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
      </div>
    </div>
  );

  return (
    <div className="w-[420px] h-full bg-white border-l border-border animate-slide-in-right">
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground leading-tight">
              {property.address}
            </h2>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Badge className={getStatusColor(property.status)}>
            {getStatusLabel(property.status)}
          </Badge>
        </div>

        {/* Building Owner */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Building Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assigned to:</span>
                <span className="text-sm font-medium">{property.buildingOwner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last modified:</span>
                <span className="text-sm font-medium">{property.lastModified}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Assign an owner to enable Salesforce push
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ComplianceField label="Zoning" value={property.compliance.zoning} />
            <ComplianceField label="Current Occupancy" value={property.compliance.currentOccupancy} />
            <ComplianceField label="By-Right Status" value={property.compliance.byRightStatus} />
            <ComplianceField label="Fire Sprinkler Status" value={property.compliance.fireSprinklerStatus} />
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Parcel Number:</span>
              <span className="text-sm font-medium">{property.propertyDetails.parcelNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Square Feet:</span>
              <span className="text-sm font-medium">{property.propertyDetails.squareFeet.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Owner:</span>
              <span className="text-sm font-medium">{property.propertyDetails.owner}</span>
            </div>
          </CardContent>
        </Card>

        {/* Reference */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">County:</span>
              <span className="text-sm font-medium">{property.reference.county}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Page:</span>
              <span className="text-sm font-medium">{property.reference.page}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Block:</span>
              <span className="text-sm font-medium">{property.reference.block}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Book:</span>
              <span className="text-sm font-medium">{property.reference.book}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="text-sm font-medium">{property.reference.created}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Updated:</span>
              <span className="text-sm font-medium">{property.reference.updated}</span>
            </div>
          </CardContent>
        </Card>

        {/* Scoping Notes */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Scoping Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Add notes about this property..."
              className="min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="mt-6">
          {getActionButton(property.status)}
        </div>
      </div>
    </div>
  );
}

export default PropertyPanel;