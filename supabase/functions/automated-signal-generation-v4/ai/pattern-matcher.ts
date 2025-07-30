/**
 * 🎯 PURPOSE: AI Pattern Recognition - Historical Signal Similarity Matching
 * 🔧 SESSION #317: Pattern Recognition Display - Backend pattern matching engine
 * 🛡️ PRESERVATION: Extends Session #314 Knowledge Engine without modifying existing functionality
 * 📝 HANDOVER: Production-ready pattern similarity search for Session #317 frontend components
 *
 * File: supabase/functions/automated-signal-generation-v4/ai/pattern-matcher.ts
 *
 * This component extends the existing Knowledge Engine to find historically similar signals
 * and provide pattern-based insights for current signals. It leverages the existing
 * signal_outcomes and indicators tables for comprehensive pattern analysis.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { KnowledgeEngine } from "./knowledge-engine.ts";

// 🔧 SESSION #317: TypeScript interfaces matching exact database schema patterns
interface IndicatorData {
  id: string;
  signal_id: string;
  indicator_name: string;
  timeframe: string;
  raw_value: number | null;
  score_contribution: number | null;
  metadata: Record<string, any>;
  created_at: string;
}

interface SignalOutcome {
  id: string;
  signal_id: string;
  user_id?: string;
  outcome_type: "win" | "loss" | "breakeven" | "expired";
  entry_price?: number;
  exit_price?: number;
  profit_loss?: number;
  profit_loss_percentage?: number;
  holding_period_hours?: number;
  actual_vs_predicted_score?: number;
  indicator_accuracy?: Record<string, any>;
  market_conditions?: Record<string, any>;
  signal_created_at?: string;
  trade_executed_at?: string;
  trade_closed_at?: string;
  learning_version?: string;
  quality_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface PatternMatch {
  signal_id: string;
  similarity_score: number; // 0-100
  outcome_type: "win" | "loss" | "breakeven" | "expired";
  profit_loss_percentage?: number;
  holding_period_hours?: number;
  market_conditions?: Record<string, any>;
  pattern_type: string;
  confidence_level: number; // 0-100
  created_at: string;
}

interface PatternAnalysis {
  current_signal_id: string;
  pattern_signature: string;
  similar_patterns: PatternMatch[];
  pattern_confidence: number; // 0-100
  success_rate: number; // 0-100
  avg_profit_loss: number;
  avg_holding_period: number;
  market_context: Record<string, any>;
  sample_size: number;
  generated_at: string;
}

interface IndicatorPattern {
  indicator_name: string;
  timeframes: Record<string, number>; // timeframe -> raw_value
  contribution_pattern: Record<string, number>; // timeframe -> score_contribution
}

/**
 * 🎯 PURPOSE: Pattern Matcher Class - Extends Knowledge Engine functionality
 * 🔧 SESSION #317: Production-ready pattern similarity search system
 * 🛡️ PRESERVATION: Builds on Session #314 AI foundation without modifications
 */
export class PatternMatcher {
  private supabase: any;
  private knowledgeEngine: KnowledgeEngine;

  constructor(supabaseUrl: string, supabaseKey: string) {
    // 🔧 SESSION #317: Initialize Supabase client following established V4 patterns
    this.supabase = createClient(supabaseUrl, supabaseKey);

    // 🔧 SESSION #317: Leverage existing Knowledge Engine algorithms
    this.knowledgeEngine = new KnowledgeEngine(
      supabaseUrl,
      supabaseKey,
      "v1.0"
    );
  }

  /**
   * 🎯 PURPOSE: Find historically similar signals for pattern analysis
   * 🔧 SESSION #317: Main pattern matching function for frontend components
   * 📝 HANDOVER: Call this with current signal_id to get pattern insights
   */
  async findSimilarPatterns(signalId: string): Promise<PatternAnalysis | null> {
    console.log(
      `🔍 Pattern Matcher: Analyzing patterns for signal ${signalId}...`
    );

    try {
      // 🔧 SESSION #317: Get current signal's 28-indicator pattern
      const currentPattern = await this.getCurrentSignalPattern(signalId);
      if (!currentPattern) {
        console.log(`⚠️ No indicator pattern found for signal ${signalId}`);
        return null;
      }

      // 🔧 SESSION #317: Create pattern signature for similarity matching
      const patternSignature = this.createPatternSignature(currentPattern);

      // 🔧 SESSION #317: Find historically similar patterns
      const similarPatterns = await this.searchSimilarHistoricalPatterns(
        currentPattern,
        patternSignature
      );

      if (similarPatterns.length === 0) {
        console.log(
          `📊 No similar historical patterns found for ${patternSignature}`
        );
        return {
          current_signal_id: signalId,
          pattern_signature: patternSignature,
          similar_patterns: [],
          pattern_confidence: 0,
          success_rate: 0,
          avg_profit_loss: 0,
          avg_holding_period: 0,
          market_context: {},
          sample_size: 0,
          generated_at: new Date().toISOString(),
        };
      }

      // 🔧 SESSION #317: Calculate pattern analysis metrics
      const analysis = this.calculatePatternAnalysis(
        signalId,
        patternSignature,
        similarPatterns
      );

      console.log(
        `✅ Pattern analysis complete: Found ${similarPatterns.length} similar patterns`
      );
      return analysis;
    } catch (error) {
      console.error("❌ Pattern matching error:", error);
      return null;
    }
  }

