# 🌐 KURZORA PLATFORM - MASTER API ENDPOINTS

## 📋 DOCUMENT STATUS

- **Status:** ✅ **MASTER REFERENCE**
- **Version:** 1.0
- **Last Updated:** December 2024
- **Authority:** Single Source of Truth for ALL API Endpoints

## 🎯 PURPOSE

This document serves as the **ONLY authoritative reference** for all API endpoints in the Kurzora Platform. All other documents, frontend code, and backend implementations MUST conform to this specification.

## 🏗️ API ARCHITECTURE PRINCIPLES

### Base Configuration

```javascript
const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:3001',
  VERSION: 'v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3
}

// Complete Base URL Pattern
const FULL_BASE_URL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`
// Example: http://localhost:3001/api/v1
```

### Response Format Standard

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
  timestamp: string
  requestId?: string
}
```

## 🔐 AUTHENTICATION ENDPOINTS

### Auth Base: `/api/v1/auth`

```javascript
const AUTH_ENDPOINTS = {
  // User Authentication
  LOGIN: 'POST /api/v1/auth/login',
  REGISTER: 'POST /api/v1/auth/register',
  LOGOUT: 'POST /api/v1/auth/logout',
  REFRESH_TOKEN: 'POST /api/v1/auth/refresh',

  // Password Management
  FORGOT_PASSWORD: 'POST /api/v1/auth/forgot-password',
  RESET_PASSWORD: 'POST /api/v1/auth/reset-password',
  CHANGE_PASSWORD: 'POST /api/v1/auth/change-password',

  // Email Verification
  VERIFY_EMAIL: 'POST /api/v1/auth/verify-email',
  RESEND_VERIFICATION: 'POST /api/v1/auth/resend-verification',

  // Session Management
  GET_SESSION: 'GET /api/v1/auth/session',
  LOGOUT_ALL_DEVICES: 'POST /api/v1/auth/logout-all'
}
```

### Frontend Usage Examples:

```javascript
const authAPI = {
  login: (credentials) => 
    POST(`${FULL_BASE_URL}/auth/login`, credentials),
  register: (userData) => 
    POST(`${FULL_BASE_URL}/auth/register`, userData),
  refreshToken: (refreshToken) => 
    POST(`${FULL_BASE_URL}/auth/refresh`, { refreshToken })
}
```

## 👤 USER MANAGEMENT ENDPOINTS

### User Base: `/api/v1/user`

```javascript
const USER_ENDPOINTS = {
  // Profile Management
  GET_PROFILE: 'GET /api/v1/user/profile',
  UPDATE_PROFILE: 'PUT /api/v1/user/profile',
  UPLOAD_AVATAR: 'POST /api/v1/user/profile/avatar',
  DELETE_AVATAR: 'DELETE /api/v1/user/profile/avatar',

  // Preferences
  GET_PREFERENCES: 'GET /api/v1/user/preferences',
  UPDATE_PREFERENCES: 'PUT /api/v1/user/preferences',
  RESET_PREFERENCES: 'POST /api/v1/user/preferences/reset',

  // Security Settings
  GET_SECURITY: 'GET /api/v1/user/security',
  UPDATE_SECURITY: 'PUT /api/v1/user/security',
  ENABLE_2FA: 'POST /api/v1/user/security/2fa/enable',
  DISABLE_2FA: 'POST /api/v1/user/security/2fa/disable',
  VERIFY_2FA: 'POST /api/v1/user/security/2fa/verify',

  // API Keys Management
  LIST_API_KEYS: 'GET /api/v1/user/api-keys',
  CREATE_API_KEY: 'POST /api/v1/user/api-keys',
  UPDATE_API_KEY: 'PUT /api/v1/user/api-keys/:id',
  DELETE_API_KEY: 'DELETE /api/v1/user/api-keys/:id',

  // Account Management
  DELETE_ACCOUNT: 'DELETE /api/v1/user/account',
  EXPORT_DATA: 'GET /api/v1/user/export'
}
```

### Frontend Usage Examples:

```javascript
const userAPI = {
  getProfile: () => 
    GET(`${FULL_BASE_URL}/user/profile`),
  updateProfile: (updates) => 
    PUT(`${FULL_BASE_URL}/user/profile`, updates),
  createApiKey: (keyData) => 
    POST(`${FULL_BASE_URL}/user/api-keys`, keyData)
}
```

