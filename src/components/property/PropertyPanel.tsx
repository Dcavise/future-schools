import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  Edit, 
  Check, 
  User, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ExternalLink,
  Building,
  MapPin,
  FileText,
  Plus
} from 'lucide-react';
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

const TEAM_MEMBERS = [
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'jarnail', label: 'Jarnail' },
  { value: 'david-h', label: 'David H' },
  { value: 'cavise', label: 'Cavise' },
  { value: 'jb', label: 'JB' },
  { value: 'stephen', label: 'Stephen' },
  { value: 'aly', label: 'Aly' },
  { value: 'ryan-d', label: 'Ryan D' },
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
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(property?.notes || '');

  if (!property) {
    return (
      <div className="h-full bg-background border-l border-border shadow-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a property to view details</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getComplianceStatus = (value: boolean | string | null) => {
    if (value === true || value === 'yes') return { label: 'Yes', icon: CheckCircle, variant: 'default' as const };
    if (value === false || value === 'no') return { label: 'No', icon: X, variant: 'destructive' as const };
    if (value === 'special-exemption') return { label: 'Special Exemption', icon: AlertCircle, variant: 'secondary' as const };
    return { label: 'Unknown', icon: AlertCircle, variant: 'secondary' as const };
  };

  const getOccupancyLabel = (occupancy: string | null) => {
    const occupancyMap: { [key: string]: string } = {
      'assembly': 'Assembly',
      'business': 'Business', 
      'educational': 'Educational',
      'factory': 'Factory',
      'industrial': 'Industrial',
      'institutional': 'Institutional',
      'mercantile': 'Mercantile',
      'residential': 'Residential',
      'storage': 'Storage',
      'utility': 'Utility',
      'other': 'Other',
      'E': 'Educational',
      'A': 'Assembly'
    };
    return occupancyMap[occupancy || 'unknown'] || 'Unknown';
  };

  const handleAssignmentChange = (value: string) => {
    if (onPropertyUpdate) {
      const updatedProperty = {
        ...property,
        assigned_to: value === 'unassigned' ? null : value,
        updated_at: new Date().toISOString()
      };
      onPropertyUpdate(updatedProperty);
    }
  };

  const handleNotesUpdate = () => {
    if (onPropertyUpdate && notesValue !== property.notes) {
      onPropertyUpdate({
        ...property,
        notes: notesValue,
        updated_at: new Date().toISOString()
      });
    }
    setEditingNotes(false);
  };

  const zoningByRight = getComplianceStatus(property.zoning_by_right);
  const fireSprinkler = getComplianceStatus(property.fire_sprinkler_status === 'Yes' ? true : property.fire_sprinkler_status === 'No' ? false : null);
  const currentOccupancy = getComplianceStatus(property.current_occupancy ? true : null);

  return (
    <div className="h-full bg-background border-l border-border shadow-lg flex flex-col">
      {/* Metadata Bar */}
      <div className="bg-muted/30 border-b border-border px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Last Updated: {formatDate(property.updated_at)}</span>
            <span>Created: {formatDate(property.created_at)}</span>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPreviousProperty}
              className="h-6 w-6 p-0"
              disabled={!onPreviousProperty}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNextProperty}
              className="h-6 w-6 p-0"
              disabled={!onNextProperty}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">{property.address}</h1>
          <p className="text-lg text-muted-foreground mb-3">
            {property.city}, {property.state} {property.zip}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Parcel:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs">{property.parcel_number || 'N/A'}</code>
              {property.parcel_number && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => navigator.clipboard.writeText(property.parcel_number!)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
            {property.latitude && property.longitude && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Compliance Requirements - Priority Card */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                COMPLIANCE REQUIREMENTS
              </CardTitle>
              <CardDescription>
                Critical requirements for property qualification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <zoningByRight.icon className={`h-4 w-4 ${
                    zoningByRight.variant === 'default' ? 'text-green-600' :
                    zoningByRight.variant === 'destructive' ? 'text-red-600' :
                    'text-yellow-600'
                  }`} />
                  <span className="font-medium">Zoning By-Right</span>
                </div>
                <Badge variant={zoningByRight.variant}>{zoningByRight.label}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <fireSprinkler.icon className={`h-4 w-4 ${
                    fireSprinkler.variant === 'default' ? 'text-green-600' :
                    fireSprinkler.variant === 'destructive' ? 'text-red-600' :
                    'text-yellow-600'
                  }`} />
                  <span className="font-medium">Fire Sprinklers</span>
                </div>
                <Badge variant={fireSprinkler.variant}>{fireSprinkler.label}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <currentOccupancy.icon className={`h-4 w-4 ${
                    currentOccupancy.variant === 'default' ? 'text-green-600' :
                    currentOccupancy.variant === 'destructive' ? 'text-red-600' :
                    'text-yellow-600'
                  }`} />
                  <span className="font-medium">Current Occupancy</span>
                </div>
                <Badge variant={currentOccupancy.variant}>
                  {property.current_occupancy ? getOccupancyLabel(property.current_occupancy) : 'Unknown'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Assigned To */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">ASSIGNED TO</h3>
            <div className="flex items-center gap-3">
              <Select 
                value={property.assigned_to || 'unassigned'} 
                onValueChange={handleAssignmentChange}
              >
                <SelectTrigger className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {TEAM_MEMBERS.map((member) => (
                    <SelectItem key={member.value} value={member.value}>
                      {member.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!property.assigned_to && (
                <Button 
                  onClick={() => onAssignAnalyst?.(property)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">PROPERTY DETAILS</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Parcel Sq Ft</span>
                <span className="text-sm font-medium">{property.parcel_sq_ft?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Building Sq Ft</span>
                <span className="text-sm font-medium">{property.square_feet?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">County</span>
                <span className="text-sm font-medium">{property.county || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Zoning Code</span>
                <span className="text-sm font-medium">{property.zoning_code || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Folio #</span>
                <span className="text-sm font-medium">{property.folio_int || 'N/A'}</span>
              </div>
              {property.municipal_zoning_url && (
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Ordinance URL</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(property.municipal_zoning_url!, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              )}
              {property.city_portal_url && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">City Portal URL</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(property.city_portal_url!, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">NOTES</h3>
              {!editingNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingNotes(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Add notes about this property..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleNotesUpdate}>
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEditingNotes(false);
                      setNotesValue(property.notes || '');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg border border-dashed">
                {property.notes || 'No notes added'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-border p-6 bg-muted/30">
        <div className="space-y-2">
          {property.status === 'synced' && (
            <Button className="w-full" size="lg">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Site Visit
            </Button>
          )}
          {property.status === 'reviewing' && (
            <Button className="w-full" size="lg">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Review
            </Button>
          )}
          {property.status === 'not_qualified' && (
            <Button variant="secondary" className="w-full" size="lg">
              <Building className="h-4 w-4 mr-2" />
              Find Alternative
            </Button>
          )}
          {property.status === 'new' && (
            <Button className="w-full" size="lg">
              <Clock className="h-4 w-4 mr-2" />
              Start Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}