# KURZORA MULTI-LANGUAGE DATABASE SCHEMA UPDATE

**Step 1: Add Multi-Language Support to Existing Database**

---

## Add Language Preference to Users Table

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS language_preference VARCHAR(5) DEFAULT 'en' CHECK (language_preference IN ('en', 'de', 'ar')),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS region VARCHAR(10) DEFAULT 'US',
ADD COLUMN IF NOT EXISTS islamic_finance_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS currency_preference VARCHAR(5) DEFAULT 'USD';
```

---

## 1. CONTENT TRANSLATIONS TABLE

```sql
CREATE TABLE IF NOT EXISTS content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_key VARCHAR(255) NOT NULL,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'de', 'ar')),
    content_text TEXT NOT NULL,
    content_html TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(content_key, language)
);
```

### Add Indexes for Performance
```sql
CREATE INDEX IF NOT EXISTS idx_content_translations_key_lang ON content_translations(content_key, language);
CREATE INDEX IF NOT EXISTS idx_content_translations_lang ON content_translations(language);
```

---

## 2. STOCK TRANSLATIONS TABLE

```sql
CREATE TABLE IF NOT EXISTS stock_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(10) NOT NULL,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'de', 'ar')),
    company_name TEXT NOT NULL,
    company_description TEXT,
    sector_name TEXT,
    industry_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ticker, language)
);
```

### Add Indexes for Performance
```sql
CREATE INDEX IF NOT EXISTS idx_stock_translations_ticker_lang ON stock_translations(ticker, language);
CREATE INDEX IF NOT EXISTS idx_stock_translations_lang ON stock_translations(language);
```

---

## 3. SIGNAL EXPLANATIONS TABLE (Multi-Language AI Explanations)

```sql
CREATE TABLE IF NOT EXISTS signal_explanations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id UUID NOT NULL REFERENCES trading_signals(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'de', 'ar')),
    explanation_text TEXT NOT NULL,
    explanation_summary TEXT,
    risk_warning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(signal_id, language)
);
```

### Add Indexes for Performance
```sql
CREATE INDEX IF NOT EXISTS idx_signal_explanations_signal_lang ON signal_explanations(signal_id, language);
CREATE INDEX IF NOT EXISTS idx_signal_explanations_lang ON signal_explanations(language);
```

---

## 4. ISLAMIC FINANCE COMPLIANCE TABLE

```sql
CREATE TABLE IF NOT EXISTS islamic_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(10) NOT NULL UNIQUE,
    is_shariah_compliant BOOLEAN DEFAULT false,
    compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
    debt_to_market_cap DECIMAL(5,2),
    non_compliant_income_ratio DECIMAL(5,2),
    compliance_authority VARCHAR(100),
    certification_date DATE,
    review_date DATE,
    compliance_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Add Indexes for Performance
```sql
CREATE INDEX IF NOT EXISTS idx_islamic_compliance_ticker ON islamic_compliance(ticker);
CREATE INDEX IF NOT EXISTS idx_islamic_compliance_shariah ON islamic_compliance(is_shariah_compliant);
```

---

## 5. USER NOTIFICATION PREFERENCES (Multi-Language)

```sql
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signal_alerts BOOLEAN DEFAULT true,
    email_language VARCHAR(5) DEFAULT 'en' CHECK (email_language IN ('en', 'de', 'ar')),
    telegram_language VARCHAR(5) DEFAULT 'en' CHECK (telegram_language IN ('en', 'de', 'ar')),
    email_notifications BOOLEAN DEFAULT true,
    telegram_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    daily_digest BOOLEAN DEFAULT true,
    weekly_summary BOOLEAN DEFAULT true,
    risk_alerts BOOLEAN DEFAULT true,
    min_signal_score INTEGER DEFAULT 80 CHECK (min_signal_score >= 0 AND min_signal_score <= 100),
    notification_timezone VARCHAR(50) DEFAULT 'UTC',
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### Add Indexes for Performance
```sql
CREATE INDEX IF NOT EXISTS idx_user_notification_prefs_user_id ON user_notification_preferences(user_id);
```

---

## 6. REGIONAL SETTINGS TABLE

```sql
CREATE TABLE IF NOT EXISTS regional_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code VARCHAR(10) NOT NULL UNIQUE,
    region_name_en VARCHAR(100) NOT NULL,
    region_name_de VARCHAR(100),
    region_name_ar VARCHAR(100),
    default_currency VARCHAR(5) DEFAULT 'USD',
    default_timezone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    time_format VARCHAR(10) DEFAULT '12h',
    number_format VARCHAR(20) DEFAULT 'en-US',
    islamic_finance_default BOOLEAN DEFAULT false,
    available_languages VARCHAR(50) DEFAULT 'en,de,ar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Add Indexes for Performance
```sql
CREATE INDEX IF NOT EXISTS idx_regional_settings_code ON regional_settings(region_code);
```

---

## 7. INSERT SAMPLE DATA FOR TESTING

