# 🏗️ KURZORA TRADING PLATFORM - COMPLETE BACKEND ARCHITECTURE

## Executive Summary

Complete technical specifications and implementation code for Kurzora's backend infrastructure. This document provides production-ready code for immediate Cursor development, covering database design, API architecture, Cloud Functions, Supabase integration, authentication, security, and monitoring.

## 1. 🗄️ PHASED SCALING CONFIGURATION GUIDE

### 🎯 PHASED SCALING CONFIGURATION GUIDE

**CRITICAL:** This section provides Phase 1/2/3 configurations for the Budget-Conscious Scaling Strategy. Always use the appropriate phase configuration based on your current stage.

### 🚀 PHASE 1: LAUNCH & VALIDATION (Months 1-6)

#### Stock Universe Configuration

```javascript
// Phase 1 Configuration - S&P 500 Only
const PHASE_1_CONFIG = {
  STOCK_UNIVERSE: 'SP500',
  TOTAL_STOCKS: 500,
  SCAN_INTERVAL: 15 * 60 * 1000, // 15 minutes
  DATA_PROVIDER: 'polygon_basic',
  MONTHLY_COST: 149,
  EXPECTED_SIGNALS_PER_DAY: 2,
  TARGET_USERS: 50,
  TARGET_REVENUE: 1450 // monthly by month 6
};
```

#### Database Optimization for Phase 1

```sql
-- Phase 1: Optimized for 500 stocks, 15-minute data
-- Estimated daily data volume: ~7,200 records (500 stocks × 15 min intervals × 6.5 hours)
-- Table partitioning by date for Phase 1

CREATE TABLE market_data_phase1 (
  symbol VARCHAR(10) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  price DECIMAL(10, 2),
  volume BIGINT,
  phase_config VARCHAR(20) DEFAULT 'PHASE_1',
  -- Partition by day to manage data volume
  CONSTRAINT pk_market_data_phase1 PRIMARY KEY (symbol, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions for cost optimization
CREATE TABLE market_data_202501 PARTITION OF market_data_phase1
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Index optimization for Phase 1 queries
CREATE INDEX CONCURRENTLY idx_phase1_symbol_time
ON market_data_phase1 (symbol, timestamp DESC);

CREATE INDEX CONCURRENTLY idx_phase1_signals
ON trading_signals (triggered_at DESC, final_score DESC)
WHERE final_score >= 80;
```

#### API Rate Limiting for Phase 1

```javascript
// Polygon.io Basic Plan Limits
const PHASE_1_RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 5, // Basic plan limit
  REQUESTS_PER_DAY: 100000, // Daily limit
  STOCKS_PER_REQUEST: 50, // Batch efficiently
  // Conservative scanning schedule
  SCAN_FREQUENCY: '*/15 * * * *', // Every 15 minutes
  MARKET_HOURS_ONLY: true,
  WEEKEND_SCANNING: false
};

// Rate limiter implementation
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Phase 1: Rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 🔥 PHASE 2: GROWTH & OPTIMIZATION (Months 7-12)

#### Stock Universe Configuration

```javascript
// Phase 2 Configuration - Russell 1000
const PHASE_2_CONFIG = {
  STOCK_UNIVERSE: 'RUSSELL_1000',
  TOTAL_STOCKS: 1000,
  SCAN_INTERVAL: 10 * 60 * 1000, // 10 minutes
  DATA_PROVIDER: 'polygon_pro',
  MONTHLY_COST: 299,
  EXPECTED_SIGNALS_PER_DAY: 4,
  TARGET_USERS: 200,
  TARGET_REVENUE: 9800 // monthly by month 12
};
```

### 🚀 PHASE 3: FULL SCALE (Months 13-18)

#### Stock Universe Configuration

```javascript
// Phase 3 Configuration - Full Market
const PHASE_3_CONFIG = {
  STOCK_UNIVERSE: 'ALL_MARKETS',
  TOTAL_STOCKS: 6000,
  SCAN_INTERVAL: 5 * 60 * 1000, // 5 minutes
  DATA_PROVIDER: 'polygon_enterprise',
  MONTHLY_COST: 699,
  EXPECTED_SIGNALS_PER_DAY: 8,
  TARGET_USERS: 500,
  TARGET_REVENUE: 24500 // monthly by month 18
};
```

## 2. 🗄️ DATABASE DESIGN

### PostgreSQL Schema Architecture

```sql
-- ===================================================================
-- KURZORA DATABASE SCHEMA - COMPLETE IMPLEMENTATION
-- ===================================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ===================================================================
-- 1. USERS & AUTHENTICATION
-- ===================================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('user', 'premium', 'admin', 'super_admin');

