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
  XCircle,
  HelpCircle,
  ExternalLink,
  Building,
  MapPin,
  FileText,
  Plus,
  ChevronDown
} from 'lucide-react';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';

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
  { id: 'unassigned', name: 'Unassigned' },
  { id: 'jarnail', name: 'Jarnail' },
  { id: 'david-h', name: 'David H' },
  { id: 'cavise', name: 'Cavise' },
  { id: 'jb', name: 'JB' },
  { id: 'stephen', name: 'Stephen' },
  { id: 'aly', name: 'Aly' },
  { id: 'ryan-d', name: 'Ryan D' },
];

// Editable assignment component
const EditableAssignment = ({ value, users, onAssign }: {
  value: string | null;
  users: typeof TEAM_MEMBERS;
  onAssign: (userId: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentUser = users.find(user => user.id === value);
  const displayName = currentUser?.name || "Unassigned";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg border transition-colors"
      >
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{displayName}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform text-muted-foreground",
          isOpen && "rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-20 py-1">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => {
                onAssign(user.id === 'unassigned' ? '' : user.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full p-2 text-left hover:bg-muted/50 text-sm transition-colors",
                user.id === value && "bg-muted"
              )}
            >
              {user.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Editable field component
const EditableField = ({ label, value, onSave, type = "text" }: {
  label: string;
  value: string | number | null;
  onSave: (value: string) => void;
  type?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value?.toString() || '');

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value?.toString() || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input 
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="h-7 text-sm"
          type={type}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSave}>
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancel}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 transition-colors group"
      onClick={() => setIsEditing(true)}
    >
      <span className="text-sm font-medium">{value || 'N/A'}</span>
      <Edit className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-50 inline" />
    </div>
  );
};

// Compliance status badge component
const ComplianceStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'yes': 
      case 'true':
        return { label: 'Yes', icon: CheckCircle, className: 'bg-green-100 text-green-800 border-green-200' };
      case 'no': 
      case 'false':
        return { label: 'No', icon: XCircle, className: 'bg-red-100 text-red-800 border-red-200' };
      case 'special-exemption':
        return { label: 'Special Exemption', icon: AlertCircle, className: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { label: 'Unknown', icon: HelpCircle, className: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  );
};

// Editable compliance item
const EditableComplianceItem = ({ name, status, onStatusChange }: {
  name: string;
  status: string;
  onStatusChange: (value: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
        <span className="font-medium">{name}</span>
        <Select 
          value={status} 
          onValueChange={(value) => {
            onStatusChange(value);
            setIsEditing(false);
          }}
        >
          <SelectTrigger className="w-40 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Yes
              </div>
            </SelectItem>
            <SelectItem value="special-exemption">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-blue-600" />
                Special Exemption
              </div>
            </SelectItem>
            <SelectItem value="no">
              <div className="flex items-center gap-2">
                <XCircle className="h-3 w-3 text-red-600" />
                No
              </div>
            </SelectItem>
            <SelectItem value="unknown">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-3 w-3 text-amber-600" />
                Unknown
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg border group">
      <span className="font-medium">{name}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="hover:ring-2 hover:ring-offset-1 hover:ring-primary/20 rounded-full transition-all"
      >
        <ComplianceStatusBadge status={status} />
      </button>
    </div>
  );
};

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

  const handleAssignmentChange = (userId: string) => {
    if (onPropertyUpdate) {
      const updatedProperty = {
        ...property,
        assigned_to: userId || null,
        updated_at: new Date().toISOString()
      };
      onPropertyUpdate(updatedProperty);
    }
  };

  const handleFieldUpdate = (field: keyof Property, value: string) => {
    if (onPropertyUpdate) {
      let processedValue: any = value;
      
      // Process value based on field type
      if (field === 'square_feet' || field === 'parcel_sq_ft') {
        processedValue = value ? parseInt(value.replace(/,/g, '')) : null;
      }
      
      onPropertyUpdate({
        ...property,
        [field]: processedValue,
        updated_at: new Date().toISOString()
      });
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

  const handleComplianceChange = (field: keyof Property, value: string) => {
    if (onPropertyUpdate) {
      let processedValue: any = value;
      
      // Convert string values to appropriate types
      if (field === 'zoning_by_right') {
        if (value === 'yes') processedValue = true;
        else if (value === 'no') processedValue = false;
        else if (value === 'special-exemption') processedValue = 'special-exemption';
        else processedValue = null;
      } else if (field === 'fire_sprinkler_status') {
        processedValue = value === 'unknown' ? null : value === 'yes' ? 'Yes' : 'No';
      } else if (field === 'current_occupancy') {
        processedValue = value === 'unknown' ? null : value;
      }
      
      onPropertyUpdate({
        ...property,
        [field]: processedValue,
        updated_at: new Date().toISOString()
      });
    }
  };

  const getComplianceValue = (field: keyof Property) => {
    const value = property[field];
    if (field === 'zoning_by_right') {
      if (value === true) return 'yes';
      if (value === false) return 'no';
      if (value === 'special-exemption') return 'special-exemption';
      return 'unknown';
    } else if (field === 'fire_sprinkler_status') {
      if (value === 'Yes') return 'yes';
      if (value === 'No') return 'no';
      return 'unknown';
    } else if (field === 'current_occupancy') {
      return value ? 'yes' : 'unknown';
    }
    return 'unknown';
  };

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
              <EditableComplianceItem
                name="Zoning By-Right"
                status={getComplianceValue('zoning_by_right')}
                onStatusChange={(value) => handleComplianceChange('zoning_by_right', value)}
              />
              
              <EditableComplianceItem
                name="Fire Sprinklers"
                status={getComplianceValue('fire_sprinkler_status')}
                onStatusChange={(value) => handleComplianceChange('fire_sprinkler_status', value)}
              />
              
              <EditableComplianceItem
                name="Current Occupancy"
                status={getComplianceValue('current_occupancy')}
                onStatusChange={(value) => handleComplianceChange('current_occupancy', value)}
              />
            </CardContent>
          </Card>

          {/* Assigned To */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">ASSIGNED TO</h3>
            <EditableAssignment
              value={property.assigned_to}
              users={TEAM_MEMBERS}
              onAssign={handleAssignmentChange}
            />
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">PROPERTY DETAILS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center group">
                <span className="text-sm text-muted-foreground">Parcel Sq Ft</span>
                <EditableField
                  label="Parcel Sq Ft"
                  value={property.parcel_sq_ft?.toLocaleString()}
                  onSave={(value) => handleFieldUpdate('parcel_sq_ft', value)}
                  type="number"
                />
              </div>
              
              <div className="flex justify-between items-center group">
                <span className="text-sm text-muted-foreground">Building Sq Ft</span>
                <EditableField
                  label="Building Sq Ft"
                  value={property.square_feet?.toLocaleString()}
                  onSave={(value) => handleFieldUpdate('square_feet', value)}
                  type="number"
                />
              </div>
              
              <div className="flex justify-between items-center group">
                <span className="text-sm text-muted-foreground">County</span>
                <EditableField
                  label="County"
                  value={property.county}
                  onSave={(value) => handleFieldUpdate('county', value)}
                />
              </div>
              
              <div className="flex justify-between items-center group">
                <span className="text-sm text-muted-foreground">Zoning Code</span>
                <EditableField
                  label="Zoning Code"
                  value={property.zoning_code}
                  onSave={(value) => handleFieldUpdate('zoning_code', value)}
                />
              </div>
              
              <div className="flex justify-between items-center group">
                <span className="text-sm text-muted-foreground">Listed Owner</span>
                <EditableField
                  label="Listed Owner"
                  value={property.listed_owner}
                  onSave={(value) => handleFieldUpdate('listed_owner', value)}
                />
              </div>
              
              <div className="flex justify-between items-center group">
                <span className="text-sm text-muted-foreground">Folio #</span>
                <EditableField
                  label="Folio #"
                  value={property.folio_int}
                  onSave={(value) => handleFieldUpdate('folio_int', value)}
                />
              </div>
              
              {property.municipal_zoning_url && (
                <div className="flex justify-between items-center group">
                  <span className="text-sm text-muted-foreground">Ordinance URL</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(property.municipal_zoning_url!, '_blank')}
                    className="h-7 px-2 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              )}
              
              {property.city_portal_url && (
                <div className="flex justify-between items-center group">
                  <span className="text-sm text-muted-foreground">City Portal URL</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(property.city_portal_url!, '_blank')}
                    className="h-7 px-2 text-xs"
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