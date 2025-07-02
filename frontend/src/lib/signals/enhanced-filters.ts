// ===================================================================
// ENHANCED SIGNAL FILTERING & CUSTOMIZATION SYSTEM
// ===================================================================
// File: src/lib/signals/enhanced-filters.ts
// Purpose: Advanced filtering, customization, and personalization

import { ProcessedSignal, SignalStrength } from "./signal-processor";

// ===================================================================
// FILTER INTERFACES & TYPES
// ===================================================================

export interface TechnicalFilterCriteria {
  // RSI Filters
  rsiMin?: number;
  rsiMax?: number;
  rsiOversold?: number; // Default 30
  rsiOverbought?: number; // Default 70

  // MACD Filters
  macdBullish?: boolean; // MACD > Signal
  macdHistogramPositive?: boolean;
  macdAboveZero?: boolean;

  // Bollinger Bands Filters
  bbPercentBMin?: number; // 0-1 scale
  bbPercentBMax?: number;
  bbSqueezeDetection?: boolean; // Low bandwidth
  bbBreakoutDetection?: boolean; // Price outside bands

  // Volume Filters
  volumeRatioMin?: number;
  volumeRatioMax?: number;
  highVolumeOnly?: boolean; // ratio >= 1.5

  // Momentum Filters
  momentumPositive?: boolean;
  momentumMin?: number;
  momentumMax?: number;
}

export interface RiskManagementFilters {
  // Risk/Reward Ratios
  minRiskRewardRatio?: number; // Default 1.5
  maxRiskRewardRatio?: number; // Default 10

  // Stop Loss Criteria
  maxStopLossPercent?: number; // Default 10%
  minStopLossPercent?: number; // Default 2%

  // Position Sizing
  maxPositionSize?: number; // % of portfolio
  minPositionSize?: number;

  // Volatility Filters
  maxVolatility?: number; // Based on ATR or BB bandwidth
  minVolatility?: number;

  // Price Filters
  minStockPrice?: number; // Avoid penny stocks
  maxStockPrice?: number; // Avoid expensive stocks
}

export interface MarketConditionFilters {
  // Market Environment
  preferredMarketCondition?: "trending" | "ranging" | "volatile" | "any";

  // Timeframe Preferences
  requiredTimeframes?: string[]; // Must have data for these
  minimumTimeframeCount?: number; // At least N timeframes

  // Data Quality
  minimumDataQuality?: "excellent" | "good" | "fair" | "limited";

  // Sector/Industry
  allowedSectors?: string[];
  excludedSectors?: string[];
  allowedIndustries?: string[];
  excludedIndustries?: string[];

  // Market Cap
  minMarketCap?: number;
  maxMarketCap?: number;

  // Exchange Filters
  allowedExchanges?: string[]; // NYSE, NASDAQ, etc.
}

export interface PersonalizationFilters {
  // User Trading Style
  tradingStyle?:
    | "scalping"
    | "day_trading"
    | "swing_trading"
    | "position_trading";
  riskTolerance?: "conservative" | "moderate" | "aggressive";
  experienceLevel?: "beginner" | "intermediate" | "advanced" | "professional";

  // Portfolio Context
  portfolioSize?: number;
  currentPositions?: string[]; // Tickers already held
  maxPositionsCount?: number;
  sectorDiversificationRequired?: boolean;

  // Islamic Finance Compliance
  islamicCompliantOnly?: boolean;
  excludeInterestBasedStocks?: boolean;
  excludeAlcoholTobacco?: boolean;
  excludeGambling?: boolean;

  // Preference Learning
  favoriteIndicators?: string[]; // RSI, MACD, etc.
  indicatorWeights?: Record<string, number>; // Custom weights
  historicalSuccessPatterns?: any[]; // Learn from past trades
}

export interface CustomSignalCriteria {
  // Custom Scoring
  customWeights?: {
    rsi: number;
    macd: number;
    bollingerBands: number;
    volume: number;
    momentum: number;
  };

