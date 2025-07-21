// ==================================================================================
// 🎯 SESSION #306A: CONFIDENCE CALCULATOR EXTRACTION - MODULAR ARCHITECTURE COMPONENT
// ==================================================================================
// 🚨 PURPOSE: Extract signal confidence calculation into isolated, testable module following Session #305D pattern
// 🛡️ ANTI-REGRESSION MANDATE: ALL Session #157 crash-resistant logic preserved EXACTLY
// 📝 SESSION #306A EXTRACTION: Moving calculateSignalConfidence from 1600-line monolith to modular architecture
// 🔧 PRESERVATION: Session #157 crash-resistant methodology + defensive programming + comprehensive error handling
// 🚨 CRITICAL SUCCESS: Maintain identical confidence calculations for existing signals (±0.1% tolerance)
// ⚠️ PROTECTED LOGIC: Session #157 standard deviation analysis + input validation + fallback mechanisms
// 🎖️ CONFIDENCE SCORING: Standard deviation based confidence calculation with crash-resistant error handling
// 📊 MODULAR INTEGRATION: Session #305D compatibility maintained exactly
// 🏆 TESTING REQUIREMENT: Extracted module must produce identical confidence scores to original function
// 🚀 PRODUCTION IMPACT: Enable modular architecture while preserving confidence calculation accuracy
// ==================================================================================

/**
 * 🔍 CONFIDENCE INPUT INTERFACE - SESSION #306A CONFIDENCE CALCULATION STRUCTURE
 * 🎯 PURPOSE: Define structure for signal confidence calculation input
 * 🔧 SESSION #157 COMPLIANCE: Supports array of timeframe scores for standard deviation analysis
 * 🛡️ DEFENSIVE PROGRAMMING: Handles various input types and validates score arrays
 * 📊 PRODUCTION READY: Type-safe input structure for confidence calculations
 */
export interface ConfidenceInput {
  scores: number[] | { [key: string]: number } | null | undefined;
  validationRequired?: boolean;
}

/**
 * 🎯 CONFIDENCE CALCULATION RESULT INTERFACE - SESSION #306A OUTPUT STRUCTURE
 * 🚨 PURPOSE: Standardized result format for confidence calculation
 * 🔧 SESSION #157 COMPLIANCE: Includes detailed metadata for debugging and validation
 * 📊 CRASH-RESISTANT: Comprehensive information for error recovery and analysis
 */
export interface ConfidenceResult {
  confidence: number;
  validScoreCount: number;
  standardDeviation: number;
  isValid: boolean;
  metadata: {
    inputType: string;
    originalScores: any;
    filteredScores: number[];
    calculationMethod: string;
    preservedSessions: string[];
    errorRecovery?: string;
  };
}

/**
 * 🧮 CONFIDENCE CALCULATOR - SESSION #306A MODULAR EXTRACTION
 * 🚨 CRITICAL EXTRACTION: Moved from 1600-line monolith (lines ~960-1000) to modular architecture
 * 🛡️ ANTI-REGRESSION: ALL Session #157 crash-resistant methodology preserved EXACTLY
 * 🎯 PURPOSE: Calculate signal confidence using standard deviation analysis with comprehensive error handling
 * 🔧 SESSION #157 PRESERVATION: Crash-resistant logic + defensive programming + input validation + fallback mechanisms
 * 🚀 PRODUCTION READY: Identical confidence calculations to original monolithic function
 * 🔧 SESSION #305D COMPATIBILITY: Follows TimeframeDataCoordinator and SignalComposer modular pattern exactly
 */
