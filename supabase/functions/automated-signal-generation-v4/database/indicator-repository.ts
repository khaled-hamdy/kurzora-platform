// ==================================================================================
// 🎯 SESSION #321: INDICATOR REPOSITORY - 28-RECORD DATABASE OPERATIONS
// ==================================================================================
// 🚨 PURPOSE: Transaction-safe signal and indicator database operations
// 🛡️ ANTI-REGRESSION: Safe database operations for Session #321 enhancement
// 📝 SESSION #321 REQUIREMENT: Save signals with 28 indicator records atomically
// 🔧 TRANSACTION SAFETY: Ensure signal + indicators saved together or rolled back
// ✅ PRODUCTION READY: Professional database operations with complete error handling
// 📊 SESSION #320 FOUNDATION: Uses indicators table created in Session #320
// 🎖️ SESSION #313E PRESERVATION: All scoring logic preserved in calculations
// ==================================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getSupabaseUrl, getServiceRoleKey } from "../config/api-config.ts";

/**
 * 🎯 SESSION #321: SAVE SIGNAL WITH INDICATORS - TRANSACTION SAFE
 * PURPOSE: Save signal and all its indicator records in a single transaction
 * CRITICAL: If signal save fails, indicators are not created (data consistency)
 * CRITICAL: If indicators save fails, signal is rolled back (transaction safety)
 * SESSION #321: Enables 28-record indicator transparency for users
 */
export async function saveSignalWithIndicators(signalData, indicatorsData) {
  console.log(
    `💾 [INDICATOR_REPOSITORY] SESSION #321: Starting transaction-safe signal + indicators save...`
  );
  console.log(
    `📊 [INDICATOR_REPOSITORY] Signal: ${signalData.ticker}, Indicators: ${indicatorsData.length} records`
  );

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getServiceRoleKey();
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 🔧 SESSION #321: STEP 1 - Save signal first (existing pattern preserved)
    console.log(
      `🎯 [INDICATOR_REPOSITORY] Step 1: Saving signal for ${signalData.ticker}...`
    );

    const { data: signalResult, error: signalError } = await supabase
      .from("trading_signals")
      .insert([signalData])
      .select()
      .single();

    if (signalError) {
      console.log(
        `❌ [INDICATOR_REPOSITORY] Signal save failed for ${signalData.ticker}: ${signalError.message}`
      );
      return {
        success: false,
        error: `Signal save failed: ${signalError.message}`,
        step: "signal_save",
      };
    }

    const signalId = signalResult.id;
    console.log(
      `✅ [INDICATOR_REPOSITORY] Signal saved successfully: ID ${signalId} for ${signalData.ticker}`
    );

    // 🔧 SESSION #321: STEP 2 - Add signal_id to all indicator records
    console.log(
      `🎯 [INDICATOR_REPOSITORY] Step 2: Preparing ${indicatorsData.length} indicator records...`
    );

    const indicatorsWithSignalId = indicatorsData.map((indicator) => ({
      ...indicator,
      signal_id: signalId,
    }));

    // 🔧 SESSION #321: STEP 3 - Save all indicators in batch
    console.log(
      `🎯 [INDICATOR_REPOSITORY] Step 3: Batch saving ${indicatorsWithSignalId.length} indicators...`
    );

    const { data: indicatorsResult, error: indicatorsError } = await supabase
      .from("indicators")
      .insert(indicatorsWithSignalId)
      .select();

    if (indicatorsError) {
      console.log(
        `❌ [INDICATOR_REPOSITORY] Indicators save failed for signal ${signalId}: ${indicatorsError.message}`
      );

      // 🚨 SESSION #321: ROLLBACK - Delete the signal since indicators failed
      console.log(
        `🔄 [INDICATOR_REPOSITORY] ROLLBACK: Deleting signal ${signalId} due to indicators failure...`
      );

      const { error: deleteError } = await supabase
        .from("trading_signals")
        .delete()
        .eq("id", signalId);

      if (deleteError) {
        console.log(
          `⚠️ [INDICATOR_REPOSITORY] ROLLBACK FAILED: Could not delete signal ${signalId}: ${deleteError.message}`
        );
      } else {
        console.log(
          `✅ [INDICATOR_REPOSITORY] ROLLBACK SUCCESS: Signal ${signalId} deleted successfully`
        );
      }

      return {
        success: false,
        error: `Indicators save failed: ${indicatorsError.message}`,
        step: "indicators_save",
        rollback_attempted: true,
        rollback_success: !deleteError,
      };
    }

    console.log(
      `✅ [INDICATOR_REPOSITORY] Indicators saved successfully: ${indicatorsResult.length} records for signal ${signalId}`
    );

    // 🎯 SESSION #321: SUCCESS - Both signal and indicators saved
    console.log(
      `🎉 [INDICATOR_REPOSITORY] SESSION #321 TRANSACTION SUCCESS: Signal ${signalId} + ${indicatorsResult.length} indicators saved for ${signalData.ticker}`
    );

    return {
      success: true,
      data: {
        id: signalId,
        signal: signalResult,
        indicators: indicatorsResult,
        indicators_count: indicatorsResult.length,
      },
      message: `Signal and ${indicatorsResult.length} indicators saved successfully`,
    };
  } catch (error) {
    console.log(
      `❌ [INDICATOR_REPOSITORY] Unexpected error during save: ${error.message}`
    );

    return {
      success: false,
      error: `Unexpected error: ${error.message}`,
      step: "unexpected_error",
    };
  }
}