### Insert Default Regional Settings
```sql
INSERT INTO regional_settings (region_code, region_name_en, region_name_de, region_name_ar, default_currency, default_timezone, islamic_finance_default) VALUES
    ('US', 'United States', 'Vereinigte Staaten', 'الولايات المتحدة', 'USD', 'America/New_York', false),
    ('DE', 'Germany', 'Deutschland', 'ألمانيا', 'EUR', 'Europe/Berlin', false),
    ('AE', 'United Arab Emirates', 'Vereinigte Arabische Emirate', 'الإمارات العربية المتحدة', 'AED', 'Asia/Dubai', true),
    ('SA', 'Saudi Arabia', 'Saudi-Arabien', 'المملكة العربية السعودية', 'SAR', 'Asia/Riyadh', true)
ON CONFLICT (region_code) DO NOTHING;
```

### Insert Sample Content Translations
```sql
INSERT INTO content_translations (content_key, language, content_text) VALUES
    ('welcome_message', 'en', 'Welcome to Kurzora Trading Platform'),
    ('welcome_message', 'de', 'Willkommen bei der Kurzora Trading Platform'),
    ('welcome_message', 'ar', 'مرحباً بكم في منصة كورزورا للتداول'),
    ('signal_score', 'en', 'Signal Score'),
    ('signal_score', 'de', 'Signal-Bewertung'),
    ('signal_score', 'ar', 'نقاط الإشارة'),
    ('risk_warning', 'en', 'Trading involves significant risk'),
    ('risk_warning', 'de', 'Trading birgt erhebliche Risiken'),
    ('risk_warning', 'ar', 'التداول ينطوي على مخاطر كبيرة')
ON CONFLICT (content_key, language) DO NOTHING;
```

### Insert Sample Islamic Compliance Data for Major Stocks
```sql
INSERT INTO islamic_compliance (ticker, is_shariah_compliant, compliance_score, debt_to_market_cap, non_compliant_income_ratio, compliance_authority) VALUES
    ('AAPL', true, 85, 15.5, 2.1, 'AAOIFI'),
    ('MSFT', true, 90, 12.3, 1.8, 'AAOIFI'),
    ('GOOGL', false, 45, 8.2, 15.7, 'AAOIFI'),
    ('AMZN', true, 75, 22.1, 4.2, 'AAOIFI'),
    ('TSLA', true, 88, 18.9, 0.5, 'AAOIFI')
ON CONFLICT (ticker) DO NOTHING;
```

---

## 8. UPDATE RLS POLICIES FOR MULTI-LANGUAGE SUPPORT

### Enable RLS on New Tables
```sql
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE islamic_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_settings ENABLE ROW LEVEL SECURITY;
```

### Content Translations - Public Read Access
```sql
CREATE POLICY "Content translations are publicly readable"
    ON content_translations FOR SELECT
    USING (true);
```

### Stock Translations - Public Read Access
```sql
CREATE POLICY "Stock translations are publicly readable"
    ON stock_translations FOR SELECT
    USING (true);
```

### Signal Explanations - Authenticated Users Can Read All
```sql
CREATE POLICY "Signal explanations are readable by authenticated users"
    ON signal_explanations FOR SELECT
    USING (auth.role() = 'authenticated');
```

### Islamic Compliance - Public Read Access
```sql
CREATE POLICY "Islamic compliance data is publicly readable"
    ON islamic_compliance FOR SELECT
    USING (true);
```

### User Notification Preferences - Users Can Only Access Their Own
```sql
CREATE POLICY "Users can view their own notification preferences"
    ON user_notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
    ON user_notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
    ON user_notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### Regional Settings - Public Read Access
```sql
CREATE POLICY "Regional settings are publicly readable"
    ON regional_settings FOR SELECT
    USING (true);
```

---

## 9. CREATE HELPER FUNCTIONS FOR MULTI-LANGUAGE CONTENT

### Function to Get Translated Content with Fallback to English
```sql
CREATE OR REPLACE FUNCTION get_translated_content(
    content_key_param VARCHAR(255),
    language_param VARCHAR(5) DEFAULT 'en'
)
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
    SELECT COALESCE(
        (SELECT content_text FROM content_translations
         WHERE content_key = content_key_param AND language = language_param),
        (SELECT content_text FROM content_translations
         WHERE content_key = content_key_param AND language = 'en'),
        content_key_param
    );
$$;
```

### Function to Get Translated Stock Name with Fallback
```sql
CREATE OR REPLACE FUNCTION get_translated_stock_name(
    ticker_param VARCHAR(10),
    language_param VARCHAR(5) DEFAULT 'en'
)
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
    SELECT COALESCE(
        (SELECT company_name FROM stock_translations
         WHERE ticker = ticker_param AND language = language_param),
        (SELECT company_name FROM stock_translations
         WHERE ticker = ticker_param AND language = 'en'),
        ticker_param
    );
$$;
```

---

## COMPLETION MESSAGE

**You're done! Your database now supports:**

- ✅ Multi-language content (EN/DE/AR)
- ✅ Islamic finance compliance tracking
- ✅ User language preferences
- ✅ Regional settings
- ✅ Translated stock information
- ✅ Multi-language signal explanations
- ✅ Proper security policies (RLS)
- ✅ Helper functions for easy content retrieval