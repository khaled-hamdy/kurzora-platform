// ==================================================================================
// 🎯 SESSION #308: OUTCOME STORAGE - MODULAR DATABASE ARCHITECTURE COMPONENT
// ==================================================================================
// 🚨 PURPOSE: Extract signal outcome tracking into isolated, testable module for AI learning
// 🛡️ ANTI-REGRESSION MANDATE: ALL existing signal tracking functionality preserved EXACTLY
// 📝 SESSION #308 EXTRACTION: Creating outcome storage foundation for future AI learning features
// 🔧 PRESERVATION: Maintain all existing outcome tracking patterns + performance monitoring
// 🚨 CRITICAL SUCCESS: Enable AI learning foundation while preserving production stability
// ⚠️ PROTECTED LOGIC: No interference with existing signal generation or processing
// 🎖️ OUTCOME TRACKING: Signal performance + trade outcomes + AI learning data preparation
// 📊 MODULAR INTEGRATION: Compatible with Session #301-307 extracted components + SignalRepository
// 🏆 TESTING REQUIREMENT: Extracted module must not impact existing signal processing
// 🚀 PRODUCTION IMPACT: Foundation for AI learning while maintaining current system stability
// ==================================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * 🎯 SIGNAL OUTCOME INPUT INTERFACE - SESSION #308 OUTCOME INPUT STRUCTURE
 * 🚨 PURPOSE: Define structure for signal outcome tracking data
 * 🔧 AI LEARNING FOUNDATION: Data structure designed for future AI learning integration
 * 🛡️ PRODUCTION READY: Type-safe structure for outcome tracking operations
 * 📊 OUTCOME TRACKING: Complete signal lifecycle from generation to resolution
 */
export interface SignalOutcomeInput {
  signal_id: number;
  ticker: string;
  original_score: number;
  entry_price: number;
  exit_price?: number;
  actual_return?: number;
  target_hit?: boolean;
  stop_loss_hit?: boolean;
  days_active?: number;
  outcome_type: "pending" | "completed" | "expired" | "stopped";
  performance_rating?: number;
  ai_learning_data?: any;
}

/**
 * 🎯 OUTCOME OPERATION RESULT INTERFACE - SESSION #308 OUTCOME OUTPUT STRUCTURE
 * 🚨 PURPOSE: Standardized result format for outcome operations
 * 🔧 SESSION #308 COMPLIANCE: Comprehensive outcome tracking results
 * 📊 METADATA TRACKING: Complete information for AI learning and analysis
 */
export interface OutcomeOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  count?: number;
  operation: string;
  sessionOrigin: string;
  aiLearningReady: boolean;
}

/**
 * 🎯 PERFORMANCE METRICS INTERFACE - SESSION #308 METRICS STRUCTURE
 * 🚨 PURPOSE: Define structure for signal performance analysis
 * 🔧 AI FOUNDATION: Metrics designed for future AI learning and optimization
 * 📊 ANALYTICS READY: Complete performance tracking for institutional analysis
 */
export interface PerformanceMetrics {
  total_signals: number;
  completed_signals: number;
  success_rate: number;
  average_return: number;
  average_days_active: number;
  ai_confidence_correlation: number;
}

/**
 * 🗄️ OUTCOME STORAGE - SESSION #308 MODULAR EXTRACTION
 * 🚨 CRITICAL FOUNDATION: New module for AI learning data collection and outcome tracking
 * 🛡️ NON-INTERFERENCE: Designed to not impact existing signal generation or processing
 * 🎯 PURPOSE: Track signal outcomes for future AI learning and system optimization
 * 🔧 AI LEARNING FOUNDATION: Prepare data structures and storage patterns for AI integration
 * 🚨 PRODUCTION SAFE: All operations designed to be non-blocking and non-interfering
 * 📊 MODULAR INTEGRATION: Session #301-307 pattern compliance for seamless integration
 * 🎖️ FUTURE READY: Foundation for Phase 2-5 AI features and learning capabilities
 * 🚀 OUTCOME TRACKING: Comprehensive signal lifecycle monitoring with performance analysis
 * 🔧 SESSION #301-307 COMPATIBILITY: Follows established modular pattern exactly
 */
export class OutcomeStorage {
  private supabase: any;

  /**
   * 🔧 INITIALIZE OUTCOME STORAGE - SESSION #308 DATABASE CONNECTION
   * 🎯 PURPOSE: Initialize Supabase connection for outcome tracking
   * 🛡️ PRODUCTION SAFE: Uses same connection patterns as SignalRepository
   * 📊 AI FOUNDATION: Prepare for future AI learning data collection
   */
  constructor() {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing Supabase configuration for OutcomeStorage - check environment variables"
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log(
      "✅ [OUTCOME_STORAGE] Outcome tracking initialized successfully"
    );
  }

