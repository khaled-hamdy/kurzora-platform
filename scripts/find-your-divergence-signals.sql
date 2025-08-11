-- ==================================================================================
-- 🎯 SESSION #402: FIND YOUR ACTUAL DIVERGENCE SIGNALS
-- ==================================================================================
-- 🚨 FOUND: Your 24 signals exist! They were saved around 18:44 UTC today
-- 📊 TICKERS: PCAR, OKTA, OKE, NOVA, NKE, MRO, MGM, MDLZ, LYB, LVS, etc.
-- 🔧 PURPOSE: Find which of these 24 signals have divergence patterns
-- ==================================================================================

-- STEP 1: Get ALL your recent signals (your 24 signals from today)
SELECT 
    s.ticker,
    s.final_score,
    s.signal_strength,
    s.created_at,
    s.entry_price,
    s.stop_loss,
    s.take_profit
FROM trading_signals s
WHERE s.created_at >= '2025-08-10 18:40:00'  -- Around when your signals were created
ORDER BY s.created_at DESC;

-- STEP 2: Check if ANY of your recent signals have RSI_DIVERGENCE indicators
SELECT 
    s.ticker,
    s.final_score,
    s.created_at,
    i.indicator_name,
    i.timeframe,
    i.raw_value,
    i.score_contribution,
    i.scoring_version,
    i.metadata
FROM trading_signals s
INNER JOIN indicators i ON s.id = i.signal_id
WHERE s.created_at >= '2025-08-10 18:40:00'
  AND i.indicator_name = 'RSI_DIVERGENCE'
ORDER BY s.created_at DESC;

-- STEP 3: If no RSI_DIVERGENCE found, check all indicators for your recent signals
SELECT 
    s.ticker,
    s.final_score,
    i.indicator_name,
    i.timeframe,
    i.score_contribution,
    i.scoring_version
FROM trading_signals s
INNER JOIN indicators i ON s.id = i.signal_id
WHERE s.created_at >= '2025-08-10 18:40:00'
  AND s.ticker IN ('PCAR', 'OKTA', 'OKE', 'NOVA', 'NKE', 'MRO', 'MGM', 'MDLZ', 'LYB', 'LVS')
ORDER BY s.ticker, i.indicator_name;

-- STEP 4: Count indicators per signal (should be 28 + divergence if present)
SELECT 
    s.ticker,
    s.final_score,
    COUNT(i.id) as indicator_count,
    COUNT(CASE WHEN i.indicator_name = 'RSI_DIVERGENCE' THEN 1 END) as divergence_count
FROM trading_signals s
LEFT JOIN indicators i ON s.id = i.signal_id
WHERE s.created_at >= '2025-08-10 18:40:00'
GROUP BY s.id, s.ticker, s.final_score
ORDER BY s.final_score DESC;

-- STEP 5: Look for any Session #402 metadata in recent signals
SELECT 
    s.ticker,
    s.final_score,
    i.indicator_name,
    i.scoring_version,
    i.metadata
FROM trading_signals s
INNER JOIN indicators i ON s.id = i.signal_id
WHERE s.created_at >= '2025-08-10 18:40:00'
  AND (i.scoring_version LIKE '%402%' 
       OR i.scoring_version LIKE '%divergence%'
       OR i.metadata::text LIKE '%402%'
       OR i.metadata::text LIKE '%divergence%')
ORDER BY s.created_at DESC;
