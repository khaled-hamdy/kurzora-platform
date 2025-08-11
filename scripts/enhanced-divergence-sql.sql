-- ==================================================================================
-- 🎯 SESSION #402: ENHANCED SQL - COMPLETE SIGNAL ANALYSIS WITH DIVERGENCE
-- ==================================================================================
-- 🚨 PURPOSE: Comprehensive analysis including all 28 indicators + RSI_DIVERGENCE
-- 📊 FEATURES: Signal details, indicators breakdown, divergence pattern detection
-- 🔧 USAGE: Replace 'SIRI' with any ticker to analyze divergence-enhanced signals
-- ==================================================================================

-- Complete stock analysis: Signal details + All indicators (28 standard + divergence)
SELECT 
    -- Signal Overview
    s.ticker,
    s.final_score,
    s.signal_strength,
    s.entry_price,
    s.stop_loss,
    s.take_profit,
    s.risk_reward_ratio,
    s.created_at as signal_created,
    
    -- Indicator Details (28 standard + RSI_DIVERGENCE when present)
    i.indicator_name,
    i.timeframe,
    i.raw_value,
    i.score_contribution,
    i.scoring_version,
    i.metadata,
    
    -- Enhanced Divergence Analysis
    CASE 
        WHEN i.indicator_name = 'RSI_DIVERGENCE' THEN '🎯 DIVERGENCE SIGNAL'
        WHEN i.score_contribution > 0 THEN '📈 BULLISH'
        WHEN i.score_contribution < 0 THEN '📉 BEARISH' 
        ELSE '📊 NEUTRAL'
    END as signal_direction,
    
    -- Divergence Pattern Detection
    CASE 
        WHEN i.indicator_name = 'RSI_DIVERGENCE' AND i.timeframe = '1D' THEN 
            CONCAT('🎯 1D DIVERGENCE: ', 
                   COALESCE(i.metadata->>'divergence_type', 'Pattern'),
                   ' (Confidence: ', 
                   COALESCE(i.metadata->>'confidence', 'N/A'),
                   '%)')
        ELSE NULL
    END as divergence_pattern,
    
    -- Score Impact Analysis
    CASE 
        WHEN i.indicator_name = 'RSI_DIVERGENCE' THEN 
            CONCAT('Bonus: +', ROUND(i.score_contribution, 2), ' points')
        ELSE 
            CONCAT('Impact: ', 
                   CASE WHEN i.score_contribution > 0 THEN '+' ELSE '' END,
                   ROUND(i.score_contribution, 2), ' points')
    END as score_impact

FROM trading_signals s
LEFT JOIN indicators i ON s.id = i.signal_id
WHERE s.ticker = 'SIRI'  -- 🔧 Change this to analyze any ticker
ORDER BY 
    s.created_at DESC,          -- Latest signals first
    -- Custom sorting to show divergence indicators first
    CASE 
        WHEN i.indicator_name = 'RSI_DIVERGENCE' THEN 0
        ELSE 1 
    END,
    i.timeframe,                -- 1H, 4H, 1D, 1W order
    i.indicator_name;           -- Alphabetical within timeframe

-- ==================================================================================
-- 🎯 ADDITIONAL QUERY: FIND ALL DIVERGENCE-ENHANCED SIGNALS
-- ==================================================================================

-- Query to find all signals that have divergence patterns
/*
SELECT DISTINCT
    s.ticker,
    s.final_score,
    s.signal_strength,
    s.created_at,
    i.raw_value as divergence_confidence,
    i.score_contribution as divergence_bonus,
    i.metadata->>'divergence_type' as pattern_type,
    i.metadata->>'pattern_strength' as pattern_strength,
    i.metadata->>'timeframe' as analysis_timeframe,
    i.metadata->>'session' as divergence_session
FROM trading_signals s
INNER JOIN indicators i ON s.id = i.signal_id
WHERE i.indicator_name = 'RSI_DIVERGENCE'
  AND i.timeframe = '1D'
  AND i.scoring_version = 'session_402_1d_divergence'
ORDER BY s.created_at DESC, i.score_contribution DESC;
*/

-- ==================================================================================
-- 🎯 SUMMARY QUERY: DIVERGENCE PERFORMANCE STATISTICS
-- ==================================================================================

-- Performance comparison: Divergence vs Regular signals
/*
SELECT 
    'Divergence Signals' as signal_type,
    COUNT(DISTINCT s.id) as total_signals,
    ROUND(AVG(s.final_score), 2) as avg_score,
    ROUND(AVG(i.score_contribution), 2) as avg_divergence_bonus,
    MIN(s.created_at) as first_signal,
    MAX(s.created_at) as latest_signal
FROM trading_signals s
INNER JOIN indicators i ON s.id = i.signal_id
WHERE i.indicator_name = 'RSI_DIVERGENCE'

UNION ALL

SELECT 
    'Regular Signals' as signal_type,
    COUNT(DISTINCT s.id) as total_signals,
    ROUND(AVG(s.final_score), 2) as avg_score,
    NULL as avg_divergence_bonus,
    MIN(s.created_at) as first_signal,
    MAX(s.created_at) as latest_signal
FROM trading_signals s
LEFT JOIN indicators i ON s.id = i.signal_id AND i.indicator_name = 'RSI_DIVERGENCE'
WHERE i.id IS NULL;
*/