## 📊 DASHBOARD ENDPOINTS

### Dashboard Base: `/api/v1/dashboard`

```javascript
const DASHBOARD_ENDPOINTS = {
  // Main Dashboard Data
  GET_METRICS: 'GET /api/v1/dashboard/metrics',
  GET_OVERVIEW: 'GET /api/v1/dashboard/overview',

  // Portfolio Summary
  GET_PORTFOLIO_SUMMARY: 'GET /api/v1/dashboard/portfolio',
  GET_PERFORMANCE_CHART: 'GET /api/v1/dashboard/performance',

  // Recent Activity
  GET_RECENT_ACTIVITY: 'GET /api/v1/dashboard/activity',
  GET_RECENT_TRADES: 'GET /api/v1/dashboard/trades/recent',

  // Alerts & Notifications
  GET_ALERTS: 'GET /api/v1/dashboard/alerts',
  MARK_ALERT_READ: 'PUT /api/v1/dashboard/alerts/:id/read',
  CLEAR_ALL_ALERTS: 'DELETE /api/v1/dashboard/alerts'
}
```

### Query Parameters for Dashboard:

```typescript
interface DashboardParams {
  // Performance Chart
  period?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'
  
  // Recent Activity
  limit?: number
  offset?: number
  
  // Alerts
  unreadOnly?: boolean
  type?: 'signal' | 'trade' | 'system'
}
```

### Frontend Usage Examples:

```javascript
const dashboardAPI = {
  getMetrics: () => 
    GET(`${FULL_BASE_URL}/dashboard/metrics`),
  getPerformance: (period = '1M') => 
    GET(`${FULL_BASE_URL}/dashboard/performance?period=${period}`),
  getRecentTrades: (limit = 5) => 
    GET(`${FULL_BASE_URL}/dashboard/trades/recent?limit=${limit}`)
}
```

## 📈 SIGNALS ENDPOINTS

### Signals Base: `/api/v1/signals`

```javascript
const SIGNALS_ENDPOINTS = {
  // Signal Data
  LIST_SIGNALS: 'GET /api/v1/signals',
  GET_SIGNAL: 'GET /api/v1/signals/:id',
  GET_SIGNAL_HISTORY: 'GET /api/v1/signals/:id/history',

  // Signal Actions
  EXECUTE_SIGNAL: 'POST /api/v1/signals/:id/execute',
  BOOKMARK_SIGNAL: 'POST /api/v1/signals/:id/bookmark',
  UNBOOKMARK_SIGNAL: 'DELETE /api/v1/signals/:id/bookmark',

  // Signal Analytics
  GET_SIGNAL_PERFORMANCE: 'GET /api/v1/signals/performance',
  GET_SIGNAL_STATISTICS: 'GET /api/v1/signals/statistics',

  // Real-time Updates
  SUBSCRIBE_UPDATES: 'WS /api/v1/signals/subscribe',
  UNSUBSCRIBE_UPDATES: 'WS /api/v1/signals/unsubscribe'
}
```

### Query Parameters for Signals:

```typescript
interface SignalsParams {
  // Filtering
  timeframe?: '1H' | '4H' | '1D' | '1W'
  minScore?: number
  maxScore?: number
  sector?: string
  market?: 'US' | 'global'
  shariahCompliant?: boolean
  status?: 'active' | 'triggered' | 'expired'

  // Pagination
  page?: number
  limit?: number

  // Sorting
  sortBy?: 'score' | 'timestamp' | 'symbol'
  sortOrder?: 'asc' | 'desc'
}
```

### Frontend Usage Examples:

```javascript
const signalsAPI = {
  getSignals: (params: SignalsParams) => 
    GET(`${FULL_BASE_URL}/signals`, { params }),
  getSignal: (id: string) => 
    GET(`${FULL_BASE_URL}/signals/${id}`),
  executeSignal: (id: string, tradeData) => 
    POST(`${FULL_BASE_URL}/signals/${id}/execute`, tradeData)
}
```

## 📊 PORTFOLIO ENDPOINTS

### Portfolio Base: `/api/v1/portfolio`