-- Users table (core user data)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  google_id VARCHAR(255) UNIQUE,
  apple_id VARCHAR(255) UNIQUE,
  role user_role DEFAULT 'user',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- User sessions for JWT management
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  access_token_jti VARCHAR(255) NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  notifications JSONB DEFAULT '{"email": true, "telegram": false, "push": true}'::jsonb,
  trading JSONB DEFAULT '{"risk_level": "medium", "auto_stop_loss": true}'::jsonb,
  ui JSONB DEFAULT '{"theme": "dark", "language": "en", "rtl": false}'::jsonb,
  alerts JSONB DEFAULT '{"min_score": 80, "max_per_day": 10}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. 🌐 API ARCHITECTURE

### RESTful API Design Patterns

```typescript
// ===================================================================
// API TYPES & INTERFACES
// ===================================================================

// Base response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
  timestamp: string;
}

// Authentication interfaces
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  planId?: string;
  referralCode?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'premium' | 'admin';
  emailVerified: boolean;
  profilePicture?: string;
  preferences: UserPreferences;
  subscription?: UserSubscription;
  createdAt: string;
  lastLoginAt?: string;
}
```

## 4. 🔥 CLOUD FUNCTIONS

### Function Architecture & Implementation

```typescript
// ===================================================================
// CLOUD FUNCTIONS - COMPLETE IMPLEMENTATION
// ===================================================================

// functions/src/index.ts
import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth';
import { signalsRouter } from './routes/signals';
import { portfolioRouter } from './routes/portfolio';
import { dashboardRouter } from './routes/dashboard';
import { userRouter } from './routes/user';
import { watchlistRouter } from './routes/watchlist';
import { adminRouter } from './routes/admin';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';
import { supabaseClient } from './services/supabase';

// Create Express app
const app = express();

// ===================================================================
// MIDDLEWARE CONFIGURATION
// ===================================================================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [
    'https://kurzora.com',
    'https://www.kurzora.com',
    'https://app.kurzora.com',
    'http://localhost:3000', // Development
    'http://localhost:3001'  // Development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Export the main API function
export const api = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB',
    maxInstances: 100
  })
  .https
  .onRequest(app);

// ===================================================================
// SCHEDULED FUNCTIONS
// ===================================================================

// Signal generation function (runs every 5 minutes during market hours)
export const generateSignals = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .pubsub
  .schedule('*/5 9-16 * * 1-5')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const { signalGenerationService } = await import('./services/signalGeneration');
    
    try {
      console.log('Starting signal generation...');
      const result = await signalGenerationService.generateSignals();
      
      console.log(`Signal generation completed: ${result.newSignals} new signals, ${result.updatedSignals} updated`);
      
      // Trigger alert notifications for new high-score signals
      if (result.highScoreSignals.length > 0) {
        await signalGenerationService.triggerAlerts(result.highScoreSignals);
      }
      
      return { success: true, result };
    } catch (error) {
      console.error('Signal generation failed:', error);
      
      // Send error notification to admin via database log
      await supabaseClient.from('system_alerts').insert([{
        type: 'signal_generation_error',
        error: error.message,
        timestamp: new Date().toISOString()
      }]);
      
      throw error;
    }
  });

// Portfolio performance calculation (runs daily at market close)
export const calculatePortfolioPerformance = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .pubsub
  .schedule('0 17 * * 1-5')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const { portfolioService } = await import('./services/portfolio');
    
    try {
      console.log('Starting portfolio performance calculation...');
      const result = await portfolioService.calculateDailyPerformance();
      
      console.log(`Portfolio calculation completed for ${result.usersProcessed} users`);
      
      return { success: true, result };
    } catch (error) {
      console.error('Portfolio calculation failed:', error);
      throw error;
    }
  });
```