  // Custom Thresholds
  customThresholds?: {
    strongBuy: number;
    buy: number;
    weakBuy: number;
    neutral: number;
    weakSell: number;
    sell: number;
  };

  // Confluence Requirements
  minimumTimeframeAgreement?: number; // % of timeframes must agree
  requiredIndicatorConsensus?: number; // N indicators must agree

  // Signal Timing
  onlyRecentSignals?: boolean; // Generated within X hours
  maxSignalAge?: number; // Hours
  avoidOverlappingSignals?: boolean; // One per sector/industry
}

// ===================================================================
// COMPREHENSIVE FILTER CONFIGURATION
// ===================================================================

export interface EnhancedFilterConfig {
  // Core Filter Categories
  technical: TechnicalFilterCriteria;
  riskManagement: RiskManagementFilters;
  marketConditions: MarketConditionFilters;
  personalization: PersonalizationFilters;
  customCriteria: CustomSignalCriteria;

  // Meta Configuration
  filterMode: "strict" | "flexible" | "learning";
  enableAutoLearning?: boolean;
  saveAsPreset?: boolean;
  presetName?: string;
}

// ===================================================================
// FILTER PRESETS FOR DIFFERENT USER TYPES
// ===================================================================

export const FILTER_PRESETS: Record<string, Partial<EnhancedFilterConfig>> = {
  // Conservative Investor Preset
  conservative: {
    technical: {
      rsiMin: 20,
      rsiMax: 70, // Avoid overbought
      macdBullish: true,
      volumeRatioMin: 1.2, // Decent volume confirmation
      momentumPositive: true,
    },
    riskManagement: {
      minRiskRewardRatio: 2.0, // Conservative R:R
      maxStopLossPercent: 5, // Tight stops
      maxPositionSize: 5, // Small positions
      minStockPrice: 10, // Avoid penny stocks
    },
    marketConditions: {
      preferredMarketCondition: "trending",
      minimumDataQuality: "good",
      minMarketCap: 1000000000, // Large cap only
    },
    personalization: {
      riskTolerance: "conservative",
      sectorDiversificationRequired: true,
      islamicCompliantOnly: false,
    },
  },

  // Aggressive Trader Preset
  aggressive: {
    technical: {
      rsiMin: 10,
      rsiMax: 90, // Accept extreme conditions
      volumeRatioMin: 2.0, // High volume for momentum
      bbBreakoutDetection: true,
    },
    riskManagement: {
      minRiskRewardRatio: 1.5, // Accept lower R:R for frequency
      maxStopLossPercent: 15, // Wider stops
      maxPositionSize: 15, // Larger positions
      minStockPrice: 5, // Allow more speculative stocks
    },
    marketConditions: {
      preferredMarketCondition: "volatile",
      minimumDataQuality: "fair", // Accept lower quality for opportunities
    },
    personalization: {
      riskTolerance: "aggressive",
      sectorDiversificationRequired: false,
    },
  },

  // Day Trader Preset
  dayTrader: {
    technical: {
      rsiOversold: 25,
      rsiOverbought: 75,
      macdHistogramPositive: true,
      highVolumeOnly: true, // Essential for day trading
    },
    riskManagement: {
      minRiskRewardRatio: 1.2, // Quick scalps
      maxStopLossPercent: 3, // Very tight stops
      maxPositionSize: 20, // Can take larger positions for short time
    },
    marketConditions: {
      preferredMarketCondition: "trending",
      requiredTimeframes: ["1H"], // Focus on hourly
      minimumTimeframeCount: 2,
    },
    personalization: {
      tradingStyle: "day_trading",
      experienceLevel: "advanced",
    },
    customCriteria: {
      onlyRecentSignals: true,
      maxSignalAge: 2, // Very recent signals only
    },
  },

  // Islamic Finance Preset
  islamicCompliant: {
    technical: {
      rsiMin: 25,
      rsiMax: 75,
      macdBullish: true,
      volumeRatioMin: 1.0,
    },
    riskManagement: {
      minRiskRewardRatio: 2.0, // Conservative approach
      maxStopLossPercent: 8,
      maxPositionSize: 8,
    },
    marketConditions: {
      excludedSectors: ["Financial Services"], // Exclude interest-based
      minimumDataQuality: "good",
      minMarketCap: 500000000,
    },
    personalization: {
      islamicCompliantOnly: true,
      excludeInterestBasedStocks: true,
      excludeAlcoholTobacco: true,
      excludeGambling: true,
      riskTolerance: "moderate",
      sectorDiversificationRequired: true,
    },
  },

  // Swing Trader Preset
  swingTrader: {
    technical: {
      rsiMin: 30,
      rsiMax: 70,
      macdBullish: true,
      bbSqueezeDetection: true, // Look for breakout setups
      volumeRatioMin: 1.1,
    },
    riskManagement: {
      minRiskRewardRatio: 2.5, // Good R:R for swing trades
      maxStopLossPercent: 10,
      maxPositionSize: 10,
      minStockPrice: 15,
    },
    marketConditions: {
      preferredMarketCondition: "ranging",
      requiredTimeframes: ["1D", "1W"], // Focus on daily/weekly
      minimumDataQuality: "good",
    },
    personalization: {
      tradingStyle: "swing_trading",
      maxPositionsCount: 10,
      sectorDiversificationRequired: true,
    },
    customCriteria: {
      minimumTimeframeAgreement: 75, // Strong confluence
      requiredIndicatorConsensus: 3,
    },
  },
};