```javascript
const PORTFOLIO_ENDPOINTS = {
  // Portfolio Overview
  GET_PORTFOLIO: 'GET /api/v1/portfolio',
  GET_PERFORMANCE: 'GET /api/v1/portfolio/performance',
  GET_ANALYTICS: 'GET /api/v1/portfolio/analytics',

  // Positions Management
  LIST_POSITIONS: 'GET /api/v1/portfolio/positions',
  GET_POSITION: 'GET /api/v1/portfolio/positions/:id',
  UPDATE_POSITION: 'PUT /api/v1/portfolio/positions/:id',
  CLOSE_POSITION: 'DELETE /api/v1/portfolio/positions/:id',

  // Trade History
  GET_TRADE_HISTORY: 'GET /api/v1/portfolio/trades',
  GET_TRADE: 'GET /api/v1/portfolio/trades/:id',
  EXPORT_TRADES: 'GET /api/v1/portfolio/trades/export',

  // Paper Trading
  EXECUTE_PAPER_TRADE: 'POST /api/v1/portfolio/paper-trade',
  GET_PAPER_TRADES: 'GET /api/v1/portfolio/paper-trades',

  // Portfolio Settings
  GET_SETTINGS: 'GET /api/v1/portfolio/settings',
  UPDATE_SETTINGS: 'PUT /api/v1/portfolio/settings',
  RESET_PORTFOLIO: 'POST /api/v1/portfolio/reset'
}
```

### Query Parameters for Portfolio:

```typescript
interface PortfolioParams {
  // Trade History
  dateFrom?: string // ISO date
  dateTo?: string // ISO date
  symbol?: string
  status?: 'open' | 'closed'
  exitReason?: 'take_profit' | 'stop_loss' | 'manual' | 'expired'

  // Performance
  period?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'
  benchmark?: 'SPY' | 'QQQ' | 'none'

  // Pagination
  page?: number
  limit?: number
}
```

### Frontend Usage Examples:

```javascript
const portfolioAPI = {
  getPortfolio: () => 
    GET(`${FULL_BASE_URL}/portfolio`),
  getTradeHistory: (params: PortfolioParams) => 
    GET(`${FULL_BASE_URL}/portfolio/trades`, { params }),
  executePaperTrade: (tradeData) => 
    POST(`${FULL_BASE_URL}/portfolio/paper-trade`, tradeData)
}
```

## 📝 WATCHLIST ENDPOINTS

### Watchlist Base: `/api/v1/watchlists`

```javascript
const WATCHLIST_ENDPOINTS = {
  // Watchlist Management
  LIST_WATCHLISTS: 'GET /api/v1/watchlists',
  CREATE_WATCHLIST: 'POST /api/v1/watchlists',
  GET_WATCHLIST: 'GET /api/v1/watchlists/:id',
  UPDATE_WATCHLIST: 'PUT /api/v1/watchlists/:id',
  DELETE_WATCHLIST: 'DELETE /api/v1/watchlists/:id',

  // Watchlist Items
  LIST_ITEMS: 'GET /api/v1/watchlists/:id/items',
  ADD_ITEM: 'POST /api/v1/watchlists/:id/items',
  REMOVE_ITEM: 'DELETE /api/v1/watchlists/:id/items/:symbol',
  UPDATE_ITEM_NOTES: 'PUT /api/v1/watchlists/:id/items/:symbol',

  // Bulk Operations
  BULK_ADD_ITEMS: 'POST /api/v1/watchlists/:id/items/bulk',
  BULK_REMOVE_ITEMS: 'DELETE /api/v1/watchlists/:id/items/bulk',

  // Watchlist Sharing (Future)
  SHARE_WATCHLIST: 'POST /api/v1/watchlists/:id/share',
  IMPORT_WATCHLIST: 'POST /api/v1/watchlists/import'
}
```

### Frontend Usage Examples:

```javascript
const watchlistAPI = {
  getWatchlists: () => 
    GET(`${FULL_BASE_URL}/watchlists`),
  addToWatchlist: (watchlistId: string, symbol: string) => 
    POST(`${FULL_BASE_URL}/watchlists/${watchlistId}/items`, { symbol }),
  removeFromWatchlist: (watchlistId: string, symbol: string) => 
    DELETE(`${FULL_BASE_URL}/watchlists/${watchlistId}/items/${symbol}`)
}
```

## 💳 SUBSCRIPTION & BILLING ENDPOINTS

### Billing Base: `/api/v1/billing`

