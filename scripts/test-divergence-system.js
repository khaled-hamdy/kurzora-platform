// ==================================================================================
// 🎯 SESSION #402: COMPREHENSIVE DIVERGENCE SYSTEM TEST
// ==================================================================================

require("dotenv").config();
const fetch = require("node-fetch");

const CONFIG = {
  EDGE_FUNCTION_URL: process.env.VITE_SUPABASE_URL 
    ? `${process.env.VITE_SUPABASE_URL}/functions/v1/automated-signal-generation-v4`
    : null,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
};

async function testDivergenceSystem() {
  console.log("🎯 SESSION #402: Comprehensive Divergence System Test");
  console.log("=" .repeat(60));
  
  if (!CONFIG.EDGE_FUNCTION_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
    console.log("❌ Missing environment variables!");
    console.log(`   SUPABASE_URL: ${!!process.env.VITE_SUPABASE_URL}`);
    console.log(`   SERVICE_KEY: ${!!CONFIG.SUPABASE_SERVICE_KEY}`);
    return;
  }

  console.log(`📡 Testing URL: ${CONFIG.EDGE_FUNCTION_URL}`);

  const tests = [
    { 
      name: "Basic Test (Default Divergence)", 
      params: { startIndex: 0, endIndex: 1, batchNumber: 999 } 
    },
    { 
      name: "Divergence Enabled (Standard Mode)", 
      params: { 
        startIndex: 0, 
        endIndex: 1, 
        batchNumber: 999,
        divergence: { enabled: true, sensitivityLevel: 5, mode: 'standard' }
      } 
    },
    { 
      name: "Divergence Enabled (Sensitive Mode)", 
      params: { 
        startIndex: 0, 
        endIndex: 1, 
        batchNumber: 999,
        divergence: { enabled: true, sensitivityLevel: 8, mode: 'sensitive' }
      } 
    },
    { 
      name: "Divergence Disabled", 
      params: { 
        startIndex: 0, 
        endIndex: 1, 
        batchNumber: 999,
        divergence: { enabled: false }
      } 
    }
  ];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n🔍 Test ${i + 1}: ${test.name}`);
    console.log("-" .repeat(40));
    
    try {
      const response = await fetch(CONFIG.EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
          'apikey': CONFIG.SUPABASE_SERVICE_KEY
        },
        body: JSON.stringify(test.params),
        timeout: 30000
      });

      console.log(`📊 Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Error: ${errorText.substring(0, 200)}...`);
        continue;
      }

      const data = await response.json();
      
      // Check Session Version
      if (data.session_402_divergence) {
        console.log(`✅ Session #402: ACTIVE`);
        console.log(`   Divergence Enabled: ${data.session_402_divergence.divergence_enabled}`);
        console.log(`   Divergence Mode: ${data.session_402_divergence.divergence_mode}`);
        console.log(`   Sensitivity: ${data.session_402_divergence.divergence_sensitivity}`);
        console.log(`   Integration Complete: ${data.session_402_divergence.divergence_integration_complete}`);
      } else if (data.session_313_production) {
        console.log(`📋 Session #313: Active (No Divergence Enhancement)`);
      } else {
        console.log(`❓ Unknown Session Version`);
      }

      // Check Results
      const signals = data.data?.signals || [];
      console.log(`📈 Signals Generated: ${signals.length}`);

      // Check Divergence Statistics
      if (data.divergence_stats) {
        console.log(`📊 Divergence Stats:`);
        console.log(`   Total Signals: ${data.divergence_stats.total_signals}`);
        console.log(`   With Divergence: ${data.divergence_stats.signals_with_divergence}`);
        console.log(`   Strong Divergence: ${data.divergence_stats.signals_with_strong_divergence}`);
        console.log(`   Avg Bonus: ${data.divergence_stats.average_divergence_bonus}`);
        console.log(`   Enhancement Rate: ${data.divergence_stats.divergence_enhancement_rate}%`);
      } else {
        console.log(`📊 Divergence Stats: Not Available`);
      }

      // Check Individual Signals
      if (signals.length > 0) {
        const signal = signals[0];
        console.log(`🎯 Example Signal (${signal.ticker}):`);
        console.log(`   Confidence Score: ${signal.confidence_score || 'N/A'}%`);
        console.log(`   Divergence Bonus: ${signal.divergence_bonus || 'N/A'}`);
        console.log(`   Strong Divergence: ${signal.has_strong_divergence || 'N/A'}`);
        
        if (signal.divergence_analysis) {
          console.log(`   Divergence Analysis: Present`);
          if (signal.divergence_analysis.strongestPattern) {
            console.log(`     Pattern: ${signal.divergence_analysis.strongestPattern.type}`);
            console.log(`     Strength: ${signal.divergence_analysis.strongestPattern.strength}`);
            console.log(`     Confidence: ${signal.divergence_analysis.strongestPattern.confidenceScore}%`);
          }
        } else {
          console.log(`   Divergence Analysis: Not Available`);
        }
      }

    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
  }

  console.log("\n" + "=" .repeat(60));
  console.log("🎯 DIVERGENCE SYSTEM TEST COMPLETE");
  console.log("✅ If you see 'Session #402: ACTIVE' above, the divergence system is working!");
  console.log("❌ If you see 'Session #313' only, the files need to be deployed to Supabase.");
  console.log("=" .repeat(60));
}

testDivergenceSystem();