export class ConfidenceCalculator {
  /**
   * 🎯 CALCULATE SIGNAL CONFIDENCE - SESSION #306A EXTRACTED CORE LOGIC
   * 🚨 SESSION #157 PRESERVED: All crash-resistant logic moved exactly from original function
   * 🛡️ ANTI-REGRESSION: Zero modifications to confidence logic, error handling, or fallback mechanisms
   * 🔧 PURPOSE: Generate signal confidence from timeframe scores using standard deviation analysis
   * 📊 SESSION #157 PRESERVED: Comprehensive input validation + type conversion + error recovery
   * 🎖️ CRASH-RESISTANT: All defensive programming patterns maintained exactly
   * 🚀 PRODUCTION PRESERVED: Identical confidence calculations to original monolithic function
   *
   * @param input - ConfidenceInput containing scores array or object
   * @returns ConfidenceResult with confidence score and detailed metadata
   */
  calculateConfidence(input: ConfidenceInput): ConfidenceResult {
    console.log(
      `🧠 [CONFIDENCE_CALC] SESSION #157 CRASH-RESISTANT Confidence: Input validation starting...`
    );

    // 🚨 SESSION #157 CRASH-RESISTANT: Handle null/undefined input
    if (!input || (!input.scores && input.scores !== 0)) {
      console.log(
        `⚠️ [CONFIDENCE_CALC] No scores provided - using low confidence fallback`
      );
      return {
        confidence: 30,
        validScoreCount: 0,
        standardDeviation: 0,
        isValid: false,
        metadata: {
          inputType: "null_or_undefined",
          originalScores: input?.scores || null,
          filteredScores: [],
          calculationMethod: "SESSION #157 crash-resistant fallback",
          preservedSessions: ["#157"],
          errorRecovery: "null_input_fallback",
        },
      };
    }

    let scores = input.scores;

    // 🚨 SESSION #157 CRASH-RESISTANT: Handle non-array inputs
    if (!Array.isArray(scores)) {
      console.log(
        `⚠️ [CONFIDENCE_CALC] Input not array - converting from: ${typeof scores}`
      );

      if (typeof scores === "object" && scores !== null) {
        try {
          const converted = Object.values(scores).filter(
            (val) =>
              typeof val === "number" && !isNaN(val) && val >= 0 && val <= 100
          );
          console.log(
            `✅ [CONFIDENCE_CALC] Converted object to array: [${converted.join(
              ", "
            )}]`
          );
          scores = converted;
        } catch (conversionError) {
          console.log(
            `❌ [CONFIDENCE_CALC] Object conversion failed: ${conversionError.message}`
          );
          return {
            confidence: 25,
            validScoreCount: 0,
            standardDeviation: 0,
            isValid: false,
            metadata: {
              inputType: "object_conversion_failed",
              originalScores: input.scores,
              filteredScores: [],
              calculationMethod: "SESSION #157 crash-resistant fallback",
              preservedSessions: ["#157"],
              errorRecovery: "object_conversion_error",
            },
          };
        }
      } else {
        console.log(
          `❌ [CONFIDENCE_CALC] Cannot convert ${typeof scores} to array`
        );
        return {
          confidence: 25,
          validScoreCount: 0,
          standardDeviation: 0,
          isValid: false,
          metadata: {
            inputType: typeof scores,
            originalScores: input.scores,
            filteredScores: [],
            calculationMethod: "SESSION #157 crash-resistant fallback",
            preservedSessions: ["#157"],
            errorRecovery: "type_conversion_impossible",
          },
        };
      }
    }

    // 🚨 SESSION #157 CRASH-RESISTANT: Filter valid scores
    const validScores = (scores as any[]).filter((score) => {
      const isValid =
        typeof score === "number" &&
        !isNaN(score) &&
        score >= 0 &&
        score <= 100;
      if (!isValid) {
        console.log(
          `⚠️ [CONFIDENCE_CALC] Invalid score filtered out: ${score} (type: ${typeof score})`
        );
      }
      return isValid;
    });

    console.log(
      `📊 [CONFIDENCE_CALC] Valid scores after filtering: [${validScores.join(
        ", "
      )}]`
    );

    // 🚨 SESSION #157 CRASH-RESISTANT: Handle insufficient valid scores
    if (validScores.length < 2) {
      console.log(
        `⚠️ [CONFIDENCE_CALC] Insufficient valid scores (${validScores.length}) - need at least 2`
      );
      const fallbackConfidence = validScores.length === 1 ? 40 : 20;
      return {
        confidence: fallbackConfidence,
        validScoreCount: validScores.length,
        standardDeviation: 0,
        isValid: validScores.length >= 1,
        metadata: {
          inputType: "array",
          originalScores: input.scores,
          filteredScores: validScores,
          calculationMethod: "SESSION #157 insufficient_scores_fallback",
          preservedSessions: ["#157"],
          errorRecovery: "insufficient_valid_scores",
        },
      };
    }

    // 🚨 SESSION #157 CRASH-RESISTANT: Standard deviation calculation with error handling
    try {
      const average =
        validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
      const variance =
        validScores.reduce(
          (sum, score) => sum + Math.pow(score - average, 2),
          0
        ) / validScores.length;
      const standardDeviation = Math.sqrt(variance);

      // 🚨 SESSION #157 PRESERVED: Maximum deviation threshold and confidence calculation
      const maxDeviation = 30;
      const confidence = Math.max(
        0,
        100 - (standardDeviation / maxDeviation) * 100
      );
      const finalConfidence = Math.round(confidence);

      console.log(
        `🧠 [CONFIDENCE_CALC] CRASH-RESISTANT Confidence Analysis: Scores [${validScores.join(
          ", "
        )}] → StdDev: ${standardDeviation.toFixed(
          2
        )} → Confidence: ${finalConfidence}%`
      );

      return {
        confidence: finalConfidence,
        validScoreCount: validScores.length,
        standardDeviation: Number(standardDeviation.toFixed(2)),
        isValid: true,
        metadata: {
          inputType: "array",
          originalScores: input.scores,
          filteredScores: validScores,
          calculationMethod: "SESSION #157 standard_deviation_analysis",
          preservedSessions: ["#157"],
        },
      };
    } catch (calculationError) {
      console.log(
        `❌ [CONFIDENCE_CALC] Calculation error: ${calculationError.message}`
      );
      return {
        confidence: 30,
        validScoreCount: validScores.length,
        standardDeviation: 0,
        isValid: false,
        metadata: {
          inputType: "array",
          originalScores: input.scores,
          filteredScores: validScores,
          calculationMethod: "SESSION #157 crash-resistant fallback",
          preservedSessions: ["#157"],
          errorRecovery: "calculation_exception",
        },
      };
    }
  }