```javascript
const BILLING_ENDPOINTS = {
  // Subscription Management
  GET_SUBSCRIPTION: 'GET /api/v1/billing/subscription',
  UPDATE_SUBSCRIPTION: 'PUT /api/v1/billing/subscription',
  CANCEL_SUBSCRIPTION: 'DELETE /api/v1/billing/subscription',
  REACTIVATE_SUBSCRIPTION: 'POST /api/v1/billing/subscription/reactivate',

  // Payment Methods
  LIST_PAYMENT_METHODS: 'GET /api/v1/billing/payment-methods',
  ADD_PAYMENT_METHOD: 'POST /api/v1/billing/payment-methods',
  UPDATE_PAYMENT_METHOD: 'PUT /api/v1/billing/payment-methods/:id',
  DELETE_PAYMENT_METHOD: 'DELETE /api/v1/billing/payment-methods/:id',
  SET_DEFAULT_PAYMENT: 'POST /api/v1/billing/payment-methods/:id/default',

  // Billing History
  GET_INVOICES: 'GET /api/v1/billing/invoices',
  GET_INVOICE: 'GET /api/v1/billing/invoices/:id',
  DOWNLOAD_INVOICE: 'GET /api/v1/billing/invoices/:id/download',

  // Plans & Pricing
  LIST_PLANS: 'GET /api/v1/billing/plans',
  GET_PLAN: 'GET /api/v1/billing/plans/:id',

  // Stripe Integration
  CREATE_PAYMENT_INTENT: 'POST /api/v1/billing/payment-intent',
  CONFIRM_PAYMENT: 'POST /api/v1/billing/confirm-payment'
}
```

### Frontend Usage Examples:

```javascript
const billingAPI = {
  getSubscription: () => 
    GET(`${FULL_BASE_URL}/billing/subscription`),
  getPlans: () => 
    GET(`${FULL_BASE_URL}/billing/plans`),
  updateSubscription: (planId: string) => 
    PUT(`${FULL_BASE_URL}/billing/subscription`, { planId })
}
```

## 🔔 NOTIFICATIONS ENDPOINTS

### Notifications Base: `/api/v1/notifications`

```javascript
const NOTIFICATION_ENDPOINTS = {
  // Notification Management
  LIST_NOTIFICATIONS: 'GET /api/v1/notifications',
  GET_NOTIFICATION: 'GET /api/v1/notifications/:id',
  MARK_READ: 'PUT /api/v1/notifications/:id/read',
  MARK_UNREAD: 'PUT /api/v1/notifications/:id/unread',
  DELETE_NOTIFICATION: 'DELETE /api/v1/notifications/:id',

  // Bulk Operations
  MARK_ALL_READ: 'PUT /api/v1/notifications/mark-all-read',
  DELETE_ALL: 'DELETE /api/v1/notifications/all',

  // Notification Settings
  GET_SETTINGS: 'GET /api/v1/notifications/settings',
  UPDATE_SETTINGS: 'PUT /api/v1/notifications/settings',

  // Push Notifications
  REGISTER_DEVICE: 'POST /api/v1/notifications/devices',
  UNREGISTER_DEVICE: 'DELETE /api/v1/notifications/devices/:token',

  // Email Preferences
  GET_EMAIL_PREFERENCES: 'GET /api/v1/notifications/email-preferences',
  UPDATE_EMAIL_PREFERENCES: 'PUT /api/v1/notifications/email-preferences',
  UNSUBSCRIBE_EMAIL: 'POST /api/v1/notifications/unsubscribe'
}
```

### Frontend Usage Examples:

```javascript
const notificationAPI = {
  getNotifications: (unreadOnly = false) => 
    GET(`${FULL_BASE_URL}/notifications?unreadOnly=${unreadOnly}`),
  markAsRead: (id: string) => 
    PUT(`${FULL_BASE_URL}/notifications/${id}/read`),
  updateSettings: (settings) => 
    PUT(`${FULL_BASE_URL}/notifications/settings`, settings)
}
```

## 🛠️ ADMIN ENDPOINTS

### Admin Base: `/api/v1/admin`

