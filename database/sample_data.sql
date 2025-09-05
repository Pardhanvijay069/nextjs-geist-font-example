-- FrameShop E-Commerce Sample Data
-- MySQL Sample Data for Development and Testing

USE frameshop;

-- =============================================
-- CLEAR EXISTING DATA (Optional - for fresh start)
-- =============================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE order_items;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE order_status_history;
-- TRUNCATE TABLE product_images;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE customers;
-- TRUNCATE TABLE customer_addresses;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE coupons;
-- TRUNCATE TABLE admin_logs;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- 1. INSERT ADMIN USERS
-- =============================================
INSERT INTO users (name, email, password, role, status, email_verified) VALUES
('Admin User', 'admin@frameshop.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', TRUE),
('Manager User', 'manager@frameshop.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', TRUE),
('Staff User', 'staff@frameshop.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active', TRUE);

-- =============================================
-- 2. INSERT CATEGORIES
-- =============================================
INSERT INTO categories (name, slug, description, status, sort_order, meta_title, meta_description) VALUES
('Photo Frames', 'photo-frames', 'Traditional photo frames perfect for family pictures and memories', 'active', 1, 'Photo Frames - FrameShop', 'Browse our collection of beautiful photo frames for your precious memories'),
('Art Frames', 'art-frames', 'Professional frames for artwork, paintings, and canvas prints', 'active', 2, 'Art Frames - FrameShop', 'Professional art frames for paintings, prints, and artwork'),
('Digital Frames', 'digital-frames', 'Modern digital photo frames with LED displays and smart features', 'active', 3, 'Digital Photo Frames - FrameShop', 'Smart digital photo frames with WiFi and app connectivity'),
('Wall Frames', 'wall-frames', 'Large decorative frames perfect for wall mounting and home decor', 'active', 4, 'Wall Frames - FrameShop', 'Decorative wall frames for home and office decoration'),
('Vintage Frames', 'vintage-frames', 'Classic vintage-style frames with ornate designs and antique finishes', 'active', 5, 'Vintage Frames - FrameShop', 'Antique and vintage style frames with classic designs'),
('Collage Frames', 'collage-frames', 'Multi-photo frames for displaying multiple pictures together', 'active', 6, 'Collage Frames - FrameShop', 'Multi-photo collage frames for family pictures'),
('Custom Frames', 'custom-frames', 'Personalized and custom-made frames according to your specifications', 'active', 7, 'Custom Frames - FrameShop', 'Custom made frames tailored to your specific requirements'),
('Mirror Frames', 'mirror-frames', 'Decorative frames specifically designed for mirrors', 'active', 8, 'Mirror Frames - FrameShop', 'Beautiful decorative frames for mirrors and reflective surfaces');

-- =============================================
-- 3. INSERT PRODUCTS
-- =============================================
INSERT INTO products (title, slug, description, short_description, price, compare_price, category_id, sku, stock_quantity, low_stock_threshold, weight, dimensions, status, featured, tags, meta_title, meta_description) VALUES

-- Photo Frames
('Classic Wooden Photo Frame', 'classic-wooden-photo-frame', 'Beautiful handcrafted wooden frame perfect for family photos. Made from premium quality wood with a smooth finish that complements any home decor. Available in multiple sizes to fit your favorite memories.', 'Handcrafted wooden frame for family photos', 29.99, 39.99, 1, 'WF-001', 25, 5, 0.5, '8x10 inches', 'active', TRUE, 'wooden,classic,family,photo', 'Classic Wooden Photo Frame - FrameShop', 'Premium wooden photo frame perfect for family pictures'),

('Modern Metal Photo Frame', 'modern-metal-photo-frame', 'Sleek and contemporary metal frame with a brushed aluminum finish. Perfect for modern homes and offices. Lightweight yet durable construction ensures your photos are displayed beautifully.', 'Contemporary metal frame with aluminum finish', 24.99, 34.99, 1, 'MF-001', 30, 5, 0.3, '5x7 inches', 'active', TRUE, 'metal,modern,aluminum,contemporary', 'Modern Metal Photo Frame - FrameShop', 'Sleek metal photo frame with brushed aluminum finish'),

('Elegant Silver Photo Frame', 'elegant-silver-photo-frame', 'Sophisticated silver-plated frame with intricate detailing. Perfect for special occasions and formal settings. The lustrous finish adds a touch of elegance to any photograph.', 'Silver-plated frame with elegant detailing', 45.99, 55.99, 1, 'SF-001', 15, 3, 0.7, '4x6 inches', 'active', FALSE, 'silver,elegant,formal,special', 'Elegant Silver Photo Frame - FrameShop', 'Sophisticated silver photo frame for special occasions'),

-- Art Frames
('Professional Canvas Frame', 'professional-canvas-frame', 'High-quality frame designed specifically for canvas artwork. Features a deep profile to accommodate stretched canvases and includes hanging hardware. Perfect for galleries and art enthusiasts.', 'Professional frame for canvas artwork', 89.99, 109.99, 2, 'CF-001', 12, 3, 2.1, '16x20 inches', 'active', TRUE, 'canvas,professional,art,gallery', 'Professional Canvas Frame - FrameShop', 'High-quality canvas frame for artwork and paintings'),

