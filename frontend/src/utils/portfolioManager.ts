// ==================================================================================
// 💼 KURZORA PORTFOLIO MANAGER - 30-DAY TRADING SIMULATION
// ==================================================================================
// 🔧 PURPOSE: Professional portfolio management for backtesting system
// 📝 SESSION #168: Complete position tracking and cash management system
// 🛡️ ANTI-REGRESSION: This is new functionality - no existing features affected
// 🎯 WHITE PAPER: Implements exactly what Session #167 white paper specified
// ⚠️ CRITICAL: Handles 2% position sizing, stop losses, take profits, cash management
// 🚀 BACKTESTING: Enables realistic 30-day trading simulation with professional risk management

import { SignalAnalysis } from "./KuzzoraSignalEngine";

// ==================================================================================
// 📋 TYPE DEFINITIONS FOR PORTFOLIO MANAGEMENT
// ==================================================================================

export interface Position {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;

  // Entry Details
  entryDate: string;
  entryPrice: number;
  shares: number;
  positionCost: number;

  // Risk Management
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;

  // Signal Details
  signalScore: number;
  signalType: string;
  timeframeScores: { [key: string]: number };

  // Exit Details (populated when position closes)
  exitDate?: string;
  exitPrice?: number;
  exitReason?: "STOP_LOSS" | "TAKE_PROFIT" | "TIME_LIMIT";
  daysHeld?: number;
  realizedPnL?: number;
  returnPercent?: number;

  // Current Status
  status: "OPEN" | "CLOSED";
  currentPrice?: number;
  unrealizedPnL?: number;
  currentReturn?: number;
}

export interface DailySnapshot {
  date: string;
  dayNumber: number;

  // Portfolio Values
  totalPortfolioValue: number;
  availableCash: number;
  totalInvestedAmount: number;

  // Position Summary
  openPositions: number;
  newPositionsToday: number;
  closedPositionsToday: number;

  // Performance
  dailyPnL: number;
  totalReturn: number;
  totalReturnPercent: number;

  // Signals
  signalsGenerated: number;
  signalsExecuted: number;
  signalsRejected: number;

  // Risk Management
  totalUnrealizedPnL: number;
  bestPerformer?: { ticker: string; return: number };
  worstPerformer?: { ticker: string; return: number };
}

export interface BacktestResult {
  // Summary
  startDate: string;
  endDate: string;
  totalDays: number;
  startingCapital: number;
  endingCapital: number;
  totalReturn: number;
  totalReturnPercent: number;

  // Trading Statistics
  totalSignalsGenerated: number;
  totalPositionsOpened: number;
  winningPositions: number;
  losingPositions: number;
  winRate: number;

  // Performance Metrics
  averageWin: number;
  averageLoss: number;
  riskRewardRatio: number;
  maxDrawdown: number;
  averageDaysHeld: number;

  // Daily Data
  dailySnapshots: DailySnapshot[];
  allPositions: Position[];

  // Final Summary
  summary: string;
}

// ==================================================================================
// 💼 PORTFOLIO MANAGER CLASS - PROFESSIONAL TRADING SIMULATION
// ==================================================================================

export class PortfolioManager {
  private startingCapital: number;
  private availableCash: number;
  private positions: Position[] = [];
  private dailySnapshots: DailySnapshot[] = [];
  private positionCounter: number = 1;

  // Configuration from Session #167 White Paper
  private readonly POSITION_SIZE_PERCENT = 0.02; // 2% of available cash
  private readonly MAX_DAYS_HELD = 30; // Time limit exit
  private readonly MIN_SIGNAL_SCORE = 75; // Only execute signals ≥75%

  constructor(startingCapital: number = 250000) {
    this.startingCapital = startingCapital;
    this.availableCash = startingCapital;

    console.log(`💼 Portfolio Manager initialized:`);
    console.log(`   Starting Capital: $${startingCapital.toLocaleString()}`);
    console.log(
      `   Position Sizing: ${
        this.POSITION_SIZE_PERCENT * 100
      }% of available cash`
    );
    console.log(
      `   Signal Threshold: ${this.MIN_SIGNAL_SCORE}% minimum for execution`
    );
    console.log(
      `   Time Limit: ${this.MAX_DAYS_HELD} days maximum per position`
    );
  }

  // ==================================================================================
  // 🌅 MORNING POSITION REVIEW - CHECK EXITS
  // ==================================================================================

