-- FrameShop E-Commerce Database Stored Procedures
-- MySQL Stored Procedures for Common Operations

USE frameshop;

-- Drop existing procedures if they exist
DROP PROCEDURE IF EXISTS GetProductDetails;
DROP PROCEDURE IF EXISTS CreateOrder;
DROP PROCEDURE IF EXISTS UpdateOrderStatus;
DROP PROCEDURE IF EXISTS GetCustomerOrders;
DROP PROCEDURE IF EXISTS GetSalesReport;
DROP PROCEDURE IF EXISTS UpdateProductStock;
DROP PROCEDURE IF EXISTS GetLowStockProducts;
DROP PROCEDURE IF EXISTS GetTopSellingProducts;
DROP PROCEDURE IF EXISTS GetCustomerAnalytics;
DROP PROCEDURE IF EXISTS CreateCustomer;
DROP PROCEDURE IF EXISTS GetOrderDetails;
DROP PROCEDURE IF EXISTS CancelOrder;
DROP PROCEDURE IF EXISTS GetDashboardStats;
DROP PROCEDURE IF EXISTS SearchProducts;
DROP PROCEDURE IF EXISTS ApplyCoupon;
DROP PROCEDURE IF EXISTS GetCategoryProducts;

DELIMITER //

-- =============================================
-- 1. GET PRODUCT DETAILS WITH IMAGES AND CATEGORY
-- =============================================
CREATE PROCEDURE GetProductDetails(IN product_id INT)
BEGIN
    SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order) as images,
        (SELECT COUNT(*) FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = p.id AND o.status IN ('delivered', 'processing', 'shipped')) as total_sold,
        CASE 
            WHEN p.stock_quantity <= p.low_stock_threshold THEN 'low'
            WHEN p.stock_quantity = 0 THEN 'out_of_stock'
            ELSE 'in_stock'
        END as stock_status
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.id = product_id AND p.status = 'active'
    GROUP BY p.id;
END//

-- =============================================
-- 2. CREATE ORDER WITH ITEMS
-- =============================================
CREATE PROCEDURE CreateOrder(
    IN p_customer_id INT,
    IN p_customer_email VARCHAR(255),
    IN p_customer_phone VARCHAR(20),
    IN p_subtotal DECIMAL(10,2),
    IN p_tax_amount DECIMAL(10,2),
    IN p_shipping_amount DECIMAL(10,2),
    IN p_discount_amount DECIMAL(10,2),
    IN p_total_amount DECIMAL(10,2),
    IN p_payment_method VARCHAR(50),
    IN p_shipping_address JSON,
    IN p_billing_address JSON,
    IN p_order_items JSON,
    OUT p_order_id INT,
    OUT p_order_number VARCHAR(50)
)
BEGIN
    DECLARE v_order_number VARCHAR(50);
    DECLARE v_item JSON;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_items_count INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Generate order number
    SET v_order_number = CONCAT('ORD-', YEAR(NOW()), '-', LPAD(FLOOR(RAND() * 999999), 6, '0'));
    
    -- Insert order
    INSERT INTO orders (
        order_number, customer_id, customer_email, customer_phone,
        subtotal, tax_amount, shipping_amount, discount_amount, total_amount,
        payment_method, status, payment_status,
        shipping_first_name, shipping_last_name, shipping_address_line_1, 
        shipping_address_line_2, shipping_city, shipping_state, 
        shipping_postal_code, shipping_country, shipping_phone,
        billing_first_name, billing_last_name, billing_address_line_1,
        billing_address_line_2, billing_city, billing_state,
        billing_postal_code, billing_country, billing_phone
    ) VALUES (
        v_order_number, p_customer_id, p_customer_email, p_customer_phone,
        p_subtotal, p_tax_amount, p_shipping_amount, p_discount_amount, p_total_amount,
        p_payment_method, 'pending', 'pending',
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.firstName')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.lastName')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.addressLine1')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.addressLine2')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.city')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.state')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.postalCode')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.country')),
        JSON_UNQUOTE(JSON_EXTRACT(p_shipping_address, '$.phone')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.firstName')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.lastName')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.addressLine1')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.addressLine2')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.city')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.state')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.postalCode')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.country')),
        JSON_UNQUOTE(JSON_EXTRACT(p_billing_address, '$.phone'))
    );
    
    SET p_order_id = LAST_INSERT_ID();
    SET p_order_number = v_order_number;
    
    -- Insert order items
    SET v_items_count = JSON_LENGTH(p_order_items);
    WHILE v_i < v_items_count DO
        SET v_item = JSON_EXTRACT(p_order_items, CONCAT('$[', v_i, ']'));
        
        INSERT INTO order_items (
            order_id, product_id, product_title, product_sku,
            quantity, unit_price, total_price, product_data
        ) VALUES (
            p_order_id,
            JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.productId')),
            JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.title')),
            JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.sku')),
            JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.quantity')),
            JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.price')),
            JSON_UNQUOTE(JSON_EXTRACT(v_item, '$.total')),
            v_item
        );
        
        SET v_i = v_i + 1;
    END WHILE;

    COMMIT;
