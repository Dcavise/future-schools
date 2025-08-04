import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, DollarSign, Users } from 'lucide-react';

interface Property {
  id: string;
  address: string;
  lat: number;
  lng: number;
  status: 'qualified' | 'review' | 'disqualified';
  taxValue: number;
  taxYearly: number;
  occupancyRate: number;
  sqft: number;
  type: string;
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
        return <Button variant="outline" className="w-full">Appeal Decision</Button>;
      default:
        return <Button variant="outline" className="w-full">Review Property</Button>;
    }
  };

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
                ×
              </Button>
            )}
          </div>
          
          <Badge className={getStatusColor(property.status)}>
            {getStatusLabel(property.status)}
          </Badge>
        </div>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium">{property.type}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Size:</span>
                <span className="ml-2 font-medium">{property.sqft.toLocaleString()} sq ft</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Tax Value:</span>
                <span className="ml-2 font-medium">${property.taxValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Annual Tax:</span>
                <span className="ml-2 font-medium">${property.taxYearly.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Occupancy:</span>
                <span className="ml-2 font-medium">{property.occupancyRate}%</span>
              </div>
            </div>
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