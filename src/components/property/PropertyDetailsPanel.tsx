import { useState } from 'react';
import { Property } from '@/types/property';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Building, 
  Calendar, 
  DollarSign, 
  Car, 
  Edit3, 
  Save, 
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';

interface PropertyDetailsPanelProps {
  property: Property | null;
  onPropertyUpdate: (property: Property) => void;
  onClose: () => void;
}

export function PropertyDetailsPanel({ property, onPropertyUpdate, onClose }: PropertyDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);

  if (!property) {
    return (
      <Card className="h-full p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">No Property Selected</h3>
            <p className="text-sm text-muted-foreground">
              Click on a property marker to view details
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const handleEdit = () => {
    setEditedProperty({ ...property });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedProperty) {
      onPropertyUpdate({
        ...editedProperty,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
      setEditedProperty(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperty(null);
  };

  const getStatusIcon = (status: Property['qualificationStatus']) => {
    switch (status) {
      case 'qualified':
        return <CheckCircle2 className="h-5 w-5 text-qualified" />;
      case 'review':
        return <Clock className="h-5 w-5 text-review" />;
      case 'disqualified':
        return <X className="h-5 w-5 text-disqualified" />;
      case 'unknown':
        return <HelpCircle className="h-5 w-5 text-unknown" />;
    }
  };

  const getStatusColor = (status: Property['qualificationStatus']) => {
    switch (status) {
      case 'qualified':
        return 'bg-qualified text-qualified-foreground';
      case 'review':
        return 'bg-review text-review-foreground';
      case 'disqualified':
        return 'bg-disqualified text-disqualified-foreground';
      case 'unknown':
        return 'bg-unknown text-unknown-foreground';
    }
  };

  const currentProperty = editedProperty || property;

  const missingFields = [
    { field: 'zoningByRight', label: 'Zoning by Right' },
    { field: 'fireSprinklers', label: 'Fire Sprinklers' },
    { field: 'occupancyType', label: 'Occupancy Type' }
  ].filter(({ field }) => currentProperty[field as keyof Property] === null);

  return (
    <Card className="h-full flex flex-col shadow-medium">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(currentProperty.qualificationStatus)}
              <Badge className={getStatusColor(currentProperty.qualificationStatus)}>
                {currentProperty.qualificationStatus.toUpperCase()}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold mb-1">{currentProperty.address}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {currentProperty.coordinates[1].toFixed(4)}, {currentProperty.coordinates[0].toFixed(4)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Missing Data Alert */}
        {missingFields.length > 0 && (
          <Card className="p-4 bg-unknown/10 border-unknown">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-unknown mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-unknown mb-1">Missing Critical Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete these fields to determine qualification status:
                </p>
                <div className="space-y-2">
                  {missingFields.map(({ label }) => (
                    <div key={label} className="text-sm">
                      • {label}
                    </div>
                  ))}
                </div>
                {!isEditing && (
                  <Button size="sm" className="mt-3" onClick={handleEdit}>
                    Add Missing Data
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Square Footage</div>
            <div className="text-lg font-semibold">{currentProperty.squareFootage.toLocaleString()}</div>
          </div>
          {currentProperty.price && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="text-lg font-semibold">${(currentProperty.price / 1000000).toFixed(1)}M</div>
            </div>
          )}
        </div>

        <Separator />

        {/* Qualification Criteria */}
        <div className="space-y-4">
          <h3 className="font-semibold">Qualification Criteria</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Zoning by Right</span>
              {isEditing ? (
                <Select 
                  value={editedProperty?.zoningByRight === null ? 'unknown' : editedProperty?.zoningByRight?.toString()}
                  onValueChange={(value) => {
                    if (editedProperty) {
                      setEditedProperty({
                        ...editedProperty,
                        zoningByRight: value === 'unknown' ? null : value === 'true'
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={
                  currentProperty.zoningByRight === true ? 'default' : 
                  currentProperty.zoningByRight === false ? 'destructive' : 'secondary'
                }>
                  {currentProperty.zoningByRight === null ? 'Unknown' : 
                   currentProperty.zoningByRight ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Fire Sprinklers</span>
              {isEditing ? (
                <Select 
                  value={editedProperty?.fireSprinklers === null ? 'unknown' : editedProperty?.fireSprinklers?.toString()}
                  onValueChange={(value) => {
                    if (editedProperty) {
                      setEditedProperty({
                        ...editedProperty,
                        fireSprinklers: value === 'unknown' ? null : value === 'true'
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={
                  currentProperty.fireSprinklers === true ? 'default' : 
                  currentProperty.fireSprinklers === false ? 'destructive' : 'secondary'
                }>
                  {currentProperty.fireSprinklers === null ? 'Unknown' : 
                   currentProperty.fireSprinklers ? 'Yes' : 'No'}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Occupancy Type</span>
              {isEditing ? (
                <Select 
                  value={editedProperty?.occupancyType || 'unknown'}
                  onValueChange={(value) => {
                    if (editedProperty) {
                      setEditedProperty({
                        ...editedProperty,
                        occupancyType: value === 'unknown' ? null : value
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline">
                  {currentProperty.occupancyType || 'Unknown'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Details */}
        <div className="space-y-4">
          <h3 className="font-semibold">Property Details</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {currentProperty.buildingYear && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Built {currentProperty.buildingYear}</span>
              </div>
            )}
            
            {currentProperty.parkingSpaces && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span>{currentProperty.parkingSpaces} spaces</span>
              </div>
            )}
            
            {currentProperty.lotSize && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{currentProperty.lotSize} acres</span>
              </div>
            )}
            
            <div className="text-muted-foreground">
              Updated {new Date(currentProperty.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <h3 className="font-semibold">Notes</h3>
          {isEditing ? (
            <Textarea
              value={editedProperty?.notes || ''}
              onChange={(e) => {
                if (editedProperty) {
                  setEditedProperty({
                    ...editedProperty,
                    notes: e.target.value
                  });
                }
              }}
              placeholder="Add notes about this property..."
              rows={3}
            />
          ) : (
            <div className="text-sm text-muted-foreground min-h-[60px] p-3 bg-muted/50 rounded-md">
              {currentProperty.notes || 'No notes added.'}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}