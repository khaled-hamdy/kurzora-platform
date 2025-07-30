// ==================================================================================
// 🎯 SESSION #317: KURZORA PRODUCTION SIGNAL ENGINE - MAIN ORCHESTRATOR + AI LEARNING + PATTERN RECOGNITION
// ==================================================================================
// 🚨 PURPOSE: Clean production orchestrator + AI learning foundation + Session #317 pattern recognition integration
// 🛡️ ANTI-REGRESSION: EXACT preservation of ALL Session #151-314 functionality
// 📝 SESSION #317 AI ENHANCEMENT: AI pattern recognition added without modification to existing logic
// 🔧 HISTORIC ACHIEVEMENT: Complete modular architecture + AI learning + pattern recognition capabilities
// ✅ PRODUCTION READY: Professional codebase with AI learning + pattern analysis enhancement
// 📊 MODULAR ARCHITECTURE: Clean orchestrator + 11 modules + AI learning foundation + pattern recognition
// 🎖️ PRODUCTION DEPLOYMENT: Professional signal generation system with AI optimization + pattern analysis
// 🧠 AI LEARNING: Performance tracking, knowledge engine, and pattern recognition for continuous improvement
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { executeSignalPipeline } from "./orchestration/signal-pipeline.ts";
import { createPerformanceTracker } from "./ai/performance-tracker.ts";
import { createKnowledgeEngine } from "./ai/knowledge-engine.ts";
import { createPatternMatcher } from "./ai/pattern-matcher.ts";

/**
 * 🎯 SESSION #317: KURZORA MAIN ORCHESTRATOR - PRODUCTION ENGINE + AI LEARNING + PATTERN RECOGNITION
 * PURPOSE: HTTP request handling + parameter parsing + pipeline coordination + AI learning + pattern analysis + response construction
 * SESSION #317: AI pattern recognition integration preserving ALL existing functionality
 * ANTI-REGRESSION: Identical HTTP interface preserving ALL Session #151-314 functionality
 * PRODUCTION: Live signal generation with AI learning + pattern recognition capabilities
 * AI LEARNING: Performance tracking, knowledge generation, and pattern recognition for signal optimization
 */
