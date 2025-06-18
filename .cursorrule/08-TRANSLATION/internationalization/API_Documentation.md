# Internationalization API Documentation

## Overview

This document provides comprehensive documentation for the Kurzora trading platform's internationalization APIs, including endpoints, request/response formats, and usage examples.

## Table of Contents

1. Authentication
2. Language Management
3. Currency Management
4. Date/Time Management
5. Content Translation
6. Error Handling
7. Rate Limiting
8. Webhooks

## 1. Authentication

### API Key Authentication

```typescript
interface AuthHeaders {
  "X-API-Key": string;
  "Content-Type": "application/json";
}

// Example request
const headers: AuthHeaders = {
  "X-API-Key": "your-api-key",
  "Content-Type": "application/json",
};
```

### OAuth2 Authentication

```typescript
interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  scope: string[];
  redirectUri: string;
}

// Example OAuth2 flow
const oauth2Config: OAuth2Config = {
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  scope: ["read", "write"],
  redirectUri: "https://your-app.com/callback",
};
```

## 2. Language Management

### Get Supported Languages

```typescript
// GET /api/v1/languages
interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

// Response
interface LanguagesResponse {
  languages: Language[];
  defaultLanguage: string;
}
```

### Set User Language

```typescript
// POST /api/v1/users/language
interface SetLanguageRequest {
  languageCode: string;
  userId: string;
}

// Response
interface SetLanguageResponse {
  success: boolean;
  currentLanguage: string;
  message: string;
}
```

## 3. Currency Management

### Get Supported Currencies

```typescript
// GET /api/v1/currencies
interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
}

// Response
interface CurrenciesResponse {
  currencies: Currency[];
  defaultCurrency: string;
}
```

### Convert Currency

```typescript
// POST /api/v1/currency/convert
interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

// Response
interface CurrencyConversionResponse {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
}
```

## 4. Date/Time Management

### Get Timezone Information

```typescript
// GET /api/v1/timezones
interface Timezone {
  id: string;
  name: string;
  offset: string;
  isDST: boolean;
}

// Response
interface TimezonesResponse {
  timezones: Timezone[];
  serverTimezone: string;
}
```

### Format Date/Time

```typescript
// POST /api/v1/datetime/format
interface DateTimeFormatRequest {
  timestamp: string;
  format: string;
  timezone: string;
}

// Response
interface DateTimeFormatResponse {
  formatted: string;
  timezone: string;
  utc: string;
}
```

## 5. Content Translation

### Translate Content

```typescript
// POST /api/v1/translate
interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}

// Response
interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}
```

### Batch Translation

```typescript
// POST /api/v1/translate/batch
interface BatchTranslationRequest {
  texts: string[];
  sourceLanguage: string;
  targetLanguage: string;
}

// Response
interface BatchTranslationResponse {
  translations: {
    original: string;
    translated: string;
    confidence: number;
  }[];
}
```

## 6. Error Handling

### Error Response Format

```typescript
interface APIError {
  code: string;
  message: string;
  details?: {
    field?: string;
    reason?: string;
  }[];
  timestamp: string;
}

// Example error response
const errorResponse: APIError = {
  code: "INVALID_LANGUAGE",
  message: "The specified language is not supported",
  details: [
    {
      field: "languageCode",
      reason: "Language code must be one of: en, de, ar",
    },
  ],
  timestamp: new Date().toISOString(),
};
```

### Error Codes

| Code                  | Description               |
| --------------------- | ------------------------- |
| INVALID_LANGUAGE      | Unsupported language code |
| INVALID_CURRENCY      | Unsupported currency code |
| INVALID_TIMEZONE      | Unsupported timezone      |
| RATE_LIMIT_EXCEEDED   | Too many requests         |
| AUTHENTICATION_FAILED | Invalid API key           |
| INVALID_REQUEST       | Malformed request         |

## 7. Rate Limiting

### Rate Limit Headers

```typescript
interface RateLimitHeaders {
  "X-RateLimit-Limit": string;
  "X-RateLimit-Remaining": string;
  "X-RateLimit-Reset": string;
}

// Example headers
const rateLimitHeaders: RateLimitHeaders = {
  "X-RateLimit-Limit": "1000",
  "X-RateLimit-Remaining": "999",
  "X-RateLimit-Reset": "1609459200",
};
```

### Rate Limit Policies

| Endpoint                 | Limit | Window   |
| ------------------------ | ----- | -------- |
| /api/v1/languages        | 1000  | 1 hour   |
| /api/v1/currencies       | 1000  | 1 hour   |
| /api/v1/translate        | 100   | 1 minute |
| /api/v1/currency/convert | 1000  | 1 hour   |

## 8. Webhooks

### Webhook Configuration

```typescript
// POST /api/v1/webhooks
interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
}

// Response
interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
  createdAt: string;
}
```

### Webhook Events

```typescript
interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  signature: string;
}

// Example event
const languageChangeEvent: WebhookEvent = {
  id: "evt_123",
  type: "user.language_changed",
  data: {
    userId: "user_123",
    oldLanguage: "en",
    newLanguage: "de",
  },
  timestamp: new Date().toISOString(),
  signature: "sha256=...",
};
```

## 9. SDK Examples

### TypeScript SDK

```typescript
import { KurzoraClient } from "@kurzora/sdk";

const client = new KurzoraClient({
  apiKey: "your-api-key",
  environment: "production",
});

// Language management
const languages = await client.languages.list();
await client.languages.setUserLanguage("user_123", "de");

// Currency conversion
const conversion = await client.currency.convert({
  amount: 100,
  fromCurrency: "USD",
  toCurrency: "EUR",
});

// Translation
const translation = await client.translate({
  text: "Hello, world!",
  sourceLanguage: "en",
  targetLanguage: "de",
});
```

### Python SDK

```python
from kurzora import KurzoraClient

client = KurzoraClient(
    api_key='your-api-key',
    environment='production'
)

# Language management
languages = client.languages.list()
client.languages.set_user_language('user_123', 'de')

# Currency conversion
conversion = client.currency.convert(
    amount=100,
    from_currency='USD',
    to_currency='EUR'
)

# Translation
translation = client.translate(
    text='Hello, world!',
    source_language='en',
    target_language='de'
)
```

## 10. Best Practices

### API Usage

- Use appropriate authentication
- Handle rate limits
- Implement retry logic
- Cache responses when possible
- Use webhooks for real-time updates

### Error Handling

- Implement proper error handling
- Log errors for debugging
- Use appropriate HTTP status codes
- Provide meaningful error messages

### Security

- Use HTTPS for all requests
- Keep API keys secure
- Validate input data
- Implement request signing
- Use webhook signatures

## References

- [API Reference](https://api.kurzora.com/docs)
- [SDK Documentation](https://sdk.kurzora.com)
- [Webhook Guide](https://kurzora.com/webhooks)
- [Rate Limiting Guide](https://kurzora.com/rate-limits)
- [Error Codes](https://kurzora.com/errors)
