import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const ImportPreview = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const previewData = [
    {
      row: 1,
      address: '123 Main St, Austin, TX',
      status: 'valid',
      errors: [],
      warnings: ['Coordinates estimated']
    },
    {
      row: 2,
      address: '456 Oak Ave, Austin, TX',
      status: 'error',
      errors: ['Invalid ZIP code'],
      warnings: []
    },
    {
      row: 3,
      address: '789 Pine St, Austin, TX',
      status: 'valid',
      errors: [],
      warnings: []
    }
  ];

  const validCount = previewData.filter(p => p.status === 'valid').length;
  const errorCount = previewData.filter(p => p.status === 'error').length;
  const warningCount = previewData.reduce((acc, p) => acc + p.warnings.length, 0);

  const handleImport = async () => {
    setIsProcessing(true);
    // TODO: Process import
    setTimeout(() => {
      navigate('/import/results');
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/import')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Import
          </Button>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Import Preview</h1>
          <p className="text-muted-foreground">
            Review your data before importing 247 properties
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-qualified" />
                Valid Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{validCount}</div>
              <p className="text-sm text-muted-foreground">Ready to import</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-review" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{warningCount}</div>
              <p className="text-sm text-muted-foreground">Will be imported with notes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <XCircle className="h-5 w-5 text-destructive" />
                Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{errorCount}</div>
              <p className="text-sm text-muted-foreground">Will be skipped</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Preview Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row) => (
                  <TableRow key={row.row}>
                    <TableCell>{row.row}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'valid' ? 'default' : 'destructive'}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {row.errors.map((error, i) => (
                          <Badge key={i} variant="destructive" className="mr-1">
                            {error}
                          </Badge>
                        ))}
                        {row.warnings.map((warning, i) => (
                          <Badge key={i} variant="secondary" className="mr-1">
                            {warning}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => navigate('/import')}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={isProcessing || errorCount > 0}
          >
            {isProcessing ? 'Processing...' : `Import ${validCount} Properties`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportPreview;