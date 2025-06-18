# KURZORA TRADING PLATFORM - MASTER DATABASE SCHEMA

**PostgreSQL with Supabase**  
**Version:** 1.0 (Final)

---

## Enable Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

---

## 1. ENUMS & CUSTOM TYPES

### Signal Types
```sql
CREATE TYPE signal_type_enum AS ENUM ('bullish', 'bearish', 'neutral');
```

### Signal Status
```sql
CREATE TYPE signal_status_enum AS ENUM ('active', 'triggered', 'expired', 'cancelled');
```

### Signal Actions for History Tracking
```sql
CREATE TYPE signal_action_enum AS ENUM ('generated', 'triggered', 'stop_loss_hit', 'take_profit_hit', 'expired', 'manual_close');
```

### Alert Types
```sql
CREATE TYPE alert_type_enum AS ENUM ('signal_alert', 'trade_update', 'portfolio_summary', 'account_notification');
```

### Delivery Channels
```sql
CREATE TYPE delivery_channel_enum AS ENUM ('email', 'telegram', 'push', 'sms');
```

### Delivery Status
```sql
CREATE TYPE delivery_status_enum AS ENUM ('pending', 'sent', 'delivered', 'failed', 'bounced');
```

### Subscription Tiers
```sql
CREATE TYPE subscription_tier_enum AS ENUM ('starter', 'professional', 'elite');
```

### Trade Types
```sql
CREATE TYPE trade_type_enum AS ENUM ('buy', 'sell');
```

---

## 2. USERS & AUTHENTICATION

### Users Table (synced with Supabase Auth)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic info
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    
    -- Subscription info
    subscription_tier subscription_tier_enum DEFAULT 'starter',
    subscription_status VARCHAR(50) DEFAULT 'trial',
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    stripe_customer_id VARCHAR(255),
    
    -- Preferences
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    notification_settings JSONB DEFAULT '{}',
    
    -- Portfolio settings
    starting_balance DECIMAL(12,2) DEFAULT 10000.00,
    current_balance DECIMAL(12,2) DEFAULT 10000.00,
    risk_percentage DECIMAL(3,2) DEFAULT 2.00, -- 2% default risk per trade
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Sessions (for tracking active sessions)
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 3. STOCK UNIVERSE & MARKET DATA

### Stock Universe (all stocks we track)
```sql
CREATE TABLE stock_universe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker VARCHAR(10) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap BIGINT,
    is_active BOOLEAN DEFAULT true,
    is_islamic_compliant BOOLEAN DEFAULT false,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Market Data Snapshots
```sql
CREATE TABLE market_data_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker VARCHAR(10) NOT NULL,
    price DECIMAL(10,4) NOT NULL,
    volume BIGINT NOT NULL,
    change_percent DECIMAL(8,4),
    high_52w DECIMAL(10,4),
    low_52w DECIMAL(10,4),
    market_cap BIGINT,
    snapshot_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for efficient queries
    UNIQUE(ticker, snapshot_time)
);
```

---

## 4. TRADING SIGNALS

### Main Trading Signals Table
```sql
CREATE TABLE trading_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Signal identification
    ticker VARCHAR(10) NOT NULL,
    signal_type signal_type_enum NOT NULL,
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    
    -- Technical analysis
    rsi_value DECIMAL(5,2),
    macd_signal DECIMAL(8,4),
    volume_ratio DECIMAL(8,4),
    support_level DECIMAL(10,4),
    resistance_level DECIMAL(10,4),
    timeframe VARCHAR(10) DEFAULT '15m',
    
    -- Signal details
    entry_price DECIMAL(10,4),
    stop_loss DECIMAL(10,4),
    take_profit DECIMAL(10,4),
    risk_reward_ratio DECIMAL(5,2),
    
    -- AI explanation
    explanation TEXT,
    
    -- Status and timing
    status signal_status_enum DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE,
    triggered_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Signal History for Tracking Performance
```sql
CREATE TABLE signal_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signal_id UUID NOT NULL REFERENCES trading_signals(id) ON DELETE CASCADE,
    action signal_action_enum NOT NULL,
    price DECIMAL(10,4),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 5. PAPER TRADING

### Paper Trades Table
```sql
CREATE TABLE paper_trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signal_id UUID REFERENCES trading_signals(id),
    
    -- Trade details
    ticker VARCHAR(10) NOT NULL,
    trade_type trade_type_enum NOT NULL,
    quantity INTEGER NOT NULL,
    entry_price DECIMAL(10,4) NOT NULL,
    exit_price DECIMAL(10,4),
    
    -- Trade management
    stop_loss DECIMAL(10,4),
    take_profit DECIMAL(10,4),
    
    -- Performance
    profit_loss DECIMAL(12,2),
    profit_loss_percentage DECIMAL(8,4),
    
    -- Status and timing
    is_open BOOLEAN DEFAULT true,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Portfolio Snapshots for Performance Tracking
```sql
CREATE TABLE portfolio_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Portfolio metrics
    total_value DECIMAL(12,2) NOT NULL,
    cash_balance DECIMAL(12,2) NOT NULL,
    invested_amount DECIMAL(12,2) NOT NULL,
    unrealized_pnl DECIMAL(12,2) DEFAULT 0,
    realized_pnl DECIMAL(12,2) DEFAULT 0,
    
    -- Performance metrics
    total_return_percentage DECIMAL(8,4),
    daily_change DECIMAL(12,2),
    daily_change_percentage DECIMAL(8,4),
    
    -- Metadata
    snapshot_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, snapshot_date)
);
```

---

## 6. ALERTS & NOTIFICATIONS

