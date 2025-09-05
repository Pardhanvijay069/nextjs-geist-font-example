-- FrameShop Database Initialization Script
-- Run this script to set up the database with all required tables and default data

-- Create Database
CREATE DATABASE IF NOT EXISTS frameshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE frameshop;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT,
  stock INT DEFAULT 0,
  images JSON,
  sizes JSON,
  specifications JSON,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  shipping_address JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  user_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Settings table for company branding and configuration
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default company settings
INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'FrameShop', 'string', 'Company name displayed across the website'),
('company_description', 'Premium photo frames and art frames', 'string', 'Company description for homepage'),
('company_logo', 'F', 'string', 'Company logo (text or base64 image)'),
('company_email', 'contact@frameshop.com', 'string', 'Company contact email'),
('company_phone', '+91 98765 43210', 'string', 'Company contact phone number'),
('company_address', '123 Frame Street, Art District, Mumbai 400001', 'string', 'Company physical address');

-- Insert sample categories
INSERT IGNORE INTO categories (id, name, slug, description) VALUES
(1, 'Photo Frames', 'photo-frames', 'Traditional photo frames for family pictures'),
(2, 'Art Frames', 'art-frames', 'Professional frames for artwork and paintings'),
(3, 'Digital Frames', 'digital-frames', 'Modern digital photo frames with LED displays'),
(4, 'Wall Frames', 'wall-frames', 'Large decorative frames for wall mounting'),
(5, 'Vintage Frames', 'vintage-frames', 'Classic vintage-style frames');

-- Insert sample products
INSERT IGNORE INTO products (id, title, description, price, category_id, stock, status) VALUES
(1, 'Classic Wooden Frame', 'Beautiful handcrafted wooden frame perfect for family photos', 299.99, 1, 25, 'active'),
(2, 'Modern Metal Frame', 'Sleek modern metal frame for contemporary artwork', 399.99, 2, 15, 'active'),
(3, 'Vintage Gold Frame', 'Elegant vintage gold frame for special occasions', 599.99, 5, 8, 'active'),
(4, 'Digital Photo Frame', 'Smart digital frame with WiFi connectivity', 899.99, 3, 12, 'active'),
(5, 'Rustic Barn Wood Frame', 'Authentic rustic barn wood frame with character', 349.99, 1, 3, 'active');

-- Create default admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT IGNORE INTO users (email, password, name, role) VALUES
('admin@frameshop.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin');

COMMIT;

SELECT 'Database initialization completed successfully!' as message;