  /**
   * 🌅 MORNING POSITION REVIEW
   * PURPOSE: Check all open positions for stop loss or take profit hits
   * INPUT: Current date and market data for all open positions
   * OUTPUT: Array of closed positions with exit details
   *
   * 🎯 WHITE PAPER REQUIREMENT: "Daily Position Review - Check exits before new signals"
   */
  reviewOpenPositions(
    currentDate: string,
    marketData: {
      [ticker: string]: { high: number; low: number; close: number };
    }
  ): Position[] {
    console.log(
      `\n🌅 ========== MORNING POSITION REVIEW: ${currentDate} ==========`
    );
    console.log(
      `📊 Reviewing ${
        this.getOpenPositions().length
      } open positions for exits...`
    );

    const closedPositions: Position[] = [];
    const openPositions = this.getOpenPositions();

    for (const position of openPositions) {
      const ticker = position.ticker;
      const data = marketData[ticker];

      if (!data) {
        console.log(
          `⚠️ [${ticker}] No market data available - keeping position open`
        );
        continue;
      }

      const { high, low, close } = data;
      let exitTriggered = false;
      let exitPrice = 0;
      let exitReason: "STOP_LOSS" | "TAKE_PROFIT" | "TIME_LIMIT" = "STOP_LOSS";

      // Check Stop Loss (daily low <= stop loss price)
      if (low <= position.stopLoss) {
        exitTriggered = true;
        exitPrice = position.stopLoss;
        exitReason = "STOP_LOSS";
        console.log(
          `❌ [${ticker}] Stop Loss Hit: Low $${low.toFixed(
            2
          )} <= Stop $${position.stopLoss.toFixed(2)}`
        );
      }
      // Check Take Profit (daily high >= take profit price)
      else if (high >= position.takeProfit) {
        exitTriggered = true;
        exitPrice = position.takeProfit;
        exitReason = "TAKE_PROFIT";
        console.log(
          `✅ [${ticker}] Take Profit Hit: High $${high.toFixed(
            2
          )} >= Target $${position.takeProfit.toFixed(2)}`
        );
      }
      // Check Time Limit (30 days maximum)
      else {
        const daysHeld = this.calculateDaysHeld(
          position.entryDate,
          currentDate
        );
        if (daysHeld >= this.MAX_DAYS_HELD) {
          exitTriggered = true;
          exitPrice = close;
          exitReason = "TIME_LIMIT";
          console.log(
            `⏰ [${ticker}] Time Limit Reached: ${daysHeld} days >= ${this.MAX_DAYS_HELD} day limit`
          );
        }
      }

      if (exitTriggered) {
        const closedPosition = this.closePosition(
          position,
          currentDate,
          exitPrice,
          exitReason
        );
        closedPositions.push(closedPosition);

        // Add cash back to available funds
        this.availableCash += closedPosition.shares * exitPrice;

        console.log(
          `💰 [${ticker}] Position Closed: ${exitReason} → ${
            closedPosition.returnPercent! >= 0 ? "+" : ""
          }${closedPosition.returnPercent!.toFixed(2)}% (${
            closedPosition.realizedPnL! >= 0 ? "+" : ""
          }$${closedPosition.realizedPnL!.toFixed(2)})`
        );
      } else {
        // Update current price for unrealized P&L calculation
        position.currentPrice = close;
        position.unrealizedPnL =
          (close - position.entryPrice) * position.shares;
        position.currentReturn =
          ((close - position.entryPrice) / position.entryPrice) * 100;

        console.log(
          `⏳ [${ticker}] Still Open: $${close.toFixed(2)} (${
            position.currentReturn >= 0 ? "+" : ""
          }${position.currentReturn.toFixed(2)}% unrealized)`
        );
      }
    }

    console.log(
      `🌅 Morning Review Complete: ${
        closedPositions.length
      } positions closed, ${this.getOpenPositions().length} remain open`
    );
    console.log(
      `💰 Available Cash After Exits: $${this.availableCash.toLocaleString()}`
    );

    return closedPositions;
  }

  // ==================================================================================
  // 🎯 SIGNAL EXECUTION - OPEN NEW POSITIONS
  // ==================================================================================

