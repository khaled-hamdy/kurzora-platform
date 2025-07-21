#!/bin/bash

# =============================================================================
# SESSION #312: KURZORA VALIDATION - PURE BASH VERSION
# =============================================================================

echo "🎯 ========== SESSION #312: MANUAL VALIDATION STARTING =========="
echo "🚀 [SESSION_312] Kurzora Trading Platform - Modular Architecture Validation"
echo "🔧 [SESSION_312] Testing Session #311 transformation: 1600-line monolith → Professional modules"
echo ""

# System URLs
PRODUCTION_URL="https://jmbkssafogvzizypjaoi.supabase.co/functions/v1/automated--signal--generation"
V2_URL="https://jmbkssafogvzizypjaoi.supabase.co/functions/v1/automated-signal-generation-v2"

echo "📡 [CONFIGURATION] System URLs:"
echo "   🏭 Production System: $PRODUCTION_URL"
echo "   🧪 V2 Testing System: $V2_URL"
echo ""

# =============================================================================
# TEST 1: SMALL BATCH VALIDATION (5 stocks)
# =============================================================================
echo "🔬 [TEST_1] Starting Small Batch Validation (0-5 stocks)..."
echo "📋 [TEST_1] Purpose: Basic functionality validation"
echo "📊 [TEST_1] Expected: ≥1 signal generated, <120s processing time"
echo ""

# Test parameters for small batch
TEST_PARAMS='{"startIndex": 0, "endIndex": 5, "batchNumber": 1}'

echo "🏭 [TEST_1] Executing production system..."
echo "⏱️ [TEST_1] Production start time: $(date)"

# Execute production system
curl -X POST \
  "$PRODUCTION_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_PARAMS" \
  -w "\n⏱️ [PRODUCTION] HTTP Response Time: %{time_total}s\n" \
  -o production-test1-result.json \
  --max-time 300

PROD_EXIT_CODE=$?
echo "✅ [TEST_1] Production completed with exit code: $PROD_EXIT_CODE"
echo "📄 [TEST_1] Production results saved to: production-test1-result.json"
echo ""

echo "🧪 [TEST_1] Executing V2 testing system..."
echo "⏱️ [TEST_1] V2 start time: $(date)"

# Execute V2 system
curl -X POST \
  "$V2_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_PARAMS" \
  -w "\n⏱️ [V2_TESTING] HTTP Response Time: %{time_total}s\n" \
  -o v2-test1-result.json \
  --max-time 300

V2_EXIT_CODE=$?
echo "✅ [TEST_1] V2 completed with exit code: $V2_EXIT_CODE"
echo "📄 [TEST_1] V2 results saved to: v2-test1-result.json"
echo ""

# =============================================================================
# TEST 1: RESULTS COMPARISON
# =============================================================================
echo "🔍 [TEST_1] Analyzing results comparison..."

