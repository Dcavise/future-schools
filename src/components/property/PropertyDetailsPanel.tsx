import { useState } from 'react';
import { Property, PropertyNote } from '@/types/property';
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
  HelpCircle,
  User,
  FileText,
  Plus,
  AlertCircle
} from 'lucide-react';

interface PropertyDetailsPanelProps {
  property: Property | null;
  onPropertyUpdate: (property: Property) => void;
  onClose: () => void;
}

export function PropertyDetailsPanel({ property, onPropertyUpdate, onClose }: PropertyDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState<PropertyNote['type']>('general');

  if (!property) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a property to view details</p>
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
      onPropertyUpdate(editedProperty);
      setIsEditing(false);
      setEditedProperty(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperty(null);
  };

  const addNote = () => {
    if (newNote.trim() && editedProperty) {
      const note: PropertyNote = {
        id: `note-${Date.now()}`,
        content: newNote.trim(),
        author: 'Current User', // In real app, this would be from auth context
        createdAt: new Date().toISOString(),
        type: newNoteType
      };
      
      const updatedProperty = {
        ...editedProperty,
        notes: [...(editedProperty.notes || []), note]
      };
      
      setEditedProperty(updatedProperty);
      setNewNote('');
    }
  };

  const getStatusIcon = (status: Property['status']) => {
    switch (status) {
      case 'qualified':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'reviewing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'disqualified':
        return <X className="h-5 w-5 text-red-600" />;
      case 'unreviewed':
        return <HelpCircle className="h-5 w-5 text-gray-600" />;
      case 'on_hold':
        return <AlertTriangle className="h-5 w-5 text-purple-600" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'disqualified':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'unreviewed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_hold':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceStatus = (property: Property) => {
    const issues = [];
    
    // Check minimum square footage
    if (property.squareFootage < 6000) {
      issues.push('Below 6,000 sq ft minimum');
    }
    
    // Check zoning
    if (property.zoningByRight === false) {
      issues.push('Zoning does not allow schools');
    } else if (property.zoningByRight === null) {
      issues.push('Zoning status needs verification');
    }
    
    // Check fire sprinklers
    if (property.fireSprinklers === false) {
      issues.push('No fire sprinkler system');
    } else if (property.fireSprinklers === null) {
      issues.push('Fire sprinkler status unknown');
    }
    
    // Check occupancy
    if (!property.currentOccupancy) {
      issues.push('Current occupancy unknown');
    }
    
    return issues;
  };

  const currentProperty = editedProperty || property;
  const complianceIssues = getComplianceStatus(currentProperty);

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground line-clamp-2">
              {currentProperty.address}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentProperty.city}, {currentProperty.state} {currentProperty.zip}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Status Badge */}
        <div className="mt-3 flex items-center gap-2">
          {getStatusIcon(currentProperty.status)}
          <Badge className={`${getStatusColor(currentProperty.status)} capitalize`}>
            {currentProperty.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          
          {/* Assignment Info */}
          {currentProperty.assignedAnalyst && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Assigned Analyst
              </h3>
              <div className="text-sm text-muted-foreground">
                {currentProperty.assignedAnalyst}
              </div>
            </div>
          )}

          {/* Compliance Issues */}
          {complianceIssues.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Compliance Issues ({complianceIssues.length})
              </h3>
              <div className="space-y-1">
                {complianceIssues.map((issue, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    • {issue}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Property Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Square Footage</span>
                <div className="font-medium">
                  {currentProperty.squareFootage.toLocaleString()} sq ft
                  {currentProperty.squareFootage < 6000 && (
                    <span className="text-red-600 text-xs ml-1">(Below min)</span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Building Year</span>
                <div className="font-medium">{currentProperty.buildingYear || 'Unknown'}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Lot Size</span>
                <div className="font-medium">{currentProperty.lotSize || 'Unknown'} acres</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Parking Spaces</span>
                <div className="font-medium">{currentProperty.parkingSpaces || 'Unknown'}</div>
              </div>
            </div>
          </div>

          {/* Compliance Fields */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Compliance Requirements</h3>
            
            <div className="space-y-3">
              {/* Zoning by Right */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Zoning Allows Schools</span>
                {isEditing ? (
                  <Select
                    value={editedProperty?.zoningByRight?.toString() || "unknown"}
                    onValueChange={(value) => setEditedProperty(prev => prev ? {
                      ...prev,
                      zoningByRight: value === "unknown" ? null : value === "true"
                    } : null)}
                  >
                    <SelectTrigger className="w-24">
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
                    currentProperty.zoningByRight === true ? "default" :
                    currentProperty.zoningByRight === false ? "destructive" : "secondary"
                  }>
                    {currentProperty.zoningByRight === true ? "Yes" :
                     currentProperty.zoningByRight === false ? "No" : "Unknown"}
                  </Badge>
                )}
              </div>

              {/* Fire Sprinklers */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fire Sprinklers</span>
                {isEditing ? (
                  <Select
                    value={editedProperty?.fireSprinklers?.toString() || "unknown"}
                    onValueChange={(value) => setEditedProperty(prev => prev ? {
                      ...prev,
                      fireSprinklers: value === "unknown" ? null : value === "true"
                    } : null)}
                  >
                    <SelectTrigger className="w-24">
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
                    currentProperty.fireSprinklers === true ? "default" :
                    currentProperty.fireSprinklers === false ? "destructive" : "secondary"
                  }>
                    {currentProperty.fireSprinklers === true ? "Yes" :
                     currentProperty.fireSprinklers === false ? "No" : "Unknown"}
                  </Badge>
                )}
              </div>

              {/* Current Occupancy */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Occupancy</span>
                {isEditing ? (
                  <Select
                    value={editedProperty?.currentOccupancy || "unknown"}
                    onValueChange={(value) => setEditedProperty(prev => prev ? {
                      ...prev,
                      currentOccupancy: value === "unknown" ? null : value as 'E' | 'A' | 'Other'
                    } : null)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="E">Educational</SelectItem>
                      <SelectItem value="A">Assembly</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">
                    {currentProperty.currentOccupancy === 'E' ? 'Educational' :
                     currentProperty.currentOccupancy === 'A' ? 'Assembly' :
                     currentProperty.currentOccupancy === 'Other' ? 'Other' : 'Unknown'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Research Notes ({currentProperty.notes?.length || 0})
            </h3>
            
            {/* Add Note (when editing) */}
            {isEditing && (
              <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                <div className="flex gap-2">
                  <Select value={newNoteType} onValueChange={(value: PropertyNote['type']) => setNewNoteType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="site_visit">Site Visit</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            )}
            
            {/* Notes List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentProperty.notes?.map((note) => (
                <div key={note.id} className="p-2 bg-muted/30 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {note.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-muted-foreground">{note.author}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{note.content}</p>
                </div>
              )) || (
                <p className="text-xs text-muted-foreground italic">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-muted/30">
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={handleEdit} size="sm" className="w-full">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
        )}
      </div>
    </Card>
  );
}