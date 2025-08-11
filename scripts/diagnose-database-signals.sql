-- ==================================================================================
-- 🎯 SESSION #402: DATABASE DIAGNOSIS - FIND WHERE SIGNALS ARE STORED
-- ==================================================================================
-- 🚨 PURPOSE: Step-by-step investigation to find your 24 signals
-- 📊 ISSUE: Postman shows 24 signals, but SQL query shows 0
-- 🔧 DIAGNOSIS: Check different possibilities for where signals might be
-- ==================================================================================

-- STEP 1: Check if any signals exist at all
SELECT 'Total signals in database' as check_type, COUNT(*) as count
FROM trading_signals;

-- STEP 2: Check recent signals (last 24 hours)
SELECT 'Recent signals (24h)' as check_type, COUNT(*) as count
FROM trading_signals 
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- STEP 3: Check if SIRI specifically exists
SELECT 'SIRI signals' as check_type, COUNT(*) as count
FROM trading_signals 
WHERE ticker = 'SIRI';

-- STEP 4: Check what tickers actually exist (top 10 most recent)
SELECT 'Recent tickers' as info, ticker, created_at, final_score
FROM trading_signals 
ORDER BY created_at DESC 
LIMIT 10;

-- STEP 5: Check if indicators table has any RSI_DIVERGENCE records
SELECT 'RSI_DIVERGENCE indicators' as check_type, COUNT(*) as count
FROM indicators 
WHERE indicator_name = 'RSI_DIVERGENCE';

-- STEP 6: Check all indicator names that exist
SELECT 'Indicator types' as info, indicator_name, COUNT(*) as count
FROM indicators 
GROUP BY indicator_name 
ORDER BY count DESC;

-- STEP 7: Check if there are indicators with Session #402 scoring
SELECT 'Session 402 indicators' as check_type, COUNT(*) as count
FROM indicators 
WHERE scoring_version LIKE '%session_402%' 
   OR scoring_version LIKE '%1d_divergence%';

-- STEP 8: Check signal-indicator relationship (any signals with indicators)
SELECT 'Signals with indicators' as check_type, COUNT(DISTINCT s.id) as count
FROM trading_signals s
INNER JOIN indicators i ON s.id = i.signal_id;

-- STEP 9: Look for any metadata containing divergence info
SELECT 'Indicators with divergence metadata' as check_type, COUNT(*) as count
FROM indicators 
WHERE metadata::text LIKE '%divergence%' 
   OR metadata::text LIKE '%SESSION_402%';

-- STEP 10: Check the actual table structure
SELECT 'trading_signals columns' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'trading_signals'
ORDER BY ordinal_position;

SELECT 'indicators columns' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'indicators'
ORDER BY ordinal_position;