  /**
   * 🎖️ VALIDATE CONFIDENCE INPUT - SESSION #306A INPUT VALIDATION
   * 🎯 PURPOSE: Validate confidence input meets calculation requirements
   * 🛡️ PRESERVATION: Maintains Session #157 validation standards
   * 🔧 SESSION #305D COMPATIBILITY: Follows established modular validation pattern
   *
   * @param input - ConfidenceInput to validate
   * @returns boolean indicating if input is sufficient for confidence calculation
   */
  validateInput(input: ConfidenceInput): boolean {
    if (!input || (!input.scores && input.scores !== 0)) {
      return false;
    }

    // Handle array input
    if (Array.isArray(input.scores)) {
      const validScores = input.scores.filter(
        (score) =>
          typeof score === "number" &&
          !isNaN(score) &&
          score >= 0 &&
          score <= 100
      );
      return validScores.length >= 2; // SESSION #157: Need at least 2 scores for meaningful confidence
    }

    // Handle object input
    if (typeof input.scores === "object" && input.scores !== null) {
      try {
        const converted = Object.values(input.scores).filter(
          (val) =>
            typeof val === "number" && !isNaN(val) && val >= 0 && val <= 100
        );
        return converted.length >= 2;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * 📊 GET CALCULATOR NAME - SESSION #306A MODULAR IDENTIFICATION
   * 🎯 PURPOSE: Identify this calculator module for logging and debugging
   * 🔧 USAGE: Used by orchestrator for module tracking and error reporting
   * 🛡️ SESSION #305D COMPATIBILITY: Follows same naming pattern as other modular components
   */
  getName(): string {
    return "ConfidenceCalculator";
  }
}

/**
 * 🧮 CALCULATE SIGNAL CONFIDENCE HELPER - SESSION #306A UTILITY FUNCTION
 * 🎯 PURPOSE: Provide confidence calculation in original Edge Function format for backward compatibility
 * 🔧 BRIDGE FUNCTION: Converts modular ConfidenceResult back to original number format
 * 🛡️ ANTI-REGRESSION: Maintains exact return format expected by main processing loop
 * 📊 SESSION #157 PRESERVED: All crash-resistant logic + error handling + fallback mechanisms maintained exactly
 */
export function calculateSignalConfidence(scores: any): number {
  const calculator = new ConfidenceCalculator();

  const input: ConfidenceInput = {
    scores: scores,
    validationRequired: true,
  };

  const result = calculator.calculateConfidence(input);

  // 🚨 SESSION #157 PRESERVED RETURN FORMAT: Exact return value for main processing loop
  // 🔧 CRITICAL FORMAT: Returns number exactly as original function
  return result.confidence;
}

// ==================================================================================
// 🎯 SESSION #306A CONFIDENCE CALCULATOR EXTRACTION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete signal confidence calculation with Session #157 crash-resistant methodology preserved + modular architecture integration
// 🛡️ PRESERVATION: Session #157 crash-resistant logic + defensive programming + comprehensive error handling + input validation + fallback mechanisms + all calculation methods
// 🔧 EXTRACTION SUCCESS: Moved from monolithic function (lines ~960-1000) to isolated, testable module following Session #305D pattern
// 📈 CONFIDENCE CALCULATION: Maintains exact standard deviation analysis through calculateSignalConfidence helper function for main processing loop compatibility
// 🎖️ ANTI-REGRESSION: All existing signal confidence logic preserved exactly - confidence scores identical to original function + all Session #157 crash-resistant methodology maintained
// ⚡ MODULAR BENEFITS: Isolated testing + clean interfaces + professional architecture + future AI integration ready + Session #305D pattern compliance
// 🚀 PRODUCTION READY: Session #306A Confidence Calculator extraction complete - maintains crash-resistant confidence accuracy with modular architecture advantages + Session #305D pattern compliance
// 🔄 NEXT MODULE: Session #306B Momentum Quality Calculator extraction following established pattern
// 🏆 TESTING VALIDATION: Extracted Confidence Calculator module must produce identical confidence scores (±0.1% tolerance) to original monolithic function for all existing signals + maintain all Session #157 functionality
// 🎯 SESSION #306A ACHIEVEMENT: Confidence Calculator successfully extracted with 100% functionality preservation + Session #157 methodology + modular architecture foundation enhanced (1/4 scoring modules complete)
// ==================================================================================
