#!/usr/bin/env node

// ==================================================================================
// 🎯 SESSION #402: FIX DIVERGENCE INTEGRATION
// ==================================================================================
// 🚨 PROBLEM: Real divergence code exists but is never called
// 🔧 SOLUTION: Fix index.ts to pass divergence parameters to signal-pipeline.ts
// 📊 RESULT: Enable real 1D divergence analysis instead of fake random bonuses
// ==================================================================================

const fs = require('fs');
const path = require('path');

console.log('🔧 SESSION #402: Fixing Divergence Integration...\n');

// The corrected index.ts content
const correctedIndexTs = `// ==================================================================================
// 🎯 SESSION #402: CORRECTED DIVERGENCE INTEGRATION
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
    let divergenceConfig = {
      timeframe: "1D",
      sensitivityLevel: 5,
      enableDebug: false
    };

    if (req.method === "POST") {
      try {
        const requestBody = await req.json();
        if (requestBody) {
          if (typeof requestBody.startIndex === "number") {
            startIndex = Math.max(0, Math.floor(requestBody.startIndex));
          }
          if (typeof requestBody.endIndex === "number") {
            endIndex = Math.max(startIndex + 1, Math.floor(requestBody.endIndex));
          }
          if (typeof requestBody.batchNumber === "number") {
            batchNumber = Math.max(1, Math.floor(requestBody.batchNumber));
          }
          
          // ✅ CORRECTED: Proper divergence parameter parsing
          if (typeof requestBody.divergenceEnabled === "boolean") {
            divergenceEnabled = requestBody.divergenceEnabled;
          }
          if (requestBody.divergenceConfig && typeof requestBody.divergenceConfig === "object") {
            divergenceConfig = { ...divergenceConfig, ...requestBody.divergenceConfig };
          }
        }
      } catch (parameterError) {
        console.log(\`⚠️ [PARAMETERS] Parameter parsing error: \${parameterError.message}\`);
      }
    }

    console.log(\`🎯 [SESSION #402] Processing \${startIndex}-\${endIndex}, divergence: \${divergenceEnabled}\`);

    // ✅ CORRECTED: Pass divergence parameters to pipeline
    const pipelineParams = { 
      startIndex, 
      endIndex, 
      batchNumber,
      divergenceEnabled,
      divergenceConfig
    };
    const pipelineResult = await executeSignalPipeline(pipelineParams);

    console.log(\`📊 [SESSION #402] Pipeline result received\`);

    // ❌ REMOVED: Fake divergence enhancement
    // The real divergence analysis happens inside signal-pipeline.ts now

    // Calculate stats from real divergence data
    const signals = pipelineResult.data?.signals || [];
    
    // Count signals with actual divergence indicators in database
    let signalsWithDivergence = 0;
    let signalsWithStrongDivergence = 0;
    let totalDivergenceBonus = 0;
    
    // Check for real divergence in the signal metadata
    signals.forEach(signal => {
      if (signal.analysis?.session_402_divergence?.hasValidDivergence) {
        signalsWithDivergence++;
        if (signal.analysis.session_402_divergence.scoreBonus) {
          totalDivergenceBonus += signal.analysis.session_402_divergence.scoreBonus;
        }
        if (signal.analysis.session_402_divergence.strongestPattern?.strength === 'STRONG' || 
            signal.analysis.session_402_divergence.strongestPattern?.strength === 'VERY_STRONG') {
          signalsWithStrongDivergence++;
        }
      }
    });
    
    const divergenceStats = {
      total_signals: signals.length,
      signals_with_divergence: signalsWithDivergence,
      signals_with_strong_divergence: signalsWithStrongDivergence,
      average_divergence_bonus: signalsWithDivergence > 0 ? 
        (totalDivergenceBonus / signalsWithDivergence).toFixed(2) : 0,
      divergence_enabled: divergenceEnabled,
      timeframe: divergenceConfig.timeframe
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: pipelineResult.data,
        metadata: {
          ...pipelineResult.metadata,
          session_402_divergence_stats: divergenceStats,
          processing_summary: \`Processed \${signals.length} signals, \${signalsWithDivergence} with divergence patterns\`
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("❌ Function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        metadata: {
          session: "SESSION_402_DIVERGENCE_ERROR",
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});`;

// Write the corrected file
const indexPath = path.join(__dirname, '..', 'supabase', 'functions', 'automated-signal-generation-v4', 'index.ts');

try {
  fs.writeFileSync(indexPath, correctedIndexTs);
  console.log('✅ Fixed index.ts - Real divergence integration enabled!');
  console.log('📁 File updated:', indexPath);
  console.log('\n🎯 Next Steps:');
  console.log('1. Deploy the function: supabase functions deploy automated-signal-generation-v4');
  console.log('2. Test with Postman using the same 300-stock configuration');
  console.log('3. Check for RSI_DIVERGENCE indicators in the database');
  console.log('\n🚀 Your Session #402 1D Divergence System will now be active!');
} catch (error) {
  console.log('❌ Error writing file:', error.message);
  console.log('\n📋 Manual Fix Instructions:');
  console.log('1. Open supabase/functions/automated-signal-generation-v4/index.ts');
  console.log('2. Replace the content with the corrected version above');
  console.log('3. Deploy the function');
}`;

console.log('🔧 Creating divergence integration fix...');
fs.writeFileSync(path.join(__dirname, 'fix-divergence-integration.js'), correctedIndexTs);
