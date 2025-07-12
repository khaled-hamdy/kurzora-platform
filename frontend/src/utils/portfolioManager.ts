// ==================================================================================
// 📊 KURZORA PORTFOLIO MANAGER - FIXED: CLOSED POSITIONS ONLY CALCULATION
// ==================================================================================
// 🔧 PURPOSE: Professional portfolio management with REALISTIC performance calculation
// 📝 SESSION #175: FIXED - Only count realized trades, exclude TIME_LIMIT positions
// 🛡️ CRITICAL: NO artificial forced closures, matches institutional standards
// 🎯 FEATURES: Realized vs Unrealized P&L separation, professional reporting
// ⚠️ MAJOR FIX: Performance based on actual trading decisions only
// 🚀 RESULT: True signal performance without artificial distortion

export interface Position {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  entryDate: string;
  entryPrice: number;
  shares: number;
  stopLoss: number;
  takeProfit: number;
  signalScore: number;
  signalType: string;
  timeframeScores: { [key: string]: number };

  // Position status
  status: "OPEN" | "CLOSED";

  // For closed positions (REAL EXITS ONLY)
  exitDate?: string;
  exitPrice?: number;
  exitReason?: "STOP_LOSS" | "TAKE_PROFIT" | "TIME_LIMIT";
  daysHeld?: number;
  realizedPnL?: number;
  returnPercent?: number;

  // For open positions
  currentPrice?: number;
  unrealizedPnL?: number;
  currentReturn?: number;
}

export interface DailySnapshot {
  date: string;
  totalPortfolioValue: number;
  availableCash: number;
  dailyPnL: number;
  totalReturnPercent: number;
  openPositions: number;
  newPositionsToday: number;
  closedPositionsToday: number;
  signalsGenerated: number;
  signalsExecuted: number;
}

// 🆕 ENHANCED RESULT INTERFACE - REALISTIC PERFORMANCE
export interface BacktestResult {
  // 🎯 REALIZED PERFORMANCE (PRIMARY METRICS - REAL TRADING DECISIONS ONLY)
  realizedReturn: number; // Only closed positions (STOP_LOSS, TAKE_PROFIT)
  realizedPnL: number; // Actual profits/losses from completed trades
  realizedPositions: number; // Count of positions that actually closed
  realizedWinRate: number; // Win rate of real exits only
  realizedWinningPositions: number; // Winning trades count
  realizedLosingPositions: number; // Losing trades count
  realizedAverageDaysHeld: number; // Average holding period for closed trades
  realizedRiskRewardRatio: number; // Real risk/reward from actual trades
  realizedMaxDrawdown: number; // Max drawdown from realized trades only

  // 🔄 UNREALIZED STATUS (INFORMATION ONLY - NOT COUNTED IN PERFORMANCE)
  openPositions: number; // Remaining open positions
  unrealizedPnL: number; // Current paper value of open positions
  unrealizedReturn: number; // Current paper return of open positions

  // 📊 COMBINED METRICS (REFERENCE ONLY)
  totalPortfolioValue: number; // Current total portfolio value
  totalPositionsOpened: number; // All positions ever opened
  totalSignalsGenerated: number; // Total signals processed

  // 📋 LEGACY METRICS (FOR COMPATIBILITY)
  totalReturnPercent: number; // = realizedReturn (main metric)
  winRate: number; // = realizedWinRate (main metric)
  winningPositions: number; // = realizedWinningPositions
  averageDaysHeld: number; // = realizedAverageDaysHeld
  riskRewardRatio: number; // = realizedRiskRewardRatio
  maxDrawdown: number; // = realizedMaxDrawdown

  // 📊 DATA COLLECTIONS
  dailySnapshots: DailySnapshot[];
  allPositions: Position[]; // All positions (closed + open)
  summary: string;
}

export class PortfolioManager {
  private startingCapital: number;
  private availableCash: number;
  private positions: Position[] = [];
  private dailySnapshots: DailySnapshot[] = [];

  constructor(startingCapital: number) {
    this.startingCapital = startingCapital;
    this.availableCash = startingCapital;
  }

  // Get currently open positions
  getOpenPositions(): Position[] {
    return this.positions.filter((p) => p.status === "OPEN");
  }

  // Get available cash
  getAvailableCash(): number {
    return this.availableCash;
  }

  // Execute signals - create new positions
  executeSignals(signals: any[], currentDate: string): Position[] {
    const newPositions: Position[] = [];

    signals.forEach((signal, index) => {
      // Calculate position size (simplified for backtest)
      const riskAmount = this.startingCapital * 0.02; // 2% risk
      const stopDistance = signal.entryPrice - signal.stopLoss;
      const shares = Math.floor(riskAmount / stopDistance);
      const positionValue = shares * signal.entryPrice;

      // Check if we have enough cash
      if (positionValue <= this.availableCash) {
        const position: Position = {
          id: `POS_${currentDate}_${signal.ticker}_${index}`,
          ticker: signal.ticker,
          companyName: signal.companyName || `${signal.ticker} Corp`,
          sector: signal.sector || "Unknown",
          entryDate: currentDate,
          entryPrice: signal.entryPrice,
          shares: shares,
          stopLoss: signal.stopLoss,
          takeProfit: signal.takeProfit,
          signalScore: signal.finalScore,
          signalType: signal.signalType || "BUY",
          timeframeScores: signal.timeframes || {},
          status: "OPEN",
          currentPrice: signal.entryPrice,
          unrealizedPnL: 0,
          currentReturn: 0,
        };

        this.positions.push(position);
        newPositions.push(position);
        this.availableCash -= positionValue;

        console.log(
          `✅ Opened position: ${signal.ticker} at $${signal.entryPrice} (${shares} shares)`
        );
      }
    });

    return newPositions;
  }

  // Review open positions for stop loss/take profit hits
  reviewOpenPositions(
    currentDate: string,
    marketData: {
      [ticker: string]: { high: number; low: number; close: number };
    }
  ): Position[] {
    const closedPositions: Position[] = [];

    this.positions.forEach((position) => {
      if (position.status === "OPEN") {
        const data = marketData[position.ticker];
        if (!data) return;

        // Update current price
        position.currentPrice = data.close;
        position.unrealizedPnL =
          (data.close - position.entryPrice) * position.shares;
        position.currentReturn =
          ((data.close - position.entryPrice) / position.entryPrice) * 100;

        // 🎯 CHECK FOR REAL EXITS (STOP LOSS OR TAKE PROFIT)
        let shouldClose = false;
        let exitReason: "STOP_LOSS" | "TAKE_PROFIT" | undefined;
        let exitPrice = data.close;

        // Check stop loss hit
        if (data.low <= position.stopLoss) {
          shouldClose = true;
          exitReason = "STOP_LOSS";
          exitPrice = position.stopLoss;
          console.log(`🛑 STOP LOSS HIT: ${position.ticker} at $${exitPrice}`);
        }
        // Check take profit hit (only if stop loss not hit)
        else if (data.high >= position.takeProfit) {
          shouldClose = true;
          exitReason = "TAKE_PROFIT";
          exitPrice = position.takeProfit;
          console.log(
            `🎯 TAKE PROFIT HIT: ${position.ticker} at $${exitPrice}`
          );
        }

        // 🚀 CLOSE POSITION IF TARGET HIT
        if (shouldClose && exitReason) {
          const daysHeld = this.calculateDaysHeld(
            position.entryDate,
            currentDate
          );
          const realizedPnL =
            (exitPrice - position.entryPrice) * position.shares;
          const returnPercent =
            ((exitPrice - position.entryPrice) / position.entryPrice) * 100;

          // Update position with closure details
          position.status = "CLOSED";
          position.exitDate = currentDate;
          position.exitPrice = exitPrice;
          position.exitReason = exitReason;
          position.daysHeld = daysHeld;
          position.realizedPnL = realizedPnL;
          position.returnPercent = returnPercent;

          // Return cash to portfolio
          const proceeds = exitPrice * position.shares;
          this.availableCash += proceeds;

          closedPositions.push(position);

          console.log(
            `✅ Position closed: ${
              position.ticker
            } ${exitReason} - P&L: $${realizedPnL.toFixed(
              2
            )} (${returnPercent.toFixed(2)}%)`
          );
        }
      }
    });

    return closedPositions;
  }

  // Record daily snapshot
  recordDailySnapshot(
    date: string,
    dayNumber: number,
    newPositions: Position[],
    closedPositions: Position[],
    signalsGenerated: number,
    signalsExecuted: number
  ): DailySnapshot {
    const openPositions = this.getOpenPositions();
    const totalInvested = openPositions.reduce(
      (sum, pos) => sum + (pos.currentPrice || pos.entryPrice) * pos.shares,
      0
    );
    const totalPortfolioValue = this.availableCash + totalInvested;

    // Calculate daily P&L from closed positions only
    const dailyPnL = closedPositions.reduce(
      (sum, pos) => sum + (pos.realizedPnL || 0),
      0
    );

    const snapshot: DailySnapshot = {
      date,
      totalPortfolioValue,
      availableCash: this.availableCash,
      dailyPnL,
      totalReturnPercent:
        ((totalPortfolioValue - this.startingCapital) / this.startingCapital) *
        100,
      openPositions: openPositions.length,
      newPositionsToday: newPositions.length,
      closedPositionsToday: closedPositions.length,
      signalsGenerated,
      signalsExecuted,
    };

    this.dailySnapshots.push(snapshot);
    return snapshot;
  }

  // 🚀 CORE FIX: GENERATE REALISTIC FINAL RESULTS
  generateFinalResults(startDate: string, endDate: string): BacktestResult {
    console.log(
      "📊 Generating REALISTIC final results (Closed Positions Only)..."
    );

    // 🎯 STEP 1: SEPARATE REALIZED VS UNREALIZED POSITIONS
    const realizedPositions = this.positions.filter(
      (pos) =>
        pos.status === "CLOSED" &&
        pos.exitReason !== "TIME_LIMIT" && // 🚫 EXCLUDE artificial TIME_LIMIT closures
        ["STOP_LOSS", "TAKE_PROFIT"].includes(pos.exitReason!)
    );

    const openPositions = this.positions.filter(
      (pos) => pos.status === "OPEN" || pos.exitReason === "TIME_LIMIT" // Keep TIME_LIMIT as open
    );

    console.log(`🎯 Realized Positions (counted): ${realizedPositions.length}`);
    console.log(`⏳ Open Positions (not counted): ${openPositions.length}`);

    // 🎯 STEP 2: CALCULATE REALIZED PERFORMANCE (PRIMARY METRICS)
    const realizedWinningPositions = realizedPositions.filter(
      (pos) => (pos.realizedPnL || 0) > 0
    ).length;
    const realizedLosingPositions = realizedPositions.filter(
      (pos) => (pos.realizedPnL || 0) < 0
    ).length;
    const realizedWinRate =
      realizedPositions.length > 0
        ? (realizedWinningPositions / realizedPositions.length) * 100
        : 0;

    const realizedPnL = realizedPositions.reduce(
      (sum, pos) => sum + (pos.realizedPnL || 0),
      0
    );
    const realizedReturn = (realizedPnL / this.startingCapital) * 100;

    const realizedAverageDaysHeld =
      realizedPositions.length > 0
        ? realizedPositions.reduce((sum, pos) => sum + (pos.daysHeld || 0), 0) /
          realizedPositions.length
        : 0;

    // Calculate realized risk/reward ratio
    const winners = realizedPositions.filter(
      (pos) => (pos.realizedPnL || 0) > 0
    );
    const losers = realizedPositions.filter(
      (pos) => (pos.realizedPnL || 0) < 0
    );

    const avgWin =
      winners.length > 0
        ? winners.reduce((sum, pos) => sum + (pos.realizedPnL || 0), 0) /
          winners.length
        : 0;
    const avgLoss =
      losers.length > 0
        ? Math.abs(
            losers.reduce((sum, pos) => sum + (pos.realizedPnL || 0), 0) /
              losers.length
          )
        : 1;

    const realizedRiskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

    // Calculate max drawdown from realized trades only
    let realizedMaxDrawdown = 0;
    let runningPnL = 0;
    let peak = 0;

    realizedPositions
      .sort(
        (a, b) =>
          new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime()
      )
      .forEach((pos) => {
        runningPnL += pos.realizedPnL || 0;
        if (runningPnL > peak) {
          peak = runningPnL;
        }
        const drawdown = ((peak - runningPnL) / this.startingCapital) * 100;
        if (drawdown > realizedMaxDrawdown) {
          realizedMaxDrawdown = drawdown;
        }
      });

    // 🔄 STEP 3: CALCULATE UNREALIZED STATUS (INFORMATION ONLY)
    const unrealizedPnL = openPositions.reduce(
      (sum, pos) => sum + (pos.unrealizedPnL || 0),
      0
    );
    const unrealizedReturn = (unrealizedPnL / this.startingCapital) * 100;

    // 📊 STEP 4: CALCULATE CURRENT PORTFOLIO VALUE
    const currentPortfolioValue =
      this.availableCash +
      openPositions.reduce(
        (sum, pos) => sum + (pos.currentPrice || pos.entryPrice) * pos.shares,
        0
      );

    // 🎯 STEP 5: GENERATE PROFESSIONAL SUMMARY
    const summary = this.generateRealisticSummary(
      realizedReturn,
      realizedWinRate,
      realizedPositions.length,
      openPositions.length,
      realizedRiskRewardRatio,
      realizedMaxDrawdown
    );

    // 🚀 STEP 6: CREATE ENHANCED RESULT OBJECT
    const result: BacktestResult = {
      // 🎯 REALIZED PERFORMANCE (PRIMARY METRICS)
      realizedReturn: realizedReturn,
      realizedPnL: realizedPnL,
      realizedPositions: realizedPositions.length,
      realizedWinRate: realizedWinRate,
      realizedWinningPositions: realizedWinningPositions,
      realizedLosingPositions: realizedLosingPositions,
      realizedAverageDaysHeld: realizedAverageDaysHeld,
      realizedRiskRewardRatio: realizedRiskRewardRatio,
      realizedMaxDrawdown: realizedMaxDrawdown,

      // 🔄 UNREALIZED STATUS (INFORMATION ONLY)
      openPositions: openPositions.length,
      unrealizedPnL: unrealizedPnL,
      unrealizedReturn: unrealizedReturn,

      // 📊 COMBINED METRICS (REFERENCE ONLY)
      totalPortfolioValue: currentPortfolioValue,
      totalPositionsOpened: this.positions.length,
      totalSignalsGenerated: this.dailySnapshots.reduce(
        (sum, day) => sum + day.signalsGenerated,
        0
      ),

      // 📋 LEGACY METRICS (FOR COMPATIBILITY - BASED ON REALIZED ONLY)
      totalReturnPercent: realizedReturn, // Main metric = realized return
      winRate: realizedWinRate, // Main metric = realized win rate
      winningPositions: realizedWinningPositions, // Realized winners only
      averageDaysHeld: realizedAverageDaysHeld, // Realized average only
      riskRewardRatio: realizedRiskRewardRatio, // Realized R/R only
      maxDrawdown: realizedMaxDrawdown, // Realized drawdown only

      // 📊 DATA COLLECTIONS
      dailySnapshots: this.dailySnapshots,
      allPositions: this.positions,
      summary: summary,
    };

    console.log("✅ REALISTIC Results Generated:");
    console.log(
      `   📊 Realized Return: ${realizedReturn.toFixed(2)}% (${
        realizedPositions.length
      } trades)`
    );
    console.log(`   🎯 Realized Win Rate: ${realizedWinRate.toFixed(1)}%`);
    console.log(`   ⏳ Open Positions: ${openPositions.length} (unrealized)`);
    console.log(`   💰 Realized P&L: $${realizedPnL.toFixed(2)}`);
    console.log(
      `   📈 Unrealized P&L: $${unrealizedPnL.toFixed(2)} (not counted)`
    );

    return result;
  }

