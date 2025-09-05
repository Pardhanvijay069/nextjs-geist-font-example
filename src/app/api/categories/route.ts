import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/sqlite-database';

// GET - Fetch all categories with product counts
export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `;

    const categories = executeQuery(query, []);

    return NextResponse.json({
      success: true,
      categories,
      total: (categories as any[]).length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Fallback to static categories
    const fallbackCategories = [
      { id: 1, name: 'Photo Frames', slug: 'photo-frames', product_count: 0 },
      { id: 2, name: 'Art Frames', slug: 'art-frames', product_count: 0 },
      { id: 3, name: 'Digital Frames', slug: 'digital-frames', product_count: 0 },
      { id: 4, name: 'Wall Frames', slug: 'wall-frames', product_count: 0 },
      { id: 5, name: 'Vintage Frames', slug: 'vintage-frames', product_count: 0 }
    ];
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      categories: fallbackCategories,
      total: fallbackCategories.length
    });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image_url, sort_order } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Insert category
    const result = executeQuery(
      `INSERT INTO categories (name, slug, description, image_url, sort_order, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [name, slug, description || null, image_url || null, sort_order || 0]
    ) as any;

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
