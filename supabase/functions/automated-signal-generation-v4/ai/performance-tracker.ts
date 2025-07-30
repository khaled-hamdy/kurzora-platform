/**
 * 🎯 PURPOSE: AI Learning Foundation - Performance Tracking System
 * 🔧 SESSION #314: Created for signal outcome analysis and AI learning
 * 🛡️ PRESERVATION: Integrates with existing trading_signals, paper_trades, indicators tables
 * 📝 HANDOVER: Complete production-ready performance tracking for signal learning
 *
 * File: supabase/functions/automated-signal-generation-v4/ai/performance-tracker.ts
 *
 * This component tracks trading signal performance and feeds learning data back to the AI system.
 * It analyzes outcomes from paper trades and builds intelligence for future signal generation.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔧 SESSION #314: TypeScript interfaces matching exact database schema patterns
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

interface PaperTrade {
  id: string;
  user_id: string;
  signal_id?: string;
  ticker: string;
  trade_type: string;
  quantity: number;
  entry_price: number;
  exit_price?: number;
  stop_loss?: number;
  take_profit?: number;
  profit_loss?: number;
  profit_loss_percentage?: number;
  is_open: boolean;
  opened_at?: string;
  closed_at?: string;
  current_price?: number;
  created_at?: string;
  updated_at?: string;
}

interface TradingSignal {
  id: string;
  ticker: string;
  signal_type: string;
  confidence_score: number;
  timeframe?: string;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  status?: string;
  created_at?: string;
  sector?: string;
  market?: string;
  signals?: Record<string, any>;
}

interface IndicatorData {
  id: string;
  signal_id: string;
  indicator_name: string;
  timeframe: string;
  raw_value?: number;
  score_contribution?: number;
  metadata?: Record<string, any>;
}

interface MarketRegime {
  regime: "bull" | "bear" | "sideways";
  volatility_level: "high" | "medium" | "low";
  market_trend_strength: number;
  volatility_percentile: number;
  sector_performance?: Record<string, number>;
}

/**
 * 🎯 PURPOSE: Main Performance Tracker Class
 * 🔧 SESSION #314: Production-ready performance tracking system
 * 🛡️ PRESERVATION: Does not modify existing tables, only reads and creates outcomes
 */
export class PerformanceTracker {
  private supabase: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    // 🔧 SESSION #314: Initialize Supabase client following V4 patterns
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * 🎯 PURPOSE: Track outcomes from paper trades automatically
   * 🔧 SESSION #314: Links paper_trades back to original trading_signals
   * 📝 HANDOVER: Call this to sync closed trades into signal_outcomes table
   */
  async trackFromPaperTrades(): Promise<{
    processed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let processed = 0;

    try {
      // 🔧 SESSION #314: Get all closed paper trades that haven't been tracked yet
      const { data: closedTrades, error: tradesError } = await this.supabase
        .from("paper_trades")
        .select(
          `
          *,
          trading_signals!inner(
            id, ticker, signal_type, confidence_score, timeframe, 
            entry_price, stop_loss, take_profit, status, created_at,
            sector, market, signals
          )
        `
        )
        .eq("is_open", false)
        .not("signal_id", "is", null);

      if (tradesError) {
        errors.push(`Error fetching closed trades: ${tradesError.message}`);
        return { processed, errors };
      }

      if (!closedTrades || closedTrades.length === 0) {
        return { processed, errors };
      }

      // 🔧 SESSION #314: Check which trades are already tracked
      const signalIds = closedTrades
        .map((trade) => trade.signal_id)
        .filter(Boolean);
      const { data: existingOutcomes } = await this.supabase
        .from("signal_outcomes")
        .select("signal_id")
        .in("signal_id", signalIds);

      const trackedSignalIds = new Set(
        existingOutcomes?.map((outcome) => outcome.signal_id) || []
      );

      // 🔧 SESSION #314: Process each untracked closed trade
      for (const trade of closedTrades) {
        if (!trade.signal_id || trackedSignalIds.has(trade.signal_id)) {
          continue; // Skip if already tracked or no signal_id
        }

        try {
          const outcome = await this.createSignalOutcome(
            trade,
            trade.trading_signals
          );
          if (outcome) {
            processed++;
          }
        } catch (error) {
          errors.push(`Error processing trade ${trade.id}: ${error.message}`);
        }
      }

      return { processed, errors };
    } catch (error) {
      errors.push(`Fatal error in trackFromPaperTrades: ${error.message}`);
      return { processed, errors };
    }
  }

