# FrameShop E-Commerce - API Reference

## 📋 Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Product Management APIs](#product-management-apis)
3. [Category Management APIs](#category-management-apis)
4. [Order Management APIs](#order-management-apis)
5. [Customer Management APIs](#customer-management-apis)
6. [Payment Processing APIs](#payment-processing-apis)
7. [File Upload APIs](#file-upload-apis)
8. [Analytics & Reports APIs](#analytics--reports-apis)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

## Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

## Authentication
All admin API endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication APIs

### POST `/auth/signin`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "admin@frameshop.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@frameshop.com",
    "name": "Admin User",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@frameshop.com",
    "password": "admin123"
  }'
```

### POST `/auth/signout`
Sign out user and invalidate token.

**Response (200):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

## 📦 Product Management APIs

### GET `/admin/products`
Retrieve all products with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category ID
- `status` (optional): Filter by status (active/inactive)
- `search` (optional): Search in title and description

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "title": "Classic Wooden Frame",
        "description": "Beautiful handcrafted wooden frame perfect for family photos",
        "price": 29.99,
        "category": {
          "id": 1,
          "name": "Photo Frames"
        },
        "stock": 15,
        "images": [
          "https://storage.googleapis.com/frameshop/image1.jpg",
          "https://storage.googleapis.com/frameshop/image2.jpg"
        ],
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/admin/products?page=1&limit=10&category=1" \
  -H "Authorization: Bearer <your_token>"
```

### GET `/admin/products/[id]`
Get a specific product by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Classic Wooden Frame",
    "description": "Beautiful handcrafted wooden frame perfect for family photos",
    "price": 29.99,
    "category": {
      "id": 1,
      "name": "Photo Frames"
    },
    "stock": 15,
    "images": ["https://storage.googleapis.com/frameshop/image1.jpg"],
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST `/admin/products`
Create a new product.

**Request Body:**
```json
{
  "title": "Modern Metal Frame",
  "description": "Sleek metal frame with contemporary design",
  "price": 39.99,
  "categoryId": 2,
  "stock": 20,
  "images": ["https://storage.googleapis.com/frameshop/new-image.jpg"],
  "status": "active"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 26,
    "title": "Modern Metal Frame",
    "description": "Sleek metal frame with contemporary design",
    "price": 39.99,
    "categoryId": 2,
    "stock": 20,
    "images": ["https://storage.googleapis.com/frameshop/new-image.jpg"],
    "status": "active",
    "createdAt": "2024-01-20T14:30:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/admin/products \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Modern Metal Frame",
    "description": "Sleek metal frame with contemporary design",
    "price": 39.99,
    "categoryId": 2,
    "stock": 20,
    "images": ["https://storage.googleapis.com/frameshop/new-image.jpg"],
    "status": "active"
  }'
```

### PUT `/admin/products/[id]`
Update an existing product.

**Request Body:**
```json
{
  "title": "Updated Classic Wooden Frame",
  "price": 34.99,
  "stock": 12
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Classic Wooden Frame",
    "price": 34.99,
    "stock": 12,
    "updatedAt": "2024-01-20T15:00:00Z"
  }
}
```

### DELETE `/admin/products/[id]`
Delete a product.

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📂 Category Management APIs

### GET `/admin/categories`
Retrieve all categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Photo Frames",
      "description": "Traditional photo frames for family pictures",
      "productCount": 15,
      "status": "active",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-10T09:00:00Z"
    },
    {
      "id": 2,
      "name": "Art Frames",
      "description": "Professional frames for artwork and paintings",
      "productCount": 8,
      "status": "active",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-10T09:00:00Z"
    }
  ]
}
```

### POST `/admin/categories`
Create a new category.

**Request Body:**
```json
{
  "name": "Digital Frames",
  "description": "Modern digital photo frames with LED displays",
  "status": "active"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Digital Frames",
    "description": "Modern digital photo frames with LED displays",
    "productCount": 0,
    "status": "active",
    "createdAt": "2024-01-20T16:00:00Z",
    "updatedAt": "2024-01-20T16:00:00Z"
  }
}
```

### PUT `/admin/categories/[id]`
Update a category.

**Request Body:**
```json
{
  "name": "Updated Digital Frames",
  "description": "Updated description for digital frames"
}
```

### DELETE `/admin/categories/[id]`
Delete a category.

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 🛒 Order Management APIs

### GET `/admin/orders`
Retrieve all orders with filtering options.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by order status
- `customer` (optional): Filter by customer name/email
- `dateFrom` (optional): Start date (YYYY-MM-DD)
- `dateTo` (optional): End date (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "customer": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+91 9876543210"
        },
        "items": [
          {
            "id": 1,
            "productId": 1,
            "productName": "Classic Wooden Frame",
            "quantity": 2,
            "price": 29.99,
            "total": 59.98
          }
        ],
        "totalAmount": 299.99,
        "status": "processing",
        "paymentStatus": "paid",
        "paymentMethod": "razorpay",
        "shippingAddress": "123 Main St, Mumbai, Maharashtra 400001",
        "notes": "Customer requested express delivery",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T14:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/admin/orders?status=processing&page=1" \
  -H "Authorization: Bearer <your_token>"
```

### GET `/admin/orders/[id]`
Get detailed information about a specific order.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-2024-001",
    "customer": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 9876543210"
    },
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Classic Wooden Frame",
        "quantity": 2,
        "price": 29.99,
        "total": 59.98
      }
    ],
    "totalAmount": 299.99,
    "status": "processing",
    "paymentStatus": "paid",
    "paymentMethod": "razorpay",
    "shippingAddress": "123 Main St, Mumbai, Maharashtra 400001",
    "notes": "Customer requested express delivery",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T10:30:00Z",
        "note": "Order placed"
      },
      {
        "status": "processing",
        "timestamp": "2024-01-15T14:20:00Z",
        "note": "Payment confirmed, processing order"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:20:00Z"
  }
}
```

### PUT `/admin/orders/[id]/status`
Update order status.

**Request Body:**
```json
{
  "status": "shipped",
  "notes": "Order shipped via Blue Dart. Tracking: BD123456789"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "shipped",
    "notes": "Order shipped via Blue Dart. Tracking: BD123456789",
    "updatedAt": "2024-01-16T11:45:00Z"
  }
}
```

---

## 👥 Customer Management APIs

### GET `/admin/customers`
Retrieve all customers.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by customer status
- `search` (optional): Search by name, email, or phone

**Response (200):**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 9876543210",
        "totalOrders": 5,
        "totalSpent": 1299.95,
        "status": "active",
        "registrationDate": "2024-01-10T00:00:00Z",
        "lastOrderDate": "2024-01-20T00:00:00Z",
        "shippingAddress": "123 Main St, Mumbai, Maharashtra 400001"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 28,
      "itemsPerPage": 10
    }
  }
}
```