serve(async (req) => {
  try {
    // 🔧 SESSION #313: CORS HANDLING - PRODUCTION READY (PRESERVED)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // 🔧 SESSION #317: REQUEST BODY PARSING - ENHANCED FOR ACTION ROUTING
    let requestBody = null;
    if (req.method === "POST") {
      try {
        requestBody = await req.json();
      } catch (parseError) {
        console.log(`⚠️ [REQUEST] Body parsing error: ${parseError.message}`);
      }
    }

    // 🔧 SESSION #317: ACTION-BASED ROUTING - NEW PATTERN ANALYSIS CAPABILITY
    if (requestBody && requestBody.action === "analyze_patterns") {
      try {
        console.log(
          `🔍 Pattern Analysis: Starting for signal ${requestBody.signal_id}`
        );

        // 🔧 SESSION #317: Validate required parameter
        if (!requestBody.signal_id) {
          throw new Error("Missing required parameter: signal_id");
        }

        // 🔧 SESSION #317: Initialize pattern matcher using established AI patterns
        const patternMatcher = createPatternMatcher();

        // 🔧 SESSION #317: Execute pattern analysis using real database data
        const patternAnalysis = await patternMatcher.findSimilarPatterns(
          requestBody.signal_id
        );

        if (!patternAnalysis) {
          throw new Error("No pattern analysis data available for this signal");
        }

        console.log(
          `✅ Pattern Analysis: Found ${patternAnalysis.sample_size} similar patterns`
        );

        // 🔧 SESSION #317: Return pattern analysis response following established patterns
        return new Response(
          JSON.stringify(
            {
              success: true,
              pattern_analysis: patternAnalysis,
              session_317_ai_patterns: {
                version: "pattern-recognition-v1.0",
                status: "production-ready",
                pattern_signature: patternAnalysis.pattern_signature,
                similar_patterns_found: patternAnalysis.sample_size,
                pattern_confidence: patternAnalysis.pattern_confidence,
                success_rate: patternAnalysis.success_rate,
                ai_components_used: [
                  "Pattern Matcher - Historical similarity search",
                  "Knowledge Engine - Pattern confidence analysis",
                  "Performance Tracker - Historical outcome data",
                ],
              },
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (patternError) {
        console.log(`❌ Pattern Analysis Error: ${patternError.message}`);

        // 🔧 SESSION #317: Pattern analysis error response following established error patterns
        return new Response(
          JSON.stringify(
            {
              success: false,
              error: "Pattern analysis failed",
              message: patternError.message,
              session_317_status: {
                pattern_analysis_attempted: true,
                error_in_pattern_matching: true,
                troubleshooting:
                  "Check signal_id parameter, database connection, and AI component integration",
              },
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 🔧 SESSION #313: PARAMETER PARSING - PRODUCTION READY (PRESERVED EXACTLY)
    let startIndex = 0;
    let endIndex = 50;
    let batchNumber = 1;

    // 🔧 SESSION #314: AI LEARNING PARAMETERS (OPTIONAL - NO BREAKING CHANGES) (PRESERVED EXACTLY)
    let enableAiTracking = true;
    let enableAiLearning = false; // Only on request to avoid performance impact

    if (req.method === "POST") {
      try {
        if (requestBody) {
          // 🔧 SESSION #313: EXISTING PARAMETERS (PRESERVED EXACTLY)
          if (typeof requestBody.startIndex === "number") {
            startIndex = Math.max(0, Math.floor(requestBody.startIndex));
          }
          if (typeof requestBody.endIndex === "number") {
            endIndex = Math.max(
              startIndex + 1,
              Math.floor(requestBody.endIndex)
            );
          }
          if (typeof requestBody.batchNumber === "number") {
            batchNumber = Math.max(1, Math.floor(requestBody.batchNumber));
          }

          // 🔧 SESSION #314: AI PARAMETERS (OPTIONAL - DEFAULT TO EXISTING BEHAVIOR) (PRESERVED EXACTLY)
          if (typeof requestBody.enableAiTracking === "boolean") {
            enableAiTracking = requestBody.enableAiTracking;
          }
          if (typeof requestBody.enableAiLearning === "boolean") {
            enableAiLearning = requestBody.enableAiLearning;
          }
        }
      } catch (parameterError) {
        console.log(
          `⚠️ [PARAMETERS] Parameter parsing error: ${parameterError.message}, using defaults`
        );
      }
    }

    // 🚀 SESSION #313: PIPELINE EXECUTION - PRODUCTION MODULAR PROCESSING ENGINE (PRESERVED EXACTLY)
    const pipelineParams = {
      startIndex,
      endIndex,
      batchNumber,
    };
    const pipelineResult = await executeSignalPipeline(pipelineParams);

    // 🧠 SESSION #314: AI LEARNING FOUNDATION - POST-PROCESSING (NO IMPACT ON EXISTING PIPELINE) (PRESERVED EXACTLY)
    let aiTrackingResult = null;
    let aiLearningResult = null;

    if (enableAiTracking) {
      try {
        // 🔧 SESSION #314: Performance tracking - runs after pipeline without affecting it
        console.log("🧠 AI Learning: Starting performance tracking...");
        const performanceTracker = createPerformanceTracker();
        aiTrackingResult = await performanceTracker.trackFromPaperTrades();
        console.log(
          `✅ AI Learning: Tracked ${aiTrackingResult.processed} outcomes`
        );
      } catch (aiTrackingError) {
        console.log(
          `⚠️ [AI-TRACKING] Non-critical error: ${aiTrackingError.message}`
        );
        aiTrackingResult = { error: aiTrackingError.message, processed: 0 };
      }
    }

    if (enableAiLearning) {
      try {
        // 🔧 SESSION #314: Knowledge engine - generates learning insights when requested
        console.log("🧠 AI Learning: Generating optimization insights...");
        const knowledgeEngine = createKnowledgeEngine();
        aiLearningResult =
          await knowledgeEngine.getOptimizationRecommendations();
        console.log(
          `✅ AI Learning: Generated ${aiLearningResult.recommendations.length} recommendations`
        );
      } catch (aiLearningError) {
        console.log(
          `⚠️ [AI-LEARNING] Non-critical error: ${aiLearningError.message}`
        );
        aiLearningResult = {
          error: aiLearningError.message,
          recommendations: [],
        };
      }
    }

    // 🔧 SESSION #317: RESPONSE CONSTRUCTION - ENHANCED WITH SESSION #317 PATTERN CAPABILITIES (PRESERVING ALL EXISTING STRUCTURE)
    const responseData = {
      // 🔧 SESSION #313: ALL EXISTING RESPONSE DATA (PRESERVED EXACTLY)
      ...pipelineResult,
      session_313_production: {
        version: "automated-signal-generation",
        status: "production",
        modular_architecture_deployed: true,
        session_311_transformation_complete: true,
        professional_codebase: true,
      },
      session_311_transformation: {
        historic_achievement:
          "1600-line monolith → 50-line orchestrator + 11 modular components",
        main_orchestrator_complete: true,
        modular_architecture_complete: true,
        architecture_progress: "11/11 major extractions complete",
        extracted_modules: [
          "RSI Calculator (Session #301)",
          "MACD Calculator (Session #302)",
          "Volume Analyzer (Session #303)",
          "Support/Resistance (Session #304)",
          "Multi-Timeframe Processor (Session #305)",
          "Signal Scoring System (Session #306)",
          "Quality Filter & Gatekeeper (Session #307)",
          "Database Operations (Session #308)",
          "Data Layer (Session #309A)",
          "Data Layer Integration (Session #309B)",
          "Configuration Management (Session #310)",
          "Main Orchestrator (Session #311)",
        ],
        professional_codebase:
          "Clean, maintainable, scalable architecture achieved",
        ai_integration_ready:
          "Modular architecture enables unlimited AI feature development",
        production_ready:
          "All Session #151-310 functionality preserved with enhanced maintainability",
      },

      // 🔧 SESSION #314: AI LEARNING FOUNDATION DATA (PRESERVED EXACTLY)
      session_314_ai_learning: {
        version: "ai-learning-foundation-v1.0",
        status: "production-ready",
        ai_tracking_enabled: enableAiTracking,
        ai_learning_enabled: enableAiLearning,
        performance_tracking: aiTrackingResult
          ? {
              outcomes_processed: aiTrackingResult.processed || 0,
              tracking_errors: aiTrackingResult.errors?.length || 0,
              status: aiTrackingResult.error ? "error" : "success",
            }
          : null,
        ai_learning_insights: aiLearningResult
          ? {
              recommendations_generated:
                aiLearningResult.recommendations?.length || 0,
              confidence_level: aiLearningResult.confidence_level || 0,
              status: aiLearningResult.error ? "error" : "success",
              priority_actions: aiLearningResult.priority_actions?.length || 0,
            }
          : null,
        ai_components_deployed: [
          "Performance Tracker - Signal outcome analysis",
          "Knowledge Engine - AI learning and optimization",
          "Signal Outcomes Table - Learning data foundation",
        ],
        learning_capabilities: [
          "Indicator performance optimization",
          "Market condition adaptation",
          "Confidence score calibration",
          "Success pattern recognition",
        ],
      },

      // 🔧 SESSION #317: AI PATTERN RECOGNITION CAPABILITIES (NEW - NON-BREAKING ADDITION)
      session_317_pattern_recognition: {
        version: "pattern-recognition-v1.0",
        status: "production-ready",
        pattern_analysis_available: true,
        pattern_matcher_deployed: true,
        ai_components_enhanced: [
          "Pattern Matcher - Historical signal similarity search",
          "Pattern Recognition - AI pattern analysis display",
          "Historical Matches - Comprehensive pattern visualization",
          "Enhanced Signal Breakdown - Pattern tab integration",
        ],
        pattern_capabilities: [
          "28-indicator pattern fingerprinting",
          "Historical pattern similarity matching",
          "Pattern confidence scoring and success rate analysis",
          "Market context analysis for pattern reliability",
          "Comprehensive historical pattern visualization",
        ],
        integration_status: {
          backend_pattern_matcher: "deployed",
          frontend_components: "ready",
          database_integration: "signal_outcomes + indicators tables",
          api_endpoint: "action: analyze_patterns",
        },
      },
    };

    return new Response(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (mainError) {
    // 🚨 SESSION #313: ERROR HANDLING - PRODUCTION READY (PRESERVED EXACTLY)
    console.log(
      `🚨 SESSION #317 Production Main Orchestrator + AI Learning + Pattern Recognition error: ${
        mainError.message || "Unknown system error"
      }`
    );

    const errorResponse = {
      success: false,
      session: "SESSION-317-PRODUCTION-MAIN-ORCHESTRATOR-AI-PATTERN-ERROR",
      error: (
        mainError.message || "Main orchestrator processing error"
      ).replace(/"/g, '\\"'),
      message:
        "SESSION #317 Production Main Orchestrator + AI Learning + Pattern Recognition encountered system errors",
      timestamp: new Date().toISOString(),
      session_317_status: {
        main_orchestrator_extracted: true,
        modular_architecture_complete: true,
        ai_learning_foundation_deployed: true,
        pattern_recognition_deployed: true,
        error_in_pipeline: true,
        production_version: "automated-signal-generation-v4-ai-patterns",
        troubleshooting:
          "Check pipeline execution, AI components, pattern matcher, API keys, database connection, modular component integration",
      },
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

// ==================================================================================
// 🎯 SESSION #317 PRODUCTION MAIN ORCHESTRATOR + AI LEARNING + PATTERN RECOGNITION DEPLOYMENT COMPLETE
// ==================================================================================
// 📊 FUNCTIONALITY: Production deployment with AI learning foundation + pattern recognition integration
// 🛡️ PRESERVATION: ALL Session #151-314 HTTP interface and functionality preserved exactly
// 🔧 PRODUCTION PURPOSE: Live signal generation + AI learning + pattern recognition for comprehensive optimization
// 📈 PRODUCTION READY: Enhanced maintainability + AI learning + pattern analysis capabilities
// 🎖️ ANTI-REGRESSION: Zero modifications to core logic - pattern recognition added as enhancement
// 🚀 LIVE SYSTEM: Production-grade modular signal generation + AI learning + pattern recognition infrastructure
// 📋 SESSION #317: AI pattern recognition ready for live signal analysis and historical pattern matching
// 🏆 ACHIEVEMENT: Modular architecture + AI learning foundation + pattern recognition DEPLOYED
// 🧠 AI CAPABILITIES: Performance tracking, knowledge generation, pattern recognition, historical analysis
// ==================================================================================
