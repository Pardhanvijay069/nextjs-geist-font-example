# Database Migration Plan: Convert E-commerce from Static JSON/localStorage to MySQL

## Overview
This plan outlines the steps required to convert the existing e-commerce application from using static JSON/localStorage to a fully database-driven application using MySQL. The application will utilize REST APIs to fetch data, and images will be uploaded to a designated folder with URLs stored in the database.

## Step-by-Step Changes

### 1. Database Setup & Configuration
- **File**: `database/schema.sql`
  - Execute the SQL script to create the necessary tables: `users`, `categories`, `products`, `product_images`, `customers`, `orders`, `order_items`, `reviews`, and `settings`.
  - Ensure that the database is set up on the local MySQL server using the provided credentials.
- **File**: `src/lib/database.ts`
  - Update database connection pool configuration to use local MySQL database credentials.
  - Confirm that the `executeQuery` function is capable of handling queries for all CRUD operations.
- **File**: `.env.local`
  - Create environment variables for database configuration.

### 2. User Authentication APIs
- **File**: `src/app/api/auth/register/route.ts` (NEW)
  - Create user registration API endpoint
  - Hash passwords and store user data in MySQL `users` table
  - Implement email validation and duplicate checking
- **File**: `src/app/api/auth/login/route.ts` (NEW)
  - Create user login API endpoint
  - Validate credentials against MySQL database
  - Generate JWT tokens or session management
- **File**: `src/app/api/auth/profile/route.ts` (NEW)
  - Create user profile management API
  - Allow users to view and update their profile information
- **File**: `src/lib/auth.ts`
  - Update authentication configuration to work with MySQL database
  - Implement proper session management

### 3. Product Management APIs
- **File**: `src/app/api/products/route.ts` (NEW)
  - Create public product listing API (GET)
  - Implement filtering, sorting, and pagination
  - Replace static product data with database queries
- **File**: `src/app/api/products/[id]/route.ts` (NEW)
  - Create individual product details API (GET)
  - Include product images, reviews, and specifications
- **File**: `src/app/api/admin/products/route.ts`
  - Update existing admin product management APIs
  - Implement full CRUD operations with MySQL
  - Add proper validation and error handling

### 4. Category Management APIs
- **File**: `src/app/api/categories/route.ts` (NEW)
  - Create public categories listing API
  - Include product counts for each category
- **File**: `src/app/api/admin/categories/route.ts`
  - Update admin category management
  - Implement full CRUD operations with MySQL

### 5. Image Upload System
- **File**: `src/app/api/admin/upload-image/route.ts`
  - Create image upload API endpoint
  - Store images in `uploads/` folder
  - Save image URLs in `product_images` table
  - Implement image validation and resizing
- **File**: `public/uploads/` (NEW FOLDER)
  - Create uploads directory for storing product images

### 6. Cart & Session Management
- **File**: `src/app/api/cart/route.ts` (NEW)
  - Create cart management APIs for logged-in users
  - Store cart data in database for persistence
- **File**: `src/contexts/CartContext.tsx`
  - Update cart context to work with both localStorage (guests) and database (users)
  - Implement cart synchronization for user login/logout

### 7. Checkout & Order Management APIs
- **File**: `src/app/api/checkout/route.ts` (NEW)
  - Create checkout process API
  - Validate cart items and calculate totals
  - Create order records in database
- **File**: `src/app/api/checkout/razorpay/route.ts`
  - Update Razorpay integration to work with database orders
  - Store payment information in orders table
- **File**: `src/app/api/orders/route.ts` (NEW)
  - Create order history API for users
  - Allow users to view their past orders
- **File**: `src/app/api/orders/[id]/route.ts` (NEW)
  - Create individual order details API
  - Include order items and status tracking

### 8. Customer Management
- **File**: `src/app/api/customers/route.ts` (NEW)
  - Create customer profile management API
  - Handle customer addresses and preferences
- **File**: `src/app/api/admin/customers/route.ts`
  - Update admin customer management
  - Implement customer analytics and management

### 9. Frontend Updates
- **File**: `src/app/products/page.tsx`
  - Replace static product data with API calls
  - Implement loading states and error handling
- **File**: `src/app/products/[id]/page.tsx`
  - Update product details page to fetch from API
  - Handle dynamic routing and SEO
- **File**: `src/app/cart/page.tsx`
  - Update cart page to work with new cart APIs
  - Handle both guest and user cart scenarios
- **File**: `src/app/checkout/page.tsx`
  - Update checkout flow to use new APIs
  - Implement proper order creation and payment flow
- **File**: `src/app/orders/page.tsx` (NEW)
  - Create order history page for users
  - Display past orders with status tracking
- **File**: `src/app/orders/[id]/page.tsx` (NEW)
  - Create individual order details page
  - Show order items, shipping, and payment information

### 10. Admin Panel Updates
- **File**: `src/app/admin/products/page.tsx`
  - Update admin product management to use new APIs
  - Implement proper CRUD operations
- **File**: `src/app/admin/orders/page.tsx`
  - Update admin order management
  - Implement order status updates and tracking
- **File**: `src/app/admin/customers/page.tsx`
  - Update admin customer management
  - Display customer analytics and order history

### 11. Data Migration
- **File**: `scripts/migrate-data.js` (NEW)
  - Create script to migrate existing static data to MySQL
  - Import sample products, categories, and test data
- **File**: `database/sample_data.sql`
  - Update sample data script with comprehensive test data

### 12. Testing & Validation
- **File**: `API_TESTING_RESULTS.md`
  - Create comprehensive tests for all new API endpoints
  - Validate CRUD operations, authentication, and order flow
  - Test error handling and edge cases

### 13. Deployment Preparation
- **File**: `README.md`
  - Update documentation for database-driven architecture
  - Provide setup instructions for Hostinger MySQL and Vercel deployment
- **File**: `vercel.json` (NEW)
  - Configure Vercel deployment settings
  - Set up environment variables and build configuration

## UI/UX Considerations
- Implement loading indicators for all API calls
- Provide clear error messages and fallback states
- Maintain responsive design across all updated components
- Ensure smooth user experience during authentication flow
- Implement proper order tracking and status updates
- Use Tailwind CSS for consistent modern styling

## Security Considerations
- Implement proper input validation and sanitization
- Use parameterized queries to prevent SQL injection
- Implement rate limiting for API endpoints
- Secure file upload functionality
- Protect sensitive user and order information

## Performance Optimizations
- Implement database indexing for frequently queried fields
- Use connection pooling for database connections
- Implement caching strategies for product listings
- Optimize image storage and delivery
- Implement pagination for large datasets

## Summary
- Set up MySQL database with comprehensive schema
- Implement complete user authentication and authorization system
- Create full product and category management APIs
- Implement secure image upload and storage system
- Build complete checkout and order management flow
- Update all frontend components to use database APIs
- Ensure proper testing and deployment preparation

After plan approval, I will break down the plan into logical steps and create a tracker (TODO.md) to track the execution of steps in the plan.