if [ $PROD_EXIT_CODE -eq 0 ] && [ $V2_EXIT_CODE -eq 0 ]; then
  echo "✅ [TEST_1] Both systems executed successfully"
  
  echo "📊 [TEST_1] Production Results:"
  if [ -f production-test1-result.json ]; then
    if command -v jq &> /dev/null; then
      cat production-test1-result.json | jq -r '
        "   📈 Processed: " + (.processed // 0 | tostring) + 
        ", Saved: " + (.saved // 0 | tostring) + 
        ", Time: " + (.time // "N/A" | tostring) + "s"
      ' 2>/dev/null || echo "   📄 See production-test1-result.json for full results"
    else
      echo "   📄 See production-test1-result.json for full results (jq not available)"
    fi
  fi
  
  echo "📊 [TEST_1] V2 Testing Results:"
  if [ -f v2-test1-result.json ]; then
    if command -v jq &> /dev/null; then
      cat v2-test1-result.json | jq -r '
        "   📈 Processed: " + (.processed // 0 | tostring) + 
        ", Saved: " + (.saved // 0 | tostring) + 
        ", Time: " + (.time // "N/A" | tostring) + "s"
      ' 2>/dev/null || echo "   📄 See v2-test1-result.json for full results"
    else
      echo "   📄 See v2-test1-result.json for full results (jq not available)"
    fi
  fi
  
  echo "🔍 [TEST_1] Manual comparison required:"
  echo "   ✅ Check that 'processed' counts match exactly"
  echo "   ✅ Check that 'saved' counts match exactly" 
  echo "   ✅ Check that processing times are within ±10%"
  echo "   ✅ Review detailed signal results for identical scores"
  
else
  echo "❌ [TEST_1] System execution issues detected:"
  echo "   🏭 Production exit code: $PROD_EXIT_CODE"
  echo "   🧪 V2 testing exit code: $V2_EXIT_CODE"
  echo "   🔧 Review error output and system availability"
fi

echo ""

# =============================================================================
# TEST 2: MEDIUM BATCH VALIDATION (15 stocks)
# =============================================================================
echo "🔬 [TEST_2] Starting Medium Batch Validation (0-15 stocks)..."
echo "📋 [TEST_2] Purpose: Performance validation"
echo "📊 [TEST_2] Expected: ≥3 signals generated, <300s processing time"
echo ""

# Test parameters for medium batch
TEST_PARAMS_2='{"startIndex": 0, "endIndex": 15, "batchNumber": 1}'

echo "🏭 [TEST_2] Executing production system..."
echo "⏱️ [TEST_2] Production start time: $(date)"

# Execute production system
curl -X POST \
  "$PRODUCTION_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_PARAMS_2" \
  -w "\n⏱️ [PRODUCTION] HTTP Response Time: %{time_total}s\n" \
  -o production-test2-result.json \
  --max-time 600

PROD_EXIT_CODE_2=$?
echo "✅ [TEST_2] Production completed with exit code: $PROD_EXIT_CODE_2"
echo "📄 [TEST_2] Production results saved to: production-test2-result.json"
echo ""

echo "🧪 [TEST_2] Executing V2 testing system..."
echo "⏱️ [TEST_2] V2 start time: $(date)"

# Execute V2 system
curl -X POST \
  "$V2_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_PARAMS_2" \
  -w "\n⏱️ [V2_TESTING] HTTP Response Time: %{time_total}s\n" \
  -o v2-test2-result.json \
  --max-time 600

V2_EXIT_CODE_2=$?
echo "✅ [TEST_2] V2 completed with exit code: $V2_EXIT_CODE_2"
echo "📄 [TEST_2] V2 results saved to: v2-test2-result.json"
echo ""

# =============================================================================
# TEST 2: RESULTS COMPARISON
# =============================================================================
echo "🔍 [TEST_2] Analyzing results comparison..."

if [ $PROD_EXIT_CODE_2 -eq 0 ] && [ $V2_EXIT_CODE_2 -eq 0 ]; then
  echo "✅ [TEST_2] Both systems executed successfully"
  
  echo "📊 [TEST_2] Production Results:"
  if [ -f production-test2-result.json ]; then
    if command -v jq &> /dev/null; then
      cat production-test2-result.json | jq -r '
        "   📈 Processed: " + (.processed // 0 | tostring) + 
        ", Saved: " + (.saved // 0 | tostring) + 
        ", Time: " + (.time // "N/A" | tostring) + "s"
      ' 2>/dev/null || echo "   📄 See production-test2-result.json for full results"
    else
      echo "   📄 See production-test2-result.json for full results (jq not available)"
    fi
  fi
  
  echo "📊 [TEST_2] V2 Testing Results:"
  if [ -f v2-test2-result.json ]; then
    if command -v jq &> /dev/null; then
      cat v2-test2-result.json | jq -r '
        "   📈 Processed: " + (.processed // 0 | tostring) + 
        ", Saved: " + (.saved // 0 | tostring) + 
        ", Time: " + (.time // "N/A" | tostring) + "s"
      ' 2>/dev/null || echo "   📄 See v2-test2-result.json for full results"
    else
      echo "   📄 See v2-test2-result.json for full results (jq not available)"
    fi
  fi
  
  echo "🔍 [TEST_2] Manual comparison required:"
  echo "   ✅ Check that 'processed' counts match exactly"
  echo "   ✅ Check that 'saved' counts match exactly"
  echo "   ✅ Check that processing times are within ±10%"
  echo "   ✅ Review detailed signal results for identical scores"
  
else
  echo "❌ [TEST_2] System execution issues detected:"
  echo "   🏭 Production exit code: $PROD_EXIT_CODE_2"
  echo "   🧪 V2 testing exit code: $V2_EXIT_CODE_2"
  echo "   🔧 Review error output and system availability"
fi

echo ""

# =============================================================================
# TEST 3: APPEND MODE VALIDATION
# =============================================================================
echo "🔬 [TEST_3] Starting Append Mode Validation (5-10 stocks, Batch #2)..."
echo "📋 [TEST_3] Purpose: Batch processing validation"
echo "📊 [TEST_3] Expected: ≥1 signal generated, <180s processing time"
echo ""

# Test parameters for append mode
TEST_PARAMS_3='{"startIndex": 5, "endIndex": 10, "batchNumber": 2}'

echo "🏭 [TEST_3] Executing production system..."
echo "⏱️ [TEST_3] Production start time: $(date)"

# Execute production system
curl -X POST \
  "$PRODUCTION_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_PARAMS_3" \
  -w "\n⏱️ [PRODUCTION] HTTP Response Time: %{time_total}s\n" \
  -o production-test3-result.json \
  --max-time 400

PROD_EXIT_CODE_3=$?
echo "✅ [TEST_3] Production completed with exit code: $PROD_EXIT_CODE_3"
echo "📄 [TEST_3] Production results saved to: production-test3-result.json"
echo ""

echo "🧪 [TEST_3] Executing V2 testing system..."
echo "⏱️ [TEST_3] V2 start time: $(date)"

# Execute V2 system
curl -X POST \
  "$V2_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_PARAMS_3" \
  -w "\n⏱️ [V2_TESTING] HTTP Response Time: %{time_total}s\n" \
  -o v2-test3-result.json \
  --max-time 400

V2_EXIT_CODE_3=$?
echo "✅ [TEST_3] V2 completed with exit code: $V2_EXIT_CODE_3"
echo "📄 [TEST_3] V2 results saved to: v2-test3-result.json"
echo ""

# =============================================================================
# TEST 3: RESULTS COMPARISON
# =============================================================================
echo "🔍 [TEST_3] Analyzing results comparison..."

if [ $PROD_EXIT_CODE_3 -eq 0 ] && [ $V2_EXIT_CODE_3 -eq 0 ]; then
  echo "✅ [TEST_3] Both systems executed successfully"
  
  echo "📊 [TEST_3] Production Results:"
  if [ -f production-test3-result.json ]; then
    if command -v jq &> /dev/null; then
      cat production-test3-result.json | jq -r '
        "   📈 Processed: " + (.processed // 0 | tostring) + 
        ", Saved: " + (.saved // 0 | tostring) + 
        ", Time: " + (.time // "N/A" | tostring) + "s"
      ' 2>/dev/null || echo "   📄 See production-test3-result.json for full results"
    else
      echo "   📄 See production-test3-result.json for full results (jq not available)"
    fi
  fi
  
  echo "📊 [TEST_3] V2 Testing Results:"
  if [ -f v2-test3-result.json ]; then
    if command -v jq &> /dev/null; then
      cat v2-test3-result.json | jq -r '
        "   📈 Processed: " + (.processed // 0 | tostring) + 
        ", Saved: " + (.saved // 0 | tostring) + 
        ", Time: " + (.time // "N/A" | tostring) + "s"
      ' 2>/dev/null || echo "   📄 See v2-test3-result.json for full results"
    else
      echo "   📄 See v2-test3-result.json for full results (jq not available)"
    fi
  fi
  
  echo "🔍 [TEST_3] Manual comparison required:"
  echo "   ✅ Check that 'processed' counts match exactly"
  echo "   ✅ Check that 'saved' counts match exactly"
  echo "   ✅ Check that processing times are within ±10%"
  echo "   ✅ Review detailed signal results for identical scores"
  
else
  echo "❌ [TEST_3] System execution issues detected:"
  echo "   🏭 Production exit code: $PROD_EXIT_CODE_3"
  echo "   🧪 V2 testing exit code: $V2_EXIT_CODE_3"
  echo "   🔧 Review error output and system availability"
fi

echo ""

# =============================================================================
# COMPREHENSIVE VALIDATION SUMMARY
# =============================================================================
echo "📊 ========== SESSION #312: VALIDATION SUMMARY =========="
echo "🎯 [SUMMARY] Comprehensive validation execution complete"
echo ""

# Calculate overall success
TOTAL_TESTS=3
SUCCESSFUL_TESTS=0

if [ $PROD_EXIT_CODE -eq 0 ] && [ $V2_EXIT_CODE -eq 0 ]; then
  SUCCESSFUL_TESTS=$((SUCCESSFUL_TESTS + 1))
fi

if [ $PROD_EXIT_CODE_2 -eq 0 ] && [ $V2_EXIT_CODE_2 -eq 0 ]; then
  SUCCESSFUL_TESTS=$((SUCCESSFUL_TESTS + 1))
fi

if [ $PROD_EXIT_CODE_3 -eq 0 ] && [ $V2_EXIT_CODE_3 -eq 0 ]; then
  SUCCESSFUL_TESTS=$((SUCCESSFUL_TESTS + 1))
fi

echo "📈 [SUMMARY] Test Execution Results:"
echo "   📊 Total Tests: $TOTAL_TESTS"
echo "   ✅ Successful Tests: $SUCCESSFUL_TESTS"
echo "   ❌ Failed Tests: $((TOTAL_TESTS - SUCCESSFUL_TESTS))"

if [ $SUCCESSFUL_TESTS -eq $TOTAL_TESTS ]; then
  echo "🏆 [SUCCESS] ALL VALIDATION TESTS EXECUTED SUCCESSFULLY!"
  echo "✅ [SUCCESS] Both systems (production and V2) responded to all test scenarios"
  echo "🔍 [SUCCESS] Manual comparison required to verify identical outputs"
  echo ""
  echo "📋 [NEXT_STEPS] Manual Validation Checklist:"
  echo "   1. ✅ Compare 'processed' counts - should be identical"
  echo "   2. ✅ Compare 'saved' counts - should be identical"
  echo "   3. ✅ Compare processing times - should be within ±10%"
  echo "   4. ✅ Compare individual signal scores - should be identical"
  echo "   5. ✅ Verify database save rates - should be ≥98%"
  echo ""
  echo "🎯 [SUCCESS] If all manual comparisons pass:"
  echo "   🏆 Session #311 modular transformation VALIDATED!"
  echo "   🚀 Ready for Session #313: Production Migration & Deployment"
  echo "   🎉 Historic achievement: 1600-line monolith → Professional modular architecture"
else
  echo "⚠️ [ISSUES] Some validation tests encountered issues:"
  echo "   🔧 Review error messages above for specific failures"
  echo "   📞 Check system availability and network connectivity"
  echo "   🔄 Re-run individual tests that failed"
  echo ""
  echo "🛡️ [SAFETY] Production system remains completely protected"
  echo "🔧 [TROUBLESHOOTING] Review SESSION-312-SETUP-GUIDE.md for assistance"
fi

echo ""
echo "📄 [FILES] Generated validation files:"
echo "   📊 production-test1-result.json - Small batch production results"
echo "   📊 v2-test1-result.json - Small batch V2 results"
echo "   📊 production-test2-result.json - Medium batch production results"
echo "   📊 v2-test2-result.json - Medium batch V2 results"
echo "   📊 production-test3-result.json - Append mode production results"
echo "   📊 v2-test3-result.json - Append mode V2 results"
echo ""

echo "🎯 ========== SESSION #312: MANUAL VALIDATION COMPLETE =========="
echo "📊 [FINAL] Review all result files for detailed comparison analysis"
echo "🏆 [FINAL] Modular architecture validation framework execution complete"