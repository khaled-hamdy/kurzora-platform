// ==================================================================================
// 🎯 SESSION #307: GATEKEEPER RULES - MODULAR ARCHITECTURE COMPONENT
// ==================================================================================
// 🚨 PURPOSE: Extract institutional-grade gatekeeper rules into isolated, testable module
// 🛡️ ANTI-REGRESSION MANDATE: ALL Session #151-185 gatekeeper functionality preserved EXACTLY
// 📝 SESSION #307 EXTRACTION: Moving GATEKEEPER_THRESHOLDS and passesGatekeeperRules from 1600-line monolith to modular architecture
// 🔧 PRESERVATION: Session #151-185 institutional thresholds + Session #301-306 modular integration
// 🚨 CRITICAL SUCCESS: Maintain identical gatekeeper validation (100% exact logic)
// ⚠️ PROTECTED LOGIC: Institutional-grade criteria "1H≥70% AND 4H≥70% AND (1D≥70% OR 1W≥70%)"
// 🎖️ GATEKEEPER RULES: Professional signal filtering with institutional quality standards
// 📊 MODULAR INTEGRATION: Compatible with all Session #301-306 extracted components
// 🏆 TESTING REQUIREMENT: Extracted module must produce identical validation results
// 🚀 PRODUCTION IMPACT: Enable modular architecture while preserving institutional-grade quality
// ==================================================================================

/**
 * 🛡️ GATEKEEPER THRESHOLDS INTERFACE - SESSION #307 THRESHOLD STRUCTURE
 * 🎯 PURPOSE: Define structure for institutional-grade signal thresholds
 * 🔧 SESSION #151-185 COMPLIANCE: Preserves exact threshold values from original system
 * 🛡️ INSTITUTIONAL STANDARDS: Professional signal quality requirements
 * 📊 PRODUCTION READY: Type-safe threshold structure for gatekeeper validation
 */
export interface GatekeeperThresholds {
  oneHour: number; // 1H timeframe minimum score requirement
  fourHour: number; // 4H timeframe minimum score requirement
  longTerm: number; // Daily/Weekly minimum score requirement (either can pass)
}

/**
 * 🎯 GATEKEEPER VALIDATION RESULT INTERFACE - SESSION #307 RESULT STRUCTURE
 * 🚨 PURPOSE: Standardized result format for gatekeeper rule validation
 * 🔧 SESSION #151-185 COMPLIANCE: Supports comprehensive gatekeeper validation results
 * 📊 METADATA TRACKING: Detailed information for debugging and future sessions
 */
export interface GatekeeperResult {
  passed: boolean;
  reason?: string;
  scores: {
    oneHour: number;
    fourHour: number;
    daily: number;
    weekly: number;
  };
  metadata: {
    thresholds: GatekeeperThresholds;
    sessionOrigin: string;
    validationMethod: string;
    institutionalGrade: boolean;
  };
}

/**
 * 🛡️ GATEKEEPER RULES - SESSION #307 MODULAR EXTRACTION
 * 🚨 CRITICAL EXTRACTION: Moved from 1600-line monolith (lines ~95-180) to modular architecture
 * 🛡️ ANTI-REGRESSION: ALL Session #151-185 institutional gatekeeper logic preserved EXACTLY
 * 🎯 PURPOSE: Validate signals against institutional-grade quality thresholds
 * 🔧 SESSION #151-185 PRESERVATION: Exact threshold values and validation logic maintained
 * 🚨 INSTITUTIONAL STANDARDS: Professional signal quality requirements (1H≥70%, 4H≥70%, Daily≥70% OR Weekly≥70%)
 * 📊 MODULAR INTEGRATION: Session #301-306 pattern compliance for seamless integration
 * 🎖️ QUALITY ASSURANCE: Institutional-grade signal filtering with comprehensive logging
 * 🚀 PRODUCTION READY: Identical validation results to original monolithic function
 * 🔧 SESSION #306 COMPATIBILITY: Follows established modular pattern exactly
 */
export class GatekeeperRules {
  private thresholds: GatekeeperThresholds;