  /**
   * 📊 RECORD SIGNAL OUTCOME - SESSION #308 CORE OUTCOME TRACKING
   * 🚨 AI LEARNING FOUNDATION: Core function for collecting signal outcome data
   * 🛡️ NON-BLOCKING: Designed to not interfere with existing signal processing
   * 🔧 PURPOSE: Record signal outcomes for future AI learning and analysis
   * 📊 OUTCOME TRACKING: Complete signal lifecycle from generation to resolution
   * 🎖️ PERFORMANCE MONITORING: Track signal accuracy and trading performance
   * 🚀 FUTURE READY: Data structure prepared for AI learning integration
   *
   * @param outcomeData - Complete outcome data for the signal
   * @returns OutcomeOperationResult with outcome recording details
   */
  async recordSignalOutcome(
    outcomeData: SignalOutcomeInput
  ): Promise<OutcomeOperationResult> {
    console.log(
      `📊 [OUTCOME_STORAGE] Recording outcome for signal ${outcomeData.signal_id} (${outcomeData.ticker})...`
    );

    try {
      // Check if signal_outcomes table exists, create if needed (future enhancement)
      const { data, error } = await this.supabase
        .from("signal_outcomes")
        .insert([
          {
            ...outcomeData,
            recorded_at: new Date().toISOString(),
            session_origin: "SESSION #308",
          },
        ])
        .select();

      if (error) {
        // Non-blocking error handling - outcome tracking should not break signal generation
        console.log(
          `⚠️ [OUTCOME_STORAGE] Outcome recording failed for ${outcomeData.ticker}: ${error.message} (non-blocking)`
        );
        return {
          success: false,
          error: error.message,
          operation: "RECORD_OUTCOME",
          sessionOrigin: "SESSION #308",
          aiLearningReady: false,
        };
      }

      if (data && data.length > 0) {
        console.log(
          `✅ [OUTCOME_STORAGE] Outcome recorded successfully for ${outcomeData.ticker} with ID: ${data[0].id}`
        );
        return {
          success: true,
          data: data[0],
          operation: "RECORD_OUTCOME",
          sessionOrigin: "SESSION #308",
          aiLearningReady: true,
        };
      }

      return {
        success: false,
        error: "No data returned from outcome recording",
        operation: "RECORD_OUTCOME",
        sessionOrigin: "SESSION #308",
        aiLearningReady: false,
      };
    } catch (outcomeError: any) {
      // Non-blocking error handling
      console.log(
        `⚠️ [OUTCOME_STORAGE] Outcome recording exception for ${outcomeData.ticker}: ${outcomeError.message} (non-blocking)`
      );
      return {
        success: false,
        error: outcomeError.message,
        operation: "RECORD_OUTCOME_EXCEPTION",
        sessionOrigin: "SESSION #308",
        aiLearningReady: false,
      };
    }
  }

  /**
   * 📈 GET PERFORMANCE METRICS - SESSION #308 ANALYTICS FOUNDATION
   * 🚨 AI LEARNING FOUNDATION: Analyze signal performance for AI learning
   * 🛡️ NON-BLOCKING: Analytics operations designed to not impact signal processing
   * 🔧 PURPOSE: Calculate performance metrics for system optimization
   * 📊 ANALYTICS: Comprehensive performance analysis for institutional insights
   * 🎖️ AI READY: Metrics prepared for future AI learning integration
   * 🚀 OPTIMIZATION: Data for continuous system improvement
   *
   * @param timeframe_days - Number of days to analyze (default: 30)
   * @returns PerformanceMetrics with comprehensive analysis
   */
  async getPerformanceMetrics(
    timeframe_days: number = 30
  ): Promise<PerformanceMetrics> {
    console.log(
      `📈 [OUTCOME_STORAGE] Calculating performance metrics for last ${timeframe_days} days...`
    );

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframe_days);

      const { data: outcomes, error } = await this.supabase
        .from("signal_outcomes")
        .select("*")
        .gte("recorded_at", cutoffDate.toISOString());

      if (error) {
        console.log(
          `⚠️ [OUTCOME_STORAGE] Performance metrics query failed: ${error.message} (non-blocking)`
        );
        // Return default metrics to not break system
        return {
          total_signals: 0,
          completed_signals: 0,
          success_rate: 0,
          average_return: 0,
          average_days_active: 0,
          ai_confidence_correlation: 0,
        };
      }