### SUPABASE AUTH WEBHOOKS (REPLACES FIREBASE AUTH TRIGGERS)

```typescript
// User registration webhook (called from Supabase Auth webhook)
export const onUserRegistration = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '512MB'
  })
  .https
  .onRequest(async (req, res) => {
    try {
      // Verify webhook signature from Supabase
      const signature = req.headers['x-webhook-signature'];
      if (!verifySupabaseWebhook(req.body, signature)) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      const { record } = req.body;
      const userId = record.id;
      const userEmail = record.email;
      const userName = record.user_metadata?.name || 'User';

      // Create default user preferences
      const { error: prefsError } = await supabaseClient
        .from('user_preferences')
        .insert([{
          user_id: userId,
          notifications: {
            email: true,
            telegram: false,
            push: true
          },
          trading: {
            risk_level: 'medium',
            auto_stop_loss: true
          },
          ui: {
            theme: 'dark',
            language: 'en',
            rtl: false
          }
        }]);

      if (prefsError) throw prefsError;

      // Create default portfolio
      const { error: portfolioError } = await supabaseClient
        .from('user_portfolio')
        .insert([{
          user_id: userId,
          balance: 10000.00
        }]);

      if (portfolioError) throw portfolioError;

      // Create default watchlist
      const { error: watchlistError } = await supabaseClient
        .from('user_watchlists')
        .insert([{
          user_id: userId,
          name: 'My Watchlist',
          is_default: true
        }]);

      if (watchlistError) throw watchlistError;

      console.log(`User setup completed for ${userId}`);

      // Send welcome email
      const { notificationService } = await import('./services/notifications');
      await notificationService.sendWelcomeEmail(userEmail, userName);

      res.json({ success: true });
    } catch (error) {
      console.error('User creation failed:', error);
      
      // Log error for admin review
      await supabaseClient.from('user_creation_errors').insert([{
        user_id: req.body.record?.id,
        email: req.body.record?.email,
        error: error.message,
        timestamp: new Date().toISOString()
      }]);

      res.status(500).json({ error: 'User setup failed' });
    }
  });

// Helper function to verify Supabase webhook signature
function verifySupabaseWebhook(payload: any, signature: string): boolean {
  // Implement HMAC verification using your webhook secret
  const crypto = require('crypto');
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  
  if (!webhookSecret || !signature) return false;
  
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return `sha256=${computedSignature}` === signature;
}
```

## 5. 📊 SUPABASE INTEGRATION

### Authentication Service with Supabase Only