  /**
   * 🏗️ GATEKEEPER RULES CONSTRUCTOR - SESSION #307 INITIALIZATION
   * 🎯 PURPOSE: Initialize gatekeeper with institutional-grade thresholds
   * 🔧 SESSION #151-185 PRESERVED: Exact threshold values from original system
   * 🛡️ INSTITUTIONAL STANDARDS: Professional signal quality requirements maintained exactly
   */
  constructor() {
    // 🚨 SESSION #151-185 PRESERVED EXACTLY: Institutional gatekeeper thresholds
    this.thresholds = {
      oneHour: 70, // 1H score must be ≥70% (preserved exactly)
      fourHour: 70, // 4H score must be ≥70% (preserved exactly)
      longTerm: 70, // Either Daily ≥70% OR Weekly ≥70% (preserved exactly)
    };
  }

  /**
   * 🛡️ VALIDATE GATEKEEPER RULES - SESSION #307 EXTRACTED CORE LOGIC
   * 🚨 SESSION #151-185 PRESERVED: All institutional gatekeeper logic moved exactly from original function
   * 🛡️ ANTI-REGRESSION: Zero modifications to validation logic, thresholds, or conditional statements
   * 🔧 PURPOSE: Validate timeframe scores against institutional-grade quality requirements
   * 📊 INSTITUTIONAL LOGIC: 1H≥70% AND 4H≥70% AND (Daily≥70% OR Weekly≥70%)
   * 🎖️ QUALITY STANDARDS: Professional signal filtering with exact original logic
   * 🚀 PRODUCTION PRESERVED: All logging and validation maintained exactly
   *
   * @param oneHour - 1H timeframe score for validation
   * @param fourHour - 4H timeframe score for validation
   * @param daily - Daily timeframe score for validation
   * @param weekly - Weekly timeframe score for validation
   * @returns GatekeeperResult with validation results and metadata
   */
  validateGatekeeperRules(
    oneHour: number,
    fourHour: number,
    daily: number,
    weekly: number
  ): GatekeeperResult {
    console.log(
      `🛡️ [GATEKEEPER] SESSION #151-185 + #307 INSTITUTIONAL VALIDATION: 1H:${oneHour}%, 4H:${fourHour}%, Daily:${daily}%, Weekly:${weekly}%`
    );

    const scores = { oneHour, fourHour, daily, weekly };

    // 🚨 SESSION #151-185 PRESERVED EXACTLY: 1H threshold validation
    if (oneHour < this.thresholds.oneHour) {
      const reason = `1H score ${oneHour}% < ${this.thresholds.oneHour}% required`;
      console.log(`❌ Gatekeeper: ${reason}`);
      return {
        passed: false,
        reason,
        scores,
        metadata: {
          thresholds: this.thresholds,
          sessionOrigin: "SESSION #151-185 + #307",
          validationMethod: "Institutional Grade Multi-Timeframe Validation",
          institutionalGrade: true,
        },
      };
    }

    // 🚨 SESSION #151-185 PRESERVED EXACTLY: 4H threshold validation
    if (fourHour < this.thresholds.fourHour) {
      const reason = `4H score ${fourHour}% < ${this.thresholds.fourHour}% required`;
      console.log(`❌ Gatekeeper: ${reason}`);
      return {
        passed: false,
        reason,
        scores,
        metadata: {
          thresholds: this.thresholds,
          sessionOrigin: "SESSION #151-185 + #307",
          validationMethod: "Institutional Grade Multi-Timeframe Validation",
          institutionalGrade: true,
        },
      };
    }

    // 🚨 SESSION #151-185 PRESERVED EXACTLY: Long-term threshold validation (Daily OR Weekly)
    if (daily < this.thresholds.longTerm && weekly < this.thresholds.longTerm) {
      const reason = `Neither Daily (${daily}%) nor Weekly (${weekly}%) meet ${this.thresholds.longTerm}% requirement`;
      console.log(`❌ Gatekeeper: ${reason}`);
      return {
        passed: false,
        reason,
        scores,
        metadata: {
          thresholds: this.thresholds,
          sessionOrigin: "SESSION #151-185 + #307",
          validationMethod: "Institutional Grade Multi-Timeframe Validation",
          institutionalGrade: true,
        },
      };
    }

    // 🎉 SESSION #151-185 PRESERVED EXACTLY: Successful gatekeeper validation
    console.log(
      `✅ Gatekeeper: PASSED - 1H:${oneHour}%, 4H:${fourHour}%, Daily:${daily}%, Weekly:${weekly}%`
    );

    return {
      passed: true,
      scores,
      metadata: {
        thresholds: this.thresholds,
        sessionOrigin: "SESSION #151-185 + #307",
        validationMethod: "Institutional Grade Multi-Timeframe Validation",
        institutionalGrade: true,
      },
    };
  }

