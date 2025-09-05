# FrameShop Database Setup Guide

## 📋 Overview

This directory contains all the necessary SQL scripts to set up the complete FrameShop e-commerce database with tables, stored procedures, and sample data.

## 📁 Files Structure

```
database/
├── README.md           # This setup guide
├── schema.sql          # Database schema with tables, indexes, views, and triggers
├── procedures.sql      # Stored procedures for common operations
└── sample_data.sql     # Sample data for development and testing
```

## 🚀 Quick Setup

### Prerequisites
- MySQL 8.0 or higher
- Database user with CREATE, ALTER, INSERT, UPDATE, DELETE privileges
- At least 100MB free space

### Step 1: Create Database and Run Schema
```bash
# Connect to MySQL
mysql -u root -p

# Run the schema script
mysql -u root -p < database/schema.sql
```

### Step 2: Create Stored Procedures
```bash
# Run the procedures script
mysql -u root -p frameshop < database/procedures.sql
```

### Step 3: Insert Sample Data (Optional)
```bash
# Run the sample data script
mysql -u root -p frameshop < database/sample_data.sql
```

## 📊 Database Schema Overview

### Core Tables

#### 1. **users** - Admin Authentication
- Stores admin users and their roles
- Supports role-based access control (admin, user)
- Password hashing and email verification

#### 2. **categories** - Product Categories
- Hierarchical product categorization
- SEO-friendly with slugs and meta data
- Status management (active/inactive)

#### 3. **products** - Product Catalog
- Complete product information with pricing
- Stock management with low stock alerts
- SEO optimization with meta tags
- Support for variants and custom attributes

#### 4. **product_images** - Product Images
- Multiple images per product
- Primary image designation
- Sort ordering for image galleries

#### 5. **customers** - Customer Management
- Customer profiles with contact information
- Purchase history and analytics
- Customer tier system (Bronze, Silver, Gold)

#### 6. **customer_addresses** - Address Management
- Multiple addresses per customer
- Billing and shipping address types
- Default address designation

#### 7. **orders** - Order Management
- Complete order lifecycle management
- Payment and fulfillment status tracking
- Comprehensive address and customer data
- Order notes and tracking information

#### 8. **order_items** - Order Line Items
- Individual items within orders
- Product snapshot at time of purchase
- Quantity and pricing information

#### 9. **order_status_history** - Order Tracking
- Complete audit trail of order status changes
- Admin user tracking for changes
- Timestamped status updates with notes

#### 10. **coupons** - Discount Management
- Percentage and fixed amount discounts
- Usage limits and expiration dates
- Minimum order requirements

#### 11. **admin_logs** - Activity Logging
- Complete audit trail of admin actions
- JSON storage of old and new values
- IP address and user agent tracking

#### 12. **settings** - Configuration Management
- Key-value store for application settings
- Type-safe value storage (string, number, boolean, JSON)

### Views for Easy Querying

#### **product_details**
- Products with category information and primary images
- Sales statistics and stock status

#### **order_summary**
- Orders with customer information and item counts
- Aggregated order statistics

#### **customer_analytics**
- Customer tier classification and activity status
- Registration and purchase analytics

#### **sales_analytics**
- Daily sales data with revenue and customer metrics
- Ready for reporting and dashboard displays

## 🔧 Stored Procedures

### Product Management
- `GetProductDetails(product_id)` - Get complete product information
- `UpdateProductStock(product_id, quantity_change, operation)` - Manage inventory
- `GetLowStockProducts()` - Get products below stock threshold
- `SearchProducts(search_term, filters...)` - Advanced product search

### Order Management
- `CreateOrder(order_data...)` - Create new order with items
- `UpdateOrderStatus(order_id, status, notes, user_id)` - Update order status
- `GetOrderDetails(order_id)` - Get complete order information
- `CancelOrder(order_id, reason, user_id)` - Cancel order and restore stock