// ===================================================================
// ENHANCED SIGNAL FILTER ENGINE
// ===================================================================

export class EnhancedSignalFilter {
  private config: EnhancedFilterConfig;
  private userPreferences: any = {};
  private learningData: any[] = [];

  constructor(config: Partial<EnhancedFilterConfig> = {}) {
    this.config = this.mergeWithDefaults(config);
  }

  // ===================================================================
  // MAIN FILTERING METHOD
  // ===================================================================

  public filterSignals(
    signals: ProcessedSignal[],
    additionalFilters?: Partial<EnhancedFilterConfig>
  ): {
    filteredSignals: ProcessedSignal[];
    filterStats: FilteringStats;
    recommendations: string[];
  } {
    console.log(`🔍 Enhanced filtering: ${signals.length} signals input`);

    // Merge any additional filters
    const activeConfig = additionalFilters
      ? this.mergeConfigs(this.config, additionalFilters)
      : this.config;

    let filtered = [...signals];
    const stats: FilteringStats = {
      originalCount: signals.length,
      filtersApplied: [],
      finalCount: 0,
      rejectionReasons: {},
    };

    // Apply filter stages in order
    filtered = this.applyTechnicalFilters(
      filtered,
      activeConfig.technical,
      stats
    );
    filtered = this.applyRiskManagementFilters(
      filtered,
      activeConfig.riskManagement,
      stats
    );
    filtered = this.applyMarketConditionFilters(
      filtered,
      activeConfig.marketConditions,
      stats
    );
    filtered = this.applyPersonalizationFilters(
      filtered,
      activeConfig.personalization,
      stats
    );
    filtered = this.applyCustomCriteriaFilters(
      filtered,
      activeConfig.customCriteria,
      stats
    );

    stats.finalCount = filtered.length;

    // Generate recommendations
    const recommendations = this.generateRecommendations(stats, activeConfig);

    // Learn from filtering results if enabled
    if (activeConfig.enableAutoLearning) {
      this.updateLearningData(signals, filtered, activeConfig);
    }

    console.log(
      `✅ Enhanced filtering complete: ${filtered.length} signals passed`
    );

    return {
      filteredSignals: filtered,
      filterStats: stats,
      recommendations,
    };
  }

  // ===================================================================
  // TECHNICAL INDICATOR FILTERS
  // ===================================================================