```javascript
const ADMIN_ENDPOINTS = {
  // User Management
  LIST_USERS: 'GET /api/v1/admin/users',
  GET_USER: 'GET /api/v1/admin/users/:id',
  UPDATE_USER: 'PUT /api/v1/admin/users/:id',
  DELETE_USER: 'DELETE /api/v1/admin/users/:id',
  SUSPEND_USER: 'POST /api/v1/admin/users/:id/suspend',
  ACTIVATE_USER: 'POST /api/v1/admin/users/:id/activate',

  // Signal Management
  LIST_ALL_SIGNALS: 'GET /api/v1/admin/signals',
  CREATE_SIGNAL: 'POST /api/v1/admin/signals',
  UPDATE_SIGNAL: 'PUT /api/v1/admin/signals/:id',
  DELETE_SIGNAL: 'DELETE /api/v1/admin/signals/:id',
  FORCE_SIGNAL_EXPIRY: 'POST /api/v1/admin/signals/:id/expire',

  // System Management
  GET_SYSTEM_STATS: 'GET /api/v1/admin/system/stats',
  GET_SYSTEM_HEALTH: 'GET /api/v1/admin/system/health',
  GET_ERROR_LOGS: 'GET /api/v1/admin/system/logs/errors',
  GET_AUDIT_LOGS: 'GET /api/v1/admin/system/logs/audit',

  // Configuration
  GET_CONFIG: 'GET /api/v1/admin/config',
  UPDATE_CONFIG: 'PUT /api/v1/admin/config',

  // Analytics
  GET_ANALYTICS: 'GET /api/v1/admin/analytics',
  EXPORT_DATA: 'GET /api/v1/admin/export'
}
```

### Frontend Usage Examples:

```javascript
const adminAPI = {
  getUsers: (params) => 
    GET(`${FULL_BASE_URL}/admin/users`, { params }),
  getSystemHealth: () => 
    GET(`${FULL_BASE_URL}/admin/system/health`),
  getAnalytics: (dateRange) => 
    GET(`${FULL_BASE_URL}/admin/analytics`, { params: dateRange })
}
```

## 🌐 PUBLIC ENDPOINTS

### Public Base: `/api/v1/public`

```javascript
const PUBLIC_ENDPOINTS = {
  // Demo & Marketing
  GET_DEMO_SIGNALS: 'GET /api/v1/public/demo/signals',
  GET_PERFORMANCE_STATS: 'GET /api/v1/public/performance',
  GET_TESTIMONIALS: 'GET /api/v1/public/testimonials',

  // Health & Status
  HEALTH_CHECK: 'GET /api/v1/public/health',
  STATUS: 'GET /api/v1/public/status',
  VERSION: 'GET /api/v1/public/version',

  // Contact & Support
  SUBMIT_CONTACT: 'POST /api/v1/public/contact',
  SUBSCRIBE_NEWSLETTER: 'POST /api/v1/public/newsletter'
}
```

### Frontend Usage Examples:

```javascript
const publicAPI = {
  getDemoSignals: () => 
    GET(`${FULL_BASE_URL}/public/demo/signals`),
  submitContact: (contactData) => 
    POST(`${FULL_BASE_URL}/public/contact`, contactData),
  healthCheck: () => 
    GET(`${FULL_BASE_URL}/public/health`)
}
```

## 🔌 WEBSOCKET ENDPOINTS

### WebSocket Base: `ws://localhost:3001/ws/v1`

```javascript
const WEBSOCKET_ENDPOINTS = {
  // Real-time Data Streams
  SIGNALS_STREAM: 'ws://localhost:3001/ws/v1/signals',
  PORTFOLIO_STREAM: 'ws://localhost:3001/ws/v1/portfolio',
  NOTIFICATIONS_STREAM: 'ws://localhost:3001/ws/v1/notifications',

  // Market Data
  MARKET_DATA_STREAM: 'ws://localhost:3001/ws/v1/market-data',
  PRICE_UPDATES: 'ws://localhost:3001/ws/v1/prices',

  // System Updates
  SYSTEM_ALERTS: 'ws://localhost:3001/ws/v1/system-alerts'
}
```

### WebSocket Message Format:

```typescript
interface WebSocketMessage {
  type: 'signal_update' | 'price_update' | 'notification' | 'error'
  data: any
  timestamp: string
  channel: string
}
```

### Frontend Usage Examples:

```javascript
const wsAPI = {
  connectToSignals: (onMessage) => {
    const ws = new WebSocket(WEBSOCKET_ENDPOINTS.SIGNALS_STREAM)
    ws.onmessage = (event) => onMessage(JSON.parse(event.data))
    return ws
  }
}
```

## 📱 FRONTEND API CLIENT IMPLEMENTATION

### Complete API Client Setup

