import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET - Fetch individual product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Validate product ID
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    // Fetch product with all related data
    const productQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.status = 'active'
    `;

    const productResult = await executeQuery(productQuery, [productId]) as any[];

    if (productResult.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    const product = productResult[0];

    // Fetch product images
    const imagesQuery = `
      SELECT 
        id,
        image_url,
        alt_text,
        sort_order,
        is_primary
      FROM product_images 
      WHERE product_id = ? 
      ORDER BY sort_order ASC, is_primary DESC
    `;

    const images = await executeQuery(imagesQuery, [productId]) as any[];

    // Fetch product reviews
    const reviewsQuery = `
      SELECT 
        r.*,
        u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT 50
    `;

    const reviews = await executeQuery(reviewsQuery, [productId]) as any[];

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Fetch related products (same category, excluding current product)
    const relatedQuery = `
      SELECT 
        p.id,
        p.title,
        p.price,
        p.slug,
        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
      ORDER BY RAND()
      LIMIT 4
    `;

    const relatedProducts = await executeQuery(relatedQuery, [product.category_id, productId]) as any[];

    // Process the product data
    const processedProduct = {
      ...product,
      images: images || [],
      reviews: reviews || [],
      average_rating: Math.round(avgRating * 10) / 10,
      review_count: reviews.length,
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      tags: product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : [],
      related_products: relatedProducts || []
    };

    // Update view count (optional - for analytics)
    try {
      await executeQuery(
        'UPDATE products SET views = COALESCE(views, 0) + 1 WHERE id = ?',
        [productId]
      );
    } catch (error) {
      // Ignore view count update errors
      console.warn('Failed to update view count:', error);
    }

    return NextResponse.json({
      success: true,
      product: processedProduct
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product details',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// PUT - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const body = await request.json();

    // Validate product ID
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    // TODO: Add authentication check for admin
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const {
      title,
      description,
      short_description,
      price,
      compare_price,
      cost_price,
      category_id,
      sku,
      stock_quantity,
      weight,
      dimensions,
      status,
      featured,
      tags,
      meta_title,
      meta_description,
      specifications
    } = body;

    // Update product
    const updateQuery = `
      UPDATE products SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        short_description = COALESCE(?, short_description),
        price = COALESCE(?, price),
        compare_price = ?,
        cost_price = ?,
        category_id = COALESCE(?, category_id),
        sku = COALESCE(?, sku),
        stock_quantity = COALESCE(?, stock_quantity),
        weight = ?,
        dimensions = ?,
        status = COALESCE(?, status),
        featured = COALESCE(?, featured),
        tags = ?,
        meta_title = ?,
        meta_description = ?,
        specifications = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [
      title,
      description,
      short_description,
      price,
      compare_price,
      cost_price,
      category_id,
      sku,
      stock_quantity,
      weight,
      dimensions,
      status,
      featured,
      tags,
      meta_title,
      meta_description,
      specifications ? JSON.stringify(specifications) : null,
      productId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

// DELETE - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Validate product ID
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    // TODO: Add authentication check for admin
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Soft delete - just update status to inactive
    await executeQuery(
      'UPDATE products SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [productId]
    );

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
}