  private applyTechnicalFilters(
    signals: ProcessedSignal[],
    criteria: TechnicalFilterCriteria,
    stats: FilteringStats
  ): ProcessedSignal[] {
    if (!criteria || Object.keys(criteria).length === 0) return signals;

    return signals.filter((signal) => {
      const reasons: string[] = [];

      // RSI Filters
      if (
        criteria.rsiMin !== undefined &&
        signal.technicalAnalysis.rsi < criteria.rsiMin
      ) {
        reasons.push(
          `RSI too low (${signal.technicalAnalysis.rsi} < ${criteria.rsiMin})`
        );
      }
      if (
        criteria.rsiMax !== undefined &&
        signal.technicalAnalysis.rsi > criteria.rsiMax
      ) {
        reasons.push(
          `RSI too high (${signal.technicalAnalysis.rsi} > ${criteria.rsiMax})`
        );
      }
      if (
        criteria.rsiOversold &&
        signal.technicalAnalysis.rsi > criteria.rsiOversold
      ) {
        reasons.push(
          `RSI not oversold (${signal.technicalAnalysis.rsi} > ${criteria.rsiOversold})`
        );
      }
      if (
        criteria.rsiOverbought &&
        signal.technicalAnalysis.rsi < criteria.rsiOverbought
      ) {
        reasons.push(
          `RSI not overbought (${signal.technicalAnalysis.rsi} < ${criteria.rsiOverbought})`
        );
      }

      // MACD Filters
      if (criteria.macdBullish && signal.technicalAnalysis.macd <= 50) {
        reasons.push(`MACD not bullish (${signal.technicalAnalysis.macd})`);
      }
      if (criteria.macdAboveZero && signal.technicalAnalysis.macd <= 50) {
        reasons.push(`MACD not above zero (${signal.technicalAnalysis.macd})`);
      }

      // Volume Filters
      if (criteria.volumeRatioMin !== undefined) {
        const volumeRatio = signal.technicalAnalysis.volume / 50; // Normalize to ratio
        if (volumeRatio < criteria.volumeRatioMin) {
          reasons.push(
            `Volume ratio too low (${volumeRatio.toFixed(2)} < ${
              criteria.volumeRatioMin
            })`
          );
        }
      }
      if (criteria.highVolumeOnly) {
        const volumeRatio = signal.technicalAnalysis.volume / 50;
        if (volumeRatio < 1.5) {
          reasons.push(
            `High volume required (${volumeRatio.toFixed(2)} < 1.5)`
          );
        }
      }

      // Momentum Filters
      if (
        criteria.momentumPositive &&
        signal.technicalAnalysis.momentum <= 50
      ) {
        reasons.push(
          `Momentum not positive (${signal.technicalAnalysis.momentum})`
        );
      }
      if (
        criteria.momentumMin !== undefined &&
        signal.technicalAnalysis.momentum < criteria.momentumMin
      ) {
        reasons.push(
          `Momentum too low (${signal.technicalAnalysis.momentum} < ${criteria.momentumMin})`
        );
      }

      // Track rejections
      if (reasons.length > 0) {
        stats.rejectionReasons[signal.ticker] = reasons;
        return false;
      }

      return true;
    });
  }

  // ===================================================================
  // RISK MANAGEMENT FILTERS
  // ===================================================================