END//

-- =============================================
-- 3. UPDATE ORDER STATUS
-- =============================================
CREATE PROCEDURE UpdateOrderStatus(
    IN p_order_id INT,
    IN p_status VARCHAR(50),
    IN p_notes TEXT,
    IN p_user_id INT
)
BEGIN
    DECLARE v_old_status VARCHAR(50);
    
    SELECT status INTO v_old_status FROM orders WHERE id = p_order_id;
    
    UPDATE orders 
    SET 
        status = p_status,
        internal_notes = CONCAT(COALESCE(internal_notes, ''), '\n', NOW(), ' - ', p_notes),
        shipped_at = CASE WHEN p_status = 'shipped' THEN NOW() ELSE shipped_at END,
        delivered_at = CASE WHEN p_status = 'delivered' THEN NOW() ELSE delivered_at END,
        cancelled_at = CASE WHEN p_status = 'cancelled' THEN NOW() ELSE cancelled_at END
    WHERE id = p_order_id;
    
    -- Log status change
    INSERT INTO order_status_history (order_id, status, notes, created_by)
    VALUES (p_order_id, p_status, p_notes, p_user_id);
    
    SELECT 'Order status updated successfully' as message;
END//

-- =============================================
-- 4. GET CUSTOMER ORDERS
-- =============================================
CREATE PROCEDURE GetCustomerOrders(
    IN p_customer_id INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        o.*,
        COUNT(oi.id) as item_count,
        SUM(oi.quantity) as total_quantity
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.customer_id = p_customer_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT p_limit OFFSET p_offset;
    
    -- Get total count
    SELECT COUNT(*) as total_orders FROM orders WHERE customer_id = p_customer_id;
END//

-- =============================================
-- 5. GET SALES REPORT
-- =============================================
CREATE PROCEDURE GetSalesReport(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_group_by VARCHAR(10) -- 'day', 'week', 'month'
)
BEGIN
    IF p_group_by = 'day' THEN
        SELECT 
            DATE(created_at) as period,
            COUNT(*) as order_count,
            SUM(total_amount) as revenue,
            AVG(total_amount) as avg_order_value,
            COUNT(DISTINCT customer_id) as unique_customers
        FROM orders 
        WHERE DATE(created_at) BETWEEN p_start_date AND p_end_date
        AND status IN ('delivered', 'processing', 'shipped')
        GROUP BY DATE(created_at)
        ORDER BY period;
    ELSEIF p_group_by = 'week' THEN
        SELECT 
            YEARWEEK(created_at) as period,
            COUNT(*) as order_count,
            SUM(total_amount) as revenue,
            AVG(total_amount) as avg_order_value,
            COUNT(DISTINCT customer_id) as unique_customers
        FROM orders 
        WHERE DATE(created_at) BETWEEN p_start_date AND p_end_date
        AND status IN ('delivered', 'processing', 'shipped')
        GROUP BY YEARWEEK(created_at)
        ORDER BY period;
    ELSE -- month
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as period,
            COUNT(*) as order_count,
            SUM(total_amount) as revenue,
            AVG(total_amount) as avg_order_value,
            COUNT(DISTINCT customer_id) as unique_customers
        FROM orders 
        WHERE DATE(created_at) BETWEEN p_start_date AND p_end_date
        AND status IN ('delivered', 'processing', 'shipped')
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY period;
    END IF;
END//

-- =============================================
-- 6. UPDATE PRODUCT STOCK
-- =============================================
CREATE PROCEDURE UpdateProductStock(
    IN p_product_id INT,
    IN p_quantity_change INT,
    IN p_operation VARCHAR(10) -- 'add' or 'subtract'
)
BEGIN
    IF p_operation = 'add' THEN
        UPDATE products 
        SET stock_quantity = stock_quantity + p_quantity_change
        WHERE id = p_product_id;
    ELSE
        UPDATE products 
        SET stock_quantity = GREATEST(0, stock_quantity - p_quantity_change)
        WHERE id = p_product_id;
    END IF;
    
    SELECT stock_quantity FROM products WHERE id = p_product_id;
END//

-- =============================================
-- 7. GET LOW STOCK PRODUCTS
-- =============================================
CREATE PROCEDURE GetLowStockProducts()
BEGIN
    SELECT 
        p.*,
        c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.stock_quantity <= p.low_stock_threshold 
    AND p.status = 'active'
    ORDER BY p.stock_quantity ASC;
END//

-- =============================================
-- 8. GET TOP SELLING PRODUCTS
-- =============================================
CREATE PROCEDURE GetTopSellingProducts(
    IN p_limit INT,
    IN p_days INT
)
BEGIN
    SELECT 
        p.*,
        c.name as category_name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status IN ('delivered', 'processing', 'shipped')
    AND o.created_at >= DATE_SUB(NOW(), INTERVAL p_days DAY)
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT p_limit;
END//

-- =============================================
-- 9. GET CUSTOMER ANALYTICS
-- =============================================
CREATE PROCEDURE GetCustomerAnalytics()
BEGIN
    SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
        COUNT(CASE WHEN total_spent >= 10000 THEN 1 END) as gold_customers,
        COUNT(CASE WHEN total_spent >= 5000 AND total_spent < 10000 THEN 1 END) as silver_customers,
        COUNT(CASE WHEN total_spent < 5000 THEN 1 END) as bronze_customers,
        AVG(total_spent) as avg_customer_value,
        AVG(total_orders) as avg_orders_per_customer,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_customers_30_days
    FROM customers;
END//

-- =============================================
-- 10. CREATE CUSTOMER
-- =============================================
CREATE PROCEDURE CreateCustomer(
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(20),
    OUT p_customer_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    INSERT INTO customers (name, email, phone, status)
    VALUES (p_name, p_email, p_phone, 'active');
    
    SET p_customer_id = LAST_INSERT_ID();
    
    COMMIT;
END//

-- =============================================
-- 11. GET ORDER DETAILS
-- =============================================
CREATE PROCEDURE GetOrderDetails(IN p_order_id INT)
BEGIN
    -- Get order information
    SELECT 
        o.*,
        c.name as customer_name,
        c.phone as customer_phone_alt
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = p_order_id;
    
    -- Get order items
    SELECT 
        oi.*,
        p.title as current_product_title,
        p.status as current_product_status
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = p_order_id;
    
    -- Get status history
    SELECT 
        osh.*,
        u.name as created_by_name
    FROM order_status_history osh
    LEFT JOIN users u ON osh.created_by = u.id
    WHERE osh.order_id = p_order_id
    ORDER BY osh.created_at DESC;
END//

-- =============================================
-- 12. CANCEL ORDER
-- =============================================
CREATE PROCEDURE CancelOrder(
    IN p_order_id INT,
    IN p_reason TEXT,
    IN p_user_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Update order status
    UPDATE orders 
    SET 
        status = 'cancelled',
        cancelled_at = NOW(),
        cancellation_reason = p_reason
    WHERE id = p_order_id;
    
    -- Restore product stock
    UPDATE products p
    JOIN order_items oi ON p.id = oi.product_id
    SET p.stock_quantity = p.stock_quantity + oi.quantity
    WHERE oi.order_id = p_order_id;
    
    -- Log status change
    INSERT INTO order_status_history (order_id, status, notes, created_by)
    VALUES (p_order_id, 'cancelled', p_reason, p_user_id);
    
    COMMIT;
    
    SELECT 'Order cancelled successfully' as message;
END//

-- =============================================
-- 13. GET DASHBOARD STATS
-- =============================================
CREATE PROCEDURE GetDashboardStats()
BEGIN
    -- Overall stats
    SELECT 
        (SELECT COUNT(*) FROM orders WHERE status != 'cancelled') as total_orders,
        (SELECT COUNT(*) FROM customers WHERE status = 'active') as total_customers,
        (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('delivered', 'processing', 'shipped')) as total_revenue,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) as today_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURDATE() AND status != 'cancelled') as today_revenue,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM products WHERE stock_quantity <= low_stock_threshold) as low_stock_products;
    
    -- Recent orders
    SELECT 
        o.id, o.order_number, o.total_amount, o.status, o.created_at,
        COALESCE(c.name, CONCAT(o.shipping_first_name, ' ', o.shipping_last_name)) as customer_name
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
    LIMIT 10;
    
    -- Top products this month
    SELECT 
        p.title,
        SUM(oi.quantity) as sold_quantity,
        SUM(oi.total_price) as revenue
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE MONTH(o.created_at) = MONTH(NOW()) 
    AND YEAR(o.created_at) = YEAR(NOW())
    AND o.status IN ('delivered', 'processing', 'shipped')
    GROUP BY p.id
    ORDER BY sold_quantity DESC
    LIMIT 5;