      const totalSignals = outcomes?.length || 0;
      const completedSignals =
        outcomes?.filter((o: any) => o.outcome_type === "completed").length ||
        0;
      const successfulSignals =
        outcomes?.filter((o: any) => o.target_hit === true).length || 0;

      const successRate =
        completedSignals > 0 ? (successfulSignals / completedSignals) * 100 : 0;
      const averageReturn =
        outcomes?.length > 0
          ? outcomes.reduce(
              (sum: number, o: any) => sum + (o.actual_return || 0),
              0
            ) / outcomes.length
          : 0;
      const averageDaysActive =
        outcomes?.length > 0
          ? outcomes.reduce(
              (sum: number, o: any) => sum + (o.days_active || 0),
              0
            ) / outcomes.length
          : 0;

      console.log(
        `📈 [OUTCOME_STORAGE] Performance metrics calculated: ${totalSignals} signals, ${successRate.toFixed(
          1
        )}% success rate`
      );

      return {
        total_signals: totalSignals,
        completed_signals: completedSignals,
        success_rate: parseFloat(successRate.toFixed(2)),
        average_return: parseFloat(averageReturn.toFixed(4)),
        average_days_active: parseFloat(averageDaysActive.toFixed(1)),
        ai_confidence_correlation: 0, // Future AI learning feature
      };
    } catch (metricsError: any) {
      console.log(
        `⚠️ [OUTCOME_STORAGE] Performance metrics calculation error: ${metricsError.message} (non-blocking)`
      );
      // Return default metrics to not break system
      return {
        total_signals: 0,
        completed_signals: 0,
        success_rate: 0,
        average_return: 0,
        average_days_active: 0,
        ai_confidence_correlation: 0,
      };
    }
  }

  /**
   * 🤖 PREPARE AI LEARNING DATA - SESSION #308 AI FOUNDATION
   * 🚨 AI LEARNING FOUNDATION: Prepare data structures for future AI learning
   * 🛡️ NON-BLOCKING: Designed to not interfere with existing operations
   * 🔧 PURPOSE: Structure outcome data for future AI learning integration
   * 📊 AI READY: Data formatting prepared for machine learning consumption
   * 🎖️ FUTURE ENHANCEMENT: Foundation for Phase 2-5 AI features
   * 🚀 LEARNING READY: Structured data for pattern recognition and optimization
   *
   * @param limit - Number of recent outcomes to prepare (default: 100)
   * @returns Structured data ready for AI learning consumption
   */
  async prepareAILearningData(limit: number = 100): Promise<any[]> {
    console.log(
      `🤖 [OUTCOME_STORAGE] Preparing AI learning data (${limit} recent outcomes)...`
    );

    try {
      const { data: outcomes, error } = await this.supabase
        .from("signal_outcomes")
        .select(
          `
          signal_id,
          ticker,
          original_score,
          entry_price,
          exit_price,
          actual_return,
          target_hit,
          stop_loss_hit,
          days_active,
          performance_rating,
          ai_learning_data
        `
        )
        .order("recorded_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log(
          `⚠️ [OUTCOME_STORAGE] AI learning data preparation failed: ${error.message} (non-blocking)`
        );
        return [];
      }

      const learningData =
        outcomes?.map((outcome: any) => ({
          // Input features for AI learning
          features: {
            original_score: outcome.original_score,
            entry_price: outcome.entry_price,
            ticker: outcome.ticker,
            // Future: Add technical indicator values, market conditions, etc.
          },
          // Target outcomes for AI learning
          targets: {
            actual_return: outcome.actual_return,
            target_hit: outcome.target_hit,
            days_to_resolution: outcome.days_active,
            performance_rating: outcome.performance_rating,
          },
          // Metadata for AI learning
          metadata: {
            signal_id: outcome.signal_id,
            outcome_quality: outcome.exit_price ? "complete" : "incomplete",
          },
        })) || [];

      console.log(
        `🤖 [OUTCOME_STORAGE] AI learning data prepared: ${learningData.length} training samples ready`
      );
      return learningData;
    } catch (learningError: any) {
      console.log(
        `⚠️ [OUTCOME_STORAGE] AI learning data preparation error: ${learningError.message} (non-blocking)`
      );
      return [];
    }
  }

  /**
   * 📊 GET STORAGE NAME - SESSION #308 MODULAR IDENTIFICATION
   * 🎯 PURPOSE: Identify this storage module for logging and debugging
   * 🔧 USAGE: Used by orchestrator for module tracking and error reporting
   * 🛡️ SESSION #301-307 COMPATIBILITY: Follows same naming pattern as other modular components
   */
  getName(): string {
    return "OutcomeStorage";
  }
}

