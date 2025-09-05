"use client";

import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { parseProductCSV, ProductCSVRow, CSVParseResult } from '@/lib/utils';
import { toast } from 'sonner';

interface UploadResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkUploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a valid CSV file');
      return;
    }

    setCsvFile(file);
    setParseResult(null);
    setUploadResult(null);

    // Read and parse the CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      const result = parseProductCSV(csvContent);
      setParseResult(result);

      if (result.success) {
        toast.success(`CSV parsed successfully! ${result.validRows} valid products found.`);
      } else {
        toast.error('CSV parsing failed. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!parseResult || !parseResult.success) {
      toast.error('No valid data to upload');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const response = await fetch('/api/admin/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: parseResult.data
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result.results);
        toast.success(result.message);
        
        // Clear the form if all products were successful
        if (result.results.failed === 0) {
          setCsvFile(null);
          setParseResult(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } else {
        toast.error(result.error || 'Upload failed');
        if (result.details) {
          console.error('Upload errors:', result.details);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Network error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/admin/bulk-upload');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product_upload_template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Template downloaded successfully');
      } else {
        toast.error('Failed to download template');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template');
    }
  };

  const clearData = () => {
    setCsvFile(null);
    setParseResult(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Product Upload</h1>
            <p className="text-gray-600">Upload multiple products using a CSV file</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="border-gray-300 hover:bg-gray-50"
            >
              Download Template
            </Button>
            {(csvFile || parseResult) && (
              <Button 
                variant="outline" 
                onClick={clearData}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Clear Data
              </Button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Required Fields:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>title</strong> - Product name</li>
                  <li>• <strong>description</strong> - Product description</li>
                  <li>• <strong>price</strong> - Product price (number)</li>
                  <li>• <strong>category</strong> - Product category</li>
                  <li>• <strong>stock_quantity</strong> - Available stock</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Optional Fields:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>short_description</strong> - Brief description</li>
                  <li>• <strong>compare_price</strong> - Original price</li>
                  <li>• <strong>sku</strong> - Product SKU</li>
                  <li>• <strong>weight</strong> - Product weight</li>
                  <li>• <strong>dimensions</strong> - Product dimensions</li>
                  <li>• <strong>tags</strong> - Comma-separated tags</li>
                </ul>
              </div>
            </div>
            <Separator />
            <p className="text-sm text-gray-600">
              Download the template above to get started with the correct format. 
              Categories will be created automatically if they don't exist.
            </p>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Select CSV File</Label>
                <Input
                  id="csv-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
              </div>
              
              {csvFile && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parse Results */}
        {parseResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Parse Results
                <Badge variant={parseResult.success ? "default" : "destructive"}>
                  {parseResult.success ? "Success" : "Failed"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{parseResult.totalRows}</div>
                  <div className="text-sm text-blue-600">Total Rows</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{parseResult.validRows}</div>
                  <div className="text-sm text-green-600">Valid Products</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{parseResult.errors.length}</div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
              </div>

              {parseResult.errors.length > 0 && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-1">
                      <strong>Errors found:</strong>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {parseResult.errors.slice(0, 10).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {parseResult.errors.length > 10 && (
                          <li>... and {parseResult.errors.length - 10} more errors</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {parseResult.success && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-black hover:bg-gray-800"
                  >
                    {isUploading ? 'Uploading...' : `Upload ${parseResult.validRows} Products`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Data Preview */}
        {parseResult && parseResult.success && parseResult.data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>SKU</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parseResult.data.slice(0, 10).map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>{product.sku || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parseResult.data.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Showing first 10 products. {parseResult.data.length - 10} more products will be uploaded.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Results */}
        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Upload Results
                <Badge variant={uploadResult.failed === 0 ? "default" : "secondary"}>
                  {uploadResult.failed === 0 ? "All Success" : "Partial Success"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{uploadResult.total}</div>
                  <div className="text-sm text-blue-600">Total Processed</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{uploadResult.success}</div>
                  <div className="text-sm text-green-600">Successfully Created</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{uploadResult.failed}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-1">
                      <strong>Upload errors:</strong>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {uploadResult.errors.slice(0, 10).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {uploadResult.errors.length > 10 && (
                          <li>... and {uploadResult.errors.length - 10} more errors</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