  /**
   * 🎯 EXECUTE TRADING SIGNALS
   * PURPOSE: Execute qualified signals (≥75%) with 2% position sizing
   * INPUT: Array of signals and current date
   * OUTPUT: Array of new positions opened
   *
   * 🎯 WHITE PAPER REQUIREMENT: "Signal Execution - Only signals ≥75%, 2% position sizing"
   */
  executeSignals(signals: SignalAnalysis[], currentDate: string): Position[] {
    console.log(`\n🎯 ========== SIGNAL EXECUTION: ${currentDate} ==========`);
    console.log(`📊 Processing ${signals.length} signals for execution...`);

    const newPositions: Position[] = [];
    const qualifiedSignals = signals.filter(
      (signal) => signal.finalScore >= this.MIN_SIGNAL_SCORE
    );

    console.log(
      `✅ Qualified Signals: ${qualifiedSignals.length}/${signals.length} (≥${this.MIN_SIGNAL_SCORE}% threshold)`
    );
    console.log(`💰 Available Cash: $${this.availableCash.toLocaleString()}`);

    for (const signal of qualifiedSignals) {
      try {
        // Calculate position size (2% of available cash)
        const positionSize = this.availableCash * this.POSITION_SIZE_PERCENT;
        const shares = Math.floor(positionSize / signal.entryPrice);
        const actualCost = shares * signal.entryPrice;

        // Check if we have sufficient cash
        if (actualCost > this.availableCash) {
          console.log(
            `💸 [${
              signal.ticker
            }] Insufficient Cash: Need $${actualCost.toLocaleString()}, Have $${this.availableCash.toLocaleString()}`
          );
          continue;
        }

        if (shares === 0) {
          console.log(
            `⚠️ [${signal.ticker}] Position too small: $${positionSize.toFixed(
              2
            )} / $${signal.entryPrice.toFixed(2)} = 0 shares`
          );
          continue;
        }

        // Create new position
        const position: Position = {
          id: `POS_${this.positionCounter++}`,
          ticker: signal.ticker,
          companyName: signal.companyName,
          sector: signal.sector,

          entryDate: currentDate,
          entryPrice: signal.entryPrice,
          shares: shares,
          positionCost: actualCost,

          stopLoss: signal.stopLoss,
          takeProfit: signal.takeProfit,
          riskRewardRatio: signal.riskRewardRatio,

          signalScore: signal.finalScore,
          signalType: signal.signalType,
          timeframeScores: signal.timeframeScores,

          status: "OPEN",
          currentPrice: signal.entryPrice,
          unrealizedPnL: 0,
          currentReturn: 0,
        };

        // Deduct cash and add position
        this.availableCash -= actualCost;
        this.positions.push(position);
        newPositions.push(position);

        console.log(
          `🚀 [${
            signal.ticker
          }] Position Opened: ${shares} shares @ $${signal.entryPrice.toFixed(
            2
          )} = $${actualCost.toLocaleString()}`
        );
        console.log(
          `   📊 Signal Score: ${
            signal.finalScore
          }% | Stop: $${signal.stopLoss.toFixed(
            2
          )} | Target: $${signal.takeProfit.toFixed(
            2
          )} | R/R: ${signal.riskRewardRatio.toFixed(1)}:1`
        );
      } catch (error) {
        console.log(
          `❌ [${signal.ticker}] Position creation error: ${error.message}`
        );
      }
    }

    console.log(
      `🎯 Signal Execution Complete: ${newPositions.length} new positions opened`
    );
    console.log(`💰 Remaining Cash: $${this.availableCash.toLocaleString()}`);

    return newPositions;
  }

  // ==================================================================================
  // 📊 DAILY SNAPSHOT RECORDING
  // ==================================================================================