  /**
   * 🔧 GET GATEKEEPER THRESHOLDS - SESSION #307 THRESHOLD ACCESS
   * 🎯 PURPOSE: Provide read-only access to institutional thresholds
   * 🛡️ PRESERVATION: Maintains Session #151-185 threshold values exactly
   * 📊 USAGE: Used for logging, debugging, and threshold verification
   */
  getThresholds(): GatekeeperThresholds {
    return { ...this.thresholds }; // Return copy to prevent modification
  }

  /**
   * 📊 GET GATEKEEPER NAME - SESSION #307 MODULAR IDENTIFICATION
   * 🎯 PURPOSE: Identify this gatekeeper module for logging and debugging
   * 🔧 USAGE: Used by orchestrator for module tracking and error reporting
   * 🛡️ SESSION #306 COMPATIBILITY: Follows same naming pattern as other modular components
   */
  getName(): string {
    return "GatekeeperRules";
  }
}

/**
 * 🛡️ GATEKEEPER RULES HELPER FUNCTION - SESSION #307 UTILITY FUNCTION
 * 🎯 PURPOSE: Provide gatekeeper validation in original Edge Function format for backward compatibility
 * 🔧 BRIDGE FUNCTION: Converts modular GatekeeperResult back to original boolean format
 * 🛡️ ANTI-REGRESSION: Maintains exact return format expected by main processing loop
 * 📊 SESSION #151-185 PRESERVED: All institutional gatekeeper logic maintained exactly
 */
export function passesGatekeeperRules(
  oneHour: number,
  fourHour: number,
  daily: number,
  weekly: number
): boolean {
  const gatekeeper = new GatekeeperRules();
  const result = gatekeeper.validateGatekeeperRules(
    oneHour,
    fourHour,
    daily,
    weekly
  );

  // 🚨 SESSION #151-185 PRESERVED RETURN FORMAT: Exact return value for main processing loop
  // 🔧 CRITICAL FORMAT: Returns boolean exactly as original function
  return result.passed;
}

// ==================================================================================
// 🎯 SESSION #307 GATEKEEPER RULES EXTRACTION COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Complete institutional-grade gatekeeper validation with Session #151-185 threshold preservation + Session #307 modular architecture integration
// 🛡️ PRESERVATION: Session #151-185 institutional thresholds + exact validation logic + comprehensive logging + all gatekeeper calculations maintained exactly
// 🔧 EXTRACTION SUCCESS: Moved from monolithic function (lines ~95-180) to isolated, testable module following Session #306 pattern
// 📈 INSTITUTIONAL VALIDATION: Maintains exact gatekeeper logic (1H≥70% AND 4H≥70% AND (Daily≥70% OR Weekly≥70%)) through passesGatekeeperRules helper function for main processing loop compatibility
// 🎖️ ANTI-REGRESSION: All existing gatekeeper validation logic preserved exactly - institutional requirements identical to original function + all Session #151-185 functionality maintained
// ⚡ MODULAR BENEFITS: Isolated testing + clean interfaces + professional architecture + future AI integration ready + Session #306 pattern compliance
// 🚀 PRODUCTION READY: Session #307 Gatekeeper Rules extraction complete - maintains institutional-grade quality standards with modular architecture advantages + Session #306 pattern compliance
// 🔄 NEXT SESSION: Complete Session #307 with Quality Filter extraction or commit Session #307A success to GitHub
// 🏆 TESTING VALIDATION: Extracted Gatekeeper Rules module must produce identical validation results (100% exact logic) to original monolithic function for all existing signals + maintain all Session #151-185 functionality
// 🎯 SESSION #307A ACHIEVEMENT: Gatekeeper Rules successfully extracted with 100% functionality preservation + Session #151-185 institutional standards + modular architecture foundation enhanced (7/8 major extractions approaching completion)
// ==================================================================================