('Ornate Gold Art Frame', 'ornate-gold-art-frame', 'Luxurious gold-finished frame with ornate baroque-style detailing. Perfect for classical artwork, oil paintings, and formal portraits. Hand-finished with attention to every detail.', 'Ornate gold frame with baroque styling', 129.99, 159.99, 2, 'GF-001', 8, 2, 3.2, '18x24 inches', 'active', TRUE, 'gold,ornate,baroque,luxury,classical', 'Ornate Gold Art Frame - FrameShop', 'Luxurious gold art frame with baroque detailing'),

('Minimalist Black Frame', 'minimalist-black-frame', 'Clean and simple black frame perfect for contemporary art and photography. The minimalist design ensures your artwork takes center stage while providing elegant presentation.', 'Simple black frame for contemporary art', 34.99, 44.99, 2, 'BF-001', 20, 4, 1.1, '11x14 inches', 'active', FALSE, 'black,minimalist,contemporary,simple', 'Minimalist Black Art Frame - FrameShop', 'Clean minimalist black frame for contemporary artwork'),

-- Digital Frames
('Smart WiFi Digital Frame', 'smart-wifi-digital-frame', 'Advanced digital photo frame with WiFi connectivity, mobile app control, and cloud storage integration. Display your photos from anywhere in the world and share memories with family instantly.', 'WiFi-enabled digital frame with app control', 199.99, 249.99, 3, 'DF-001', 10, 2, 1.8, '10.1 inch display', 'active', TRUE, 'digital,wifi,smart,app,cloud', 'Smart WiFi Digital Photo Frame - FrameShop', 'Advanced digital frame with WiFi and mobile app'),

('HD Digital Photo Frame', 'hd-digital-photo-frame', 'High-definition digital frame with crystal-clear display and easy-to-use interface. Supports multiple image formats and includes remote control for convenient operation.', 'HD digital frame with remote control', 149.99, 179.99, 3, 'DF-002', 15, 3, 1.5, '8 inch HD display', 'active', TRUE, 'digital,hd,remote,clear,easy', 'HD Digital Photo Frame - FrameShop', 'High-definition digital photo frame with remote control'),

-- Wall Frames
('Large Decorative Wall Frame', 'large-decorative-wall-frame', 'Impressive large-format frame perfect for statement pieces and wall art. Sturdy construction with secure mounting hardware included. Transform any wall into a gallery space.', 'Large decorative frame for wall mounting', 79.99, 99.99, 4, 'WLF-001', 6, 2, 4.5, '24x36 inches', 'active', TRUE, 'large,decorative,wall,statement,gallery', 'Large Decorative Wall Frame - FrameShop', 'Impressive large wall frame for statement artwork'),

('Rustic Barn Wood Frame', 'rustic-barn-wood-frame', 'Authentic reclaimed barn wood frame with natural weathering and character. Each piece is unique with its own history and charm. Perfect for farmhouse and rustic decor styles.', 'Reclaimed barn wood frame with rustic charm', 65.99, 85.99, 4, 'RWF-001', 8, 2, 3.8, '20x24 inches', 'active', FALSE, 'rustic,barn,wood,reclaimed,farmhouse', 'Rustic Barn Wood Frame - FrameShop', 'Authentic reclaimed barn wood frame for rustic decor'),

-- Vintage Frames
('Antique Brass Vintage Frame', 'antique-brass-vintage-frame', 'Authentic vintage-style frame with aged brass finish and intricate Victorian-era detailing. Perfect for vintage photographs, certificates, and classical artwork.', 'Vintage brass frame with Victorian detailing', 95.99, 119.99, 5, 'VF-001', 5, 1, 2.7, '12x16 inches', 'active', TRUE, 'vintage,brass,antique,victorian,classical', 'Antique Brass Vintage Frame - FrameShop', 'Authentic vintage brass frame with Victorian styling'),

('Ornate Victorian Frame', 'ornate-victorian-frame', 'Elaborate Victorian-style frame with hand-carved details and gold leaf accents. A true masterpiece that adds grandeur to any artwork or photograph.', 'Hand-carved Victorian frame with gold accents', 189.99, 229.99, 5, 'VF-002', 3, 1, 4.2, '14x18 inches', 'active', TRUE, 'victorian,ornate,carved,gold,masterpiece', 'Ornate Victorian Frame - FrameShop', 'Elaborate Victorian frame with hand-carved details'),

-- Collage Frames
('Multi-Photo Collage Frame', 'multi-photo-collage-frame', 'Display multiple memories in one beautiful frame. Features 9 individual photo slots with matting for a professional gallery look. Perfect for family photos and special events.', 'Collage frame for 9 photos with matting', 55.99, 69.99, 6, 'COL-001', 12, 3, 2.3, '20x16 inches overall', 'active', TRUE, 'collage,multi,family,gallery,matting', 'Multi-Photo Collage Frame - FrameShop', 'Beautiful collage frame for displaying multiple photos'),

