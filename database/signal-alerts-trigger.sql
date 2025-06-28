-- File: database/signal-alerts-trigger.sql
-- Supabase trigger to automatically process email alerts when signals are inserted/updated
-- 🚀 PRODUCTION: Calls backend API to trigger email alerts

-- Create the trigger function that calls our backend API
CREATE OR REPLACE FUNCTION notify_signal_alerts()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
  response_code INTEGER;
BEGIN
  -- Set the webhook URL to your backend API endpoint
  -- Update this URL to match your production backend URL
  webhook_url := 'http://localhost:3001/api/process-signal-alerts';
  
  -- Only process for INSERT and UPDATE operations
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Build the payload to send to the API
    payload := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW),
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', NOW()
    );
    
    -- Make HTTP request to backend API
    -- Using pg_net extension for HTTP requests in Supabase
    SELECT net.http_post(
      url := webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := payload
    ) INTO response_code;
    
    -- Log the trigger execution (optional)
    RAISE NOTICE 'Signal alerts trigger fired for % on table % with response %', 
      TG_OP, TG_TABLE_NAME, response_code;
  END IF;
  
  -- Return the appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trading_signals_alert_trigger ON trading_signals;

-- Create the trigger on trading_signals table
CREATE TRIGGER trading_signals_alert_trigger
  AFTER INSERT OR UPDATE ON trading_signals
  FOR EACH ROW
  EXECUTE FUNCTION notify_signal_alerts();

-- Enable the pg_net extension if not already enabled (for HTTP requests)
-- This might need to be run with superuser privileges
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Alternative approach using Supabase Edge Functions webhook
-- If pg_net doesn't work, you can use this approach:

/*
-- Alternative trigger function using supabase-js webhook
CREATE OR REPLACE FUNCTION notify_signal_alerts_webhook()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload TEXT;
BEGIN
  -- Set your webhook URL (update for production)
  webhook_url := 'http://localhost:3001/api/process-signal-alerts';
  
  -- Build JSON payload
  payload := json_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW),
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END
  );
  
  -- Perform the HTTP request using pg_net
  PERFORM net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json"}',
    body := payload::jsonb
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trading_signals_webhook_trigger
  AFTER INSERT OR UPDATE ON trading_signals
  FOR EACH ROW
  EXECUTE FUNCTION notify_signal_alerts_webhook();
*/

-- Instructions for manual execution:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Update the webhook_url to your production backend URL
-- 3. Test by inserting a signal manually
-- 4. Check your backend logs to see if the trigger fired

-- Test query to verify trigger works:
-- INSERT INTO trading_signals (ticker, signal_type, confidence_score, signals, entry_price, final_score, status) 
-- VALUES ('TEST', 'bullish', 95, '{"1H": 96, "4H": 94, "1D": 93, "1W": 97}'::jsonb, 100.00, 95, 'active'); 