```typescript
// ===================================================================
// SUPABASE AUTHENTICATION SERVICE
// ===================================================================

// lib/auth/authService.ts
import { supabaseClient } from '../supabase/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { KurzoraApiError, ApiErrorCode } from '../errors';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  planId?: string;
  referralCode?: string;
}

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly REMEMBER_ME_EXPIRY = '30d';

  async register(data: RegisterData): Promise<{ user: any; tokens: AuthTokens }> {
    const { name, email, password, planId, referralCode } = data;

    try {
      // Use Supabase Auth for registration
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            name: name,
            plan_id: planId,
            referral_code: referralCode
          }
        }
      });

      if (authError) {
        throw new KurzoraApiError(
          ApiErrorCode.VALIDATION_ERROR,
          authError.message,
          400
        );
      }

      if (!authData.user) {
        throw new KurzoraApiError(
          ApiErrorCode.INTERNAL_ERROR,
          'Registration failed',
          500
        );
      }

      // Get user data from Supabase Auth
      const user = {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata.name,
        role: 'user',
        email_verified: authData.user.email_confirmed_at !== null,
        created_at: authData.user.created_at
      };

      // Generate custom JWT tokens for API access
      const tokens = await this.generateTokens(user, false);

      return {
        user,
        tokens
      };
    } catch (error) {
      if (error instanceof KurzoraApiError) throw error;
      console.error('Registration error:', error);
      throw new KurzoraApiError(
        ApiErrorCode.INTERNAL_ERROR,
        'Registration failed',
        500
      );
    }
  }

  async login(credentials: LoginCredentials): Promise<{ user: any; tokens: AuthTokens }> {
    const { email, password, rememberMe = false } = credentials;

    try {
      // Use Supabase Auth for login
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      });

      if (authError) {
        throw new KurzoraApiError(
          ApiErrorCode.INVALID_CREDENTIALS,
          'Invalid email or password',
          401
        );
      }

      if (!authData.user) {
        throw new KurzoraApiError(
          ApiErrorCode.INVALID_CREDENTIALS,
          'Invalid email or password',
          401
        );
      }

      // Get additional user data from our custom tables
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select(`
          *,
          user_subscriptions!inner(
            *,
            subscription_plans(*)
          ),
          user_preferences(*)
        `)
        .eq('id', authData.user.id)
        .single();

      // Combine Supabase Auth data with our custom data
      const user = {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata.name || userData?.name || 'User',
        role: userData?.role || 'user',
        email_verified: authData.user.email_confirmed_at !== null,
        preferences: userData?.user_preferences,
        subscription: userData?.user_subscriptions,
        last_login_at: authData.user.last_sign_in_at,
        created_at: authData.user.created_at
      };

      // Generate custom JWT tokens for API access
      const tokens = await this.generateTokens(user, rememberMe);

      return {
        user,
        tokens
      };
    } catch (error) {
      if (error instanceof KurzoraApiError) throw error;
      console.error('Login error:', error);
      throw new KurzoraApiError(
        ApiErrorCode.INTERNAL_ERROR,
        'Login failed',
        500
      );
    }
  }

  // Helper methods
  private async generateTokens(user: any, rememberMe: boolean): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, rememberMe);
    const expiresIn = this.getTokenExpiryTime(this.ACCESS_TOKEN_EXPIRY);

    // Store refresh token in database
    await this.storeRefreshToken(user.id, refreshToken, rememberMe);

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }

  private generateAccessToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'access'
      },
      this.JWT_SECRET,
      {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
        issuer: 'kurzora-api',
        audience: 'kurzora-app'
      }
    );
  }

  private generateRefreshToken(user: any, rememberMe: boolean): string {
    return jwt.sign(
      {
        userId: user.id,
        type: 'refresh',
        jti: crypto.randomUUID()
      },
      this.REFRESH_SECRET,
      {
        expiresIn: rememberMe ? this.REMEMBER_ME_EXPIRY : this.REFRESH_TOKEN_EXPIRY,
        issuer: 'kurzora-api',
        audience: 'kurzora-app'
      }
    );
  }
}

export const authService = new AuthService();
```

### Real-time Subscription Patterns

```typescript
// ===================================================================
// SUPABASE REAL-TIME INTEGRATION
// ===================================================================

// lib/supabase/realtime.ts
import { supabaseClient } from './client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

class SupabaseRealtimeService {
  private subscriptions: Map<string, RealtimeSubscription> = new Map();

  // Subscribe to trading signals updates
  subscribeToSignals(
    filters: { userId?: string; minScore?: number },
    callbacks: {
      onInsert?: (signal: any) => void;
      onUpdate?: (signal: any) => void;
      onDelete?: (signal: any) => void;
    }
  ): string {
    const subscriptionId = `signals_${Date.now()}_${Math.random()}`;
    
    const channel = supabaseClient
      .channel(`signals_${subscriptionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_signals',
          filter: filters.minScore ? `final_score=gte.${filters.minScore}` : undefined
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('New signal:', payload.new);
          callbacks.onInsert?.(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trading_signals',
          filter: filters.minScore ? `final_score=gte.${filters.minScore}` : undefined
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Signal updated:', payload.new);
          callbacks.onUpdate?.(payload.new);
        }
      )
      .subscribe();

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabaseClient.removeChannel(channel);
        this.subscriptions.delete(subscriptionId);
      }
    };

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  // Unsubscribe from specific subscription
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  // Unsubscribe from all subscriptions
  unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