  private applyRiskManagementFilters(
    signals: ProcessedSignal[],
    criteria: RiskManagementFilters,
    stats: FilteringStats
  ): ProcessedSignal[] {
    if (!criteria || Object.keys(criteria).length === 0) return signals;

    return signals.filter((signal) => {
      const reasons: string[] = [];

      // Risk/Reward Ratio Filters
      if (
        criteria.minRiskRewardRatio !== undefined &&
        signal.riskManagement.riskRewardRatio < criteria.minRiskRewardRatio
      ) {
        reasons.push(
          `R:R too low (${signal.riskManagement.riskRewardRatio} < ${criteria.minRiskRewardRatio})`
        );
      }
      if (
        criteria.maxRiskRewardRatio !== undefined &&
        signal.riskManagement.riskRewardRatio > criteria.maxRiskRewardRatio
      ) {
        reasons.push(
          `R:R too high (${signal.riskManagement.riskRewardRatio} > ${criteria.maxRiskRewardRatio})`
        );
      }

      // Stop Loss Filters
      const stopLossPercent =
        ((signal.riskManagement.entryPrice - signal.riskManagement.stopLoss) /
          signal.riskManagement.entryPrice) *
        100;

      if (
        criteria.maxStopLossPercent !== undefined &&
        stopLossPercent > criteria.maxStopLossPercent
      ) {
        reasons.push(
          `Stop loss too wide (${stopLossPercent.toFixed(1)}% > ${
            criteria.maxStopLossPercent
          }%)`
        );
      }
      if (
        criteria.minStopLossPercent !== undefined &&
        stopLossPercent < criteria.minStopLossPercent
      ) {
        reasons.push(
          `Stop loss too tight (${stopLossPercent.toFixed(1)}% < ${
            criteria.minStopLossPercent
          }%)`
        );
      }

      // Price Filters
      if (
        criteria.minStockPrice !== undefined &&
        signal.marketData.currentPrice < criteria.minStockPrice
      ) {
        reasons.push(
          `Price too low ($${signal.marketData.currentPrice} < $${criteria.minStockPrice})`
        );
      }
      if (
        criteria.maxStockPrice !== undefined &&
        signal.marketData.currentPrice > criteria.maxStockPrice
      ) {
        reasons.push(
          `Price too high ($${signal.marketData.currentPrice} > $${criteria.maxStockPrice})`
        );
      }

      // Track rejections
      if (reasons.length > 0) {
        stats.rejectionReasons[signal.ticker] = (
          stats.rejectionReasons[signal.ticker] || []
        ).concat(reasons);
        return false;
      }

      return true;
    });
  }

  // ===================================================================
  // MARKET CONDITION FILTERS
  // ===================================================================

  private applyMarketConditionFilters(
    signals: ProcessedSignal[],
    criteria: MarketConditionFilters,
    stats: FilteringStats
  ): ProcessedSignal[] {
    if (!criteria || Object.keys(criteria).length === 0) return signals;

    return signals.filter((signal) => {
      const reasons: string[] = [];

      // Data Quality Filter
      if (criteria.minimumDataQuality) {
        const qualityOrder = ["limited", "fair", "good", "excellent"];
        const requiredIndex = qualityOrder.indexOf(criteria.minimumDataQuality);
        const actualIndex = qualityOrder.indexOf(signal.metadata.dataQuality);

        if (actualIndex < requiredIndex) {
          reasons.push(
            `Data quality insufficient (${signal.metadata.dataQuality} < ${criteria.minimumDataQuality})`
          );
        }
      }

      // Timeframe Requirements
      if (criteria.minimumTimeframeCount !== undefined) {
        const timeframeCount = signal.metadata.timeframesUsed.length;
        if (timeframeCount < criteria.minimumTimeframeCount) {
          reasons.push(
            `Not enough timeframes (${timeframeCount} < ${criteria.minimumTimeframeCount})`
          );
        }
      }

      if (
        criteria.requiredTimeframes &&
        criteria.requiredTimeframes.length > 0
      ) {
        const hasAllRequired = criteria.requiredTimeframes.every((tf) =>
          signal.metadata.timeframesUsed.includes(tf)
        );
        if (!hasAllRequired) {
          const missing = criteria.requiredTimeframes.filter(
            (tf) => !signal.metadata.timeframesUsed.includes(tf)
          );
          reasons.push(`Missing required timeframes: ${missing.join(", ")}`);
        }
      }

      // Track rejections
      if (reasons.length > 0) {
        stats.rejectionReasons[signal.ticker] = (
          stats.rejectionReasons[signal.ticker] || []
        ).concat(reasons);
        return false;
      }

      return true;
    });
  }

  // ===================================================================
  // PERSONALIZATION FILTERS
  // ===================================================================

