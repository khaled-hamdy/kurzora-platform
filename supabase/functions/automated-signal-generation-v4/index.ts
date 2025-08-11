// ==================================================================================
// 🎯 SESSION #402: MINIMAL DIVERGENCE INTEGRATION
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { executeSignalPipeline } from "./orchestration/signal-pipeline.ts";

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Parse parameters (preserve original logic)
    let startIndex = 0;
    let endIndex = 50;
    let batchNumber = 1;
    let divergenceEnabled = true;

    if (req.method === "POST") {
      try {
        const requestBody = await req.json();
        if (requestBody) {
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

          // Simple divergence config
          if (
            requestBody.divergence &&
            typeof requestBody.divergence.enabled === "boolean"
          ) {
            divergenceEnabled = requestBody.divergence.enabled;
          }
        }
      } catch (parameterError) {
        console.log(
          `⚠️ [PARAMETERS] Parameter parsing error: ${parameterError.message}`
        );
      }
    }

    console.log(
      `🎯 [SESSION #402] Processing ${startIndex}-${endIndex}, divergence: ${divergenceEnabled}`
    );

    // ✅ CORRECTED: Pass divergence parameters to pipeline
    const pipelineParams = {
      startIndex,
      endIndex,
      batchNumber,
      divergenceEnabled,
      divergenceConfig: {
        timeframe: "1D",
        sensitivityLevel: 5,
        enableDebug: false,
      },
    };
    const pipelineResult = await executeSignalPipeline(pipelineParams);

    console.log(`📊 [SESSION #402] Pipeline result received`);

    // ❌ REMOVED: Fake divergence enhancement
    // The real divergence analysis happens inside signal-pipeline.ts now

    // Calculate stats from real divergence data
    const signals = pipelineResult.data?.signals || [];

    // Count signals with actual divergence indicators in database
    let signalsWithDivergence = 0;
    let signalsWithStrongDivergence = 0;
    let totalDivergenceBonus = 0;

    // Check for real divergence in the signal metadata
    signals.forEach((signal) => {
      if (signal.analysis?.session_402_divergence?.hasValidDivergence) {
        signalsWithDivergence++;
        if (signal.analysis.session_402_divergence.scoreBonus) {
          totalDivergenceBonus +=
            signal.analysis.session_402_divergence.scoreBonus;
        }
        if (
          signal.analysis.session_402_divergence.strongestPattern?.strength ===
            "STRONG" ||
          signal.analysis.session_402_divergence.strongestPattern?.strength ===
            "VERY_STRONG"
        ) {
          signalsWithStrongDivergence++;
        }
      }
    });

    const divergenceStats = {
      total_signals: signals.length,
      signals_with_divergence: signalsWithDivergence,
      signals_with_strong_divergence: signalsWithStrongDivergence,
      average_divergence_bonus:
        signalsWithDivergence > 0
          ? (totalDivergenceBonus / signalsWithDivergence).toFixed(2)
          : 0,
      divergence_enhancement_rate:
        signals.length > 0
          ? ((signalsWithDivergence / signals.length) * 100).toFixed(1)
          : 0,
    };

    // Enhanced response
    const responseData = {
      ...pipelineResult,
      divergence_stats: divergenceStats,
      session_402_divergence: {
        version: "automated-signal-generation-v4-minimal-divergence",
        status: "production",
        divergence_enabled: divergenceEnabled,
        divergence_mode: "minimal",
        divergence_integration_complete: true,
        session_402_milestone: "Minimal Divergence Integration Working",
      },
      session_313_production: {
        version: "automated-signal-generation",
        status: "production",
        modular_architecture_deployed: true,
      },
    };

    console.log(
      `✅ [SESSION #402] Response ready with ${signals.length} signals`
    );

    return new Response(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`❌ [SESSION #402] Error: ${error.message}`);

    return new Response(
      JSON.stringify({
        error: "Signal generation failed",
        message: error.message,
        session_402_status: "error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
});