('Family Tree Collage Frame', 'family-tree-collage-frame', 'Unique tree-shaped collage frame perfect for displaying family photos. Features 12 circular photo openings arranged in a decorative tree pattern.', 'Tree-shaped collage frame for family photos', 75.99, 89.99, 6, 'COL-002', 7, 2, 1.9, '18x24 inches', 'active', FALSE, 'family,tree,collage,circular,decorative', 'Family Tree Collage Frame - FrameShop', 'Unique tree-shaped frame for family photo display'),

-- Custom Frames
('Custom Size Photo Frame', 'custom-size-photo-frame', 'Made-to-order frame in any size you need. Choose from various materials, colors, and finishes to create the perfect frame for your specific requirements.', 'Custom-made frame in any size', 99.99, 129.99, 7, 'CUSTOM-001', 0, 0, 0.0, 'Custom dimensions', 'active', TRUE, 'custom,made-to-order,any-size,personalized', 'Custom Size Photo Frame - FrameShop', 'Made-to-order custom frames in any size you need'),

-- Mirror Frames
('Decorative Mirror Frame', 'decorative-mirror-frame', 'Elegant frame designed specifically for mirrors. Features beveled edges and decorative corner accents. Transform any mirror into a stunning focal point.', 'Decorative frame designed for mirrors', 119.99, 149.99, 8, 'MIR-001', 4, 1, 5.1, '30x40 inches', 'active', TRUE, 'mirror,decorative,beveled,elegant,focal', 'Decorative Mirror Frame - FrameShop', 'Elegant decorative frame designed for mirrors');