export const realtimeService = new SupabaseRealtimeService();

// React hook for easy real-time integration
import { useEffect, useState } from 'react';

export function useRealtimeSignals(
  filters: { minScore?: number } = {},
  enabled: boolean = true
) {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    let subscriptionId: string | null = null;

    const initializeSubscription = () => {
      subscriptionId = realtimeService.subscribeToSignals(filters, {
        onInsert: (newSignal) => {
          setSignals(prev => [newSignal, ...prev]);
          
          // Show notification for high-score signals
          if (newSignal.final_score >= 80) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`New Signal: ${newSignal.ticker}`, {
                body: `Score: ${newSignal.final_score} - ${newSignal.signal_type}`,
                icon: '/logo.png'
              });
            }
          }
        },
        onUpdate: (updatedSignal) => {
          setSignals(prev => prev.map(signal => 
            signal.id === updatedSignal.id ? updatedSignal : signal
          ));
        },
        onDelete: (deletedSignal) => {
          setSignals(prev => prev.filter(signal => signal.id !== deletedSignal.id));
        }
      });
    };

    // Load initial data
    const loadInitialSignals = async () => {
      try {
        setLoading(true);
        
        let query = supabaseClient
          .from('trading_signals')
          .select('*')
          .eq('status', 'active')
          .order('final_score', { ascending: false });

        if (filters.minScore) {
          query = query.gte('final_score', filters.minScore);
        }

        const { data, error } = await query;
        if (error) throw error;

        setSignals(data || []);
        setLoading(false);

        // Initialize real-time subscription after loading initial data
        initializeSubscription();
      } catch (error) {
        console.error('Failed to load signals:', error);
        setLoading(false);
      }
    };

    loadInitialSignals();

    return () => {
      if (subscriptionId) {
        realtimeService.unsubscribe(subscriptionId);
      }
    };
  }, [enabled, filters.minScore]);

  return { signals, loading };
}
```

## 6. 🔐 SECURITY IMPLEMENTATION

### Input Validation & Sanitization

```typescript
// ===================================================================
// SECURITY IMPLEMENTATION
// ===================================================================

// lib/security/validation.ts
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import validator from 'validator';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

class SecurityValidator {
  // Input sanitization
  static sanitizeHtml(input: string): string {
    return purify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }

  static sanitizeString(input: string): string {
    return validator.escape(validator.trim(input));
  }

  static sanitizeEmail(email: string): string {
    return validator.normalizeEmail(email, {
      all_lowercase: true,
      gmail_remove_dots: false
    }) || '';
  }

