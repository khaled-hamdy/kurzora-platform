# KURZORA TRADING PLATFORM - MASTER DATABASE SCHEMA

**PostgreSQL with Supabase - Version: 1.0 (Final)**

## Enable Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

## 1. ENUMS & CUSTOM TYPES

```sql
-- Signal types
CREATE TYPE signal_type_enum AS ENUM ('bullish', 'bearish', 'neutral');

-- Signal status
CREATE TYPE signal_status_enum AS ENUM ('active', 'triggered', 'expired', 'cancelled');

-- Signal actions for history tracking
CREATE TYPE signal_action_enum AS ENUM ('generated', 'triggered', 'stop_loss_hit', 'take_profit_hit', 'expired', 'manual_close');

-- Alert types
CREATE TYPE alert_type_enum AS ENUM ('signal_alert', 'trade_update', 'portfolio_summary', 'account_notification');

-- Delivery channels
CREATE TYPE delivery_channel_enum AS ENUM ('email', 'telegram', 'push', 'sms');

-- Delivery status
CREATE TYPE delivery_status_enum AS ENUM ('pending', 'sent', 'delivered', 'failed', 'bounced');

-- Subscription tiers
CREATE TYPE subscription_tier_enum AS ENUM ('starter', 'professional', 'elite');

-- Trade types
CREATE TYPE trade_type_enum AS ENUM ('buy', 'sell');
```

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

## 3. STOCK UNIVERSE & MARKET DATA

### Stock Universe (all stocks we track)

```sql
CREATE TABLE stock_universe (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker VARCHAR(10) UNIQUE NOT NULL,
  company_name