-- =============================================
-- 4. INSERT PRODUCT IMAGES
-- =============================================
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
-- Classic Wooden Photo Frame
(1, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f635487f-0217-452f-803e-6df8f1c3da56.png', 'Classic wooden photo frame front view', 1, TRUE),
(1, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/aed4a941-5a0d-42f4-88de-4bb75b9d3c9a.png', 'Classic wooden photo frame side angle', 2, FALSE),

-- Modern Metal Photo Frame
(2, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3da13e42-da9f-4372-aefd-e7a24616908a.png', 'Modern metal photo frame with brushed finish', 1, TRUE),
(2, 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a11a6db7-054c-4b3f-8a0f-cc89af4e7005.png', 'Modern metal photo frame detail view', 2, FALSE),

-- Add more images for other products (using placeholder URLs for remaining products)
(3, 'https://placehold.co/600x400?text=Elegant+Silver+Photo+Frame', 'Elegant silver photo frame with intricate detailing', 1, TRUE),
(4, 'https://placehold.co/600x400?text=Professional+Canvas+Frame', 'Professional canvas frame for artwork', 1, TRUE),
(5, 'https://placehold.co/600x400?text=Ornate+Gold+Art+Frame', 'Ornate gold art frame with baroque styling', 1, TRUE),
(6, 'https://placehold.co/600x400?text=Minimalist+Black+Frame', 'Minimalist black frame for contemporary art', 1, TRUE),
(7, 'https://placehold.co/600x400?text=Smart+WiFi+Digital+Frame', 'Smart WiFi digital photo frame', 1, TRUE),
(8, 'https://placehold.co/600x400?text=HD+Digital+Photo+Frame', 'HD digital photo frame with remote', 1, TRUE),
(9, 'https://placehold.co/600x400?text=Large+Decorative+Wall+Frame', 'Large decorative wall frame', 1, TRUE),
(10, 'https://placehold.co/600x400?text=Rustic+Barn+Wood+Frame', 'Rustic barn wood frame with natural weathering', 1, TRUE),
(11, 'https://placehold.co/600x400?text=Antique+Brass+Vintage+Frame', 'Antique brass vintage frame', 1, TRUE),
(12, 'https://placehold.co/600x400?text=Ornate+Victorian+Frame', 'Ornate Victorian frame with gold accents', 1, TRUE),
(13, 'https://placehold.co/600x400?text=Multi+Photo+Collage+Frame', 'Multi-photo collage frame for 9 photos', 1, TRUE),
(14, 'https://placehold.co/600x400?text=Family+Tree+Collage+Frame', 'Family tree collage frame', 1, TRUE),
(15, 'https://placehold.co/600x400?text=Custom+Size+Photo+Frame', 'Custom size photo frame', 1, TRUE),
(16, 'https://placehold.co/600x400?text=Decorative+Mirror+Frame', 'Decorative mirror frame with beveled edges', 1, TRUE);

-- =============================================
-- 5. INSERT CUSTOMERS
-- =============================================
INSERT INTO customers (name, email, phone, date_of_birth, gender, status, email_verified, phone_verified, registration_source, notes) VALUES
('John Doe', 'john.doe@example.com', '+91 9876543210', '1985-03-15', 'male', 'active', TRUE, TRUE, 'website', 'Regular customer, prefers wooden frames'),
('Jane Smith', 'jane.smith@example.com', '+91 9876543211', '1990-07-22', 'female', 'active', TRUE, FALSE, 'website', 'Interior designer, bulk orders'),
('Mike Johnson', 'mike.johnson@example.com', '+91 9876543212', '1982-11-08', 'male', 'active', TRUE, TRUE, 'social_media', 'Art collector, premium frames only'),
('Sarah Wilson', 'sarah.wilson@example.com', '+91 9876543213', '1995-01-30', 'female', 'active', FALSE, FALSE, 'website', 'New customer'),
('David Brown', 'david.brown@example.com', '+91 9876543214', '1988-09-12', 'male', 'inactive', TRUE, TRUE, 'referral', 'Cancelled last order'),
('Emily Davis', 'emily.davis@example.com', '+91 9876543215', '1992-05-18', 'female', 'active', TRUE, TRUE, 'website', 'Photography enthusiast'),
('Robert Miller', 'robert.miller@example.com', '+91 9876543216', '1980-12-03', 'male', 'active', TRUE, FALSE, 'website', 'Corporate client'),
('Lisa Anderson', 'lisa.anderson@example.com', '+91 9876543217', '1987-08-25', 'female', 'active', TRUE, TRUE, 'social_media', 'Frequent buyer'),
('James Taylor', 'james.taylor@example.com', '+91 9876543218', '1993-04-14', 'male', 'active', FALSE, TRUE, 'website', 'Gift buyer'),
('Maria Garcia', 'maria.garcia@example.com', '+91 9876543219', '1991-10-07', 'female', 'active', TRUE, TRUE, 'referral', 'Recommended by Jane Smith');

-- =============================================
-- 6. INSERT CUSTOMER ADDRESSES
-- =============================================
INSERT INTO customer_addresses (customer_id, type, first_name, last_name, company, address_line_1, address_line_2, city, state, postal_code, country, phone, is_default) VALUES
-- John Doe addresses
(1, 'shipping', 'John', 'Doe', NULL, '123 Main Street', 'Apartment 4B', 'Mumbai', 'Maharashtra', '400001', 'India', '+91 9876543210', TRUE),
(1, 'billing', 'John', 'Doe', NULL, '123 Main Street', 'Apartment 4B', 'Mumbai', 'Maharashtra', '400001', 'India', '+91 9876543210', TRUE),

-- Jane Smith addresses
(2, 'shipping', 'Jane', 'Smith', 'Smith Interiors', '456 Oak Avenue', 'Suite 200', 'Delhi', 'Delhi', '110001', 'India', '+91 9876543211', TRUE),
(2, 'billing', 'Jane', 'Smith', 'Smith Interiors', '456 Oak Avenue', 'Suite 200', 'Delhi', 'Delhi', '110001', 'India', '+91 9876543211', TRUE),

-- Mike Johnson addresses
(3, 'shipping', 'Mike', 'Johnson', NULL, '789 Pine Street', NULL, 'Bangalore', 'Karnataka', '560001', 'India', '+91 9876543212', TRUE),

-- Sarah Wilson addresses
(4, 'shipping', 'Sarah', 'Wilson', NULL, '321 Elm Street', 'Floor 3', 'Chennai', 'Tamil Nadu', '600001', 'India', '+91 9876543213', TRUE),

-- Emily Davis addresses
(6, 'shipping', 'Emily', 'Davis', 'Davis Photography', '987 Cedar Lane', NULL, 'Hyderabad', 'Telangana', '500001', 'India', '+91 9876543215', TRUE),

-- Robert Miller addresses
(7, 'shipping', 'Robert', 'Miller', 'Miller Corp', '147 Business Park', 'Building A', 'Pune', 'Maharashtra', '411001', 'India', '+91 9876543216', TRUE),

-- Lisa Anderson addresses
(8, 'shipping', 'Lisa', 'Anderson', NULL, '258 Rose Garden', 'Villa 12', 'Kolkata', 'West Bengal', '700001', 'India', '+91 9876543217', TRUE),

-- James Taylor addresses
(9, 'shipping', 'James', 'Taylor', NULL, '369 Sunset Boulevard', NULL, 'Ahmedabad', 'Gujarat', '380001', 'India', '+91 9876543218', TRUE),

-- Maria Garcia addresses
(10, 'shipping', 'Maria', 'Garcia', NULL, '741 Garden Street', 'Flat 5A', 'Jaipur', 'Rajasthan', '302001', 'India', '+91 9876543219', TRUE);

-- =============================================
-- 7. INSERT SAMPLE ORDERS
-- =============================================
INSERT INTO orders (
    order_number, customer_id, customer_email, customer_phone,
    status, fulfillment_status, subtotal, tax_amount, shipping_amount, 
    discount_amount, total_amount, payment_status, payment_method,
    shipping_first_name, shipping_last_name, shipping_address_line_1,
    shipping_city, shipping_state, shipping_postal_code, shipping_country,
    billing_first_name, billing_last_name, billing_address_line_1,
    billing_city, billing_state, billing_postal_code, billing_country,
    notes, created_at
) VALUES
('ORD-2024-001', 1, 'john.doe@example.com', '+91 9876543210', 'delivered', 'fulfilled', 59.98, 10.80, 0.00, 0.00, 70.78, 'paid', 'razorpay', 'John', 'Doe', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', 'India', 'John', 'Doe', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', 'India', 'Customer requested express delivery', '2024-01-15 10:30:00'),

('ORD-2024-002', 2, 'jane.smith@example.com', '+91 9876543211', 'delivered', 'fulfilled', 149.98, 27.00, 0.00, 15.00, 161.98, 'paid', 'razorpay', 'Jane', 'Smith', '456 Oak Avenue', 'Delhi', 'Delhi', '110001', 'India', 'Jane', 'Smith', '456 Oak Avenue', 'Delhi', 'Delhi', '110001', 'India', 'Bulk order for interior design project', '2024-01-14 14:20:00'),

('ORD-2024-003', 3, 'mike.johnson@example.com', '+91 9876543212', 'shipped', 'partial', 189.99, 34.20, 50.00, 0.00, 274.19, 'paid', 'razorpay', 'Mike', 'Johnson', '789 Pine Street', 'Bangalore', 'Karnataka', '560001', 'India', 'Mike', 'Johnson', '789 Pine Street', 'Bangalore', 'Karnataka', '560001', 'India', 'Premium frame for art collection', '2024-01-16 09:15:00'),

('ORD-2024-004', 4, 'sarah.wilson@example.com', '+91 9876543213', 'processing', 'unfulfilled', 29.99, 5.40, 50.00, 0.00, 85.39, 'paid', 'razorpay', 'Sarah', 'Wilson', '321 Elm Street', 'Chennai', 'Tamil Nadu', '600001', 'India', 'Sarah', 'Wilson', '321 Elm Street', 'Chennai', 'Tamil Nadu', '600001', 'India', 'First order from new customer', '2024-01-18 16:45:00'),

('ORD-2024-005', 6, 'emily.davis@example.com', '+91 9876543215', 'delivered', 'fulfilled', 199.99, 36.00, 0.00, 20.00, 215.99, 'paid', 'razorpay', 'Emily', 'Davis', '987 Cedar Lane', 'Hyderabad', 'Telangana', '500001', 'India', 'Emily', 'Davis', '987 Cedar Lane', 'Hyderabad', 'Telangana', '500001', 'India', 'Digital frame for photography studio', '2024-01-12 11:30:00'),

('ORD-2024-006', 7, 'robert.miller@example.com', '+91 9876543216', 'delivered', 'fulfilled', 319.96, 57.59, 0.00, 0.00, 377.55, 'paid', 'razorpay', 'Robert', 'Miller', '147 Business Park', 'Pune', 'Maharashtra', '411001', 'India', 'Robert', 'Miller', '147 Business Park', 'Pune', 'Maharashtra', '411001', 'India', 'Corporate order for office decoration', '2024-01-10 13:20:00'),

('ORD-2024-007', 8, 'lisa.anderson@example.com', '+91 9876543217', 'cancelled', 'unfulfilled', 75.99, 13.68, 50.00, 0.00, 139.67, 'refunded', 'razorpay', 'Lisa', 'Anderson', '258 Rose Garden', 'Kolkata', 'West Bengal', '700001', 'India', 'Lisa', 'Anderson', '258 Rose Garden', 'Kolkata', 'West Bengal', '700001', 'India', 'Customer changed mind about size', '2024-01-17 08:10:00'),

('ORD-2024-008', 9, 'james.taylor@example.com', '+91 9876543218', 'pending', 'unfulfilled', 95.99, 17.28, 50.00, 0.00, 163.27, 'pending', 'razorpay', 'James', 'Taylor', '369 Sunset Boulevard', 'Ahmedabad', 'Gujarat', '380001', 'India', 'James', 'Taylor', '369 Sunset Boulevard', 'Ahmedabad', 'Gujarat', '380001', 'India', 'Gift order for anniversary', '2024-01-19 19:25:00'),

('ORD-2024-009', 10, 'maria.garcia@example.com', '+91 9876543219', 'delivered', 'fulfilled', 129.99, 23.40, 0.00, 13.00, 140.39, 'paid', 'razorpay', 'Maria', 'Garcia', '741 Garden Street', 'Jaipur', 'Rajasthan', '302001', 'India', 'Maria', 'Garcia', '741 Garden Street', 'Jaipur', 'Rajasthan', '302001', 'India', 'Referral from Jane Smith', '2024-01-13 15:50:00'),

('ORD-2024-010', 1, 'john.doe@example.com', '+91 9876543210', 'delivered', 'fulfilled', 45.99, 8.28, 0.00, 0.00, 54.27, 'paid', 'razorpay', 'John', 'Doe', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', 'India', 'John', 'Doe', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', 'India', 'Repeat customer order', '2024-01-20 12:15:00');

-- =============================================
-- 8. INSERT ORDER ITEMS
-- =============================================
INSERT INTO order_items (order_id, product_id, product_title, product_sku, quantity, unit_price, total_price, product_data) VALUES
-- Order 1 items
(1, 1, 'Classic Wooden Photo Frame', 'WF-001', 2, 29.99, 59.98, '{"id": 1, "title": "Classic Wooden Photo Frame", "price": 29.99, "image": "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f635487f-0217-452f-803e-6df8f1c3da56.png"}'),

-- Order 2 items
(2, 2, 'Modern Metal Photo Frame', 'MF-001', 3, 24.99, 74.97, '{"id": 2, "title": "Modern Metal Photo Frame", "price": 24.99}'),
(2, 6, 'Minimalist Black Frame', 'BF-001', 2, 34.99, 69.98, '{"id": 6, "title": "Minimalist Black Frame", "price": 34.99}'),
(2, 3, 'Elegant Silver Photo Frame', 'SF-001', 1, 45.99, 45.99, '{"id": 3, "title": "Elegant Silver Photo Frame", "price": 45.99}'),

-- Order 3 items
(3, 12, 'Ornate Victorian Frame', 'VF-002', 1, 189.99, 189.99, '{"id": 12, "title": "Ornate Victorian Frame", "price": 189.99}'),

-- Order 4 items
(4, 1, 'Classic Wooden Photo Frame', 'WF-001', 1, 29.99, 29.99, '{"id": 1, "title": "Classic Wooden Photo Frame", "price": 29.99}'),

-- Order 5 items
(5, 7, 'Smart WiFi Digital Frame', 'DF-001', 1, 199.99, 199.99, '{"id": 7, "title": "Smart WiFi Digital Frame", "price": 199.99}'),

-- Order 6 items
(6, 9, 'Large Decorative Wall Frame', 'WLF-001', 2, 79.99, 159.98, '{"id": 9, "title": "Large Decorative Wall Frame", "price": 79.99}'),
(6, 6, 'Minimalist Black Frame', 'BF-001', 4, 34.99, 139.96, '{"id": 6, "title": "Minimalist Black Frame", "price": 34.99}'),
(6, 2, 'Modern Metal Photo Frame', 'MF-001', 1, 24.99, 24.99, '{"id": 2, "title": "Modern Metal Photo Frame", "price": 24.99}'),

-- Order 7 items (cancelled)
(7, 14, 'Family Tree Collage Frame', 'COL-002', 1, 75.99, 75.99, '{"id": 14, "title": "Family Tree Collage Frame", "price": 75.99}'),

-- Order 8 items
(8, 11, 'Antique Brass Vintage Frame', 'VF-001', 1, 95.99, 95.99, '{"id": 11, "title": "Antique Brass Vintage Frame", "price": 95.99}'),

-- Order 9 items
(9, 5, 'Ornate Gold Art Frame', 'GF-001', 1, 129.99, 129.99, '{"id": 5, "title": "Ornate Gold Art Frame", "price": 129.99}'),

-- Order 10 items
(10, 3, 'Elegant Silver Photo Frame', 'SF-001', 1, 45.99, 45.99, '{"id": 3, "title": "Elegant Silver Photo Frame", "price": 45.99}');

-- =============================================
-- 9. INSERT COUPONS
-- =============================================
INSERT INTO coupons (code, type, value, minimum_amount, maximum_discount, usage_limit, used_count, status, starts_at, expires_at) VALUES
('WELCOME10', 'percentage', 10.00, 100.00, 50.00, 100, 15, 'active', '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('SAVE20', 'percentage', 20.00, 500.00, 100.00, 50, 8, 'active', '2024-01-01 00:00:00', '2024-06-30 23:59:59'),
('FLAT50', 'fixed_amount', 50.00, 200.00, NULL, 200, 25, 'active', '2024-01-01 00:00:00', '2024-03-31 23:59:59'),
('NEWUSER15', 'percentage', 15.00, 150.00, 75.00, NULL, 42, 'active', '2024-01-01 00:00:00', NULL),
('BULK25', 'percentage', 25.00, 1000.00, 250.00, 20, 3, 'active', '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('EXPIRED10', 'percentage', 10.00, 100.00, 30.00, 50, 50, 'inactive', '2023-01-01 00:00:00', '2023-12-31 23:59:59');

-- =============================================
-- 10. UPDATE CUSTOMER STATISTICS
-- =============================================
-- Update customer statistics based on orders
UPDATE customers c
SET 
    total_orders = (
        SELECT COUNT(*) 
        FROM orders o 
        WHERE o.customer_id = c.id AND o.status != 'cancelled'
    ),
    total_spent = (
        SELECT COALESCE(SUM(o.total_amount), 0) 
        FROM orders o 
        WHERE o.customer_id = c.id AND o.status IN ('delivered', 'processing', 'shipped')
    ),
    last_order_date = (
        SELECT MAX(o.created_at) 
        FROM orders o 
        WHERE o.customer_id = c.id
    );

-- Update average order value
UPDATE customers 
SET average_order_value = CASE 
    WHEN total_orders > 0 THEN total_spent / total_orders 
    ELSE 0 
END;

-- =============================================
-- 11. INSERT ADMIN LOGS (Sample Activity)
-- =============================================
INSERT INTO admin_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) VALUES
(1, 'CREATE', 'products', 1, NULL, '{"title": "Classic Wooden Photo Frame", "price": 29.99, "status": "active"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'UPDATE', 'orders', 1, '{"status": "pending"}', '{"status": "processing"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'UPDATE', 'orders', 1, '{"status": "processing"}', '{"status": "shipped"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'UPDATE', 'orders', 1, '{"status": "shipped"}', '{"status": "delivered"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(2, 'CREATE', 'categories', 1, NULL, '{"name": "Photo Frames", "status": "active"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(1, 'UPDATE', 'products', 5, '{"stock_quantity": 10}', '{"stock_quantity": 8}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'DELETE', 'coupons', 6, '{"code": "EXPIRED10", "status": "active"}', NULL, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- =============================================
-- 12. INSERT ORDER STATUS HISTORY
-- =============================================
INSERT INTO order_status_history (order_id, status, notes, created_by) VALUES
-- Order 1 history
(1, 'pending', 'Order placed successfully', NULL),
(1, 'processing', 'Payment confirmed, preparing for shipment', 1),
(1, 'shipped', 'Order shipped via Blue Dart - Tracking: BD123456789', 1),
(1, 'delivered', 'Order delivered successfully', 1),

-- Order 2 history
(2, 'pending', 'Order placed successfully', NULL),
(2, 'processing', 'Payment confirmed, bulk order processing', 1),
(2, 'shipped', 'Order shipped in multiple packages', 1),
(2, 'delivered', 'All packages delivered', 1),

-- Order 3 history
(3, 'pending', 'Order placed successfully', NULL),
(3, 'processing', 'Payment confirmed, premium frame being prepared', 1),
(3, 'shipped', 'Order shipped with special packaging', 1),

-- Order 4 history
(4, 'pending', 'Order placed successfully', NULL),
(4, 'processing', 'Payment confirmed, processing new customer order', 1),

-- Order 5 history
(5, 'pending', 'Order placed successfully', NULL),
(5, 'processing', 'Payment confirmed, digital frame being configured', 1),
(5, 'shipped', 'Order shipped with setup instructions', 1),
(5, 'delivered', 'Order delivered, customer satisfied', 1),

-- Order 6 history
(6, 'pending', 'Order placed successfully', NULL),
(6, 'processing', 'Payment confirmed, corporate order processing', 1),
(6, 'shipped', 'Bulk order shipped to business address', 1),
(6, 'delivered', 'Corporate delivery completed', 1),

-- Order 7 history (cancelled)
(7, 'pending', 'Order placed successfully', NULL),
(7, 'cancelled', 'Customer requested cancellation due to size concerns', 1),

-- Order 8 history
(8, 'pending', 'Order placed successfully, awaiting payment confirmation', NULL),

-- Order 9 history
(9, 'pending', 'Order placed successfully', NULL),
(9, 'processing', 'Payment confirmed, gold frame being prepared', 1),
(9, 'shipped', 'Order shipped with protective packaging', 1),
(9, 'delivered', 'Premium frame delivered safely', 1),

-- Order 10 history
(10, 'pending', 'Order placed successfully', NULL),
(10, 'processing', 'Payment confirmed, repeat customer order', 1),
(10, 'shipped', 'Order shipped to regular customer', 1),
(10, 'delivered', 'Order delivered, customer happy with quality', 1);

-- =============================================
-- 13. ADDITIONAL SAMPLE DATA FOR TESTING
-- =============================================

-- Insert more recent orders for better analytics
INSERT INTO orders (
    order_number, customer_id, customer_email, customer_phone,
    status, fulfillment_status, subtotal, tax_amount, shipping_amount, 
    discount_amount, total_amount, payment_status, payment_method,
    shipping_first_name, shipping_last_name, shipping_address_line_1,
    shipping_city, shipping_state, shipping_postal_code, shipping_country,
    notes, created_at
) VALUES
('ORD-2024-011', 2, 'jane.smith@example.com', '+91 9876543211', 'processing', 'unfulfilled', 199.98, 36.00, 0.00, 20.00, 215.98, 'paid', 'razorpay', 'Jane', 'Smith', '456 Oak Avenue', 'Delhi', 'Delhi', '110001', 'India', 'Another bulk order for client project', NOW() - INTERVAL 2 DAY),

('ORD-2024-012', 6, 'emily.davis@example.com', '+91 9876543215', 'shipped', 'partial', 149.99, 27.00, 0.00, 0.00, 176.99, 'paid', 'razorpay', 'Emily', 'Davis', '987 Cedar Lane', 'Hyderabad', 'Telangana', '500001', 'India', 'Digital frame for studio expansion', NOW() - INTERVAL 1 DAY),

('ORD-2024-013', 8, 'lisa.anderson@example.com', '+91 9876543217', 'delivered', 'fulfilled', 89.98, 16.20, 0.00, 9.00, 97.18, 'paid', 'razorpay', 'Lisa', 'Anderson', '258 Rose Garden', 'Kolkata', 'West Bengal', '700001', 'India', 'Replacement order after cancellation', NOW() - INTERVAL 3 HOUR),

('ORD-2024-014', 3, 'mike.johnson@example.com', '+91 9876543212', 'pending', 'unfulfilled', 319.98, 57.60, 0.00, 32.00, 345.58, 'pending', 'razorpay', 'Mike', 'Johnson', '789 Pine Street', 'Bangalore', 'Karnataka', '560001', 'India', 'Large art collection order', NOW() - INTERVAL 1 HOUR);

-- Insert corresponding order items for recent orders
INSERT INTO order_items (order_id, product_id, product_title, product_sku, quantity, unit_price, total_price, product_data) VALUES
-- Order 11 items
(11, 8, 'HD Digital Photo Frame', 'DF-002', 1, 149.99, 149.99, '{"id": 8, "title": "HD Digital Photo Frame", "price": 149.99}'),
(11, 2, 'Modern Metal Photo Frame', 'MF-001', 2, 24.99, 49.99, '{"id": 2, "title": "Modern Metal Photo Frame", "price": 24.99}'),

-- Order 12 items
(12, 8, 'HD Digital Photo Frame', 'DF-002', 1, 149.99, 149.99, '{"id": 8, "title": "HD Digital Photo Frame", "price": 149.99}'),

-- Order 13 items
(13, 1, 'Classic Wooden Photo Frame', 'WF-001', 2, 29.99, 59.98, '{"id": 1, "title": "Classic Wooden Photo Frame", "price": 29.99}'),
(13, 2, 'Modern Metal Photo Frame', 'MF-001', 1, 24.99, 24.99, '{"id": 2, "title": "Modern Metal Photo Frame", "price": 24.99}'),

-- Order 14 items
(14, 5, 'Ornate Gold Art Frame', 'GF-001', 1, 129.99, 129.99, '{"id": 5, "title": "Ornate Gold Art Frame", "price": 129.99}'),
(14, 12, 'Ornate Victorian Frame', 'VF-002', 1, 189.99, 189.99, '{"id": 12, "title": "Ornate Victorian Frame", "price": 189.99}');

-- Update customer statistics again after new orders
UPDATE customers c
SET 
    total_orders = (
        SELECT COUNT(*) 
        FROM orders o 
        WHERE o.customer_id = c.id AND o.status != 'cancelled'
    ),
    total_spent = (
        SELECT COALESCE(SUM(o.total_amount), 0) 
        FROM orders o 
        WHERE o.customer_id = c.id AND o.status IN ('delivered', 'processing', 'shipped')
    ),
    last_order_date = (
        SELECT MAX(o.created_at) 
        FROM orders o 
        WHERE o.customer_id = c.id
    );

UPDATE customers 
SET average_order_value = CASE 
    WHEN total_orders > 0 THEN total_spent / total_orders 
    ELSE 0 
END;

-- =============================================
-- 14. CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================
-- Additional indexes for common queries (if not already created in schema)
CREATE INDEX IF NOT EXISTS idx_orders_created_at_status ON orders(created_at, status);
CREATE INDEX IF NOT EXISTS idx_customers_total_spent ON customers(total_spent DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_order_items_product_quantity ON order_items(product_id, quantity);

-- =============================================
-- 15. VERIFY DATA INTEGRITY
-- =============================================
-- Check that all foreign key relationships are valid
SELECT 'Products without valid category' as check_type, COUNT(*) as count
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id 
WHERE p.category_id IS NOT NULL AND c.id IS NULL

UNION ALL

SELECT 'Orders without valid customer' as check_type, COUNT(*) as count
FROM orders o 
LEFT JOIN customers c ON o.customer_id = c.id 
WHERE o.customer_id IS NOT NULL AND c.id IS NULL

UNION ALL

SELECT 'Order items without valid order' as check_type, COUNT(*) as count
FROM order_items oi 
LEFT JOIN orders o ON oi.order_id = o.id 
WHERE o.id IS NULL

UNION ALL

SELECT 'Order items without valid product' as check_type, COUNT(*) as count
FROM order_items oi 
LEFT JOIN products p ON oi.product_id = p.id 
WHERE oi.product_id IS NOT NULL AND p.id IS NULL;

-- =============================================
-- 16. SUMMARY STATISTICS
-- =============================================
SELECT 'Database Setup Complete' as status;

SELECT 
    'Total Categories' as metric, COUNT(*) as value FROM categories
UNION ALL
SELECT 
    'Total Products' as metric, COUNT(*) as value FROM products
UNION ALL
SELECT 
    'Total Customers' as metric, COUNT(*) as value FROM customers
UNION ALL
SELECT 
    'Total Orders' as metric, COUNT(*) as value FROM orders
UNION ALL
SELECT 
    'Total Order Items' as metric, COUNT(*) as value FROM order_items
UNION ALL
SELECT 
    'Total Revenue' as metric, ROUND(SUM(total_amount), 2) as value 
    FROM orders WHERE status IN ('delivered', 'processing', 'shipped')
UNION ALL
SELECT 
    'Active Coupons' as metric, COUNT(*) as value FROM coupons WHERE status = 'active';

-- Show sample data verification
SELECT 'Sample Data Verification:' as info;
SELECT c.name as category, COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.sort_order;

-- =============================================
-- END OF SAMPLE DATA SCRIPT
-- =============================================