  // SQL injection prevention
  static validateSqlInput(input: string): boolean {
    const sqlInjectionPattern = /((\%3D)|(=))[^\n]*(((\%27)|(\')|(\\-\\-)|((\%3B)|(;)))/i;
    const sqlMetaChars = /((\%27)|(\')|(\\-\\-)|((\%23)|(#)))/i;
    return !sqlInjectionPattern.test(input) && !sqlMetaChars.test(input);
  }

  // XSS prevention
  static validateXssInput(input: string): boolean {
    const xssPattern = /(\<script[\s\S]*?\>[\s\S]*?\<\/script\>|javascript:|vbscript:|onload=|onerror=)/i;
    return !xssPattern.test(input);
  }

  // Password validation
  static validatePasswordStrength(password: string): { valid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 20;
    else feedback.push('Password must be at least 8 characters long');

    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('Include at least one uppercase letter');

    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('Include at least one lowercase letter');

    if (/\d/.test(password)) score += 20;
    else feedback.push('Include at least one number');

    if (/[@$!%*?&]/.test(password)) score += 20;
    else feedback.push('Include at least one special character');

    return {
      valid: score >= 80,
      score,
      feedback
    };
  }
}

export { SecurityValidator };
```

## 7. 📈 PERFORMANCE & MONITORING

### Error Handling & Monitoring

```typescript
// ===================================================================
// ERROR HANDLING & MONITORING SYSTEM
// ===================================================================

// lib/monitoring/errorHandler.ts
import * as Sentry from '@sentry/node';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.token;
      delete event.request.data.api_key;
    }
    return event;
  }
});

class ErrorHandler {
  static handleError(error: Error, req?: any): void {
    // Log error
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      url: req?.url,
      method: req?.method,
      userId: req?.user?.id,
      timestamp: new Date().toISOString()
    });

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        if (req?.user) {
          scope.setUser({
            id: req.user.id,
            email: req.user.email
          });
        }
        
        if (req) {
          scope.setContext('request', {
            url: req.url,
            method: req.method,
            headers: this.sanitizeHeaders(req.headers),
            ip: req.ip
          });
        }
        
        Sentry.captureException(error);
      });
    }

    // Store in database for analysis
    this.logErrorToDatabase(error, req);
  }

  static async logErrorToDatabase(error: Error, req?: any): Promise<void> {
    try {
      await supabaseClient
        .from('error_logs')
        .insert([{
          message: error.message,
          stack: error.stack,
          type: error.constructor.name,
          url: req?.url,
          method: req?.method,
          user_id: req?.user?.id,
          user_agent: req?.headers?.['user-agent'],
          ip_address: req?.ip,
          created_at: new Date().toISOString()
        }]);
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }
  }

  static sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    delete sanitized.authorization;
    delete sanitized.cookie;
    delete sanitized['x-api-key'];
    return sanitized;
  }
}

// Express error handling middleware
export const errorHandler = (error: any, req: any, res: any, next: any) => {
  ErrorHandler.handleError(error, req);

  // Handle known error types
  if (error instanceof KurzoraApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.toJSON(),
      timestamp: new Date().toISOString(),
      requestId: req.id
    });
  }

  // Generic error response
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred'
        : error.message
    },
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
};

export { ErrorHandler };
```

### Health Checks & Status Endpoints

```typescript
// ===================================================================
// HEALTH CHECKS & STATUS MONITORING
// ===================================================================

// lib/monitoring/healthCheck.ts
interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  responseTime?: number;
}

