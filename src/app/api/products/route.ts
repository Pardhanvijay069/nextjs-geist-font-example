import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/sqlite-database';
import { sampleProducts } from '@/data/products';

// GET - Fetch all products with filtering, sorting, and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        GROUP_CONCAT(pi.image_url) as images,
        COUNT(DISTINCT r.id) as review_count,
        AVG(r.rating) as average_rating
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.status = 'active'
    `;
    
    const params: any[] = [];

    // Add filters
    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (featured === 'true') {
      query += ' AND p.featured = 1';
    }

    // Group by product
    query += ' GROUP BY p.id';

    // Add sorting
    const validSortFields = ['title', 'price', 'created_at', 'stock_quantity'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Execute query
    const products = executeQuery(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
    `;
    
    const countParams: any[] = [];
    
    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      countQuery += ' AND p.price >= ?';
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countQuery += ' AND p.price <= ?';
      countParams.push(parseFloat(maxPrice));
    }

    if (featured === 'true') {
      countQuery += ' AND p.featured = 1';
    }

    const countResult = executeQuery(countQuery, countParams) as any[];
    const total = countResult[0]?.total || 0;

    // Process products data
    const processedProducts = (products as any[]).map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      average_rating: product.average_rating ? parseFloat(product.average_rating) : 0,
      review_count: parseInt(product.review_count) || 0
    }));

    return NextResponse.json({
      success: true,
      products: processedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Fallback to static data
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      products: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false
      }
    });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      category_id,
      stock_quantity,
      specifications,
      featured,
      images
    } = body;

    // Validate required fields
    if (!title || !description || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Insert product
    const result = executeQuery(
      `INSERT INTO products (title, slug, description, price, category_id, stock_quantity, specifications, featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        title,
        slug,
        description,
        price,
        category_id || null,
        stock_quantity || 0,
        JSON.stringify(specifications || {}),
        featured ? 1 : 0
      ]
    ) as any;

    const productId = result.lastInsertRowid;

    // Insert product images if provided
    if (images && Array.isArray(images)) {
      images.forEach((imageUrl: string, index: number) => {
        executeQuery(
          `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
           VALUES (?, ?, ?, ?)`,
          [productId, imageUrl, index === 0 ? 1 : 0, index]
        );
      });
    }

    return NextResponse.json({
      success: true,
      id: productId,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
