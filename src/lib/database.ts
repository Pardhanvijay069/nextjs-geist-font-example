import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ashirwaddigitals',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Database schema creation queries
export const createTables = async () => {
  try {
    // Users table
    await pool.execute(`
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
      )
    `);

    // Categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await pool.execute(`
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
      )
    `);

    // Orders table
    await pool.execute(`
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
      )
    `);

    // Order items table
    await pool.execute(`
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
      )
    `);

    // Reviews table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        user_id INT,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Settings table for company branding and configuration
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default company settings if they don't exist
    await pool.execute(`
      INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, description) VALUES
      ('company_name', 'FrameShop', 'string', 'Company name displayed across the website'),
      ('company_description', 'Premium photo frames and art frames', 'string', 'Company description for homepage'),
      ('company_logo', 'F', 'string', 'Company logo (text or base64 image)'),
      ('company_email', 'info@frameshop.com', 'string', 'Company contact email'),
      ('company_phone', '+91 98765 43210', 'string', 'Company contact phone number'),
      ('company_address', '123 Frame Street, Art District, Mumbai 400001', 'string', 'Company physical address')
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
};

// Helper functions for database operations
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getConnection = async () => {
  return await pool.getConnection();
};