### GET `/admin/customers/[id]`
Get detailed customer information with order history.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "totalOrders": 5,
    "totalSpent": 1299.95,
    "status": "active",
    "registrationDate": "2024-01-10T00:00:00Z",
    "lastOrderDate": "2024-01-20T00:00:00Z",
    "shippingAddress": "123 Main St, Mumbai, Maharashtra 400001",
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "date": "2024-01-20T00:00:00Z",
        "total": 299.99,
        "status": "delivered",
        "itemCount": 2
      }
    ]
  }
}
```

### PUT `/admin/customers/[id]/status`
Update customer status.

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "inactive",
    "updatedAt": "2024-01-20T17:00:00Z"
  }
}
```

---

## 💳 Payment Processing APIs

### POST `/checkout/razorpay`
Create Razorpay order for payment processing.

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "customerDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "address": "123 Main St, Mumbai, Maharashtra 400001"
  },
  "totalAmount": 299.99
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_razorpay_id_here",
    "amount": 29999,
    "currency": "INR",
    "key": "rzp_test_key_id",
    "name": "FrameShop",
    "description": "Purchase of photo frames",
    "prefill": {
      "name": "John Doe",
      "email": "john@example.com",
      "contact": "+91 9876543210"
    }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/checkout/razorpay \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 29.99
      }
    ],
    "customerDetails": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 9876543210",
      "address": "123 Main St, Mumbai, Maharashtra 400001"
    },
    "totalAmount": 299.99
  }'
```

### POST `/checkout/verify-payment`
Verify Razorpay payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": "order_razorpay_id",
  "razorpay_payment_id": "pay_razorpay_id",
  "razorpay_signature": "signature_hash"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "orderId": 1,
    "orderNumber": "ORD-2024-001",
    "paymentStatus": "paid"
  }
}
```

---

## 📁 File Upload APIs

### POST `/admin/upload-image`
Upload product images to Google Drive.

**Request Body (multipart/form-data):**
```
file: [image file]
productId: 1 (optional)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "fileId": "google_drive_file_id",
    "url": "https://storage.googleapis.com/frameshop/uploaded-image.jpg",
    "fileName": "product-image-123.jpg",
    "size": 245760
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/admin/upload-image \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/image.jpg" \
  -F "productId=1"
```

### DELETE `/admin/upload-image/[fileId]`
Delete an uploaded image.

**Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## 📊 Analytics & Reports APIs

### GET `/admin/reports/dashboard`
Get dashboard analytics data.

**Query Parameters:**
- `period` (optional): Time period (7days, 30days, 90days, 1year)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 45678.90,
      "totalOrders": 234,
      "totalCustomers": 156,
      "averageOrderValue": 195.25
    },
    "salesData": [
      {
        "date": "2024-01-01",
        "revenue": 1200,
        "orders": 8,
        "customers": 6
      }
    ],
    "topProducts": [
      {
        "id": 1,
        "name": "Classic Wooden Frame",
        "sales": 45,
        "revenue": 1349.55
      }
    ],
    "orderStatusDistribution": [
      {
        "status": "delivered",
        "count": 45,
        "percentage": 60.8
      }
    ]
  }
}
```

### GET `/admin/reports/sales`
Get detailed sales report.

**Query Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `groupBy`: Group by (day, week, month)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "groupBy": "day"
    },
    "summary": {
      "totalRevenue": 15678.90,
      "totalOrders": 89,
      "averageOrderValue": 176.28
    },
    "salesData": [
      {
        "period": "2024-01-01",
        "revenue": 1200,
        "orders": 8,
        "averageOrderValue": 150
      }
    ]
  }
}
```

---

## ❌ Error Handling

All API endpoints return consistent error responses:

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "price",
        "message": "Price must be a positive number"
      }
    ]
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication token is required"
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found"
  }
}
```

---

## 🚦 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Public endpoints**: 100 requests per minute per IP
- **Authenticated endpoints**: 1000 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## 📝 Notes

1. **Timestamps**: All timestamps are in ISO 8601 format (UTC)
2. **Pagination**: Default page size is 10, maximum is 100
3. **File Uploads**: Maximum file size is 10MB for images
4. **Authentication**: JWT tokens expire after 24 hours
5. **Webhooks**: Razorpay webhooks are handled at `/api/webhooks/razorpay`

---

**Last Updated:** January 2024  
**API Version:** v1  
**Base URL:** `/api`