  private applyPersonalizationFilters(
    signals: ProcessedSignal[],
    criteria: PersonalizationFilters,
    stats: FilteringStats
  ): ProcessedSignal[] {
    if (!criteria || Object.keys(criteria).length === 0) return signals;

    return signals.filter((signal) => {
      const reasons: string[] = [];

      // Islamic Compliance (placeholder - would need additional data)
      if (criteria.islamicCompliantOnly) {
        // This would require additional stock metadata
        // For now, exclude known non-compliant sectors
        const nonCompliantSectors = ["Financial Services"];
        // if (nonCompliantSectors.includes(signal.sector)) {
        //   reasons.push('Not Islamic compliant');
        // }
      }

      // Portfolio Context
      if (
        criteria.currentPositions &&
        criteria.currentPositions.includes(signal.ticker)
      ) {
        reasons.push("Already holding position");
      }

      // Max positions check would require portfolio context
      if (criteria.maxPositionsCount !== undefined) {
        // This would check against current portfolio size
        // Implementation depends on portfolio management system
      }

      // Track rejections
      if (reasons.length > 0) {
        stats.rejectionReasons[signal.ticker] = (
          stats.rejectionReasons[signal.ticker] || []
        ).concat(reasons);
        return false;
      }

      return true;
    });
  }

  // ===================================================================
  // CUSTOM CRITERIA FILTERS
  // ===================================================================