  /**
   * 📊 RECORD DAILY SNAPSHOT
   * PURPOSE: Capture end-of-day portfolio state for performance tracking
   * INPUT: Current date, day number, and daily trading activity
   * OUTPUT: Daily snapshot with all metrics
   *
   * 🎯 WHITE PAPER REQUIREMENT: "Daily Snapshot Recording - Complete state tracking"
   */
  recordDailySnapshot(
    currentDate: string,
    dayNumber: number,
    newPositions: Position[],
    closedPositions: Position[],
    signalsGenerated: number,
    signalsExecuted: number
  ): DailySnapshot {
    console.log(
      `\n📊 ========== DAILY SNAPSHOT: ${currentDate} (Day ${dayNumber}) ==========`
    );

    const openPositions = this.getOpenPositions();

    // Calculate total invested amount (current market value of open positions)
    const totalInvestedAmount = openPositions.reduce((total, position) => {
      return (
        total + (position.currentPrice || position.entryPrice) * position.shares
      );
    }, 0);

    // Calculate total unrealized P&L
    const totalUnrealizedPnL = openPositions.reduce((total, position) => {
      return total + (position.unrealizedPnL || 0);
    }, 0);

    // Calculate daily P&L (realized + change in unrealized)
    const realizedPnLToday = closedPositions.reduce((total, position) => {
      return total + (position.realizedPnL || 0);
    }, 0);

    // Calculate total portfolio value
    const totalPortfolioValue = this.availableCash + totalInvestedAmount;
    const totalReturn = totalPortfolioValue - this.startingCapital;
    const totalReturnPercent = (totalReturn / this.startingCapital) * 100;

    // Find best and worst performers
    let bestPerformer: { ticker: string; return: number } | undefined;
    let worstPerformer: { ticker: string; return: number } | undefined;

    openPositions.forEach((position) => {
      const returnPercent = position.currentReturn || 0;
      if (!bestPerformer || returnPercent > bestPerformer.return) {
        bestPerformer = { ticker: position.ticker, return: returnPercent };
      }
      if (!worstPerformer || returnPercent < worstPerformer.return) {
        worstPerformer = { ticker: position.ticker, return: returnPercent };
      }
    });

    const snapshot: DailySnapshot = {
      date: currentDate,
      dayNumber: dayNumber,

      totalPortfolioValue: totalPortfolioValue,
      availableCash: this.availableCash,
      totalInvestedAmount: totalInvestedAmount,

      openPositions: openPositions.length,
      newPositionsToday: newPositions.length,
      closedPositionsToday: closedPositions.length,

      dailyPnL: realizedPnLToday, // Today's realized gains/losses
      totalReturn: totalReturn,
      totalReturnPercent: totalReturnPercent,

      signalsGenerated: signalsGenerated,
      signalsExecuted: signalsExecuted,
      signalsRejected: signalsGenerated - signalsExecuted,

      totalUnrealizedPnL: totalUnrealizedPnL,
      bestPerformer: bestPerformer,
      worstPerformer: worstPerformer,
    };

    this.dailySnapshots.push(snapshot);

    console.log(`📊 Daily Snapshot Recorded:`);
    console.log(
      `   Portfolio Value: $${totalPortfolioValue.toLocaleString()} (${
        totalReturnPercent >= 0 ? "+" : ""
      }${totalReturnPercent.toFixed(2)}%)`
    );
    console.log(`   Available Cash: $${this.availableCash.toLocaleString()}`);
    console.log(
      `   Open Positions: ${
        openPositions.length
      } ($${totalInvestedAmount.toLocaleString()} invested)`
    );
    console.log(
      `   Today's Activity: +${newPositions.length} opened, +${closedPositions.length} closed`
    );
    console.log(
      `   Unrealized P&L: ${
        totalUnrealizedPnL >= 0 ? "+" : ""
      }$${totalUnrealizedPnL.toFixed(2)}`
    );

    return snapshot;
  }

  // ==================================================================================
  // 🏁 FINAL BACKTEST RESULTS
  // ==================================================================================