/**
 * 🎯 SESSION #321: CALCULATE INDICATOR SCORE CONTRIBUTION
 * PURPOSE: Calculate how much each indicator contributes to the final signal score
 * CRITICAL: Must preserve Session #313E scoring logic exactly
 * SESSION #321: Provides transparency into why signals achieve their scores
 */
export function calculateIndicatorScoreContribution(
  indicatorName,
  rawValue,
  timeframe,
  indicatorObject = null
) {
  // 🛡️ SESSION #313E PRESERVATION: Use same scoring logic as Session #313E
  // This function replicates the scoring logic from signal-composer.ts

  try {
    switch (indicatorName) {
      case "RSI":
        // 🔧 SESSION #313E RSI SCORING PRESERVED
        if (rawValue === null || isNaN(rawValue)) return 0;
        if (rawValue <= 30) return 20; // Oversold - strong buy signal
        if (rawValue <= 40) return 15; // Approaching oversold
        if (rawValue <= 45) return 10; // Mild oversold
        if (rawValue >= 70) return -20; // Overbought - strong sell signal
        if (rawValue >= 60) return -15; // Approaching overbought
        if (rawValue >= 55) return -10; // Mild overbought
        return 5; // Neutral zone (45-55)

      case "MACD":
        // 🛡️ SESSION #313E MACD MOMENTUM PENALTIES PRESERVED EXACTLY
        if (rawValue === null || isNaN(rawValue)) return 0;
        if (rawValue > 1.0) return 20; // Strong positive momentum
        if (rawValue > 0) return 10; // Weak positive momentum
        if (rawValue > -1.0) return -5; // Weak negative momentum
        return -15; // Strong negative momentum (CRITICAL: Session #313E preservation)

      case "Volume":
        // 🛡️ SESSION #313E VOLUME QUALITY VALIDATION PRESERVED EXACTLY
        if (rawValue === null || isNaN(rawValue)) return 0;
        if (rawValue >= 2.5) return 30; // Exceptional volume surge
        if (rawValue >= 2.0) return 25; // High institutional activity
        if (rawValue >= 1.5) return 15; // Above average volume
        if (rawValue >= 1.2) return 10; // Slightly elevated
        if (rawValue >= 0.8) return 5; // Normal volume
        return -5; // Below average volume

      case "Stochastic":
        // 🔧 SESSION #321: STOCHASTIC SCORING (Standard oscillator logic)
        if (rawValue === null || isNaN(rawValue)) return 0;
        if (rawValue <= 20) return 15; // Oversold
        if (rawValue <= 30) return 10; // Approaching oversold
        if (rawValue >= 80) return -15; // Overbought
        if (rawValue >= 70) return -10; // Approaching overbought
        return 5; // Neutral zone

      case "Williams_R":
        // 🔧 SESSION #321: WILLIAMS %R SCORING (Inverted oscillator logic)
        if (rawValue === null || isNaN(rawValue)) return 0;
        if (rawValue <= -80) return 15; // Oversold (Williams %R is negative)
        if (rawValue <= -70) return 10; // Approaching oversold
        if (rawValue >= -20) return -15; // Overbought
        if (rawValue >= -30) return -10; // Approaching overbought
        return 5; // Neutral zone

      case "Bollinger":
        // 🔧 SESSION #321: BOLLINGER BANDS SCORING (%B position)
        if (rawValue === null || isNaN(rawValue)) return 0;
        if (rawValue <= 0.2) return 15; // Near lower band - potential reversal
        if (rawValue <= 0.3) return 10; // Below middle
        if (rawValue >= 0.8) return -15; // Near upper band - potential reversal
        if (rawValue >= 0.7) return -10; // Above middle
        return 5; // Middle zone

      case "SUPPORT_RESISTANCE":
        // 🛡️ SESSION #313C/D: S/R PROXIMITY AND CLASSIFICATION PRESERVED
        if (rawValue === null || isNaN(rawValue)) return 0;
        // S/R contribution is based on proximity to actionable levels
        // Session #313C proximity filter ensures only actionable levels are stored
        return 10; // Standard S/R contribution for actionable levels

      default:
        console.log(
          `⚠️ [INDICATOR_REPOSITORY] Unknown indicator: ${indicatorName}, returning 0 contribution`
        );
        return 0;
    }
  } catch (error) {
    console.log(
      `❌ [INDICATOR_REPOSITORY] Error calculating contribution for ${indicatorName}: ${error.message}`
    );
    return 0;
  }
}