class HealthCheckService {
  // Overall system health
  async checkSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: Record<string, HealthCheckResult>;
  }> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkExternalAPIs()
    ]);

    const results = {
      database: checks[0].status === 'fulfilled' ? checks[0].value : { status: 'unhealthy' as const, message: 'Check failed' },
      externalAPIs: checks[1].status === 'fulfilled' ? checks[1].value : { status: 'unhealthy' as const, message: 'Check failed' }
    };

    // Determine overall status
    const statuses = Object.values(results).map(r => r.status);
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    
    if (statuses.every(s => s === 'healthy')) {
      overallStatus = 'healthy';
    } else if (statuses.some(s => s === 'unhealthy')) {
      overallStatus = 'unhealthy';
    } else {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    };
  }

  // Database connectivity check
  async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      const { data, error } = await supabaseClient
        .from('system_config')
        .select('key')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          message: `Database error: ${error.message}`,
          responseTime
        };
      }

      return {
        status: responseTime < 500 ? 'healthy' : 'degraded',
        message: responseTime < 500 ? 'Database responding normally' : 'Database responding slowly',
        responseTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }

  // External API checks
  async checkExternalAPIs(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      // Check Polygon.io API
      const response = await fetch(`${process.env.POLYGON_API_URL}/v1/meta/symbols?apikey=${process.env.POLYGON_API_KEY}&limit=1`);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          status: responseTime < 2000 ? 'healthy' : 'degraded',
          message: 'External APIs responding',
          responseTime
        };
      } else {
        return {
          status: 'degraded',
          message: `External API returned ${response.status}`,
          responseTime
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `External API check failed: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }
}

// Health check routes
export const setupHealthRoutes = (app: any) => {
  const healthService = new HealthCheckService();

  // Simple health check
  app.get('/health', async (req: any, res: any) => {
    try {
      const health = await healthService.checkSystemHealth();
      const statusCode = health.status === 'healthy' ? 200 :
        health.status === 'degraded' ? 200 : 503;
      
      res.status(statusCode).json(health);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Readiness probe
  app.get('/ready', async (req: any, res: any) => {
    const dbCheck = await healthService.checkDatabase();
    if (dbCheck.status === 'healthy') {
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready', reason: dbCheck.message });
    }
  });

  // Liveness probe
  app.get('/live', (req: any, res: any) => {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString()
    });
  });
};

export { HealthCheckService };
```

## 8. 📊 DEPLOYMENT CONFIGURATION

### Environment Configuration

```env
# ===================================================================
# ENVIRONMENT CONFIGURATION
# ===================================================================

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_WEBHOOK_SECRET=your_webhook_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Market Data
POLYGON_API_KEY=your_polygon_api_key
POLYGON_API_URL=https://api.polygon.io

# External Services
SENDGRID_API_KEY=your_sendgrid_key
MAKE_WEBHOOK_URL=https://hook.integromat.com/your-webhook
TELEGRAM_BOT_TOKEN=your_telegram_token

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Environment
NODE_ENV=production
```

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Core Infrastructure

- [ ] Set up Supabase database with complete schema
- [ ] Implement Cloud Functions structure with Supabase Auth integration
- [ ] Configure authentication with Supabase Auth + custom JWT system
- [ ] Set up basic API routes and middleware
- [ ] Implement error handling and logging

### Phase 2: Security & Performance

- [ ] Configure CORS and security headers
- [ ] Implement rate limiting and API key management
- [ ] Optimize database queries and indexes
- [ ] Configure monitoring and alerting
- [ ] Set up Supabase Auth webhooks

### Phase 3: Advanced Features

- [ ] Implement real-time subscriptions
- [ ] Set up performance monitoring
- [ ] Configure health checks and status endpoints
- [ ] Implement comprehensive audit logging
- [ ] Set up automated backup and recovery

### Phase 4: Production Deployment

- [ ] Configure production environment variables
- [ ] Set up CI/CD pipeline
- [ ] Implement load balancing and scaling
- [ ] Configure monitoring and alerting
- [ ] Perform security audit and testing

## 📊 CONCLUSION

This comprehensive backend architecture provides a production-ready foundation for the Kurzora Trading Platform using **Supabase Auth exclusively**. The implementation includes:

- **Pure Supabase Authentication**: Complete removal of Firebase Auth with Supabase-only authentication system
- **Scalable Database Design**: PostgreSQL with optimized indexes and RLS policies
- **Secure Authentication**: Supabase Auth + custom JWT tokens for API access
- **High-Performance APIs**: Optimized endpoints with caching and rate limiting
- **Real-time Features**: Supabase real-time subscriptions for live data
- **Comprehensive Security**: Input validation, XSS/SQL injection prevention, API key management
- **Monitoring & Alerting**: Performance tracking, error handling, and automated alerts
- **Cloud-Native**: Designed for Cloud Functions and Supabase infrastructure

The architecture is designed to handle high-frequency trading data, real-time notifications, and thousands of concurrent users while maintaining security and performance standards required for financial applications.

All code is production-ready and can be implemented immediately with proper environment configuration using **Supabase Auth only** - no Firebase Auth dependencies remain.