  /**
   * 🏁 GENERATE FINAL BACKTEST RESULTS
   * PURPOSE: Compile comprehensive 30-day simulation results
   * INPUT: Start and end dates
   * OUTPUT: Complete backtest analysis with all metrics
   *
   * 🎯 WHITE PAPER REQUIREMENT: "Final Report - Comprehensive 30-day summary"
   */
  generateFinalResults(startDate: string, endDate: string): BacktestResult {
    console.log(`\n🏁 ========== GENERATING FINAL BACKTEST RESULTS ==========`);

    const closedPositions = this.positions.filter((p) => p.status === "CLOSED");
    const totalDays = this.dailySnapshots.length;

    const totalPortfolioValue =
      this.availableCash +
      this.getOpenPositions().reduce((total, position) => {
        return (
          total +
          (position.currentPrice || position.entryPrice) * position.shares
        );
      }, 0);

    const totalReturn = totalPortfolioValue - this.startingCapital;
    const totalReturnPercent = (totalReturn / this.startingCapital) * 100;

    // Trading Statistics
    const winningPositions = closedPositions.filter(
      (p) => (p.realizedPnL || 0) > 0
    ).length;
    const losingPositions = closedPositions.filter(
      (p) => (p.realizedPnL || 0) < 0
    ).length;
    const winRate =
      closedPositions.length > 0
        ? (winningPositions / closedPositions.length) * 100
        : 0;

    // Performance Metrics
    const wins = closedPositions.filter((p) => (p.realizedPnL || 0) > 0);
    const losses = closedPositions.filter((p) => (p.realizedPnL || 0) < 0);

    const averageWin =
      wins.length > 0
        ? wins.reduce((sum, p) => sum + (p.realizedPnL || 0), 0) / wins.length
        : 0;
    const averageLoss =
      losses.length > 0
        ? Math.abs(
            losses.reduce((sum, p) => sum + (p.realizedPnL || 0), 0) /
              losses.length
          )
        : 0;
    const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0;

    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = this.startingCapital;

    this.dailySnapshots.forEach((snapshot) => {
      if (snapshot.totalPortfolioValue > peak) {
        peak = snapshot.totalPortfolioValue;
      }
      const drawdown = ((peak - snapshot.totalPortfolioValue) / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    const averageDaysHeld =
      closedPositions.length > 0
        ? closedPositions.reduce((sum, p) => sum + (p.daysHeld || 0), 0) /
          closedPositions.length
        : 0;

    const totalSignalsGenerated = this.dailySnapshots.reduce(
      (sum, s) => sum + s.signalsGenerated,
      0
    );

    const result: BacktestResult = {
      startDate,
      endDate,
      totalDays,
      startingCapital: this.startingCapital,
      endingCapital: totalPortfolioValue,
      totalReturn,
      totalReturnPercent,

      totalSignalsGenerated,
      totalPositionsOpened: this.positions.length,
      winningPositions,
      losingPositions,
      winRate,

      averageWin,
      averageLoss,
      riskRewardRatio,
      maxDrawdown,
      averageDaysHeld,

      dailySnapshots: this.dailySnapshots,
      allPositions: this.positions,

      summary: this.generateSummaryText(
        totalReturnPercent,
        winRate,
        maxDrawdown,
        closedPositions.length
      ),
    };

    console.log(
      `🏁 Final Results Generated: ${
        totalReturnPercent >= 0 ? "+" : ""
      }${totalReturnPercent.toFixed(2)}% return, ${winRate.toFixed(
        1
      )}% win rate`
    );

    return result;
  }

  // ==================================================================================
  // 🛠️ UTILITY METHODS
  // ==================================================================================

  private closePosition(
    position: Position,
    exitDate: string,
    exitPrice: number,
    exitReason: "STOP_LOSS" | "TAKE_PROFIT" | "TIME_LIMIT"
  ): Position {
    const daysHeld = this.calculateDaysHeld(position.entryDate, exitDate);
    const realizedPnL = (exitPrice - position.entryPrice) * position.shares;
    const returnPercent =
      ((exitPrice - position.entryPrice) / position.entryPrice) * 100;

    position.status = "CLOSED";
    position.exitDate = exitDate;
    position.exitPrice = exitPrice;
    position.exitReason = exitReason;
    position.daysHeld = daysHeld;
    position.realizedPnL = realizedPnL;
    position.returnPercent = returnPercent;

    return position;
  }

  private calculateDaysHeld(entryDate: string, exitDate: string): number {
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    const diffTime = Math.abs(exit.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private generateSummaryText(
    totalReturn: number,
    winRate: number,
    maxDrawdown: number,
    totalTrades: number
  ): string {
    const returnStatus = totalReturn >= 0 ? "profitable" : "loss-making";
    const winRateStatus =
      winRate >= 60
        ? "excellent"
        : winRate >= 50
        ? "good"
        : "needs improvement";

    return (
      `Kurzora 30-day backtesting simulation completed with ${
        totalReturn >= 0 ? "+" : ""
      }${totalReturn.toFixed(2)}% total return. ` +
      `The strategy was ${returnStatus} with a ${winRateStatus} win rate of ${winRate.toFixed(
        1
      )}%. ` +
      `Maximum drawdown was ${maxDrawdown.toFixed(
        2
      )}% across ${totalTrades} trades. ` +
      `Signal quality filtering (≥75%) maintained institutional standards throughout the simulation.`
    );
  }

  public getOpenPositions(): Position[] {
    return this.positions.filter((p) => p.status === "OPEN");
  }

  public getClosedPositions(): Position[] {
    return this.positions.filter((p) => p.status === "CLOSED");
  }

  public getAvailableCash(): number {
    return this.availableCash;
  }

  public getTotalPositions(): number {
    return this.positions.length;
  }

  public getDailySnapshots(): DailySnapshot[] {
    return this.dailySnapshots;
  }
}

console.log("💼 Portfolio Manager loaded successfully!");
console.log(
  "✅ Ready for professional 30-day trading simulation with 2% position sizing"
);
console.log(
  "🎯 Features: Position tracking, cash management, stop losses, take profits, daily snapshots"
);
console.log(
  "📊 Ready to process signals ≥75% with institutional risk management!"
);
