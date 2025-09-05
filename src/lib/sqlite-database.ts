import Database from 'better-sqlite3';
import path from 'path';

// SQLite database setup for development/demo
const dbPath = path.join(process.cwd(), 'data', 'frameshop.db');
let db: Database.Database;

try {
  // Ensure data directory exists
  const fs = require('fs');
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
} catch (error) {
  console.error('SQLite connection error:', error);
}

// Initialize database schema
export const initializeDatabase = () => {
  try {
    // Categories table
    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        status TEXT DEFAULT 'active',
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10,2) NOT NULL,
        compare_price DECIMAL(10,2),
        category_id INTEGER,
        sku TEXT UNIQUE,
        stock_quantity INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        featured BOOLEAN DEFAULT FALSE,
        tags TEXT,
        specifications TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Product images table
    db.exec(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        alt_text TEXT,
        sort_order INTEGER DEFAULT 0,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Reviews table
    db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        customer_email TEXT NOT NULL,
        customer_name TEXT,
        customer_phone TEXT,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0.00,
        shipping_amount DECIMAL(10,2) DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_method TEXT,
        payment_id TEXT,
        shipping_address TEXT, -- JSON string
        billing_address TEXT, -- JSON string
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        product_title TEXT NOT NULL,
        product_sku TEXT,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        product_data TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    // Settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_name TEXT UNIQUE NOT NULL,
        value TEXT,
        type TEXT DEFAULT 'string',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('SQLite database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Seed initial data
export const seedDatabase = () => {
  try {
    // Insert categories
    const insertCategory = db.prepare(`
      INSERT OR IGNORE INTO categories (name, slug, description, sort_order)
      VALUES (?, ?, ?, ?)
    `);

    const categories = [
      ['Wooden Frames', 'wooden', 'Traditional wooden frames for family photos', 1],
      ['Metal Frames', 'metal', 'Modern metal frames with sleek design', 2],
      ['Vintage Frames', 'vintage', 'Classic vintage-style ornate frames', 3],
      ['Glass Frames', 'glass', 'Contemporary floating glass frames', 4],
      ['Rustic Frames', 'rustic', 'Authentic rustic barn wood frames', 5],
      ['Digital Frames', 'digital', 'Smart digital frames with LED displays', 6],
      ['Collage Frames', 'collage', 'Multi-photo collage frames', 7],
      ['Shadow Box', 'shadow-box', 'Deep shadow box frames for memorabilia', 8]
    ];

    categories.forEach(category => {
      insertCategory.run(...category);
    });

    // Insert sample products
    const insertProduct = db.prepare(`
      INSERT OR IGNORE INTO products (
        title, slug, description, price, category_id, stock_quantity, 
        specifications, status, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const products = [
      [
        'Classic Wooden Frame',
        'classic-wooden-frame',
        'Beautiful handcrafted wooden frame perfect for family photos and artwork. Made from premium oak wood with a smooth finish.',
        29.99,
        1, // wooden category
        15,
        JSON.stringify({
          'Material': 'Premium Oak Wood',
          'Finish': 'Natural Wood Stain',
          'Mounting': 'Wall Mount & Table Stand',
          'Glass': 'Anti-Glare Glass'
        }),
        'active',
        1
      ],
      [
        'Modern Metal Frame',
        'modern-metal-frame',
        'Sleek and modern metal frame with a minimalist design. Perfect for contemporary home decor and professional displays.',
        39.99,
        2, // metal category
        20,
        JSON.stringify({
          'Material': 'Brushed Aluminum',
          'Finish': 'Matte Black',
          'Mounting': 'Wall Mount Only',
          'Glass': 'Crystal Clear Glass'
        }),
        'active',
        1
      ],
      [
        'Vintage Ornate Frame',
        'vintage-ornate-frame',
        'Elegant vintage-style frame with intricate ornate details. Adds a touch of classic sophistication to any space.',
        49.99,
        3, // vintage category
        8,
        JSON.stringify({
          'Material': 'Carved Wood with Gold Leaf',
          'Finish': 'Antique Gold',
          'Mounting': 'Wall Mount & Table Stand',
          'Glass': 'Museum Quality Glass'
        }),
        'active',
        0
      ],
      [
        'Floating Glass Frame',
        'floating-glass-frame',
        'Contemporary floating glass frame that creates a stunning display effect. Perfect for certificates and special photos.',
        34.99,
        4, // glass category
        12,
        JSON.stringify({
          'Material': 'Tempered Glass',
          'Finish': 'Clear Glass',
          'Mounting': 'Wall Mount Only',
          'Glass': 'Double Layer Glass'
        }),
        'active',
        0
      ],
      [
        'Digital LED Frame',
        'digital-led-frame',
        'Smart digital frame with LED display. WiFi enabled for easy photo sharing and slideshow features.',
        199.99,
        6, // digital category
        5,
        JSON.stringify({
          'Display': 'LED Touchscreen',
          'Resolution': '1920x1080 Full HD',
          'Connectivity': 'WiFi, Bluetooth, USB',
          'Storage': '16GB Internal + Cloud'
        }),
        'active',
        1
      ]
    ];

    products.forEach(product => {
      insertProduct.run(...product);
    });

    // Insert product images
    const insertImage = db.prepare(`
      INSERT OR IGNORE INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const images = [
      [1, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4d3cd262-8a43-432d-8832-99876e7eca31.png', 'Classic Wooden Frame', 1, 0],
      [2, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/08d79133-5b7f-4b1f-b804-4351953b9014.png', 'Modern Metal Frame', 1, 0],
      [3, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2407e68f-e3c8-4c6b-8d55-72382e543995.png', 'Vintage Ornate Frame', 1, 0],
      [4, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ad2442dc-f9d6-46b5-a8f9-6063372ca06a.png', 'Floating Glass Frame', 1, 0],
      [5, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/93dd0234-9c5f-479e-a17e-b47c4c210ab7.png', 'Digital LED Frame', 1, 0]
    ];

    images.forEach(image => {
      insertImage.run(...image);
    });

    // Insert sample reviews
    const insertReview = db.prepare(`
      INSERT OR IGNORE INTO reviews (product_id, user_name, rating, comment)
      VALUES (?, ?, ?, ?)
    `);

    const reviews = [
      [1, 'Sarah Johnson', 5, 'Absolutely beautiful frame! The wood quality is exceptional and it looks perfect in my living room.'],
      [1, 'Mike Chen', 4, 'Great quality frame, though a bit pricey. The craftsmanship is excellent.'],
      [2, 'Alex Rodriguez', 5, 'Perfect minimalist design! Looks amazing with my modern decor.'],
      [3, 'Margaret Thompson', 5, 'Absolutely stunning! The intricate details are breathtaking. Perfect for my antique collection.'],
      [5, 'David Park', 5, 'Amazing digital frame! Easy to set up and the picture quality is excellent.']
    ];

    reviews.forEach(review => {
      insertReview.run(...review);
    });

    // Insert default settings
    const insertSetting = db.prepare(`
      INSERT OR IGNORE INTO settings (key_name, value, type, description)
      VALUES (?, ?, ?, ?)
    `);

    const settings = [
      ['site_name', 'FrameShop', 'string', 'Website name'],
      ['site_description', 'Premium photo frames and art frames', 'string', 'Website description'],
      ['currency', 'USD', 'string', 'Default currency'],
      ['currency_symbol', '$', 'string', 'Currency symbol'],
      ['tax_rate', '8.5', 'number', 'Tax rate percentage'],
      ['shipping_rate', '9.99', 'number', 'Default shipping rate'],
      ['free_shipping_threshold', '75', 'number', 'Free shipping threshold amount']
    ];

    settings.forEach(setting => {
      insertSetting.run(...setting);
    });

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Database query functions
export const executeQuery = (query: string, params: any[] = []) => {
  try {
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db.prepare(query);
      return stmt.all(...params);
    } else {
      const stmt = db.prepare(query);
      return stmt.run(...params);
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getConnection = () => db;

// Initialize database on import
if (db) {
  initializeDatabase();
  seedDatabase();
}

export default db;
