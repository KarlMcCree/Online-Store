

-- TABLE 1: Users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email            CITEXT UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    first_name       VARCHAR(50) NOT NULL,
    last_name        VARCHAR(50) NOT NULL,
    phone_number     VARCHAR(20),
    date_of_birth    DATE,
    country          VARCHAR(100),
    city             VARCHAR(100),
    address          TEXT,
    postal_code      VARCHAR(20),
    role             VARCHAR(20) DEFAULT 'customer' NOT NULL
                     CHECK (role IN ('admin', 'manager', 'customer', 'support')),
    email_verified   BOOLEAN DEFAULT FALSE,
    is_active        BOOLEAN DEFAULT TRUE,
    profile_metadata JSONB DEFAULT '{}'::JSONB,
    two_factor_enabled  BOOLEAN DEFAULT FALSE,
    two_factor_secret   VARCHAR(255),
    last_login          TIMESTAMP,
    login_attempts      INT DEFAULT 0,
    locked_until        TIMESTAMP,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'All user accounts and authentication data';

-- TABLE 2: categories
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    category_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name               VARCHAR(100) NOT NULL,
    slug               VARCHAR(100) UNIQUE NOT NULL,
    description        TEXT,
    image_url          VARCHAR(500),
    icon_class         VARCHAR(100),
    parent_category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    display_order      INT DEFAULT 0,
    is_active          BOOLEAN DEFAULT TRUE,
    meta_title         VARCHAR(200),
    meta_description   TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE categories IS 'Product categories with support for nested subcategories';

-- TABLE 3: products
-- ----------------------------------------------------------------------------
CREATE TABLE products (
    product_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku                 VARCHAR(50) UNIQUE NOT NULL,
    name                VARCHAR(200) NOT NULL,
    slug                VARCHAR(200) UNIQUE NOT NULL,
    short_description   TEXT,
    description         TEXT,
    price               DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    sale_price          DECIMAL(10,2) CHECK (sale_price >= 0),
    cost_price          DECIMAL(10,2) CHECK (cost_price >= 0),
    category_id         UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    type                VARCHAR(20) DEFAULT 'simple' NOT NULL
                        CHECK (type IN ('simple', 'digital', 'service', 'variable', 'bundle')),

    -- Stock management 
    quantity_in_stock   INT DEFAULT -1,
    stock_status        VARCHAR(20) DEFAULT 'instock'
                        CHECK (stock_status IN ('instock', 'outofstock', 'backorder', 'preorder')),
    low_stock_threshold INT DEFAULT 5,

    -- Media
    featured_image      VARCHAR(500),
    gallery_images      TEXT[] DEFAULT '{}',

    -- SEO
    meta_title          VARCHAR(200),
    meta_description    TEXT,
    meta_keywords       TEXT[] DEFAULT '{}',

    -- Visibility flags
    is_active           BOOLEAN DEFAULT TRUE,
    is_featured         BOOLEAN DEFAULT FALSE,
    is_new              BOOLEAN DEFAULT FALSE,
    is_bestseller       BOOLEAN DEFAULT FALSE,

    attributes          JSONB DEFAULT '{}'::JSONB,

   
    target_countries    TEXT[] DEFAULT '{}',

    sales_count         INT DEFAULT 0,
    views_count         INT DEFAULT 0,

    metadata            JSONB DEFAULT '{}'::JSONB,

    search_vector       TSVECTOR,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE products IS 'Main product catalog with digital, and service products';


-- TABLE 4: orders
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
    order_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID REFERENCES users(user_id) ON DELETE SET NULL,
    order_number     VARCHAR(20) UNIQUE NOT NULL,

    subtotal         DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount_amount  DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount       DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount  DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
    total_amount     DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),

    billing_info     JSONB NOT NULL,
    shipping_info    JSONB,

    status           VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN (
                         'pending', 'processing', 'confirmed', 'shipped', 'delivered',
                         'completed', 'cancelled', 'refunded', 'failed'
                     )),
    payment_status   VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (payment_status IN (
                         'pending', 'paid', 'partially_paid', 'failed', 'refunded'
                     )),

    tracking_number  VARCHAR(100),
    shipping_carrier VARCHAR(50),

    metadata         JSONB DEFAULT '{}'::JSONB,

    --Timestamps
    ordered_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at          TIMESTAMP,
    processed_at     TIMESTAMP,
    shipped_at       TIMESTAMP,
    delivered_at     TIMESTAMP,
    completed_at     TIMESTAMP,
    cancelled_at     TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE orders IS 'Customer orders with full lifecycle tracking';

-- TABLE 5: order_items
-- ----------------------------------------------------------------------------
CREATE TABLE order_items (
    order_item_id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id       UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id     UUID REFERENCES products(product_id) ON DELETE SET NULL,

    product_name   VARCHAR(200) NOT NULL,
    product_code   VARCHAR(50),
    product_type   VARCHAR(20),

    quantity       INT NOT NULL CHECK (quantity > 0),
    unit_price     DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal       DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0,

    -- Digital delivery
    is_digital          BOOLEAN DEFAULT FALSE,
    download_token      UUID,
    download_expires_at TIMESTAMP,

    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE order_items IS 'Line items within orders with product snapshots';

-- TABLE 6: payments
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    payment_id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id              UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,

    payment_method        VARCHAR(30) NOT NULL CHECK (payment_method IN (
                              'paystack', 'paypal', 'crypto_usdt',
                              'card', 'bank_transfer', 'wallet'
                          )),

    transaction_reference VARCHAR(255) UNIQUE NOT NULL,
    crypto_wallet_address VARCHAR(255),
    crypto_currency       VARCHAR(10),
    crypto_transaction_hash VARCHAR(255),

    amount                DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    currency              VARCHAR(3) DEFAULT 'NGN',
    fees                  DECIMAL(10,2) DEFAULT 0,
    net_amount            DECIMAL(10,2),

    status                VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN (
                              'pending', 'processing', 'success', 'failed', 'refunded', 'disputed'
                          )),

    payment_date          TIMESTAMP,
    refund_date           TIMESTAMP,
    refund_reason         TEXT,
    refund_reference      VARCHAR(255),

    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE payments IS 'All payment transactions with support for multiple gateways';