### Customer Management
- `CreateCustomer(name, email, phone)` - Create new customer
- `GetCustomerOrders(customer_id, limit, offset)` - Get customer order history
- `GetCustomerAnalytics()` - Get customer statistics and metrics

### Analytics & Reporting
- `GetSalesReport(start_date, end_date, group_by)` - Generate sales reports
- `GetTopSellingProducts(limit, days)` - Get best-selling products
- `GetDashboardStats()` - Get dashboard metrics and recent activity

### Utility Procedures
- `ApplyCoupon(coupon_code, order_total)` - Validate and apply coupons
- `GetCategoryProducts(category_id, limit, offset)` - Get products by category

## 📈 Sample Data

The sample data includes:

### Categories (8 categories)
- Photo Frames
- Art Frames  
- Digital Frames
- Wall Frames
- Vintage Frames
- Collage Frames
- Custom Frames
- Mirror Frames

### Products (16 products)
- Realistic product data with descriptions, pricing, and stock
- Multiple images per product
- Various price ranges from ₹24.99 to ₹199.99
- Different stock levels for testing low stock alerts

### Customers (10 customers)
- Diverse customer profiles with complete address information
- Different customer tiers and purchase histories
- Realistic contact information and preferences

### Orders (14 orders)
- Various order statuses (pending, processing, shipped, delivered, cancelled)
- Different payment methods and amounts
- Complete order history with status changes
- Recent orders for testing analytics

### Additional Data
- 6 active coupons with different discount types
- Admin activity logs
- Order status history
- Customer addresses

## 🔍 Data Verification

After running the scripts, verify the setup:

```sql
-- Check table counts
SELECT 
    'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL  
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders;

-- Check data integrity
CALL GetDashboardStats();

-- Test a procedure
CALL GetProductDetails(1);
```

## 🔧 Configuration

### Environment Variables
Update your `.env.local` file with database connection details:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=frameshop
```

### Application Configuration
The database is designed to work with the FrameShop Next.js application. Key integration points:

1. **Authentication**: Uses NextAuth.js with the `users` table
2. **Product Catalog**: Integrates with the product listing and detail pages
3. **Shopping Cart**: Supports the cart context and checkout flow
4. **Admin Panel**: Powers all admin management features
5. **Analytics**: Provides data for reports and dashboard

## 🚨 Important Notes

### Security
- Change default admin password after setup
- Use strong passwords for database users
- Enable SSL for production database connections
- Regularly backup your database

### Performance
- Indexes are optimized for common queries
- Use stored procedures for complex operations
- Monitor slow query log for optimization opportunities
- Consider read replicas for high-traffic scenarios

### Maintenance
- Regularly update customer statistics using triggers
- Archive old order data as needed
- Monitor disk space usage
- Keep admin logs for audit purposes

## 🔄 Migration and Updates

### Adding New Features
1. Create migration scripts for schema changes
2. Update stored procedures as needed
3. Test with sample data
4. Document changes in this README

### Backup and Restore
```bash
# Backup
mysqldump -u root -p frameshop > frameshop_backup.sql

# Restore
mysql -u root -p frameshop < frameshop_backup.sql
```

## 📞 Support

For database-related issues:
1. Check the error logs in MySQL
2. Verify all foreign key constraints
3. Ensure proper user permissions
4. Review the stored procedure definitions

## 🎯 Production Deployment

### Checklist
- [ ] Change default passwords
- [ ] Configure proper user permissions
- [ ] Set up SSL connections
- [ ] Configure backup strategy
- [ ] Monitor performance metrics
- [ ] Set up alerting for critical issues

### Recommended Settings
```sql
-- For production performance
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL max_connections = 200;
SET GLOBAL query_cache_size = 64M;
```

---

**Database Version**: 1.0  
**Last Updated**: January 2024  
**Compatible With**: MySQL 8.0+, FrameShop v1.0