  /**
   * 🎯 PURPOSE: Get current signal's complete indicator pattern
   * 🔧 SESSION #317: Retrieves 28-indicator fingerprint from database
   * 📝 HANDOVER: Creates comprehensive pattern representation
   */
  private async getCurrentSignalPattern(
    signalId: string
  ): Promise<IndicatorPattern[] | null> {
    try {
      // 🔧 SESSION #317: Query indicators table for complete 28-indicator pattern
      const { data: indicators, error } = await this.supabase
        .from("indicators")
        .select(
          "indicator_name, timeframe, raw_value, score_contribution, metadata"
        )
        .eq("signal_id", signalId)
        .order("indicator_name", { ascending: true })
        .order("timeframe", { ascending: true });

      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!indicators || indicators.length === 0) {
        return null;
      }

      // 🔧 SESSION #317: Group indicators by name for pattern structure
      const indicatorGroups: Record<string, IndicatorData[]> = {};
      indicators.forEach((indicator: IndicatorData) => {
        if (!indicatorGroups[indicator.indicator_name]) {
          indicatorGroups[indicator.indicator_name] = [];
        }
        indicatorGroups[indicator.indicator_name].push(indicator);
      });

      // 🔧 SESSION #317: Convert to pattern structure
      const patterns: IndicatorPattern[] = [];
      Object.entries(indicatorGroups).forEach(
        ([indicatorName, indicatorData]) => {
          const timeframes: Record<string, number> = {};
          const contributionPattern: Record<string, number> = {};

          indicatorData.forEach((data) => {
            if (data.raw_value !== null) {
              timeframes[data.timeframe] = data.raw_value;
            }
            if (data.score_contribution !== null) {
              contributionPattern[data.timeframe] = data.score_contribution;
            }
          });

          patterns.push({
            indicator_name: indicatorName,
            timeframes,
            contribution_pattern: contributionPattern,
          });
        }
      );

      return patterns;
    } catch (error) {
      console.error(
        `Error getting current signal pattern for ${signalId}:`,
        error
      );
      return null;
    }
  }

  /**
   * 🎯 PURPOSE: Create pattern signature for similarity matching
   * 🔧 SESSION #317: Generates compact pattern representation
   * 📝 HANDOVER: Creates searchable pattern fingerprint
   */
  private createPatternSignature(patterns: IndicatorPattern[]): string {
    // 🔧 SESSION #317: Create signature based on dominant indicators and contributions
    const significantIndicators = patterns
      .map((pattern) => {
        // Calculate average contribution across timeframes
        const contributions = Object.values(pattern.contribution_pattern);
        const avgContribution =
          contributions.length > 0
            ? contributions.reduce((sum, val) => sum + val, 0) /
              contributions.length
            : 0;

        return {
          indicator: pattern.indicator_name,
          strength: Math.abs(avgContribution),
          direction: avgContribution >= 0 ? "positive" : "negative",
        };
      })
      .filter((item) => item.strength > 5) // Only significant contributors
      .sort((a, b) => b.strength - a.strength) // Sort by strength
      .slice(0, 4) // Top 4 most significant indicators
      .map((item) => `${item.indicator}_${item.direction}`)
      .join("+");

    return significantIndicators || "mixed_pattern";
  }

  /**
   * 🎯 PURPOSE: Search for historically similar patterns in signal_outcomes
   * 🔧 SESSION #317: Leverages existing AI learning data for pattern matching
   * 📝 HANDOVER: Uses real historical data from signal_outcomes table
   */
  private async searchSimilarHistoricalPatterns(
    currentPattern: IndicatorPattern[],
    patternSignature: string
  ): Promise<PatternMatch[]> {
    try {
      // 🔧 SESSION #317: Get all signal outcomes with indicator accuracy data
      const { data: outcomes, error } = await this.supabase
        .from("signal_outcomes")
        .select("*")
        .not("indicator_accuracy", "is", null)
        .not("outcome_type", "eq", "expired")
        .order("created_at", { ascending: false })
        .limit(500); // Recent patterns for relevance

      if (error) {
        throw new Error(`Historical pattern query failed: ${error.message}`);
      }

      if (!outcomes || outcomes.length === 0) {
        return [];
      }

      // 🔧 SESSION #317: Calculate similarity for each historical outcome
      const matches: PatternMatch[] = [];

      for (const outcome of outcomes) {
        if (!outcome.indicator_accuracy) continue;

        // Calculate pattern similarity using existing indicator accuracy data
        const similarity = this.calculatePatternSimilarity(
          currentPattern,
          outcome.indicator_accuracy
        );

        if (similarity > 60) {
          // Minimum similarity threshold
          // 🔧 SESSION #317: Determine pattern type from indicator accuracy
          const historicalPatternType = this.extractPatternType(
            outcome.indicator_accuracy
          );

          matches.push({
            signal_id: outcome.signal_id,
            similarity_score: Math.round(similarity * 100) / 100,
            outcome_type: outcome.outcome_type,
            profit_loss_percentage: outcome.profit_loss_percentage,
            holding_period_hours: outcome.holding_period_hours,
            market_conditions: outcome.market_conditions,
            pattern_type: historicalPatternType,
            confidence_level: this.calculateMatchConfidence(
              similarity,
              outcome.quality_score
            ),
            created_at: outcome.created_at || outcome.signal_created_at || "",
          });
        }
      }

      // 🔧 SESSION #317: Sort by similarity score and return top matches
      return matches
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, 20); // Top 20 most similar patterns
    } catch (error) {
      console.error("Error searching historical patterns:", error);
      return [];
    }
  }

  /**
   * 🎯 PURPOSE: Calculate pattern similarity between current and historical signals
   * 🔧 SESSION #317: Mathematical similarity analysis using indicator values
   * 📝 HANDOVER: Returns similarity score 0-100 based on indicator correlation
   */
  private calculatePatternSimilarity(
    currentPattern: IndicatorPattern[],
    historicalIndicatorAccuracy: Record<string, any>
  ): number {
    let totalSimilarity = 0;
    let comparedIndicators = 0;

    // 🔧 SESSION #317: Compare each indicator across timeframes
    currentPattern.forEach((currentIndicator) => {
      Object.entries(currentIndicator.timeframes).forEach(
        ([timeframe, currentValue]) => {
          const historicalKey = `${currentIndicator.indicator_name}_${timeframe}`;
          const historicalData = historicalIndicatorAccuracy[historicalKey];

          if (
            historicalData &&
            historicalData.raw_value !== null &&
            historicalData.raw_value !== undefined
          ) {
            const historicalValue = historicalData.raw_value;

            // 🔧 SESSION #317: Calculate value similarity using normalized comparison
            const similarity = this.calculateValueSimilarity(
              currentIndicator.indicator_name,
              currentValue,
              historicalValue
            );

            totalSimilarity += similarity;
            comparedIndicators++;
          }
        }
      );
    });

    // 🔧 SESSION #317: Return average similarity across all compared indicators
    return comparedIndicators > 0 ? totalSimilarity / comparedIndicators : 0;
  }

  /**
   * 🎯 PURPOSE: Calculate similarity between two indicator values
   * 🔧 SESSION #317: Indicator-specific similarity algorithms
   * 📝 HANDOVER: Returns 0-100 similarity score for specific indicator types
   */
  private calculateValueSimilarity(
    indicatorName: string,
    currentValue: number,
    historicalValue: number
  ): number {
    // 🔧 SESSION #317: Indicator-specific similarity calculations
    switch (indicatorName) {
      case "RSI":
        // RSI similarity based on overbought/oversold zones
        if (
          (currentValue < 30 && historicalValue < 30) ||
          (currentValue > 70 && historicalValue > 70) ||
          (currentValue >= 30 &&
            currentValue <= 70 &&
            historicalValue >= 30 &&
            historicalValue <= 70)
        ) {
          return Math.max(0, 100 - Math.abs(currentValue - historicalValue));
        }
        return Math.max(0, 80 - Math.abs(currentValue - historicalValue));

      case "MACD":
        // MACD similarity based on signal direction and magnitude
        const currentSign = currentValue >= 0 ? 1 : -1;
        const historicalSign = historicalValue >= 0 ? 1 : -1;

        if (currentSign === historicalSign) {
          const avgValue =
            (Math.abs(currentValue) + Math.abs(historicalValue)) / 2;
          const diff = Math.abs(currentValue - historicalValue);
          return Math.max(0, 100 - (diff / Math.max(avgValue, 1)) * 50);
        }
        return 20; // Different directions get low similarity

      case "Volume":
        // Volume similarity based on relative ratios
        const ratio =
          Math.min(currentValue, historicalValue) /
          Math.max(currentValue, historicalValue);
        return ratio * 100;

      case "Stochastic":
      case "Williams_R":
        // Oscillator similarity similar to RSI
        return Math.max(
          0,
          100 - Math.abs(currentValue - historicalValue) * 1.5
        );

      case "Bollinger":
        // Bollinger position similarity
        return Math.max(
          0,
          100 - Math.abs(currentValue - historicalValue) * 200
        );

      case "SUPPORT_RESISTANCE":
        // S/R similarity based on price relationship (less critical for pattern matching)
        return 70; // Default moderate similarity for S/R

      default:
        // Generic percentage-based similarity
        return Math.max(0, 100 - Math.abs(currentValue - historicalValue));
    }
  }

  /**
   * 🎯 PURPOSE: Extract pattern type from historical indicator accuracy data
   * 🔧 SESSION #317: Determine dominant pattern characteristics
   * 📝 HANDOVER: Creates human-readable pattern descriptions
   */
  private extractPatternType(indicatorAccuracy: Record<string, any>): string {
    const patterns: string[] = [];

    // 🔧 SESSION #317: Analyze indicator combinations for pattern classification
    const indicators = Object.keys(indicatorAccuracy);

    // Check for momentum patterns
    const macdIndicators = indicators.filter((key) => key.includes("MACD"));
    if (macdIndicators.length > 0) {
      const positiveMACD = macdIndicators.some((key) => {
        const data = indicatorAccuracy[key];
        return data.raw_value && data.raw_value > 0;
      });
      patterns.push(positiveMACD ? "bullish_momentum" : "bearish_momentum");
    }

    // Check for oversold/overbought patterns
    const rsiIndicators = indicators.filter((key) => key.includes("RSI"));
    if (rsiIndicators.length > 0) {
      const oversoldRSI = rsiIndicators.some((key) => {
        const data = indicatorAccuracy[key];
        return data.raw_value && data.raw_value < 30;
      });
      const overboughtRSI = rsiIndicators.some((key) => {
        const data = indicatorAccuracy[key];
        return data.raw_value && data.raw_value > 70;
      });

      if (oversoldRSI) patterns.push("oversold_reversal");
      if (overboughtRSI) patterns.push("overbought_reversal");
    }

    // Check for volume patterns
    const volumeIndicators = indicators.filter((key) => key.includes("Volume"));
    if (volumeIndicators.length > 0) {
      const highVolume = volumeIndicators.some((key) => {
        const data = indicatorAccuracy[key];
        return data.raw_value && data.raw_value > 1.5;
      });
      if (highVolume) patterns.push("volume_surge");
    }

    return patterns.length > 0 ? patterns.join("_") : "mixed_signals";
  }

  /**
   * 🎯 PURPOSE: Calculate confidence level for pattern match
   * 🔧 SESSION #317: Combines similarity score with historical quality
   * 📝 HANDOVER: Returns confidence score 0-100 for match reliability
   */
  private calculateMatchConfidence(
    similarityScore: number,
    qualityScore?: number
  ): number {
    // 🔧 SESSION #317: Base confidence on similarity score
    let confidence = similarityScore;

    // 🔧 SESSION #317: Adjust for historical signal quality if available
    if (qualityScore && qualityScore > 0) {
      confidence = confidence * 0.7 + qualityScore * 0.3;
    }

    return Math.round(Math.min(100, Math.max(0, confidence)) * 100) / 100;
  }

  /**
   * 🎯 PURPOSE: Calculate comprehensive pattern analysis from similar matches
   * 🔧 SESSION #317: Statistical analysis of pattern performance
   * 📝 HANDOVER: Returns complete pattern insights for frontend display
   */
  private calculatePatternAnalysis(
    signalId: string,
    patternSignature: string,
    similarPatterns: PatternMatch[]
  ): PatternAnalysis {
    const totalMatches = similarPatterns.length;

    // 🔧 SESSION #317: Calculate success metrics
    const wins = similarPatterns.filter((p) => p.outcome_type === "win").length;
    const successRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

    // 🔧 SESSION #317: Calculate average profit/loss
    const profitLosses = similarPatterns
      .map((p) => p.profit_loss_percentage)
      .filter((pl): pl is number => pl !== null && pl !== undefined);
    const avgProfitLoss =
      profitLosses.length > 0
        ? profitLosses.reduce((sum, pl) => sum + pl, 0) / profitLosses.length
        : 0;

    // 🔧 SESSION #317: Calculate average holding period
    const holdingPeriods = similarPatterns
      .map((p) => p.holding_period_hours)
      .filter((hp): hp is number => hp !== null && hp !== undefined);
    const avgHoldingPeriod =
      holdingPeriods.length > 0
        ? holdingPeriods.reduce((sum, hp) => sum + hp, 0) /
          holdingPeriods.length
        : 0;

    // 🔧 SESSION #317: Calculate pattern confidence based on sample size and consistency
    const avgSimilarity =
      similarPatterns.reduce((sum, p) => sum + p.similarity_score, 0) /
      totalMatches;
    const patternConfidence = Math.min(
      100,
      avgSimilarity * (Math.log(totalMatches + 1) / Math.log(10))
    );

    // 🔧 SESSION #317: Extract market context from recent matches
    const recentMatches = similarPatterns.slice(0, 5);
    const marketContext = this.extractMarketContext(recentMatches);

    return {
      current_signal_id: signalId,
      pattern_signature: patternSignature,
      similar_patterns: similarPatterns,
      pattern_confidence: Math.round(patternConfidence * 100) / 100,
      success_rate: Math.round(successRate * 100) / 100,
      avg_profit_loss: Math.round(avgProfitLoss * 100) / 100,
      avg_holding_period: Math.round(avgHoldingPeriod * 100) / 100,
      market_context: marketContext,
      sample_size: totalMatches,
      generated_at: new Date().toISOString(),
    };
  }

  /**
   * 🎯 PURPOSE: Extract market context from pattern matches
   * 🔧 SESSION #317: Analyze market conditions from historical patterns
   * 📝 HANDOVER: Provides market context for pattern reliability
   */
  private extractMarketContext(matches: PatternMatch[]): Record<string, any> {
    const marketConditions = matches
      .map((m) => m.market_conditions)
      .filter(
        (mc): mc is Record<string, any> => mc !== null && mc !== undefined
      );

    if (marketConditions.length === 0) {
      return { status: "insufficient_market_data" };
    }

    // 🔧 SESSION #317: Analyze market regime distribution
    const regimes = marketConditions
      .map((mc) => mc.market_regime)
      .filter(Boolean);
    const volatilities = marketConditions
      .map((mc) => mc.volatility_level)
      .filter(Boolean);

    const regimeCount: Record<string, number> = {};
    const volatilityCount: Record<string, number> = {};

    regimes.forEach((regime) => {
      regimeCount[regime] = (regimeCount[regime] || 0) + 1;
    });

    volatilities.forEach((vol) => {
      volatilityCount[vol] = (volatilityCount[vol] || 0) + 1;
    });

    return {
      dominant_market_regime: Object.keys(regimeCount).reduce(
        (a, b) => (regimeCount[a] > regimeCount[b] ? a : b),
        "unknown"
      ),
      dominant_volatility: Object.keys(volatilityCount).reduce(
        (a, b) => (volatilityCount[a] > volatilityCount[b] ? a : b),
        "unknown"
      ),
      regime_distribution: regimeCount,
      volatility_distribution: volatilityCount,
      sample_size: marketConditions.length,
    };
  }
}

/**
 * 🎯 PURPOSE: Factory function to create PatternMatcher instance
 * 🔧 SESSION #317: Easy instantiation following established V4 patterns
 * 📝 HANDOVER: Use this to create pattern matcher with environment variables
 */
export function createPatternMatcher(): PatternMatcher {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return new PatternMatcher(supabaseUrl, supabaseKey);
}

/**
 * 🎯 PURPOSE: Export main classes and functions for edge function integration
 * 🔧 SESSION #317: Ready for integration with V4 signal generation system
 * 📝 HANDOVER: Import these in your main edge function for pattern recognition
 */
export default PatternMatcher;
