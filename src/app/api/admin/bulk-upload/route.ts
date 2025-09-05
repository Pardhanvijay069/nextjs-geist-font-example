import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProductCSVRow } from '@/lib/utils';

// POST - Bulk upload products
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (for demo, we'll skip this check)
    // if (!session || (session.user as any)?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { products } = body;

    // Validate request body
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No products data provided' },
        { status: 400 }
      );
    }

    // Validate each product
    const validationErrors: string[] = [];
    products.forEach((product: ProductCSVRow, index: number) => {
      if (!product.title) {
        validationErrors.push(`Product ${index + 1}: Title is required`);
      }
      if (!product.description) {
        validationErrors.push(`Product ${index + 1}: Description is required`);
      }
      if (!product.price || product.price <= 0) {
        validationErrors.push(`Product ${index + 1}: Valid price is required`);
      }
      if (!product.category) {
        validationErrors.push(`Product ${index + 1}: Category is required`);
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // Generate slug from title
        const slug = product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if category exists, create if not
        let categoryId = null;
        const categoryResult = await executeQuery(
          'SELECT id FROM categories WHERE name = ? OR slug = ?',
          [product.category, product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')]
        ) as any[];

        if (categoryResult.length > 0) {
          categoryId = categoryResult[0].id;
        } else {
          // Create new category
          const categorySlug = product.category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          
          const newCategoryResult = await executeQuery(
            'INSERT INTO categories (name, slug, status) VALUES (?, ?, ?)',
            [product.category, categorySlug, 'active']
          ) as any;
          categoryId = newCategoryResult.insertId;
        }

        // Check if product with same title or SKU already exists
        const existingProductQuery = product.sku 
          ? 'SELECT id FROM products WHERE title = ? OR sku = ?'
          : 'SELECT id FROM products WHERE title = ?';
        
        const existingProductParams = product.sku 
          ? [product.title, product.sku]
          : [product.title];

        const existingProduct = await executeQuery(
          existingProductQuery,
          existingProductParams
        ) as any[];

        if (existingProduct.length > 0) {
          results.failed++;
          results.errors.push(`Product ${i + 1}: Product with title "${product.title}"${product.sku ? ` or SKU "${product.sku}"` : ''} already exists`);
          continue;
        }

        // Insert product
        const insertResult = await executeQuery(
          `INSERT INTO products (
            title, 
            slug, 
            description, 
            short_description, 
            price, 
            compare_price, 
            category_id, 
            sku, 
            stock_quantity, 
            weight, 
            dimensions, 
            tags, 
            meta_title, 
            meta_description, 
            status,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            product.title,
            slug,
            product.description,
            product.short_description || '',
            product.price,
            product.compare_price || null,
            categoryId,
            product.sku || null,
            product.stock_quantity || 0,
            product.weight || null,
            product.dimensions || null,
            product.tags || null,
            product.meta_title || product.title,
            product.meta_description || product.description,
            'active'
          ]
        ) as any;

        if (insertResult.insertId) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Product ${i + 1}: Failed to insert product "${product.title}"`);
        }

      } catch (error) {
        results.failed++;
        results.errors.push(`Product ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(`Error inserting product ${i + 1}:`, error);
      }
    }

    // Return results
    const statusCode = results.success > 0 ? 200 : 400;
    return NextResponse.json({
      message: `Bulk upload completed. ${results.success} products created, ${results.failed} failed.`,
      results: {
        total: products.length,
        success: results.success,
        failed: results.failed,
        errors: results.errors
      }
    }, { status: statusCode });

  } catch (error) {
    console.error('Error in bulk upload:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET - Get bulk upload template
export async function GET() {
  try {
    // Generate CSV template
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

    const sampleRows = [
      [
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
      ],
      [
        'Modern Metal Frame',
        'Sleek modern metal frame for contemporary artwork',
        'Contemporary metal art frame',
        '399.99',
        '499.99',
        'Art Frames',
        'MF-002',
        '15',
        '0.8',
        '30x40x1 cm',
        'metal,modern,art,frame',
        'Modern Metal Frame - Contemporary Design',
        'Elegant metal frames perfect for modern artwork and photography'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="product_upload_template.csv"'
      }
    });

  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