/**
 * 🗄️ OUTCOME TRACKING HELPER FUNCTIONS - SESSION #308 UTILITY FUNCTIONS
 * 🎯 PURPOSE: Provide outcome tracking in convenient format for signal processing integration
 * 🔧 BRIDGE FUNCTIONS: Enable easy integration with existing signal processing workflow
 * 🛡️ NON-BLOCKING: All operations designed to not interfere with signal generation
 * 📊 AI FOUNDATION: Helper functions prepared for future AI learning integration
 */

/**
 * 📊 RECORD OUTCOME HELPER - SESSION #308 CONVENIENT INTEGRATION
 * 🎯 PURPOSE: Provide simple outcome recording for signal processing integration
 * 🛡️ NON-BLOCKING: Designed to not impact signal generation if outcome recording fails
 */
export async function recordSignalOutcome(
  outcomeData: SignalOutcomeInput
): Promise<boolean> {
  try {
    const storage = new OutcomeStorage();
    const result = await storage.recordSignalOutcome(outcomeData);
    return result.success;
  } catch (error) {
    // Non-blocking - outcome recording failures should not break signal processing
    console.log(
      `⚠️ [OUTCOME_HELPER] Outcome recording failed (non-blocking): ${error}`
    );
    return false;
  }
}

/**
 * 📈 GET METRICS HELPER - SESSION #308 CONVENIENT ANALYTICS
 * 🎯 PURPOSE: Provide simple performance metrics access
 * 🛡️ NON-BLOCKING: Returns default metrics if analytics fail
 */
export async function getPerformanceMetrics(
  timeframe_days: number = 30
): Promise<PerformanceMetrics> {
  try {
    const storage = new OutcomeStorage();
    return await storage.getPerformanceMetrics(timeframe_days);
  } catch (error) {
    console.log(
      `⚠️ [METRICS_HELPER] Performance metrics failed (non-blocking): ${error}`
    );
    // Return safe default metrics
    return {
      total_signals: 0,
      completed_signals: 0,
      success_rate: 0,
      average_return: 0,
      average_days_active: 0,
      ai_confidence_correlation: 0,
    };
  }
}

/**
 * 🤖 PREPARE LEARNING DATA HELPER - SESSION #308 AI FOUNDATION
 * 🎯 PURPOSE: Provide simple AI learning data preparation
 * 🛡️ NON-BLOCKING: Returns empty array if data preparation fails
 */
export async function prepareAILearningData(
  limit: number = 100
): Promise<any[]> {
  try {
    const storage = new OutcomeStorage();
    return await storage.prepareAILearningData(limit);
  } catch (error) {
    console.log(
      `⚠️ [AI_HELPER] AI learning data preparation failed (non-blocking): ${error}`
    );
    return [];
  }
}

// ==================================================================================
// 🎯 SESSION #308 OUTCOME STORAGE EXTRACTION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete outcome tracking foundation + AI learning data preparation + performance analytics + Session #308 modular architecture integration
// 🛡️ NON-INTERFERENCE: All operations designed to be non-blocking and not interfere with existing signal generation + comprehensive error handling + fallback mechanisms
// 🔧 FOUNDATION SUCCESS: Created modular outcome storage following Session #301-307 pattern for future AI learning integration
// 📈 AI LEARNING READY: Structured data collection + performance metrics + learning data preparation for future AI features
// 🎖️ PRODUCTION SAFE: All operations designed to not impact existing signal processing + non-blocking error handling + safe fallback mechanisms
// ⚡ MODULAR BENEFITS: Isolated testing + clean interfaces + professional architecture + AI integration ready + Session #301-307 pattern compliance
// 🚀 FUTURE READY: Session #308 Outcome Storage extraction complete - foundation for Phase 2-5 AI learning features + performance optimization + signal improvement
// 🔄 NEXT SESSION: Session #308C User Tracking extraction or commit Session #308A-B success to GitHub
// 🏆 AI FOUNDATION: Outcome tracking infrastructure prepared for future AI learning without impacting existing signal generation performance
// 🎯 SESSION #308B ACHIEVEMENT: Outcome Storage successfully created with AI learning foundation + non-blocking design + Session #301-307 pattern compliance + future AI integration ready
// ==================================================================================
