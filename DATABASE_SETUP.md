# Database Setup Instructions

This guide will help you set up the MySQL database for the FrameShop application.

## Prerequisites

- MySQL Server 8.0 or higher
- Node.js 18+ 
- npm/yarn/pnpm

## Step 1: Install MySQL

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### On macOS (using Homebrew):
```bash
brew install mysql
brew services start mysql
```

### On Windows:
Download and install MySQL from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

## Step 2: Create Database and User

1. Login to MySQL as root:
```bash
mysql -u root -p
```

2. Create the database and user:
```sql
CREATE DATABASE frameshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'frameshop_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON frameshop.* TO 'frameshop_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=frameshop_user
DB_PASSWORD=your_secure_password
DB_NAME=frameshop

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:8000
```

## Step 4: Initialize Database

Run the initialization script to create all tables and insert default data:

```bash
mysql -u frameshop_user -p frameshop < database/init.sql
```

## Step 5: Install Dependencies and Start Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at [http://localhost:8000](http://localhost:8000)

## Default Admin Credentials

- **Email:** admin@frameshop.com
- **Password:** admin123

**Important:** Change the default admin password after first login!

## Database Features

The database includes:

### Tables:
- `users` - User accounts and admin users
- `categories` - Product categories
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Product reviews
- `settings` - Company branding and configuration

### Default Settings:
- Company Name: FrameShop
- Company Description: Premium photo frames and art frames
- Company Logo: F (text logo)
- Contact Email: contact@frameshop.com
- Phone: +91 98765 43210
- Address: 123 Frame Street, Art District, Mumbai 400001

### Sample Data:
- 5 product categories
- 5 sample products
- Default admin user

## Troubleshooting

### Connection Issues:
1. Verify MySQL is running: `sudo systemctl status mysql`
2. Check credentials in `.env.local`
3. Ensure database exists: `SHOW DATABASES;`

### Permission Issues:
```sql
GRANT ALL PRIVILEGES ON frameshop.* TO 'frameshop_user'@'localhost';
FLUSH PRIVILEGES;
```

### Port Issues:
- Default MySQL port: 3306
- Default Next.js port: 8000
- Make sure ports are not blocked by firewall

## Production Deployment

For production:
1. Use strong passwords
2. Enable SSL/TLS for database connections
3. Set up proper backup procedures
4. Configure environment variables securely
5. Use connection pooling for better performance

## Support

If you encounter any issues:
1. Check the application logs
2. Verify database connection
3. Ensure all environment variables are set correctly
4. Check MySQL error logs: `/var/log/mysql/error.log`