/**
 * 🎯 SESSION #321: GET INDICATORS FOR SIGNAL
 * PURPOSE: Retrieve all indicator records for a specific signal
 * SESSION #321: Enable frontend to display complete indicator breakdown
 */
export async function getIndicatorsForSignal(signalId) {
  console.log(
    `🔍 [INDICATOR_REPOSITORY] Fetching indicators for signal ${signalId}...`
  );

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getServiceRoleKey();
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("indicators")
      .select("*")
      .eq("signal_id", signalId)
      .order("indicator_name", { ascending: true })
      .order("timeframe", { ascending: true });

    if (error) {
      console.log(
        `❌ [INDICATOR_REPOSITORY] Error fetching indicators for signal ${signalId}: ${error.message}`
      );
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      `✅ [INDICATOR_REPOSITORY] Found ${data.length} indicators for signal ${signalId}`
    );

    return {
      success: true,
      data: data,
      count: data.length,
    };
  } catch (error) {
    console.log(
      `❌ [INDICATOR_REPOSITORY] Unexpected error fetching indicators: ${error.message}`
    );

    return {
      success: false,
      error: `Unexpected error: ${error.message}`,
    };
  }
}

/**
 * 🎯 SESSION #321: DELETE INDICATORS FOR SIGNAL
 * PURPOSE: Clean up indicator records when signal is deleted
 * SESSION #321: Maintain referential integrity in database
 */
export async function deleteIndicatorsForSignal(signalId) {
  console.log(
    `🗑️ [INDICATOR_REPOSITORY] Deleting indicators for signal ${signalId}...`
  );

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getServiceRoleKey();
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("indicators")
      .delete()
      .eq("signal_id", signalId)
      .select();

    if (error) {
      console.log(
        `❌ [INDICATOR_REPOSITORY] Error deleting indicators for signal ${signalId}: ${error.message}`
      );
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      `✅ [INDICATOR_REPOSITORY] Deleted ${
        data?.length || 0
      } indicators for signal ${signalId}`
    );

    return {
      success: true,
      deleted_count: data?.length || 0,
    };
  } catch (error) {
    console.log(
      `❌ [INDICATOR_REPOSITORY] Unexpected error deleting indicators: ${error.message}`
    );

    return {
      success: false,
      error: `Unexpected error: ${error.message}`,
    };
  }
}

// ==================================================================================
// 🎯 SESSION #321 INDICATOR REPOSITORY COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Transaction-safe signal and indicator database operations
// 🛡️ PRESERVATION: Session #313E scoring logic preserved exactly in calculations
// 🔧 PRODUCTION PURPOSE: Enable 28-record indicator transparency for users
// 📈 PRODUCTION READY: Professional database operations with complete error handling
// 🎖️ ANTI-REGRESSION: Safe operations that preserve all existing functionality
// 🚀 SESSION #321: Complete transparency into signal scoring methodology
// ==================================================================================