  /**
   * 🎯 PURPOSE: Create comprehensive signal outcome record
   * 🔧 SESSION #314: Calculates all performance metrics and market context
   * 📝 HANDOVER: Core function that builds complete outcome data
   */
  private async createSignalOutcome(
    trade: PaperTrade,
    signal: TradingSignal
  ): Promise<SignalOutcome | null> {
    try {
      // 🔧 SESSION #314: Calculate outcome classification
      const outcomeType = this.classifyOutcome(trade);

      // 🔧 SESSION #314: Calculate holding period in hours
      const holdingPeriodHours = this.calculateHoldingPeriod(
        trade.opened_at,
        trade.closed_at
      );

      // 🔧 SESSION #314: Analyze indicator accuracy for this outcome
      const indicatorAccuracy = await this.analyzeIndicatorAccuracy(
        signal.id,
        outcomeType
      );

      // 🔧 SESSION #314: Detect market conditions at time of signal
      const marketConditions = await this.detectMarketConditions(
        signal.created_at,
        signal.ticker,
        signal.sector
      );

      // 🔧 SESSION #314: Calculate prediction accuracy score
      const actualVsPredicted = this.calculatePredictionAccuracy(
        signal.confidence_score,
        outcomeType,
        trade.profit_loss_percentage
      );

      // 🔧 SESSION #314: Build complete outcome record
      const outcome: Partial<SignalOutcome> = {
        signal_id: signal.id,
        user_id: trade.user_id,
        outcome_type: outcomeType,
        entry_price: trade.entry_price,
        exit_price: trade.exit_price,
        profit_loss: trade.profit_loss,
        profit_loss_percentage: trade.profit_loss_percentage,
        holding_period_hours: holdingPeriodHours,
        actual_vs_predicted_score: actualVsPredicted,
        indicator_accuracy: indicatorAccuracy,
        market_conditions: marketConditions,
        signal_created_at: signal.created_at,
        trade_executed_at: trade.opened_at,
        trade_closed_at: trade.closed_at,
        learning_version: "v1.0",
        quality_score: this.calculateQualityScore(trade, signal),
        notes: `Tracked from paper_trade ${trade.id}`,
      };

      // 🔧 SESSION #314: Insert into signal_outcomes table
      const { data, error } = await this.supabase
        .from("signal_outcomes")
        .insert(outcome)
        .select()
        .single();

      if (error) {
        throw new Error(`Database insert error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error(
        `Error creating signal outcome for trade ${trade.id}:`,
        error
      );
      return null;
    }
  }

  /**
   * 🎯 PURPOSE: Classify trade outcome for learning
   * 🔧 SESSION #314: Simple, clear outcome classification
   * 📝 HANDOVER: Win/Loss/Breakeven/Expired classification logic
   */
  private classifyOutcome(
    trade: PaperTrade
  ): "win" | "loss" | "breakeven" | "expired" {
    if (!trade.profit_loss_percentage) {
      return "expired";
    }

    if (trade.profit_loss_percentage > 0.5) {
      return "win";
    } else if (trade.profit_loss_percentage < -0.5) {
      return "loss";
    } else {
      return "breakeven";
    }
  }

  /**
   * 🎯 PURPOSE: Calculate holding period in hours
   * 🔧 SESSION #314: Time analysis for signal performance
   * 📝 HANDOVER: Converts timestamp difference to hours
   */
  private calculateHoldingPeriod(
    openedAt?: string,
    closedAt?: string
  ): number | undefined {
    if (!openedAt || !closedAt) {
      return undefined;
    }

    const opened = new Date(openedAt);
    const closed = new Date(closedAt);
    const diffMs = closed.getTime() - opened.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal precision
  }

  /**
   * 🎯 PURPOSE: Analyze individual indicator accuracy
   * 🔧 SESSION #314: Track RSI, MACD, Volume, etc. performance individually
   * 📝 HANDOVER: Builds learning data for indicator weight optimization
   */
  private async analyzeIndicatorAccuracy(
    signalId: string,
    outcome: string
  ): Promise<Record<string, any>> {
    try {
      // 🔧 SESSION #314: Get all indicators for this signal
      const { data: indicators, error } = await this.supabase
        .from("indicators")
        .select(
          "indicator_name, timeframe, raw_value, score_contribution, metadata"
        )
        .eq("signal_id", signalId);

      if (error || !indicators) {
        return {};
      }

      const accuracy: Record<string, any> = {};

      // 🔧 SESSION #314: Analyze each indicator's contribution to outcome
      for (const indicator of indicators) {
        const indicatorKey = `${indicator.indicator_name}_${indicator.timeframe}`;

        accuracy[indicatorKey] = {
          raw_value: indicator.raw_value,
          score_contribution: indicator.score_contribution,
          outcome_correlation: this.calculateIndicatorCorrelation(
            indicator.indicator_name,
            indicator.raw_value,
            outcome
          ),
          metadata: indicator.metadata,
        };
      }

      return accuracy;
    } catch (error) {
      console.error(
        `Error analyzing indicator accuracy for signal ${signalId}:`,
        error
      );
      return {};
    }
  }

  /**
   * 🎯 PURPOSE: Calculate indicator correlation with successful outcomes
   * 🔧 SESSION #314: Learning which indicator values predict success
   * 📝 HANDOVER: Builds intelligence for future indicator weighting
   */
  private calculateIndicatorCorrelation(
    indicatorName: string,
    value?: number,
    outcome?: string
  ): number {
    if (!value || !outcome) {
      return 0;
    }

    // 🔧 SESSION #314: RSI correlation analysis
    if (indicatorName === "RSI") {
      if (outcome === "win") {
        // RSI oversold (< 30) or moderate (30-70) typically better for wins
        if (value < 30) return 0.8;
        if (value >= 30 && value <= 70) return 0.6;
        if (value > 70) return 0.3; // Overbought less reliable
      }
      return 0.5; // Neutral correlation
    }

    // 🔧 SESSION #314: MACD correlation analysis
    if (indicatorName === "MACD") {
      if (outcome === "win") {
        // Positive MACD typically better for wins
        return value > 0 ? 0.7 : 0.4;
      }
      return 0.5; // Neutral correlation
    }

    // 🔧 SESSION #314: Volume correlation analysis
    if (indicatorName === "Volume_Ratio") {
      if (outcome === "win") {
        // Higher volume ratio typically better for wins
        if (value > 1.5) return 0.8;
        if (value > 1.0) return 0.6;
        return 0.4;
      }
      return 0.5; // Neutral correlation
    }

    // 🔧 SESSION #314: Default correlation for other indicators
    return 0.5;
  }

  /**
   * 🎯 PURPOSE: Detect market conditions at signal creation time
   * 🔧 SESSION #314: Bull/Bear/Sideways and volatility analysis
   * 📝 HANDOVER: Market context for conditional learning
   */
  private async detectMarketConditions(
    createdAt?: string,
    ticker?: string,
    sector?: string
  ): Promise<Record<string, any>> {
    const conditions: Record<string, any> = {
      detected_at: new Date().toISOString(),
      ticker: ticker,
      sector: sector,
    };

    try {
      // 🔧 SESSION #314: Get recent market data for regime detection
      const signalDate = createdAt ? new Date(createdAt) : new Date();
      const lookbackDate = new Date(
        signalDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ); // 30 days back

      // 🔧 SESSION #314: Analyze market regime using historical price data
      const { data: priceData } = await this.supabase
        .from("backtest_historical_prices")
        .select("close_price, volume, trade_date")
        .in("ticker", ["SPY", "QQQ"]) // Market proxies
        .gte("trade_date", lookbackDate.toISOString().split("T")[0])
        .lte("trade_date", signalDate.toISOString().split("T")[0])
        .order("trade_date", { ascending: true });

      if (priceData && priceData.length > 10) {
        const regime = this.analyzeMarketRegime(priceData);
        conditions.market_regime = regime.regime;
        conditions.volatility_level = regime.volatility_level;
        conditions.trend_strength = regime.market_trend_strength;
        conditions.volatility_percentile = regime.volatility_percentile;
      } else {
        // 🔧 SESSION #314: Default values when insufficient data
        conditions.market_regime = "unknown";
        conditions.volatility_level = "medium";
        conditions.trend_strength = 0;
        conditions.volatility_percentile = 50;
      }

      return conditions;
    } catch (error) {
      console.error("Error detecting market conditions:", error);
      conditions.market_regime = "unknown";
      conditions.volatility_level = "medium";
      conditions.error = error.message;
      return conditions;
    }
  }

  /**
   * 🎯 PURPOSE: Analyze market regime from price data
   * 🔧 SESSION #314: Bull/Bear/Sideways classification algorithm
   * 📝 HANDOVER: Technical analysis for market context
   */
  private analyzeMarketRegime(priceData: any[]): MarketRegime {
    const prices = priceData.map((d) => d.close_price);
    const volumes = priceData.map((d) => d.volume);

    // 🔧 SESSION #314: Calculate trend strength using linear regression
    const trendStrength = this.calculateTrendStrength(prices);

    // 🔧 SESSION #314: Calculate volatility using standard deviation
    const volatility = this.calculateVolatility(prices);
    const volatilityPercentile = this.normalizeVolatility(volatility);

    // 🔧 SESSION #314: Classify market regime
    let regime: "bull" | "bear" | "sideways";
    if (trendStrength > 0.3) {
      regime = "bull";
    } else if (trendStrength < -0.3) {
      regime = "bear";
    } else {
      regime = "sideways";
    }

    // 🔧 SESSION #314: Classify volatility level
    let volatilityLevel: "high" | "medium" | "low";
    if (volatilityPercentile > 70) {
      volatilityLevel = "high";
    } else if (volatilityPercentile < 30) {
      volatilityLevel = "low";
    } else {
      volatilityLevel = "medium";
    }

    return {
      regime,
      volatility_level: volatilityLevel,
      market_trend_strength: Math.round(trendStrength * 1000) / 1000, // 3 decimal precision
      volatility_percentile: Math.round(volatilityPercentile * 100) / 100, // 2 decimal precision
    };
  }

  /**
   * 🎯 PURPOSE: Calculate trend strength using simple linear regression
   * 🔧 SESSION #314: Mathematical trend analysis
   * 📝 HANDOVER: Returns normalized trend strength (-1 to 1)
   */
  private calculateTrendStrength(prices: number[]): number {
    if (prices.length < 2) return 0;

    const n = prices.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = prices;

    // 🔧 SESSION #314: Linear regression calculation
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const avgPrice = sumY / n;

    // 🔧 SESSION #314: Normalize slope to percentage change
    return (slope * n) / avgPrice;
  }

  /**
   * 🎯 PURPOSE: Calculate price volatility using standard deviation
   * 🔧 SESSION #314: Statistical volatility measurement
   * 📝 HANDOVER: Returns volatility as percentage
   */
  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;

    // 🔧 SESSION #314: Calculate daily returns
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }

    // 🔧 SESSION #314: Calculate standard deviation of returns
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
      returns.length;
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
  }

  /**
   * 🎯 PURPOSE: Normalize volatility to percentile (0-100)
   * 🔧 SESSION #314: Convert volatility to relative ranking
   * 📝 HANDOVER: Simplified volatility classification
   */
  private normalizeVolatility(volatility: number): number {
    // 🔧 SESSION #314: Approximate percentile mapping based on market history
    // Low volatility: < 15%, Medium: 15-25%, High: > 25%
    if (volatility < 0.15) return 20; // Low volatility
    if (volatility < 0.25) return 50; // Medium volatility
    return 80; // High volatility
  }

  /**
   * 🎯 PURPOSE: Calculate prediction accuracy score
   * 🔧 SESSION #314: Compare confidence score vs actual outcome
   * 📝 HANDOVER: Learning data for confidence calibration
   */
  private calculatePredictionAccuracy(
    confidenceScore: number,
    outcome: string,
    profitLossPercentage?: number
  ): number {
    // 🔧 SESSION #314: High confidence should correlate with wins
    if (outcome === "win") {
      return confidenceScore; // Direct correlation for wins
    }

    if (outcome === "loss") {
      return Math.max(0, 100 - confidenceScore); // Inverse correlation for losses
    }

    // 🔧 SESSION #314: Breakeven or expired signals
    return Math.max(0, 50 - Math.abs(confidenceScore - 50)); // Closer to 50 is better for neutral outcomes
  }

  /**
   * 🎯 PURPOSE: Calculate learning quality score for this outcome
   * 🔧 SESSION #314: Rate the value of this outcome for AI learning
   * 📝 HANDOVER: Higher scores indicate more valuable learning data
   */
  private calculateQualityScore(
    trade: PaperTrade,
    signal: TradingSignal
  ): number {
    let score = 50; // Base score

    // 🔧 SESSION #314: Complete data increases quality
    if (
      trade.profit_loss_percentage !== null &&
      trade.profit_loss_percentage !== undefined
    )
      score += 20;
    if (trade.closed_at) score += 10;
    if (signal.confidence_score >= 70) score += 10; // High confidence signals more valuable
    if (Math.abs(trade.profit_loss_percentage || 0) > 2) score += 10; // Significant moves more valuable

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 🎯 PURPOSE: Get performance metrics for AI learning
   * 🔧 SESSION #314: Summary statistics for signal improvement
   * 📝 HANDOVER: Call this to get learning insights
   */
  async getPerformanceMetrics(
    timeframeDays = 30
  ): Promise<Record<string, any>> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

      // 🔧 SESSION #314: Get performance data from signal_outcomes
      const { data: outcomes, error } = await this.supabase
        .from("signal_outcomes")
        .select("*")
        .gte("created_at", cutoffDate.toISOString());

      if (error || !outcomes) {
        return { error: error?.message || "No data found" };
      }

      // 🔧 SESSION #314: Calculate comprehensive metrics
      const totalSignals = outcomes.length;
      const wins = outcomes.filter((o) => o.outcome_type === "win").length;
      const losses = outcomes.filter((o) => o.outcome_type === "loss").length;
      const winRate = totalSignals > 0 ? (wins / totalSignals) * 100 : 0;

      const avgProfitLoss =
        outcomes
          .filter((o) => o.profit_loss_percentage !== null)
          .reduce((sum, o) => sum + (o.profit_loss_percentage || 0), 0) /
        totalSignals;

      // 🔧 SESSION #314: Indicator performance analysis
      const indicatorStats = this.analyzeIndicatorPerformance(outcomes);

      // 🔧 SESSION #314: Market condition analysis
      const marketStats = this.analyzeMarketConditionPerformance(outcomes);

      return {
        timeframe_days: timeframeDays,
        total_signals: totalSignals,
        win_rate: Math.round(winRate * 100) / 100,
        wins: wins,
        losses: losses,
        avg_profit_loss_percentage: Math.round(avgProfitLoss * 100) / 100,
        indicator_performance: indicatorStats,
        market_condition_performance: marketStats,
        generated_at: new Date().toISOString(),
      };
    } catch (error) {
      return { error: `Failed to get performance metrics: ${error.message}` };
    }
  }

  /**
   * 🎯 PURPOSE: Analyze performance by indicator
   * 🔧 SESSION #314: Individual indicator success rates
   * 📝 HANDOVER: Learning data for indicator optimization
   */
  private analyzeIndicatorPerformance(
    outcomes: SignalOutcome[]
  ): Record<string, any> {
    const indicatorStats: Record<string, any> = {};

    outcomes.forEach((outcome) => {
      if (!outcome.indicator_accuracy) return;

      Object.entries(outcome.indicator_accuracy).forEach(
        ([indicator, data]: [string, any]) => {
          if (!indicatorStats[indicator]) {
            indicatorStats[indicator] = {
              total_signals: 0,
              wins: 0,
              losses: 0,
              avg_correlation: 0,
              correlation_sum: 0,
            };
          }

          indicatorStats[indicator].total_signals++;
          if (outcome.outcome_type === "win") indicatorStats[indicator].wins++;
          if (outcome.outcome_type === "loss")
            indicatorStats[indicator].losses++;
          if (data.outcome_correlation) {
            indicatorStats[indicator].correlation_sum +=
              data.outcome_correlation;
          }
        }
      );
    });

    // 🔧 SESSION #314: Calculate final statistics
    Object.keys(indicatorStats).forEach((indicator) => {
      const stats = indicatorStats[indicator];
      stats.win_rate =
        stats.total_signals > 0 ? (stats.wins / stats.total_signals) * 100 : 0;
      stats.avg_correlation =
        stats.total_signals > 0
          ? stats.correlation_sum / stats.total_signals
          : 0;
      delete stats.correlation_sum; // Remove temporary field
    });

    return indicatorStats;
  }

  /**
   * 🎯 PURPOSE: Analyze performance by market conditions
   * 🔧 SESSION #314: Market regime and volatility performance
   * 📝 HANDOVER: Context-aware learning insights
   */
  private analyzeMarketConditionPerformance(
    outcomes: SignalOutcome[]
  ): Record<string, any> {
    const conditionStats: Record<string, any> = {};

    outcomes.forEach((outcome) => {
      if (!outcome.market_conditions) return;

      const regime = outcome.market_conditions.market_regime;
      const volatility = outcome.market_conditions.volatility_level;

      if (regime) {
        if (!conditionStats[regime]) {
          conditionStats[regime] = { total: 0, wins: 0, losses: 0 };
        }
        conditionStats[regime].total++;
        if (outcome.outcome_type === "win") conditionStats[regime].wins++;
        if (outcome.outcome_type === "loss") conditionStats[regime].losses++;
      }

      if (volatility) {
        const volKey = `volatility_${volatility}`;
        if (!conditionStats[volKey]) {
          conditionStats[volKey] = { total: 0, wins: 0, losses: 0 };
        }
        conditionStats[volKey].total++;
        if (outcome.outcome_type === "win") conditionStats[volKey].wins++;
        if (outcome.outcome_type === "loss") conditionStats[volKey].losses++;
      }
    });

    // 🔧 SESSION #314: Calculate win rates
    Object.keys(conditionStats).forEach((condition) => {
      const stats = conditionStats[condition];
      stats.win_rate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
    });

    return conditionStats;
  }
}

/**
 * 🎯 PURPOSE: Factory function to create PerformanceTracker instance
 * 🔧 SESSION #314: Easy instantiation following V4 patterns
 * 📝 HANDOVER: Use this to create tracker with environment variables
 */
export function createPerformanceTracker(): PerformanceTracker {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return new PerformanceTracker(supabaseUrl, supabaseKey);
}

/**
 * 🎯 PURPOSE: Export main functions for edge function integration
 * 🔧 SESSION #314: Ready for integration with V4 signal generation system
 * 📝 HANDOVER: Import these functions in your main edge function
 */
export default PerformanceTracker;
