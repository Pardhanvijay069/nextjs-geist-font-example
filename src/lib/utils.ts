import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// CSV parsing utility for bulk product upload
export interface ProductCSVRow {
  title: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  category: string;
  sku?: string;
  stock_quantity: number;
  weight?: number;
  dimensions?: string;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface CSVParseResult {
  success: boolean;
  data: ProductCSVRow[];
  errors: string[];
  totalRows: number;
  validRows: number;
}

export function parseProductCSV(csvContent: string): CSVParseResult {
  const result: CSVParseResult = {
    success: false,
    data: [],
    errors: [],
    totalRows: 0,
    validRows: 0
  };

  try {
    // Split CSV into lines and remove empty lines
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      result.errors.push('CSV file must contain at least a header row and one data row');
      return result;
    }

    // Parse header row
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Required fields mapping
    const requiredFields = ['title', 'description', 'price', 'category', 'stock_quantity'];
    const fieldMapping: { [key: string]: string } = {
      'title': 'title',
      'name': 'title',
      'product_name': 'title',
      'description': 'description',
      'short_description': 'short_description',
      'price': 'price',
      'compare_price': 'compare_price',
      'category': 'category',
      'sku': 'sku',
      'stock': 'stock_quantity',
      'stock_quantity': 'stock_quantity',
      'quantity': 'stock_quantity',
      'weight': 'weight',
      'dimensions': 'dimensions',
      'tags': 'tags',
      'meta_title': 'meta_title',
      'meta_description': 'meta_description'
    };

    // Check if required fields are present
    const missingFields = requiredFields.filter(field => 
      !headers.some(header => fieldMapping[header] === field)
    );

    if (missingFields.length > 0) {
      result.errors.push(`Missing required columns: ${missingFields.join(', ')}`);
      return result;
    }

    // Parse data rows
    result.totalRows = lines.length - 1;

    for (let i = 1; i < lines.length; i++) {
      const rowNumber = i + 1;
      const values = parseCSVRow(lines[i]);
      
      if (values.length !== headers.length) {
        result.errors.push(`Row ${rowNumber}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
        continue;
      }

      const rowData: any = {};
      const rowErrors: string[] = [];

      // Map CSV columns to product fields
      headers.forEach((header, index) => {
        const fieldName = fieldMapping[header];
        if (fieldName) {
          const value = values[index]?.trim();
          
          // Validate and convert values
          switch (fieldName) {
            case 'title':
              if (!value) {
                rowErrors.push('Title is required');
              } else {
                rowData[fieldName] = value;
              }
              break;
              
            case 'description':
              if (!value) {
                rowErrors.push('Description is required');
              } else {
                rowData[fieldName] = value;
              }
              break;
              
            case 'price':
            case 'compare_price':
            case 'weight':
              if (value) {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue < 0) {
                  rowErrors.push(`${fieldName} must be a valid positive number`);
                } else {
                  rowData[fieldName] = numValue;
                }
              } else if (fieldName === 'price') {
                rowErrors.push('Price is required');
              }
              break;
              
            case 'stock_quantity':
              if (value) {
                const numValue = parseInt(value);
                if (isNaN(numValue) || numValue < 0) {
                  rowErrors.push('Stock quantity must be a valid non-negative integer');
                } else {
                  rowData[fieldName] = numValue;
                }
              } else {
                rowData[fieldName] = 0;
              }
              break;
              
            case 'category':
              if (!value) {
                rowErrors.push('Category is required');
              } else {
                rowData[fieldName] = value;
              }
              break;
              
            default:
              if (value) {
                rowData[fieldName] = value;
              }
              break;
          }
        }
      });

      if (rowErrors.length > 0) {
        result.errors.push(`Row ${rowNumber}: ${rowErrors.join(', ')}`);
      } else {
        result.data.push(rowData as ProductCSVRow);
        result.validRows++;
      }
    }

    result.success = result.validRows > 0;
    
    if (result.validRows === 0 && result.errors.length === 0) {
      result.errors.push('No valid product data found in CSV file');
    }

  } catch (error) {
    result.errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

// Helper function to parse a CSV row handling quoted values
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
}

// Generate sample CSV template for download
export function generateProductCSVTemplate(): string {
  const headers = [
    'title',
    'description',
    'short_description',
    'price',
    'compare_price',
    'category',
    'sku',
    'stock_quantity',
    'weight',
    'dimensions',
    'tags',
    'meta_title',
    'meta_description'
  ];

  const sampleRow = [
    'Classic Wooden Frame',
    'Beautiful handcrafted wooden frame perfect for family photos',
    'Handcrafted wooden photo frame',
    '299.99',
    '399.99',
    'Photo Frames',
    'WF-001',
    '25',
    '0.5',
    '20x25x2 cm',
    'wooden,classic,photo,frame',
    'Classic Wooden Frame - Premium Quality',
    'Shop our beautiful classic wooden frames perfect for displaying your precious memories'
  ];

  return [headers.join(','), sampleRow.join(',')].join('\n');
}