  private applyCustomCriteriaFilters(
    signals: ProcessedSignal[],
    criteria: CustomSignalCriteria,
    stats: FilteringStats
  ): ProcessedSignal[] {
    if (!criteria || Object.keys(criteria).length === 0) return signals;

    return signals.filter((signal) => {
      const reasons: string[] = [];

      // Signal Age Filter
      if (criteria.maxSignalAge !== undefined && criteria.onlyRecentSignals) {
        const ageHours =
          (Date.now() - signal.metadata.timestamp.getTime()) / (1000 * 60 * 60);
        if (ageHours > criteria.maxSignalAge) {
          reasons.push(
            `Signal too old (${ageHours.toFixed(1)}h > ${
              criteria.maxSignalAge
            }h)`
          );
        }
      }

      // Timeframe Agreement
      if (criteria.minimumTimeframeAgreement !== undefined) {
        const timeframeScores = Object.values(signal.timeframeScores);
        const avgScore =
          timeframeScores.reduce((sum, score) => sum + score, 0) /
          timeframeScores.length;
        const agreement = (avgScore / signal.finalScore) * 100;

        if (agreement < criteria.minimumTimeframeAgreement) {
          reasons.push(
            `Timeframe agreement too low (${agreement.toFixed(1)}% < ${
              criteria.minimumTimeframeAgreement
            }%)`
          );
        }
      }

      // Track rejections
      if (reasons.length > 0) {
        stats.rejectionReasons[signal.ticker] = (
          stats.rejectionReasons[signal.ticker] || []
        ).concat(reasons);
        return false;
      }

      return true;
    });
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  private mergeWithDefaults(
    config: Partial<EnhancedFilterConfig>
  ): EnhancedFilterConfig {
    return {
      technical: config.technical || {},
      riskManagement: config.riskManagement || {},
      marketConditions: config.marketConditions || {},
      personalization: config.personalization || {},
      customCriteria: config.customCriteria || {},
      filterMode: config.filterMode || "flexible",
      enableAutoLearning: config.enableAutoLearning || false,
    };
  }

  private mergeConfigs(
    base: EnhancedFilterConfig,
    override: Partial<EnhancedFilterConfig>
  ): EnhancedFilterConfig {
    return {
      technical: { ...base.technical, ...override.technical },
      riskManagement: { ...base.riskManagement, ...override.riskManagement },
      marketConditions: {
        ...base.marketConditions,
        ...override.marketConditions,
      },
      personalization: { ...base.personalization, ...override.personalization },
      customCriteria: { ...base.customCriteria, ...override.customCriteria },
      filterMode: override.filterMode || base.filterMode,
      enableAutoLearning:
        override.enableAutoLearning ?? base.enableAutoLearning,
    };
  }

  private generateRecommendations(
    stats: FilteringStats,
    config: EnhancedFilterConfig
  ): string[] {
    const recommendations: string[] = [];

    // Analyze rejection patterns
    const allReasons = Object.values(stats.rejectionReasons).flat();
    const reasonCounts = allReasons.reduce((acc, reason) => {
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Most common rejection reasons
    const topReasons = Object.entries(reasonCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (topReasons.length > 0) {
      recommendations.push(
        `Most common filter rejections: ${topReasons
          .map(([reason, count]) => `${reason} (${count}x)`)
          .join(", ")}`
      );
    }

    // Filter effectiveness
    const effectivenessRate = (stats.finalCount / stats.originalCount) * 100;
    if (effectivenessRate < 10) {
      recommendations.push(
        "Filters are very strict - consider relaxing criteria for more opportunities"
      );
    } else if (effectivenessRate > 80) {
      recommendations.push(
        "Filters are quite permissive - consider tightening criteria for quality"
      );
    }

    return recommendations;
  }

  private updateLearningData(
    originalSignals: ProcessedSignal[],
    filteredSignals: ProcessedSignal[],
    config: EnhancedFilterConfig
  ): void {
    // Store learning data for future personalization
    this.learningData.push({
      timestamp: new Date(),
      originalCount: originalSignals.length,
      filteredCount: filteredSignals.length,
      config: JSON.parse(JSON.stringify(config)),
      acceptedTickers: filteredSignals.map((s) => s.ticker),
      rejectedTickers: originalSignals
        .filter((s) => !filteredSignals.some((f) => f.ticker === s.ticker))
        .map((s) => s.ticker),
    });

    // Keep only last 100 learning sessions
    if (this.learningData.length > 100) {
      this.learningData = this.learningData.slice(-100);
    }
  }

  // ===================================================================
  // PUBLIC UTILITY METHODS
  // ===================================================================

  public loadPreset(presetName: string): void {
    const preset = FILTER_PRESETS[presetName];
    if (preset) {
      this.config = this.mergeWithDefaults(preset);
      console.log(`✅ Loaded filter preset: ${presetName}`);
    } else {
      console.warn(`⚠️ Unknown filter preset: ${presetName}`);
    }
  }

  public saveAsPreset(
    name: string,
    config?: Partial<EnhancedFilterConfig>
  ): void {
    const configToSave = config || this.config;
    FILTER_PRESETS[name] = configToSave;
    console.log(`✅ Saved filter preset: ${name}`);
  }

  public getAvailablePresets(): string[] {
    return Object.keys(FILTER_PRESETS);
  }

  public getCurrentConfig(): EnhancedFilterConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  public updateConfig(newConfig: Partial<EnhancedFilterConfig>): void {
    this.config = this.mergeConfigs(this.config, newConfig);
  }

  public getLearningInsights(): any {
    if (this.learningData.length < 5) return null;

    // Analyze learning patterns
    const recentData = this.learningData.slice(-20);
    const avgAcceptanceRate =
      recentData.reduce(
        (sum, session) => sum + session.filteredCount / session.originalCount,
        0
      ) / recentData.length;

    return {
      sessionsAnalyzed: recentData.length,
      averageAcceptanceRate: Math.round(avgAcceptanceRate * 100),
      recommendedAdjustments: this.generateLearningRecommendations(recentData),
    };
  }

  private generateLearningRecommendations(data: any[]): string[] {
    const recommendations: string[] = [];

    const avgRate =
      data.reduce((sum, d) => sum + d.filteredCount / d.originalCount, 0) /
      data.length;

    if (avgRate < 0.1) {
      recommendations.push(
        "Consider relaxing filters - very low acceptance rate"
      );
    } else if (avgRate > 0.8) {
      recommendations.push(
        "Consider tightening filters - high acceptance rate may reduce quality"
      );
    }

    return recommendations;
  }
}

// ===================================================================
// SUPPORTING INTERFACES
// ===================================================================

export interface FilteringStats {
  originalCount: number;
  finalCount: number;
  filtersApplied: string[];
  rejectionReasons: Record<string, string[]>;
}

// ===================================================================
// EXPORT DEFAULT
// ===================================================================

export default EnhancedSignalFilter;
