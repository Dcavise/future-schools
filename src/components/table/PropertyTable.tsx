import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

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

interface PropertyTableProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
  selectedProperties: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

type SortField = 'address' | 'type' | 'squareFeet' | 'status' | 'owner' | 'lastModified';
type SortDirection = 'asc' | 'desc';

export function PropertyTable({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  selectedProperties,
  onSelectionChange
}: PropertyTableProps) {
  const [sortField, setSortField] = useState<SortField>('address');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'address':
          aValue = a.address;
          bValue = b.address;
          break;
        case 'type':
          aValue = a.compliance.currentOccupancy;
          bValue = b.compliance.currentOccupancy;
          break;
        case 'squareFeet':
          aValue = a.propertyDetails.squareFeet;
          bValue = b.propertyDetails.squareFeet;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'owner':
          aValue = a.buildingOwner;
          bValue = b.buildingOwner;
          break;
        case 'lastModified':
          aValue = a.lastModified;
          bValue = b.lastModified;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [properties, sortField, sortDirection]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(properties.map(p => p.id));
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      onSelectionChange(selectedProperties.filter(id => id !== propertyId));
    } else {
      onSelectionChange([...selectedProperties, propertyId]);
    }
  };

  const handleRowClick = (property: Property, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox or actions menu
    if (
      (event.target as HTMLElement).closest('input[type="checkbox"]') ||
      (event.target as HTMLElement).closest('[data-dropdown-trigger]')
    ) {
      return;
    }
    onPropertySelect(property);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Bulk Actions Bar */}
      {selectedProperties.length > 0 && (
        <div className="border-b bg-blue-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedProperties.length} properties selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  Assign Owner
                </Button>
                <Button size="sm" variant="outline">
                  Export
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Select All
              </button>
              <button 
                onClick={() => onSelectionChange([])}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProperties.length === properties.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('address')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Address
                  {getSortIcon('address')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('type')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Type
                  {getSortIcon('type')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('squareFeet')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Sq Ft
                  {getSortIcon('squareFeet')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Compliance Status
                  {getSortIcon('status')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('owner')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Owner
                  {getSortIcon('owner')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('lastModified')}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Last Modified
                  {getSortIcon('lastModified')}
                </Button>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProperties.map((property, index) => (
              <TableRow
                key={property.id}
                className={`
                  cursor-pointer hover:bg-gray-50 transition-colors
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  ${selectedProperty?.id === property.id ? 'bg-blue-50 border-blue-200' : ''}
                `}
                onClick={(e) => handleRowClick(property, e)}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={() => handleSelectProperty(property.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{property.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {property.city}, {property.state}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {property.compliance.currentOccupancy}
                </TableCell>
                <TableCell>
                  {property.propertyDetails.squareFeet.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(property.status)}>
                    {getStatusLabel(property.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {property.buildingOwner}
                </TableCell>
                <TableCell>
                  {property.lastModified}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild data-dropdown-trigger>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Property</DropdownMenuItem>
                      <DropdownMenuItem>Assign Owner</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="border-t bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedProperties.length)} of {sortedProperties.length} results
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyTable;