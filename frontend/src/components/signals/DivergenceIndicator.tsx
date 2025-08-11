// src/components/signals/DivergenceIndicator.tsx
// Session #402: Professional Divergence Display Component
// Industry-standard subtle professional approach

import React from "react";
import { Badge } from "../ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DivergenceData {
  hasValidDivergence: boolean;
  analysisSuccessful: boolean;
  timeframe: string;
  strongestPattern?: {
    type:
      | "BULLISH_REGULAR"
      | "BEARISH_REGULAR"
      | "BULLISH_HIDDEN"
      | "BEARISH_HIDDEN";
    strength: "WEAK" | "MODERATE" | "STRONG" | "VERY_STRONG";
    confidenceScore: number;
    qualityScore: number;
  };
  scoreBonus?: number;
  totalPatternsFound: number;
  validPatternsCount: number;
}

interface DivergenceIndicatorProps {
  divergenceData?: DivergenceData;
  className?: string;
}

/**
 * Get divergence badge color based on pattern strength and type
 */
const getDivergenceBadgeStyle = (
  pattern: DivergenceData["strongestPattern"]
) => {
  if (!pattern) return "bg-slate-600/50 text-slate-300 border-slate-500/30";

  const isBullish = pattern.type.includes("BULLISH");
  const strength = pattern.strength;

  // Base colors for bullish/bearish
  const baseColors = {
    bullish: {
      VERY_STRONG: "bg-emerald-600/80 text-white border-emerald-500/60",
      STRONG: "bg-emerald-600/60 text-emerald-100 border-emerald-500/40",
      MODERATE: "bg-emerald-600/40 text-emerald-200 border-emerald-500/30",
      WEAK: "bg-emerald-600/20 text-emerald-300 border-emerald-500/20",
    },
    bearish: {
      VERY_STRONG: "bg-red-600/80 text-white border-red-500/60",
      STRONG: "bg-red-600/60 text-red-100 border-red-500/40",
      MODERATE: "bg-red-600/40 text-red-200 border-red-500/30",
      WEAK: "bg-red-600/20 text-red-300 border-red-500/20",
    },
  };

  return isBullish
    ? baseColors.bullish[strength]
    : baseColors.bearish[strength];
};

/**
 * Get divergence icon based on pattern type
 */
const getDivergenceIcon = (pattern: DivergenceData["strongestPattern"]) => {
  if (!pattern) return "D";

  const isBullish = pattern.type.includes("BULLISH");
  const isRegular = pattern.type.includes("REGULAR");

  if (isBullish) {
    return isRegular ? "↗" : "⤴"; // Regular vs Hidden bullish
  } else {
    return isRegular ? "↙" : "⤵"; // Regular vs Hidden bearish
  }
};

/**
 * Professional Divergence Badge Component
 */
export const DivergenceBadge: React.FC<DivergenceIndicatorProps> = ({
  divergenceData,
  className = "",
}) => {
  // Only show badge if divergence is valid
  if (!divergenceData?.hasValidDivergence || !divergenceData.strongestPattern) {
    return null;
  }

  const pattern = divergenceData.strongestPattern;
  const badgeStyle = getDivergenceBadgeStyle(pattern);
  const icon = getDivergenceIcon(pattern);

  return (
    <Badge
      className={`text-xs font-medium px-2 py-1 ${badgeStyle} ${className}`}
      title={`${pattern.type.replace("_", " ")} - ${pattern.strength} (${
        pattern.confidenceScore
      }% confidence)`}
    >
      <span className="mr-1">{icon}</span>D
    </Badge>
  );
};

/**
 * Enhanced Score Display with Divergence Bonus
 */
interface EnhancedScoreProps {
  baseScore: number;
  divergenceBonus?: number;
  finalScore: number;
  className?: string;
}

/**
 * Get score badge color (matches existing SignalCard logic)
 */
const getScoreColor = (score: number): string => {
  if (score >= 90) return "bg-emerald-600";
  if (score >= 80) return "bg-blue-600";
  if (score >= 70) return "bg-amber-600";
  return "bg-red-600";
};

export const EnhancedScoreDisplay: React.FC<EnhancedScoreProps> = ({
  baseScore,
  divergenceBonus,
  finalScore,
  className = "",
}) => {
  const hasBonus = divergenceBonus && divergenceBonus > 0;

  return (
    <div className={`text-center ${className}`}>
      <p className="text-slate-400 text-sm mb-1">Score</p>
      <div className="flex items-center justify-center space-x-1">
        <Badge
          className={`${getScoreColor(
            finalScore
          )} text-white text-2xl px-4 py-2 font-bold`}
        >
          {finalScore}
        </Badge>
        {hasBonus && (
          <span
            className="text-emerald-400 text-lg font-medium ml-1"
            title={`Enhanced by RSI Divergence (+${divergenceBonus} points)`}
          >
            [+{Math.round(divergenceBonus)}]
          </span>
        )}
      </div>
      {hasBonus && (
        <p className="text-xs text-emerald-400/70 mt-1">Divergence Enhanced</p>
      )}
    </div>
  );
};

/**
 * Divergence Tooltip Content (for detailed hover information)
 */
export const DivergenceTooltip: React.FC<{
  divergenceData: DivergenceData;
}> = ({ divergenceData }) => {
  if (!divergenceData.hasValidDivergence || !divergenceData.strongestPattern) {
    return null;
  }

  const pattern = divergenceData.strongestPattern;
  const isBullish = pattern.type.includes("BULLISH");
  const isRegular = pattern.type.includes("REGULAR");

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center space-x-2">
        {isBullish ? (
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-400" />
        )}
        <span className="font-medium">
          {pattern.type.replace("_", " ")} Divergence
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-400">Strength:</span>
          <span className="ml-1">{pattern.strength}</span>
        </div>
        <div>
          <span className="text-slate-400">Confidence:</span>
          <span className="ml-1">{pattern.confidenceScore}%</span>
        </div>
        <div>
          <span className="text-slate-400">Type:</span>
          <span className="ml-1">{isRegular ? "Regular" : "Hidden"}</span>
        </div>
        <div>
          <span className="text-slate-400">Timeframe:</span>
          <span className="ml-1">{divergenceData.timeframe}</span>
        </div>
      </div>

      {divergenceData.scoreBonus && (
        <div className="pt-2 border-t border-slate-600">
          <span className="text-emerald-400 text-xs font-medium">
            Score Bonus: +{Math.round(divergenceData.scoreBonus)} points
          </span>
        </div>
      )}

      <div className="text-xs text-slate-500">
        {isRegular
          ? isBullish
            ? "Suggests potential trend reversal upward"
            : "Suggests potential trend reversal downward"
          : isBullish
          ? "Suggests trend continuation upward"
          : "Suggests trend continuation downward"}
      </div>
    </div>
  );
};

export default DivergenceBadge;