END//

-- =============================================
-- 14. SEARCH PRODUCTS
-- =============================================
CREATE PROCEDURE SearchProducts(
    IN p_search_term VARCHAR(255),
    IN p_category_id INT,
    IN p_min_price DECIMAL(10,2),
    IN p_max_price DECIMAL(10,2),
    IN p_sort_by VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SET @sql = 'SELECT p.*, c.name as category_name,
                (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.status = "active"';
    
    IF p_search_term IS NOT NULL AND p_search_term != '' THEN
        SET @sql = CONCAT(@sql, ' AND (p.title LIKE "%', p_search_term, '%" OR p.description LIKE "%', p_search_term, '%" OR p.tags LIKE "%', p_search_term, '%")');
    END IF;
    
    IF p_category_id IS NOT NULL AND p_category_id > 0 THEN
        SET @sql = CONCAT(@sql, ' AND p.category_id = ', p_category_id);
    END IF;
    
    IF p_min_price IS NOT NULL AND p_min_price > 0 THEN
        SET @sql = CONCAT(@sql, ' AND p.price >= ', p_min_price);
    END IF;
    
    IF p_max_price IS NOT NULL AND p_max_price > 0 THEN
        SET @sql = CONCAT(@sql, ' AND p.price <= ', p_max_price);
    END IF;
    
    -- Add sorting
    IF p_sort_by = 'price_low' THEN
        SET @sql = CONCAT(@sql, ' ORDER BY p.price ASC');
    ELSEIF p_sort_by = 'price_high' THEN
        SET @sql = CONCAT(@sql, ' ORDER BY p.price DESC');
    ELSEIF p_sort_by = 'name' THEN
        SET @sql = CONCAT(@sql, ' ORDER BY p.title ASC');
    ELSE
        SET @sql = CONCAT(@sql, ' ORDER BY p.created_at DESC');
    END IF;
    
    SET @sql = CONCAT(@sql, ' LIMIT ', p_limit, ' OFFSET ', p_offset);
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END//

-- =============================================
-- 15. APPLY COUPON
-- =============================================
CREATE PROCEDURE ApplyCoupon(
    IN p_coupon_code VARCHAR(50),
    IN p_order_total DECIMAL(10,2),
    OUT p_discount_amount DECIMAL(10,2),
    OUT p_is_valid BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_coupon_id INT;
    DECLARE v_type VARCHAR(20);
    DECLARE v_value DECIMAL(10,2);
    DECLARE v_minimum_amount DECIMAL(10,2);
    DECLARE v_maximum_discount DECIMAL(10,2);
    DECLARE v_usage_limit INT;
    DECLARE v_used_count INT;
    DECLARE v_expires_at TIMESTAMP;
    
    SET p_is_valid = FALSE;
    SET p_discount_amount = 0;
    SET p_message = 'Invalid coupon code';
    
    -- Get coupon details
    SELECT id, type, value, minimum_amount, maximum_discount, usage_limit, used_count, expires_at
    INTO v_coupon_id, v_type, v_value, v_minimum_amount, v_maximum_discount, v_usage_limit, v_used_count, v_expires_at
    FROM coupons 
    WHERE code = p_coupon_code AND status = 'active';
    
    IF v_coupon_id IS NOT NULL THEN
        -- Check if coupon is expired
        IF v_expires_at IS NOT NULL AND v_expires_at < NOW() THEN
            SET p_message = 'Coupon has expired';
        -- Check usage limit
        ELSEIF v_usage_limit IS NOT NULL AND v_used_count >= v_usage_limit THEN
            SET p_message = 'Coupon usage limit exceeded';
        -- Check minimum amount
        ELSEIF p_order_total < v_minimum_amount THEN
            SET p_message = CONCAT('Minimum order amount should be ₹', v_minimum_amount);
        ELSE
            SET p_is_valid = TRUE;
            
            -- Calculate discount
            IF v_type = 'percentage' THEN
                SET p_discount_amount = (p_order_total * v_value) / 100;
                IF v_maximum_discount IS NOT NULL AND p_discount_amount > v_maximum_discount THEN
                    SET p_discount_amount = v_maximum_discount;
                END IF;
            ELSE -- fixed_amount
                SET p_discount_amount = v_value;
            END IF;
            
            -- Ensure discount doesn't exceed order total
            IF p_discount_amount > p_order_total THEN
                SET p_discount_amount = p_order_total;
            END IF;
            
            SET p_message = 'Coupon applied successfully';
        END IF;
    END IF;
END//

-- =============================================
-- 16. GET CATEGORY PRODUCTS
-- =============================================
CREATE PROCEDURE GetCategoryProducts(
    IN p_category_id INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        p.*,
        c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.product_id = p.id AND o.status IN ('delivered', 'processing', 'shipped')) as total_sold
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = p_category_id AND p.status = 'active'
    ORDER BY p.featured DESC, p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
    
    -- Get total count
    SELECT COUNT(*) as total_products 
    FROM products 
    WHERE category_id = p_category_id AND status = 'active';
END//

DELIMITER ;

-- =============================================
-- GRANT PERMISSIONS (Adjust as needed)
-- =============================================

-- Create application user (optional)
-- CREATE USER 'frameshop_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON frameshop.* TO 'frameshop_app'@'localhost';
-- GRANT EXECUTE ON frameshop.* TO 'frameshop_app'@'localhost';
-- FLUSH PRIVILEGES;

-- =============================================
-- SAMPLE PROCEDURE CALLS (For Testing)
-- =============================================

/*
-- Test GetProductDetails
CALL GetProductDetails(1);

-- Test GetDashboardStats
CALL GetDashboardStats();

-- Test GetSalesReport
CALL GetSalesReport('2024-01-01', '2024-01-31', 'day');

-- Test GetTopSellingProducts
CALL GetTopSellingProducts(5, 30);

-- Test GetLowStockProducts
CALL GetLowStockProducts();

-- Test SearchProducts
CALL SearchProducts('frame', NULL, NULL, NULL, 'price_low', 10, 0);

-- Test ApplyCoupon
CALL ApplyCoupon('SAVE10', 1000, @discount, @valid, @message);
SELECT @discount, @valid, @message;
*/
