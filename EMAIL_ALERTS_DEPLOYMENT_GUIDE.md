# 🚀 KURZORA EMAIL ALERTS - DEPLOYMENT GUIDE

## OVERVIEW

This guide implements a permanent solution for email alerts that automatically triggers when signals are inserted via SQL, frontend, or API.

### ✅ WHAT WE BUILT:

1. **Backend API Endpoint**: `/api/process-signal-alerts` - Calls your existing email alerts service
2. **Database Trigger**: Automatically fires when signals are inserted/updated
3. **Complete Integration**: Works with your existing Make.com email system

## 📋 DEPLOYMENT STEPS

### STEP 1: Install Backend Dependencies

```bash
cd backend
npm install node-fetch@3.3.2
```

### STEP 2: Start Your Backend Server

```bash
cd backend
npm run dev
# Should show: Server running on: http://localhost:3001
```

### STEP 3: Deploy Database Trigger

1. **Open Supabase SQL Editor** (dashboard.supabase.com → your project → SQL Editor)

2. **Copy and paste this SQL** (from `database/signal-alerts-trigger.sql`):

```sql
-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the trigger function
CREATE OR REPLACE FUNCTION notify_signal_alerts()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
BEGIN
  -- Update this URL for production deployment
  webhook_url := 'http://localhost:3001/api/process-signal-alerts';

  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW),
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', NOW()
    );

    PERFORM net.http_post(
      url := webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := payload
    );

    RAISE NOTICE 'Signal alerts trigger fired for % on %', TG_OP, TG_TABLE_NAME;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trading_signals_alert_trigger ON trading_signals;
CREATE TRIGGER trading_signals_alert_trigger
  AFTER INSERT OR UPDATE ON trading_signals
  FOR EACH ROW
  EXECUTE FUNCTION notify_signal_alerts();
```

3. **Click "RUN"** to execute the SQL

### STEP 4: Environment Variables

Make sure your backend has these environment variables (`.env` file):

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# or
VITE_SUPABASE_URL=your_supabase_url
```

## 🧪 TESTING THE SYSTEM

### TEST 1: Manual SQL Signal Insertion

1. **Insert a test signal** in Supabase SQL Editor:

```sql
INSERT INTO trading_signals (ticker, signal_type, confidence_score, signals, entry_price, final_score, status)
VALUES ('TEST', 'bullish', 95, '{"1H": 96, "4H": 94, "1D": 93, "1W": 97}'::jsonb, 100.00, 95, 'active');
```

2. **Check backend logs** - You should see:

```
🚀 Processing signal alerts API call...
📊 Processing signal alert for TEST (ID: xxx)
📊 Calculated score for TEST: 95
✅ Found X eligible users for email alerts
📧 Sending email webhook for TEST to X users...
✅ Email webhook sent successfully for TEST
```

3. **Check Make.com** - Your webhook should receive the payload with real user data

### TEST 2: Verify User Queries

Check that real users are being found:

```sql
-- Should return your users with email_enabled:true
SELECT
  u.email,
  u.subscription_tier,
  uas.email_enabled,
  uas.min_signal_score
FROM users u
JOIN user_alert_settings uas ON u.id = uas.user_id
WHERE u.subscription_status IN ('active', 'trial')
  AND uas.email_enabled = true
  AND u.email IS NOT NULL;
```

### TEST 3: API Direct Test

Test the API endpoint directly:

```bash
curl -X POST http://localhost:3001/api/process-signal-alerts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INSERT",
    "table": "trading_signals",
    "record": {
      "id": "test-123",
      "ticker": "AAPL",
      "signals": {"1H": 96, "4H": 94, "1D": 93, "1W": 97},
      "entry_price": 150.00,
      "signal_type": "bullish"
    }
  }'
```

## 🔧 TROUBLESHOOTING

### Issue: "pg_net extension not found"

```sql
-- Run this in Supabase SQL Editor with admin rights:
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Issue: "Backend not receiving trigger calls"

1. Check backend is running on correct port (3001)
2. Update webhook URL in trigger function for production
3. Check Supabase logs for trigger errors

### Issue: "No eligible users found"

Check your users have:

```sql
-- Verify user alert settings
SELECT * FROM user_alert_settings WHERE email_enabled = true;

-- Verify user subscription status
SELECT email, subscription_status FROM users WHERE subscription_status IN ('active', 'trial');
```

### Issue: "Webhook not reaching Make.com"

1. Check webhook URL is exactly: `https://hook.eu2.make.com/oatde944l01b32ng3ffxavgtfjcp1ffk`
2. Verify payload structure matches your Make.com scenario
3. Check Make.com execution logs

## 🌐 PRODUCTION DEPLOYMENT

### For Vercel/Production:

1. **Update webhook URL** in database trigger:

```sql
-- Replace localhost with your production backend URL
webhook_url := 'https://your-backend-domain.com/api/process-signal-alerts';
```

2. **Environment Variables** on Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

3. **Deploy backend** to your hosting platform

## ✅ VERIFICATION CHECKLIST

- [ ] Backend server running with new endpoint
- [ ] Database trigger created and active
- [ ] pg_net extension enabled in Supabase
- [ ] Environment variables configured
- [ ] Test signal insertion triggers email alerts
- [ ] Real users with email_enabled:true are found
- [ ] Make.com receives webhook with real user data
- [ ] Alert delivery logs are created in database

## 🎯 EXPECTED RESULT

When you run:

```sql
INSERT INTO trading_signals (ticker, signal_type, confidence_score, signals, entry_price, final_score, status)
VALUES ('TEST', 'bullish', 95, '{"1H": 96, "4H": 94, "1D": 93, "1W": 97}'::jsonb, 100.00, 95, 'active');
```

**You should get emails sent to**:

- khaled.hamdy.hassan@gmail.com
- hhkhalid@hotmail.com
- Any other users with `email_enabled: true`

**NOT** the hardcoded `pro@kurzora.com`!

## 🚨 IMPORTANT NOTES

1. **Preserve Existing Systems**: This doesn't affect your Telegram alerts or frontend functionality
2. **Score Threshold**: Only signals with score ≥80 trigger email alerts
3. **Daily Limits**: Users won't receive more than their `max_alerts_per_day` setting
4. **Database Logging**: All email deliveries are logged in `alert_delivery_log` table
5. **Production URL**: Remember to update the webhook URL for production deployment

Your email alerts system is now permanently fixed! 🎉