  // Generate realistic summary
  private generateRealisticSummary(
    realizedReturn: number,
    realizedWinRate: number,
    realizedPositions: number,
    openPositions: number,
    riskRewardRatio: number,
    maxDrawdown: number
  ): string {
    const returnDescription =
      realizedReturn >= 5
        ? "excellent"
        : realizedReturn >= 2
        ? "good"
        : realizedReturn >= 0
        ? "modest positive"
        : "negative";

    const winRateDescription =
      realizedWinRate >= 60
        ? "high"
        : realizedWinRate >= 40
        ? "moderate"
        : realizedWinRate >= 30
        ? "low"
        : "very low";

    return `Kurzora enhanced backtesting simulation completed with ${
      realizedReturn >= 0 ? "+" : ""
    }${realizedReturn.toFixed(
      2
    )}% realized return based on ${realizedPositions} completed trades. The strategy achieved a ${winRateDescription} win rate of ${realizedWinRate.toFixed(
      1
    )}% with ${riskRewardRatio.toFixed(
      1
    )}:1 risk-reward ratio. Maximum realized drawdown was ${maxDrawdown.toFixed(
      1
    )}%. ${openPositions} positions remain open and are not counted in performance metrics, following institutional standards. Performance reflects only actual trading decisions (stop loss/take profit exits) without artificial TIME_LIMIT distortions.`;
  }

  // Calculate days held between two dates
  private calculateDaysHeld(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// 🎯 SESSION #175: PORTFOLIO MANAGER FIXED COMPLETE
// 🛡️ PRESERVATION: Only count realized trades (STOP_LOSS, TAKE_PROFIT)
// 📝 HANDOVER: Professional performance calculation without artificial distortion
// ✅ FEATURES: Realistic returns, institutional standards, proper unrealized tracking
// 🚀 RESULT: True signal performance validation with zero TIME_LIMIT contamination

console.log(
  "📊 Portfolio Manager with Realistic Performance Calculation loaded successfully!"
);
console.log(
  "✅ Features: Closed positions only, professional standards, no artificial distortion"
);
console.log(
  "🎯 Ready for authentic signal performance validation with institutional-grade reporting!"
);