-- TABLE 7: coupons
-- ----------------------------------------------------------------------------
CREATE TABLE coupons (
    coupon_id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code                    VARCHAR(50) UNIQUE NOT NULL,
    description             TEXT,

    discount_type           VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value          DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    maximum_discount        DECIMAL(10,2),   -- Cap on percentage discounts
    minimum_spend           DECIMAL(10,2),   -- Minimum order subtotal to apply

    -- Usage limits
    usage_limit_per_coupon  INT,             -- NULL = unlimited total uses
    usage_limit_per_user    INT DEFAULT 1,
    used_count              INT DEFAULT 0,

    -- Applicability
    applicable_to           VARCHAR(20) DEFAULT 'all'
                            CHECK (applicable_to IN ('all', 'digital', 'service', 'specific_products')),
    applicable_product_ids  UUID[] DEFAULT '{}',
    applicable_category_ids UUID[] DEFAULT '{}',

    -- Validity window
    start_date              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date                TIMESTAMP NOT NULL,

    is_active               BOOLEAN DEFAULT TRUE,
    is_public               BOOLEAN DEFAULT TRUE,  -- FALSE = private/VIP codes

    created_by              UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE coupons IS 'Discount coupons with percentage and fixed-amount support';

-- TABLE 8: Digital_products :SOP guides, visa checklists, travel guides, templates.
----------------------------------------------------------------------------
CREATE TABLE digital_products (
    digital_product_id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id          UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,

    file_name           VARCHAR(255) NOT NULL,
    file_url            VARCHAR(500) NOT NULL, -- Disk	Development, small stores	file_url = '/uploads/sop-guide.pdf'AWS S3	Production, scalability	file_url = 'https://bucket.s3.amazonaws.com/file.pdf'
    file_size           BIGINT,
    file_type           VARCHAR(50),
    file_hash           VARCHAR(255),
    file_mime_type      VARCHAR(100),

    version_number      VARCHAR(20) DEFAULT '1.0',
    is_current_version  BOOLEAN DEFAULT TRUE,

    -- Download control:
    access_limit        INT DEFAULT 3,           -- How many times a user may download
    expiry_days         INT DEFAULT 30,          -- Days after purchase before link expires
    max_downloads       INT DEFAULT 3,

    -- DRM
    require_login       BOOLEAN DEFAULT TRUE,
    watermark_text      TEXT,                    -- Dynamic watermark with purchaser's name
    enable_drm          BOOLEAN DEFAULT FALSE,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(product_id, version_number)
);

COMMENT ON TABLE digital_products IS 'Digital product files with versioning and DRM';

-- TABLE 9: customer_downloads
-- ----------------------------------------------------------------------------
CREATE TABLE customer_downloads (
    download_record_id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id          UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    order_item_id       UUID NOT NULL REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    digital_product_id  UUID NOT NULL REFERENCES digital_products(digital_product_id),

    download_token      UUID DEFAULT uuid_generate_v4(),
    ip_address          INET,
    user_agent          TEXT,
    download_count      INT DEFAULT 0,

    first_downloaded_at TIMESTAMP,
    last_downloaded_at  TIMESTAMP,
    expires_at          TIMESTAMP,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(download_token)
);

COMMENT ON TABLE customer_downloads IS 'Tracks all digital product downloads per customer';

-- TABLE 10: carts
-- ----------------------------------------------------------------------------
CREATE TABLE carts (
    cart_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    session_id     VARCHAR(100),

    items          JSONB NOT NULL DEFAULT '[]'::JSONB,
    coupon_code    VARCHAR(50),
    total          DECIMAL(10,2) DEFAULT 0,

    last_activity  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE carts IS 'Shopping carts for logged-in and guest users';

-- TABLE 11: customer_profiles
-- ----------------------------------------------------------------------------
CREATE TABLE customer_profiles (
    profile_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    segment            VARCHAR(20) DEFAULT 'new'
                       CHECK (segment IN ('new', 'engaged', 'active', 'vip', 'at_risk')),

    engagement_score   INT DEFAULT 0 CHECK (engagement_score BETWEEN 0 AND 100),

    lifetime_value     DECIMAL(10,2) DEFAULT 0,

    analytics          JSONB DEFAULT '{
        "total_spent": 0,
        "order_count": 0,
        "average_order_value": 0,
        "last_order_date": null,
        "first_order_date": null,
        "product_interests": [],
        "country_interests": [],
        "category_preferences": [],
        "favorite_payment_method": []
    }'::JSONB,

    preferences        JSONB DEFAULT '{
        "newsletter": false,
        "email_notifications": true,
        "sms_notifications": false,
        "preferred_countries": [],
        "service_interest": null,
        "communication_language": "en",
        "marketing_consent": false
    }'::JSONB,

    tags               TEXT[] DEFAULT '{}',

    last_website_visit     TIMESTAMP,
    last_email_open        TIMESTAMP,
    last_social_interaction TIMESTAMP,

    profile_history        JSONB[] DEFAULT ARRAY[]::JSONB[],

    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE customer_profiles IS 'Customer CRM profiles with segmentation';

-- SERVICE WORKFLOW TABLES (NEW — Required by intended purpose) handle the post-purchase lifecycle for service products.

-- TABLE 12: service_orders
-- ----------------------------------------------------------------------------
CREATE TABLE service_orders (
    service_order_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id            UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    order_item_id       UUID NOT NULL REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id          UUID NOT NULL REFERENCES products(product_id) ON DELETE SET NULL,
    assigned_to         UUID REFERENCES users(user_id) ON DELETE SET NULL,

    --Likely to be alter as time goes on 
    service_type        VARCHAR(50) NOT NULL CHECK (service_type IN (
                            'study_abroad_consultation',
                            'visa_application',
                            'pr_processing',
                            'migration_service',
                            'second_passport',
                            'travel_package',
                            'document_review',
                            'general_consultation'
                        )),

    -- Lifecycle of Payment stage
    stage               VARCHAR(30) DEFAULT 'payment_received' NOT NULL CHECK (stage IN (
                            'payment_received',    -- Just purchased
                            'intake_pending',      -- Waiting for customer to fill intake form
                            'intake_complete',     -- Customer submitted intake/questionnaire
                            'documents_requested', -- Staff requested supporting documents
                            'documents_received',  -- All documents collected
                            'under_review',        -- Staff reviewing the case
                            'processing',          -- Active work/submission happening
                            'awaiting_response',   -- Waiting on third party (embassy, university)
                            'completed',           -- Service fully delivered
                            'on_hold',             -- Paused (customer request or issue)
                            'cancelled'
                        )),

    priority            VARCHAR(10) DEFAULT 'normal'
                        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    
    intake_deadline     TIMESTAMP,              -- Deadline for customer to submit intake form
    target_completion   TIMESTAMP,              -- Expected completion date
    completed_at        TIMESTAMP,
    cancelled_at        TIMESTAMP,

    -- Visible only to staff
    internal_notes      TEXT,

    -- Visible to customer
    customer_notes      TEXT,

    service_metadata    JSONB DEFAULT '{}'::JSONB,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE service_orders IS 'Post-purchase fulfillment tracking for service products (visas, consultations, PR, etc.)';

-- TABLE 13: Service timeline events: Gives customers a visible progress trail
-- ----------------------------------------------------------------------------
CREATE TABLE service_timeline_events (
    event_id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_order_id    UUID NOT NULL REFERENCES service_orders(service_order_id) ON DELETE CASCADE,
    created_by          UUID REFERENCES users(user_id) ON DELETE SET NULL,

    -- Can be Altered in due Time
    event_type          VARCHAR(50) NOT NULL CHECK (event_type IN (
                            'stage_changed',
                            'document_requested',
                            'document_received',
                            'note_added',
                            'email_sent',
                            'consultation_scheduled',
                            'consultation_completed',
                            'application_submitted',
                            'decision_received',
                            'completed',
                            'cancelled',
                            'on_hold'
                        )),

    previous_stage      VARCHAR(30),
    new_stage           VARCHAR(30),
    description         TEXT NOT NULL,

    is_visible_to_customer BOOLEAN DEFAULT TRUE,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE service_timeline_events IS 'Audit trail of all events and stage changes for a service order';


-- TABLE 14: document_requests
-- Tracks which documents have been requested from customers per service order,and records the customer's uploaded files.
-- ----------------------------------------------------------------------------
CREATE TABLE document_requests (
    document_request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_order_id    UUID NOT NULL REFERENCES service_orders(service_order_id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    requested_by        UUID REFERENCES users(user_id) ON DELETE SET NULL,

    document_name       VARCHAR(200) NOT NULL,   -- e.g. "Passport copy", "Bank statement"
    description         TEXT,                    -- Instructions for the customer
    is_required         BOOLEAN DEFAULT TRUE,

    status              VARCHAR(20) DEFAULT 'requested'
                        CHECK (status IN (
                            'requested',
                            'uploaded',
                            'approved',
                            'rejected',        
                        )),

    -- Customer's uploaded file
    file_url            VARCHAR(500),
    file_name           VARCHAR(255),
    file_size           BIGINT,
    uploaded_at         TIMESTAMP,

    rejection_reason    TEXT,
    deadline            TIMESTAMP,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE document_requests IS 'Document collection tracking for service fulfillment';

-- TABLE 15: Consultations
-- ----------------------------------------------------------------------------
CREATE TABLE consultations (
    consultation_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_order_id    UUID NOT NULL REFERENCES service_orders(service_order_id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    consultant_id       UUID REFERENCES users(user_id) ON DELETE SET NULL,

    consultation_type   VARCHAR(30) DEFAULT 'initial'
                        CHECK (consultation_type IN (
                            'initial',           -- First paid consultation
                            'follow_up',         -- Follow-up session
                            'document_review',   -- Reviewing submitted documents
                            'case_update'        -- Status update call
                        )),

    status              VARCHAR(20) DEFAULT 'scheduled'
                        CHECK (status IN (
                            'scheduled', 'rescheduled', 'completed',
                            'cancelled', 'no_show'
                        )),

    scheduled_at        TIMESTAMP NOT NULL,
    duration_minutes    INT DEFAULT 30,
    timezone            VARCHAR(50) DEFAULT 'Africa/Lagos',

    -- Meeting link depending on which media will be used(Zoom, Google Meet, etc.)
    meeting_url         VARCHAR(500),
    meeting_provider    VARCHAR(50),

    notes               TEXT,            -- For the Consultant
    recording_url       VARCHAR(500),  
    follow_up_actions   TEXT,

    customer_rating     INT CHECK (customer_rating BETWEEN 1 AND 5),
    customer_feedback   TEXT,

    rescheduled_from    TIMESTAMP,
    cancellation_reason TEXT,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE consultations IS 'Consultation appointments for service customers';


-- SECTION 3: CONTENT & SUPPORT TABLES

-- TABLE 16: blog_posts
-- ----------------------------------------------------------------------------
CREATE TABLE blog_posts (
    post_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    excerpt         TEXT,
    content         TEXT NOT NULL,
    featured_image  VARCHAR(500),

    category        VARCHAR(50) CHECK (category IN (
                        'study-abroad', 'migration', 'visa-tips',
                        'success-stories', 'news', 'guides'
                    )),
    tags            TEXT[] DEFAULT '{}',

    author_id       UUID REFERENCES users(user_id) ON DELETE SET NULL,

    views           INT DEFAULT 0,
    likes           INT DEFAULT 0,
    shares          INT DEFAULT 0,

    is_published    BOOLEAN DEFAULT FALSE,
    is_featured     BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMP,

    seo_title       VARCHAR(200),
    seo_description TEXT,
    seo_keywords    TEXT[] DEFAULT '{}'

    reading_time    INT,
    allow_comments  BOOLEAN DEFAULT TRUE,

    search_vector   TSVECTOR,

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_posts IS 'Blog content for SEO and customer engagement';

--  TABLE 17: blog_comments
-- ----------------------------------------------------------------------------
CREATE TABLE blog_comments (
    comment_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id           UUID NOT NULL REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    user_id           UUID REFERENCES users(user_id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES blog_comments(comment_id) ON DELETE CASCADE,

    author_name   VARCHAR(100),
    author_email  VARCHAR(100),
    content       TEXT NOT NULL,

    is_approved   BOOLEAN DEFAULT FALSE,
    is_spam       BOOLEAN DEFAULT FALSE,
    likes         INT DEFAULT 0,

    ip_address    INET,
    user_agent    TEXT,

    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_comments IS 'Blog content for SEO and customer engagement';

--  TABLE 18: Customer Support enquiries
-- ----------------------------------------------------------------------------
CREATE TABLE enquiries (
    enquiry_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID REFERENCES users(user_id) ON DELETE SET NULL,
    email         VARCHAR(100) NOT NULL,
    name          VARCHAR(100) NOT NULL,

    enquiry_type  VARCHAR(30) NOT NULL CHECK (enquiry_type IN (
                      'pre-sales', 'support', 'consultation', 'complaint',
                      'partnership', 'technical', 'refund'
                  )),

    subject       VARCHAR(200) NOT NULL,
    message       TEXT NOT NULL,
    context       JSONB DEFAULT '{}'::JSONB,

    status        VARCHAR(20) DEFAULT 'new' NOT NULL
                  CHECK (status IN ('new', 'in-progress', 'resolved', 'closed', 'escalated')),
    priority      VARCHAR(10) DEFAULT 'normal' NOT NULL
                  CHECK (priority IN ('low', 'normal', 'high', 'urgent', 'critical')),

    assigned_to   UUID REFERENCES users(user_id) ON DELETE SET NULL,

    resolved_at      TIMESTAMP,
    resolution_notes TEXT,

    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE enquiries IS 'Customer support enquiries and pre-sales questions';

-- ----------------------------------------------------------------------------
-- TABLE 19: enquiry replies
-- ----------------------------------------------------------------------------
CREATE TABLE enquiry_replies (
    reply_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id   UUID NOT NULL REFERENCES enquiries(enquiry_id) ON DELETE CASCADE,
    user_id      UUID REFERENCES users(user_id) ON DELETE SET NULL,

    message      TEXT NOT NULL,
    attachments  TEXT[] DEFAULT '{}',

    is_internal  BOOLEAN DEFAULT FALSE,
    is_automated BOOLEAN DEFAULT FALSE,

    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE enquiry_replies IS 'Replies and internal notes for customer enquiries';

-- TABLE 20: notifications email notifications for both customers and staff.
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    notification_id  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    type             VARCHAR(50) NOT NULL CHECK (type IN (
                         'order_placed',
                         'payment_received',
                         'payment_failed',
                         'service_stage_updated',
                         'document_requested',
                         'document_approved',
                         'document_rejected',
                         'consultation_scheduled',
                         'consultation_reminder',
                         'download_ready',
                         'order_completed',
                         'enquiry_reply',
                         'coupon_expiring',
                         'general'
                     )),

    title            VARCHAR(200) NOT NULL,
    message          TEXT NOT NULL,

    -- Links to the relevant record
    reference_type   VARCHAR(50),
    reference_id     UUID,

    channel          VARCHAR(20) DEFAULT 'in_app'
                     CHECK (channel IN ('in_app', 'email', 'sms', 'push')),

    is_read          BOOLEAN DEFAULT FALSE,
    read_at          TIMESTAMP,
    sent_at          TIMESTAMP,

    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notifications IS 'User notifications for order updates, service progress, and system events';

-- TABLE 21: product_reviews By the Customer 
-- ----------------------------------------------------------------------------
CREATE TABLE product_reviews (
    review_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id   UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    order_id     UUID REFERENCES orders(order_id) ON DELETE SET NULL,

    rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title        VARCHAR(200),
    content      TEXT,

    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved          BOOLEAN DEFAULT FALSE,

    helpful_votes   INT DEFAULT 0,
    reported_count  INT DEFAULT 0,

    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(product_id, user_id)
);

COMMENT ON TABLE product_reviews IS 'Customer product reviews and ratings (verified purchases only)';


-- TABLE 22: audit_logs
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    log_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,
    table_name      VARCHAR(50),
    record_id       UUID,

    old_data        JSONB,
    new_data        JSONB,

    ip_address      INET,
    user_agent      TEXT,
    request_url     TEXT,
    request_method  VARCHAR(10),

    status_code     INT,
    error_message   TEXT,

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE audit_logs IS 'Security and compliance audit trail';

-- For tracking front desk staff interactions with customers
CREATE TABLE customer_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    staff_id UUID REFERENCES users(user_id),
    interaction_type VARCHAR(30) CHECK (interaction_type IN ('call', 'email', 'chat', 'in_person', 'support_ticket')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  SECTION 4: INDEXES

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);
CREATE INDEX idx_products_target_countries ON products USING GIN(target_countries);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_ordered_at ON orders(ordered_at);
CREATE INDEX idx_orders_ordered_at_status ON orders(ordered_at, status);

-- Order items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Payments
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_reference ON payments(transaction_reference);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Coupons
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_dates ON coupons(start_date, end_date);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);

-- Digital products
CREATE INDEX idx_digital_products_product_id ON digital_products(product_id);
CREATE INDEX idx_digital_products_is_current ON digital_products(is_current_version);

-- Customer downloads
CREATE INDEX idx_customer_downloads_user_id ON customer_downloads(user_id);
CREATE INDEX idx_customer_downloads_product_id ON customer_downloads(product_id);
CREATE INDEX idx_customer_downloads_expires_at ON customer_downloads(expires_at);
CREATE INDEX idx_customer_downloads_token ON customer_downloads(download_token);

-- Carts
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_carts_last_activity ON carts(last_activity);

-- Customer profiles
CREATE INDEX idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX idx_customer_profiles_segment ON customer_profiles(segment);
CREATE INDEX idx_customer_profiles_engagement_score ON customer_profiles(engagement_score);
CREATE INDEX idx_customer_profiles_tags ON customer_profiles USING GIN(tags);

-- Service orders (NEW)
CREATE INDEX idx_service_orders_order_id ON service_orders(order_id);
CREATE INDEX idx_service_orders_user_id ON service_orders(user_id);
CREATE INDEX idx_service_orders_assigned_to ON service_orders(assigned_to);
CREATE INDEX idx_service_orders_stage ON service_orders(stage);
CREATE INDEX idx_service_orders_service_type ON service_orders(service_type);
CREATE INDEX idx_service_orders_created_at ON service_orders(created_at);

-- Service timeline events (NEW)
CREATE INDEX idx_service_timeline_service_order_id ON service_timeline_events(service_order_id);
CREATE INDEX idx_service_timeline_created_at ON service_timeline_events(created_at);

-- Document requests (NEW)
CREATE INDEX idx_document_requests_service_order_id ON document_requests(service_order_id);
CREATE INDEX idx_document_requests_user_id ON document_requests(user_id);
CREATE INDEX idx_document_requests_status ON document_requests(status);

-- Consultations (NEW)
CREATE INDEX idx_consultations_service_order_id ON consultations(service_order_id);
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_consultant_id ON consultations(consultant_id);
CREATE INDEX idx_consultations_scheduled_at ON consultations(scheduled_at);
CREATE INDEX idx_consultations_status ON consultations(status);

-- Notifications (NEW)
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Product reviews (NEW)
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);

-- Wishlists (NEW)
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);

-- Blog posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);

-- Blog comments
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX idx_blog_comments_created_at ON blog_comments(created_at);

-- Enquiries
CREATE INDEX idx_enquiries_user_id ON enquiries(user_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX idx_enquiries_priority ON enquiries(priority);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at);

-- Enquiry replies
CREATE INDEX idx_enquiry_replies_enquiry_id ON enquiry_replies(enquiry_id);
CREATE INDEX idx_enquiry_replies_user_id ON enquiry_replies(user_id);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- SECTION 5: FUNCTIONS
-- ----------------------------------------------------------------------------
--update_updated_at_column
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- current_user_id
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID;
EXCEPTION
    WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--  Calculate order totals
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_order_totals(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
    v_subtotal  DECIMAL(10,2);
    v_discount  DECIMAL(10,2);
    v_shipping  DECIMAL(10,2);
    v_tax       DECIMAL(10,2);
    v_total     DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(subtotal), 0)
    INTO v_subtotal
    FROM order_items
    WHERE order_id = p_order_id;

    SELECT discount_amount, shipping_amount
    INTO v_discount, v_shipping
    FROM orders
    WHERE order_id = p_order_id;

    v_tax   := (v_subtotal - COALESCE(v_discount, 0)) * 0.075;
    v_total := v_subtotal - COALESCE(v_discount, 0) + v_tax + COALESCE(v_shipping, 0);

    UPDATE orders
    SET subtotal     = v_subtotal,
        tax_amount   = v_tax,
        total_amount = v_total
    WHERE order_id = p_order_id;
END;
$$ LANGUAGE plpgsql;

--  update_customer_profile_analytics
----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_customer_profile_analytics(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_spent      DECIMAL(10,2);
    v_order_count      INT;
    v_avg_order_value  DECIMAL(10,2);
    v_last_order_date  TIMESTAMP;
    v_first_order_date TIMESTAMP;
    v_segment          VARCHAR(20);
BEGIN
    SELECT
        COALESCE(SUM(total_amount), 0),
        COUNT(*),
        COALESCE(AVG(total_amount), 0),
        MAX(ordered_at),
        MIN(ordered_at)
    INTO v_total_spent, v_order_count, v_avg_order_value, v_last_order_date, v_first_order_date
    FROM orders
    WHERE user_id = p_user_id
      AND status NOT IN ('cancelled', 'failed');

    -- Segment logic
    IF v_order_count >= 10 AND v_total_spent >= 5000 THEN
        v_segment := 'vip';
    ELSIF v_order_count >= 5 THEN
        v_segment := 'active';
    ELSIF v_order_count >= 1 THEN
        v_segment := 'engaged';
    ELSIF v_last_order_date < (CURRENT_TIMESTAMP - INTERVAL '90 days') THEN
        v_segment := 'at_risk';
    ELSIF v_last_order_date < (CURRENT_TIMESTAMP - INTERVAL '180 days') THEN
        v_segment := 'churned';
    ELSE
        v_segment := 'new';
    END IF;

    UPDATE customer_profiles
    SET analytics = jsonb_build_object(
            'total_spent',          v_total_spent,
            'order_count',          v_order_count,
            'average_order_value',  v_avg_order_value,
            'last_order_date',      v_last_order_date,
            'first_order_date',     v_first_order_date,
            'product_interests',    (analytics->'product_interests'),
            'country_interests',    (analytics->'country_interests'),
            'category_preferences', (analytics->'category_preferences'),
            'favorite_payment_method', (analytics->'favorite_payment_method')
        ),
        lifetime_value = v_total_spent,
        segment        = v_segment,
        updated_at     = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        INSERT INTO customer_profiles (user_id, analytics, lifetime_value, segment)
        VALUES (p_user_id,
            jsonb_build_object(
                'total_spent',         v_total_spent,
                'order_count',         v_order_count,
                'average_order_value', v_avg_order_value,
                'last_order_date',     v_last_order_date,
                'first_order_date',    v_first_order_date,
                'product_interests',   '[]'::JSONB,
                'country_interests',   '[]'::JSONB
            ),
            v_total_spent,
            v_segment
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

--Can be Altered in due Time 
--apply_coupon
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION apply_coupon(
    p_coupon_code VARCHAR,
    p_user_id     UUID,
    p_subtotal    DECIMAL(10,2)
)
RETURNS TABLE (
    valid           BOOLEAN,
    discount_amount DECIMAL(10,2),
    message         TEXT
) AS $$
DECLARE
    v_coupon    RECORD;
    v_user_usage INT;
    v_discount  DECIMAL(10,2);
BEGIN
    SELECT * INTO v_coupon
    FROM coupons
    WHERE code = UPPER(p_coupon_code)
      AND is_active = TRUE
      AND start_date <= CURRENT_TIMESTAMP
      AND end_date >= CURRENT_TIMESTAMP;

    IF v_coupon.coupon_id IS NULL THEN
        RETURN QUERY SELECT FALSE, 0::DECIMAL, 'Invalid or expired coupon code'::TEXT;
        RETURN;
    END IF;

    IF v_coupon.usage_limit_per_coupon IS NOT NULL
       AND v_coupon.used_count >= v_coupon.usage_limit_per_coupon THEN
        RETURN QUERY SELECT FALSE, 0::DECIMAL, 'Coupon usage limit reached'::TEXT;
        RETURN;
    END IF;

    IF v_coupon.usage_limit_per_user IS NOT NULL THEN
        SELECT COUNT(*) INTO v_user_usage
        FROM orders
        WHERE user_id = p_user_id
          AND metadata->>'coupon_code' = UPPER(p_coupon_code);

        IF v_user_usage >= v_coupon.usage_limit_per_user THEN
            RETURN QUERY SELECT FALSE, 0::DECIMAL, 'You have already used this coupon'::TEXT;
            RETURN;
        END IF;
    END IF;

    IF v_coupon.minimum_spend IS NOT NULL AND p_subtotal < v_coupon.minimum_spend THEN
        RETURN QUERY SELECT FALSE, 0::DECIMAL,
            format('Minimum spend of %s required', v_coupon.minimum_spend)::TEXT;
        RETURN;
    END IF;

    IF v_coupon.discount_type = 'percentage' THEN
        v_discount := p_subtotal * v_coupon.discount_value / 100;
        IF v_coupon.maximum_discount IS NOT NULL AND v_discount > v_coupon.maximum_discount THEN
            v_discount := v_coupon.maximum_discount;
        END IF;
    ELSE
        v_discount := LEAST(v_coupon.discount_value, p_subtotal);
    END IF;

    RETURN QUERY SELECT TRUE, v_discount, 'Coupon applied successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

--  create_service_order_from_purchase
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_service_order_from_purchase()
RETURNS TRIGGER AS $$
DECLARE
    v_item RECORD;
    v_service_type VARCHAR(50);
    v_new_service_order_id UUID;
BEGIN
   
    FOR v_item IN
        SELECT oi.*, p.type, p.attributes
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = NEW.order_id
          AND p.type = 'service'
    LOOP
    
        v_service_type := COALESCE(
            v_item.attributes->>'service_type',
            'general_consultation'
        );

        INSERT INTO service_orders (
            order_id, order_item_id, user_id, product_id,
            service_type, stage, service_metadata
        )
        VALUES (
            NEW.order_id,
            v_item.order_item_id,
            NEW.user_id,
            v_item.product_id,
            v_service_type,
            'payment_received',
            jsonb_build_object('product_name', v_item.product_name)
        )
        RETURNING service_order_id INTO v_new_service_order_id;

        
        INSERT INTO service_timeline_events (
            service_order_id, event_type, new_stage, description, is_visible_to_customer
        )
        VALUES (
            v_new_service_order_id,
            'stage_changed',
            'payment_received',
            'Payment confirmed. Your service request has been received and is being reviewed by our team.',
            TRUE
        );

        INSERT INTO notifications (
            user_id, type, title, message, reference_type, reference_id, channel
        )
        VALUES (
            NEW.user_id,
            'service_stage_updated',
            'Your service request is confirmed',
            'Payment received for ' || v_item.product_name || '. Our team will be in touch within 24 hours.',
            'service_order',
            v_new_service_order_id,
            'in_app'
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- update_products_search_vector
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_products_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--update_blog_search_vector (NEW)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_blog_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- trigger_audit_product_changes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_audit_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data, ip_address)
        VALUES (current_user_id(), 'INSERT', 'products', NEW.product_id, to_jsonb(NEW), inet_client_addr());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data, ip_address)
        VALUES (current_user_id(), 'UPDATE', 'products', NEW.product_id, to_jsonb(OLD), to_jsonb(NEW), inet_client_addr());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, ip_address)
        VALUES (current_user_id(), 'DELETE', 'products', OLD.product_id, to_jsonb(OLD), inet_client_addr());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Auto-generates order numbers in format: ORD-YYYYMM-000001
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part     VARCHAR(4);
    month_part    VARCHAR(2);
    sequence_num  VARCHAR(6);
BEGIN
    year_part  := TO_CHAR(CURRENT_DATE, 'YYYY');
    month_part := TO_CHAR(CURRENT_DATE, 'MM');

    SELECT LPAD(COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1, 6, '0')
    INTO sequence_num
    FROM orders
    WHERE order_number LIKE 'ORD-' || year_part || month_part || '%';

    NEW.order_number := 'ORD-' || year_part || month_part || '-' || sequence_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- SECTION 6: TRIGGERS

-- updated_at triggers
CREATE TRIGGER trigger_users_updated_at               BEFORE UPDATE ON users               FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_categories_updated_at          BEFORE UPDATE ON categories          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_products_updated_at            BEFORE UPDATE ON products            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_orders_updated_at              BEFORE UPDATE ON orders              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_coupons_updated_at             BEFORE UPDATE ON coupons             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_digital_products_updated_at    BEFORE UPDATE ON digital_products    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_customer_profiles_updated_at   BEFORE UPDATE ON customer_profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_service_orders_updated_at      BEFORE UPDATE ON service_orders      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_document_requests_updated_at   BEFORE UPDATE ON document_requests   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_consultations_updated_at       BEFORE UPDATE ON consultations        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_blog_posts_updated_at          BEFORE UPDATE ON blog_posts          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_enquiries_updated_at           BEFORE UPDATE ON enquiries           FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER trigger_generate_order_number_before_insert
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION trigger_generate_order_number();

CREATE OR REPLACE FUNCTION trigger_recalculate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM calculate_order_totals(OLD.order_id);
    ELSE
        PERFORM calculate_order_totals(NEW.order_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_order_items_changed
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION trigger_recalculate_order_totals();

CREATE OR REPLACE FUNCTION trigger_update_customer_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        PERFORM update_customer_profile_analytics(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_order_placed
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_customer_profile();

CREATE TRIGGER trigger_create_service_orders_on_payment
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN (NEW.payment_status = 'paid' AND OLD.payment_status != 'paid')
    EXECUTE FUNCTION create_service_order_from_purchase();

CREATE OR REPLACE FUNCTION trigger_increment_coupon_usage()
RETURNS TRIGGER AS $$
DECLARE
    v_coupon_code VARCHAR;
BEGIN
    v_coupon_code := NEW.metadata->>'coupon_code';
    IF v_coupon_code IS NOT NULL THEN
        UPDATE coupons
        SET used_count = used_count + 1
        WHERE code = UPPER(v_coupon_code);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_coupon_used
    AFTER INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.metadata ? 'coupon_code')
    EXECUTE FUNCTION trigger_increment_coupon_usage();

CREATE TRIGGER trigger_audit_products
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_product_changes();

CREATE TRIGGER trigger_products_search_vector
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_search_vector();

CREATE TRIGGER trigger_blog_search_vector
    BEFORE INSERT OR UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_search_vector();

-- SECTION 7: VIEWS

CREATE OR REPLACE VIEW v_order_summary AS
SELECT
    o.order_id,
    o.order_number,
    u.user_id,
    u.email,
    u.first_name,
    u.last_name,
    o.total_amount,
    o.status,
    o.payment_status,
    o.ordered_at,
    COUNT(oi.order_item_id) AS item_count,
    p.payment_method,
    p.status AS payment_detail_status
FROM orders o
LEFT JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN payments p ON o.order_id = p.order_id
GROUP BY o.order_id, u.user_id, u.email, u.first_name, u.last_name,
         p.payment_method, p.status;

-- Product performance dashboard
CREATE OR REPLACE VIEW v_product_performance AS
SELECT
    p.product_id,
    p.name,
    p.sku,
    c.name AS category_name,
    p.type,
    p.price,
    p.sales_count,
    p.views_count,
    COALESCE(SUM(oi.quantity), 0) AS total_sold,
    COALESCE(SUM(oi.subtotal), 0) AS total_revenue,
    COALESCE(SUM(oi.subtotal) / NULLIF(SUM(oi.quantity), 0), 0) AS average_selling_price,
    COUNT(DISTINCT oi.order_id) AS unique_orders,
    ROUND(
        CASE WHEN p.views_count > 0
             THEN (p.sales_count::DECIMAL / p.views_count) * 100
             ELSE 0
        END, 2
    ) AS conversion_rate
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id AND o.status NOT IN ('cancelled', 'failed')
GROUP BY p.product_id, c.name;


CREATE OR REPLACE VIEW v_customer_clv AS
SELECT
    u.user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.created_at AS registration_date,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COALESCE(AVG(o.total_amount), 0) AS avg_order_value,
    MAX(o.ordered_at) AS last_order_date,
    MIN(o.ordered_at) AS first_order_date,
    EXTRACT(DAY FROM (COALESCE(MAX(o.ordered_at), CURRENT_TIMESTAMP) - MIN(o.ordered_at))) AS customer_lifetime_days,
    cp.segment,
    cp.engagement_score,
    cp.tags
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id AND o.status NOT IN ('cancelled', 'failed')
LEFT JOIN customer_profiles cp ON u.user_id = cp.user_id
GROUP BY u.user_id, cp.segment, cp.engagement_score, cp.tags;


CREATE OR REPLACE VIEW v_daily_sales AS
SELECT
    DATE(ordered_at) AS sale_date,
    COUNT(DISTINCT order_id) AS total_orders,
    COUNT(DISTINCT user_id) AS unique_customers,
    SUM(total_amount) AS total_revenue,
    SUM(shipping_amount) AS total_shipping,
    SUM(discount_amount) AS total_discounts,
    SUM(tax_amount) AS total_tax,
    AVG(total_amount) AS average_order_value,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) AS paid_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders
FROM orders
WHERE ordered_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(ordered_at)
ORDER BY sale_date DESC;


CREATE OR REPLACE VIEW v_popular_products_by_country AS
SELECT
    unnest(p.target_countries) AS country,
    p.product_id,
    p.name,
    COUNT(oi.order_item_id) AS units_sold,
    SUM(oi.subtotal) AS revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.status NOT IN ('cancelled', 'failed')
  AND p.target_countries IS NOT NULL
  AND array_length(p.target_countries, 1) > 0
GROUP BY country, p.product_id, p.name
ORDER BY country, revenue DESC;

-- Support analytics
CREATE OR REPLACE VIEW v_support_analytics AS
SELECT
    enquiry_type,
    status,
    priority,
    COUNT(*) AS ticket_count,
    AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600) AS avg_resolution_hours,
    COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) AS resolved_count,
    COUNT(CASE WHEN resolved_at IS NULL AND status NOT IN ('closed', 'resolved') THEN 1 END) AS open_count
FROM enquiries
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY enquiry_type, status, priority
ORDER BY enquiry_type, priority;

-- Inventory status
CREATE OR REPLACE VIEW v_inventory_status AS
SELECT
    p.product_id,
    p.name,
    p.sku,
    p.type,
    p.quantity_in_stock,
    p.low_stock_threshold,
    p.stock_status,
    CASE
        WHEN p.quantity_in_stock = -1 THEN 'Unlimited'
        WHEN p.quantity_in_stock <= 0 THEN 'Out of Stock'
        WHEN p.quantity_in_stock <= p.low_stock_threshold THEN 'Low Stock'
        ELSE 'In Stock'
    END AS stock_level_status,
    COALESCE(SUM(oi.quantity), 0) AS last_30_days_sales,
    CASE
        WHEN p.quantity_in_stock > 0 AND p.quantity_in_stock != -1
        THEN ROUND(p.quantity_in_stock / NULLIF(COALESCE(SUM(oi.quantity), 1), 0) * 30, 0)
        ELSE NULL
    END AS estimated_days_remaining
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.order_id
    AND o.ordered_at >= CURRENT_DATE - INTERVAL '30 days'
    AND o.status NOT IN ('cancelled', 'failed')
GROUP BY p.product_id;

-- Product download analytics
CREATE OR REPLACE VIEW v_download_analytics AS
SELECT
    dp.product_id,
    p.name AS product_name,
    COUNT(cd.download_record_id) AS total_downloads,
    COUNT(DISTINCT cd.user_id) AS unique_downloaders,
    AVG(cd.download_count) AS avg_downloads_per_user,
    COUNT(CASE WHEN cd.first_downloaded_at IS NOT NULL THEN 1 END) AS at_least_one_download,
    COUNT(CASE WHEN cd.download_count >= dp.max_downloads THEN 1 END) AS max_downloads_reached
FROM digital_products dp
JOIN products p ON dp.product_id = p.product_id
LEFT JOIN customer_downloads cd ON dp.digital_product_id = cd.digital_product_id
GROUP BY dp.product_id, p.name;

-- Service orders pipeline dashboard
CREATE OR REPLACE VIEW v_service_pipeline AS
SELECT
    so.service_order_id,
    so.service_type,
    so.stage,
    so.priority,
    o.order_number,
    u.first_name || ' ' || u.last_name AS customer_name,
    u.email AS customer_email,
    u.country AS customer_country,
    p.name AS product_name,
    so.target_completion,
    so.created_at AS started_at,
    assigned.first_name || ' ' || assigned.last_name AS assigned_to_name,

    -- Count pending documents
    (SELECT COUNT(*) FROM document_requests dr
     WHERE dr.service_order_id = so.service_order_id
       AND dr.status = 'requested') AS pending_documents,

    -- Next consultation
    (SELECT scheduled_at FROM consultations c
     WHERE c.service_order_id = so.service_order_id
       AND c.status = 'scheduled'
     ORDER BY scheduled_at ASC LIMIT 1) AS next_consultation
FROM service_orders so
JOIN orders o ON so.order_id = o.order_id
JOIN users u ON so.user_id = u.user_id
JOIN products p ON so.product_id = p.product_id
LEFT JOIN users assigned ON so.assigned_to = assigned.user_id
WHERE so.stage NOT IN ('completed', 'cancelled');

COMMENT ON VIEW v_service_pipeline IS 'Active service orders pipeline for staff dashboard';

-- SECTION 9: DATABASE MAINTENANCE

CREATE OR REPLACE FUNCTION get_db_stats()
RETURNS TABLE (metric_name TEXT, metric_value TEXT) AS $$
BEGIN
    RETURN QUERY SELECT 'Database Size'::TEXT,   pg_size_pretty(pg_database_size(current_database()))::TEXT;
    RETURN QUERY SELECT 'Total Tables'::TEXT,    (SELECT COUNT(*)::TEXT FROM information_schema.tables WHERE table_schema = 'public');
    RETURN QUERY SELECT 'Total Indexes'::TEXT,   (SELECT COUNT(*)::TEXT FROM pg_indexes WHERE schemaname = 'public');
    RETURN QUERY SELECT 'Total Users'::TEXT,     (SELECT COUNT(*)::TEXT FROM users);
    RETURN QUERY SELECT 'Total Products'::TEXT,  (SELECT COUNT(*)::TEXT FROM products);
    RETURN QUERY SELECT 'Total Orders'::TEXT,    (SELECT COUNT(*)::TEXT FROM orders);
    RETURN QUERY SELECT 'Active Services'::TEXT, (SELECT COUNT(*)::TEXT FROM service_orders WHERE stage NOT IN ('completed','cancelled'));
    RETURN QUERY SELECT 'Total Revenue'::TEXT,   (SELECT COALESCE(SUM(total_amount),0)::TEXT FROM orders WHERE status = 'completed');
    RETURN QUERY SELECT 'Cache Hit Ratio'::TEXT,
        ROUND(100 * SUM(heap_blks_hit) / NULLIF(SUM(heap_blks_hit) + SUM(heap_blks_read), 0), 2)::TEXT || '%'
    FROM pg_statio_user_tables;
END;
$$ LANGUAGE plpgsql;