```typescript
// api/client.ts - Master API Client
import axios, { AxiosResponse } from 'axios'

const API_CLIENT = axios.create({
  baseURL: `${process.env.VITE_API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor (Add Auth Token)
API_CLIENT.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor (Handle Errors)
API_CLIENT.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      await refreshToken()
    }
    return Promise.reject(error)
  }
)

// Helper Functions
const GET = (url: string, params?: any) => 
  API_CLIENT.get(url, { params })

const POST = (url: string, data?: any) => 
  API_CLIENT.post(url, data)

const PUT = (url: string, data?: any) => 
  API_CLIENT.put(url, data)

const DELETE = (url: string) => 
  API_CLIENT.delete(url)

export { GET, POST, PUT, DELETE, API_CLIENT }
```

### Centralized API Functions

```typescript
// api/index.ts - Export All API Functions
export const kurzorAPI = {
  // Authentication
  auth: {
    login: (credentials) => POST('/auth/login', credentials),
    register: (userData) => POST('/auth/register', userData),
    logout: () => POST('/auth/logout'),
    refreshToken: (token) => POST('/auth/refresh', { refreshToken: token })
  },

  // User Management
  user: {
    getProfile: () => GET('/user/profile'),
    updateProfile: (data) => PUT('/user/profile', data),
    getPreferences: () => GET('/user/preferences'),
    updatePreferences: (prefs) => PUT('/user/preferences', prefs)
  },

  // Dashboard
  dashboard: {
    getMetrics: () => GET('/dashboard/metrics'),
    getPortfolio: () => GET('/dashboard/portfolio'),
    getPerformance: (period) => GET(`/dashboard/performance?period=${period}`)
  },

  // Signals
  signals: {
    getSignals: (params) => GET('/signals', params),
    getSignal: (id) => GET(`/signals/${id}`),
    executeSignal: (id, tradeData) => POST(`/signals/${id}/execute`, tradeData)
  },

  // Portfolio
  portfolio: {
    getPortfolio: () => GET('/portfolio'),
    getPositions: () => GET('/portfolio/positions'),
    getTradeHistory: (params) => GET('/portfolio/trades', params),
    executeTrade: (tradeData) => POST('/portfolio/paper-trade', tradeData)
  },

  // Watchlists
  watchlists: {
    getWatchlists: () => GET('/watchlists'),
    createWatchlist: (data) => POST('/watchlists', data),
    addToWatchlist: (id, symbol) => POST(`/watchlists/${id}/items`, { symbol })
  }
}
```

## 🚀 IMPLEMENTATION CHECKLIST

### Backend Implementation
- [ ] Create routes following exact endpoint patterns above
- [ ] Implement middleware for authentication, validation, rate limiting
- [ ] Add proper error handling with standardized error codes
- [ ] Set up WebSocket connections for real-time features
- [ ] Implement API versioning (v1 prefix)

### Frontend Implementation
- [ ] Use the centralized API client above
- [ ] Import kurzorAPI in all components
- [ ] Replace any hardcoded endpoints with the standardized ones
- [ ] Implement proper error handling for all API calls
- [ ] Add loading states and retry logic

### Testing & Validation
- [ ] Test all endpoints with proper authentication
- [ ] Validate response formats match ApiResponse interface
- [ ] Test WebSocket connections and message handling
- [ ] Verify error handling and edge cases

## ⚠️ CRITICAL COMPLIANCE RULES

### 🚨 MANDATORY REQUIREMENTS

1. **ALL endpoints MUST follow the exact patterns defined above**
2. **NO deviations from the URL structure without updating this document**
3. **ALL API responses MUST use the standardized ApiResponse interface**
4. **ALL authentication endpoints MUST use JWT Bearer tokens**
5. **ALL WebSocket connections MUST follow the defined message format**

### 🔄 Document Updates

Any changes to API endpoints MUST:
1. Be approved by the technical lead
2. Update this master document first
3. Be communicated to all developers
4. Include migration guide for existing endpoints

### 📞 SUPPORT & QUESTIONS

For any questions about API endpoints or conflicts with existing implementations:
1. **First:** Check this document (single source of truth)
2. **Second:** Update your code to match these specifications
3. **Third:** If you need to change an endpoint, update this document first

**Remember:** This document supersedes ALL other API documentation. When in doubt, follow this specification.

**✅ This master document resolves all API endpoint naming conflicts and serves as the ONLY authoritative reference for the Kurzora Platform.**