### User Alert Settings
```sql
CREATE TABLE user_alert_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    
    -- Alert preferences
    min_signal_score INTEGER DEFAULT 80,
    max_alerts_per_day INTEGER DEFAULT 10,
    trading_hours_only BOOLEAN DEFAULT true,
    
    -- Delivery preferences
    email_enabled BOOLEAN DEFAULT true,
    telegram_enabled BOOLEAN DEFAULT false,
    telegram_chat_id VARCHAR(255),
    push_enabled BOOLEAN DEFAULT true,
    
    -- Timing preferences
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Alert Delivery Log
```sql
CREATE TABLE alert_delivery_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signal_id UUID REFERENCES trading_signals(id),
    
    -- Alert details
    alert_type alert_type_enum NOT NULL,
    delivery_channel delivery_channel_enum NOT NULL,
    delivery_status delivery_status_enum DEFAULT 'pending',
    
    -- Content
    subject VARCHAR(255),
    message TEXT,
    
    -- Delivery tracking
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 7. DASHBOARD & USER INTERFACE

### Dashboard Metrics (cached/aggregated data)
```sql
CREATE TABLE dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Signal metrics
    todays_signals INTEGER DEFAULT 0,
    active_signals INTEGER DEFAULT 0,
    avg_signal_score DECIMAL(5,2) DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    new_signals_last_hour INTEGER DEFAULT 0,
    
    -- Performance highlights
    best_performer_symbol VARCHAR(10),
    best_performer_profit DECIMAL(10,2),
    best_performer_percentage DECIMAL(5,2),
    
    -- Latest activity
    latest_signal_symbol VARCHAR(10),
    latest_signal_score INTEGER,
    latest_signal_time TIMESTAMP WITH TIME ZONE,
    alerts_count INTEGER DEFAULT 0,
    alerts_description TEXT,
    
    -- Cache timing
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Watchlists
```sql
CREATE TABLE watchlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);
```

### Watchlist Items
```sql
CREATE TABLE watchlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watchlist_id UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
    ticker VARCHAR(10) NOT NULL,
    notes TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(watchlist_id, ticker)
);
```

---

## 8. SYSTEM ADMINISTRATION

### System Health Metrics
```sql
CREATE TABLE system_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(12,4) NOT NULL,
    metric_unit VARCHAR(20),
    status VARCHAR(20) DEFAULT 'healthy',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Usage Tracking
```sql
CREATE TABLE api_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 9. FUNCTIONS AND TRIGGERS

### Function to Update updated_at Timestamp
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Apply updated_at Trigger to Relevant Tables
```sql
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_signals_updated_at BEFORE UPDATE ON trading_signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paper_trades_updated_at BEFORE UPDATE ON paper_trades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_universe_updated_at BEFORE UPDATE ON stock_universe
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_alert_settings_updated_at BEFORE UPDATE ON user_alert_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 10. ROW LEVEL SECURITY (RLS) POLICIES

### Enable RLS on User-Specific Tables
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_delivery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;
```

### Users Can Only See Their Own Data
```sql
CREATE POLICY users_own_data ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY paper_trades_own_data ON paper_trades
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY portfolio_snapshots_own_data ON portfolio_snapshots
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_alert_settings_own_data ON user_alert_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY alert_delivery_log_own_data ON alert_delivery_log
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY dashboard_metrics_own_data ON dashboard_metrics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY watchlists_own_data ON watchlists
    FOR ALL USING (auth.uid() = user_id);
```

### Watchlist Items Inherit from Watchlist Permissions
```sql
CREATE POLICY watchlist_items_own_data ON watchlist_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM watchlists
            WHERE watchlists.id = watchlist_items.watchlist_id
            AND watchlists.user_id = auth.uid()
        )
    );
```

### Public Read Access for Signals and Stock Data
```sql
CREATE POLICY trading_signals_public_read ON trading_signals
    FOR SELECT USING (true);

CREATE POLICY stock_universe_public_read ON stock_universe
    FOR SELECT USING (true);
```

---

## 11. INITIAL DATA SETUP

### Insert Initial System Health Metrics
```sql
INSERT INTO system_health (metric_name, metric_value, metric_unit, status) VALUES
    ('signal_processing_speed', 0, 'ms', 'healthy'),
    ('database_connections', 0, 'count', 'healthy'),
    ('api_response_time', 0, 'ms', 'healthy'),
    ('active_users', 0, 'count', 'healthy');
```

---

## SCHEMA COMPLETE

### Schema Version Tracking
```sql
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO schema_migrations (version) VALUES ('v1.0_complete_schema');
```

---

## 12. CREATE INDEXES FOR PERFORMANCE

### Indexes for trading_signals Table (for faster queries)
```sql
CREATE INDEX idx_signals_ticker ON trading_signals (ticker);
CREATE INDEX idx_signals_score ON trading_signals (confidence_score);
CREATE INDEX idx_signals_status ON trading_signals (status);
CREATE INDEX idx_signals_created ON trading_signals (created_at);
```

### Indexes for market_data_snapshots
```sql
CREATE INDEX idx_market_data_ticker_time ON market_data_snapshots (ticker, snapshot_time);
```

### Indexes for paper_trades
```sql
CREATE INDEX idx_paper_trades_user ON paper_trades (user_id);
CREATE INDEX idx_paper_trades_ticker ON paper_trades (ticker);
CREATE INDEX idx_paper_trades_open ON paper_trades (is_open);
```

### Indexes for API Usage Tracking
```sql
CREATE INDEX idx_api_usage_user ON api_usage_log (user_id);
CREATE INDEX idx_api_usage_endpoint ON api_usage_log (endpoint);
CREATE INDEX idx_api_usage_created ON api_usage_log (created_at);
```