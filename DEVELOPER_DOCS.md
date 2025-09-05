# FrameShop E-Commerce - Developer Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Authentication](#authentication)
8. [Payment Integration](#payment-integration)
9. [File Upload & Storage](#file-upload--storage)
10. [Development Workflow](#development-workflow)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

FrameShop is a modern e-commerce website built with Next.js 15+ for selling photo frames, art frames, and wall frames. The application features a complete shopping experience with cart functionality, secure checkout, admin panel, and WhatsApp integration.

### Key Features
- **Frontend**: Modern React/Next.js with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: NextAuth.js with role-based access
- **Payment**: Razorpay integration
- **Admin Panel**: Complete CRUD operations for products, categories, orders, customers
- **Analytics**: Reports and charts using Recharts
- **File Storage**: Google Drive API integration
- **Communication**: WhatsApp integration for customer support

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React Pages   │    │ • REST APIs     │    │ • Razorpay      │
│ • Components    │    │ • Authentication│    │ • Google Drive  │
│ • State Mgmt    │    │ • File Upload   │    │ • WhatsApp      │
│ • Tailwind CSS  │    │ • Database      │    │ • MySQL         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
frameshop/
├── public/                     # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/            # Admin panel pages
│   │   │   ├── categories/   # Category management
│   │   │   ├── customers/    # Customer management
│   │   │   ├── dashboard/    # Admin dashboard
│   │   │   ├── orders/       # Order management
│   │   │   └── reports/      # Analytics & reports
│   │   ├── api/              # API routes
│   │   │   ├── admin/        # Admin APIs
│   │   │   ├── auth/         # Authentication
│   │   │   └── checkout/     # Payment processing
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout process
│   │   ├── contact/          # Contact form
│   │   ├── products/         # Product pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AdminLayout.tsx   # Admin layout wrapper
│   │   ├── Navigation.tsx    # Main navigation
│   │   ├── ProductCard.tsx   # Product display card
│   │   └── WhatsAppButton.tsx # WhatsApp integration
│   ├── contexts/            # React contexts
│   │   └── CartContext.tsx   # Shopping cart state
│   ├── data/                # Static data
│   │   └── products.ts       # Sample product data
│   ├── hooks/               # Custom React hooks
│   │   └── use-mobile.ts     # Mobile detection
│   └── lib/                 # Utility libraries
│       ├── auth.ts          # Authentication utilities
│       ├── database.ts      # Database connection
│       ├── googleDrive.ts   # Google Drive integration
│       ├── razorpay.ts      # Payment processing
│       └── utils.ts         # General utilities
├── .env.local               # Environment variables
├── .env.example             # Environment template
├── components.json          # shadcn/ui config
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

## 🔧 Environment Setup

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm/bun
- MySQL database (for production)
- Google Drive API credentials (optional)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frameshop
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=frameshop

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:8000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google Drive API Configuration
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER=919876543210

# Application Configuration
NODE_ENV=development
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:8000`

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signin`
User login endpoint.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

### Product Management APIs

#### GET `/api/admin/products`
Retrieve all products.

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "title": "Classic Wooden Frame",
      "description": "Beautiful handcrafted wooden frame",
      "price": 29.99,
      "category": "Photo Frames",
      "stock": 15,
      "images": ["image_url_1", "image_url_2"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST `/api/admin/products`
Create a new product.

**Request:**
```json
{
  "title": "New Frame",
  "description": "Frame description",
  "price": 39.99,
  "category": "Art Frames",
  "stock": 10,
  "images": ["image_url"]
}
```

#### PUT `/api/admin/products/[id]`
Update an existing product.

#### DELETE `/api/admin/products/[id]`
Delete a product.

### Category Management APIs

#### GET `/api/admin/categories`
Retrieve all categories.

#### POST `/api/admin/categories`
Create a new category.

**Request:**
```json
{
  "name": "Digital Frames",
  "description": "Modern digital photo frames",
  "status": "active"
}
```

### Order Management APIs

#### GET `/api/admin/orders`
Retrieve all orders with filtering options.

**Query Parameters:**
- `status`: Filter by order status
- `customer`: Filter by customer name/email
- `date_from`: Start date filter
- `date_to`: End date filter

#### PUT `/api/admin/orders/[id]/status`
Update order status.

**Request:**
```json
{
  "status": "shipped",
  "notes": "Order shipped via courier"
}
```

### Customer Management APIs

#### GET `/api/admin/customers`
Retrieve all customers.

#### GET `/api/admin/customers/[id]`
Get customer details with order history.

### Payment APIs

#### POST `/api/checkout/razorpay`
Process payment through Razorpay.

**Request:**
```json
{
  "amount": 2999,
  "currency": "INR",
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "customer_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  }
}
```

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  stock INT DEFAULT 0,
  images JSON,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Authentication

The application uses NextAuth.js for authentication with the following configuration:

### Setup
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Implement your authentication logic
        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  }
};
```

### Usage in Components
```typescript
import { useSession } from 'next-auth/react';

export function ProtectedComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Loading />;
  if (!session) return <SignIn />;
  
  return <AdminPanel />;
}
```

## 💳 Payment Integration

### Razorpay Setup
```typescript
// src/lib/razorpay.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function createOrder(amount: number, currency = 'INR') {
  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt: `order_${Date.now()}`
  };
  
  return await razorpay.orders.create(options);
}
```

### Frontend Integration
```typescript
// Payment processing in checkout
const handlePayment = async () => {
  const order = await createRazorpayOrder(totalAmount);
  
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'FrameShop',
    description: 'Purchase frames',
    order_id: order.id,
    handler: function (response: any) {
      // Handle successful payment
      verifyPayment(response);
    },
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone
    }
  };
  
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

## 📁 File Upload & Storage

### Google Drive Integration
```typescript
// src/lib/googleDrive.ts
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

export async function uploadToGoogleDrive(file: Buffer, fileName: string) {
  const drive = google.drive({ version: 'v3', auth });
  
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!]
    },
    media: {
      mimeType: 'image/jpeg',
      body: file
    }
  });
  
  return response.data.id;
}
```

## 🔄 Development Workflow

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

### Component Development
```typescript
// Example component structure
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  
  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart(product);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
}
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables (Production)
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
DB_HOST=your-production-db-host
# ... other production variables
```

### Deployment Platforms

#### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

#### Hostinger cPanel
1. Build the application locally
2. Upload build files to public_html
3. Configure Node.js app in cPanel
4. Set up MySQL database

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Check MySQL service and connection credentials.

#### 2. NextAuth Configuration Error
```
Error: Please define a NEXTAUTH_SECRET environment variable
```
**Solution:** Add NEXTAUTH_SECRET to your .env.local file.

#### 3. Razorpay Integration Issues
```
Error: Key ID is mandatory
```
**Solution:** Ensure RAZORPAY_KEY_ID is properly set in environment variables.

#### 4. Google Drive Upload Fails
```
Error: Invalid credentials
```
**Solution:** Verify Google Service Account credentials and permissions.

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Next.js specific debugging
NODE_OPTIONS='--inspect' npm run dev
```

### Performance Optimization
- Use Next.js Image component for optimized images
- Implement proper caching strategies
- Use React.memo for expensive components
- Optimize database queries with proper indexing

### Security Checklist
- [ ] Environment variables are properly secured
- [ ] API routes have proper authentication
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] HTTPS in production
- [ ] Rate limiting on API endpoints

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Maintainer:** FrameShop Development Team
