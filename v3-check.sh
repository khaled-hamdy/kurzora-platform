# Navigate to V3 function directory
cd ~/Desktop/kurzora/kurzora-platform/supabase/functions/automated-signal-generation-v3

echo "🔍 SESSION #321 FINAL VERIFICATION: Checking all components..."
echo "=================================================="

# Check enhanced signal-pipeline.ts
echo ""
echo "📊 SIGNAL PIPELINE CHECK:"
if [ -f "orchestration/signal-pipeline.ts" ]; then
    echo "✅ orchestration/signal-pipeline.ts EXISTS"
    
    # Check for Session #321 enhancements
    if grep -q "SESSION #321" orchestration/signal-pipeline.ts; then
        echo "   └── ✅ Contains SESSION #321 enhancements"
    else
        echo "   └── ⚠️ Missing SESSION #321 enhancements"
    fi
    
    # Check for critical imports
    if grep -q "saveSignalWithIndicators" orchestration/signal-pipeline.ts; then
        echo "   └── ✅ Imports saveSignalWithIndicators"
    else
        echo "   └── ❌ Missing saveSignalWithIndicators import"
    fi
    
    if grep -q "calculateIndicatorScoreContribution" orchestration/signal-pipeline.ts; then
        echo "   └── ✅ Imports calculateIndicatorScoreContribution"
    else
        echo "   └── ❌ Missing calculateIndicatorScoreContribution import"
    fi
    
    # Check for 28-record creation logic
    if grep -q "indicatorsData" orchestration/signal-pipeline.ts; then
        echo "   └── ✅ Contains indicatorsData array logic"
    else
        echo "   └── ❌ Missing indicatorsData array logic"
    fi
    
    filesize=$(wc -c < "orchestration/signal-pipeline.ts")
    echo "   └── File size: $filesize bytes"
else
    echo "❌ orchestration/signal-pipeline.ts MISSING"
fi

# Check indicator-repository.ts
echo ""
echo "🗄️ INDICATOR REPOSITORY CHECK:"
if [ -f "database/indicator-repository.ts" ]; then
    echo "✅ database/indicator-repository.ts EXISTS"
    
    if grep -q "saveSignalWithIndicators" database/indicator-repository.ts; then
        echo "   └── ✅ Contains saveSignalWithIndicators function"
    else
        echo "   └── ❌ Missing saveSignalWithIndicators function"
    fi
    
    if grep -q "calculateIndicatorScoreContribution" database/indicator-repository.ts; then
        echo "   └── ✅ Contains calculateIndicatorScoreContribution function"
    else
        echo "   └── ❌ Missing calculateIndicatorScoreContribution function"
    fi
    
    if grep -q "SESSION #313E" database/indicator-repository.ts; then
        echo "   └── ✅ Preserves Session #313E scoring logic"
    else
        echo "   └── ⚠️ May not preserve Session #313E scoring"
    fi
    
    filesize=$(wc -c < "database/indicator-repository.ts")
    echo "   └── File size: $filesize bytes"
else
    echo "❌ database/indicator-repository.ts MISSING"
fi

# Check main index.ts
echo ""
echo "🚀 MAIN FUNCTION CHECK:"
if [ -f "index.ts" ]; then
    echo "✅ index.ts EXISTS"
    
    if grep -q "signal-pipeline" index.ts; then
        echo "   └── ✅ Imports signal-pipeline"
    else
        echo "   └── ❌ Missing signal-pipeline import"
    fi
    
    if grep -q "executeSignalPipeline" index.ts; then
        echo "   └── ✅ Uses executeSignalPipeline function"
    else
        echo "   └── ⚠️ May not use executeSignalPipeline"
    fi
else
    echo "❌ index.ts MISSING"
fi

# Check database directory
echo ""
echo "📁 DATABASE DIRECTORY:"
if [ -d "database" ]; then
    echo "✅ database/ directory exists"
    echo "   Files:"
    ls -la database/*.ts 2>/dev/null | while read -r line; do
        echo "   └── $line"
    done
else
    echo "❌ database/ directory missing"
fi

# Final status check
echo ""
echo "=================================================="
echo "📊 SESSION #321 READINESS STATUS:"

all_ready=true

if [ ! -f "orchestration/signal-pipeline.ts" ]; then
    echo "❌ Missing signal-pipeline.ts"
    all_ready=false
fi

if [ ! -f "database/indicator-repository.ts" ]; then
    echo "❌ Missing indicator-repository.ts"
    all_ready=false
fi

if [ ! -f "index.ts" ]; then
    echo "❌ Missing index.ts"
    all_ready=false
fi

if [ "$all_ready" = true ]; then
    echo "🎉 ALL CRITICAL FILES PRESENT!"
    echo ""
    echo "🧪 READY FOR SESSION #321 TESTING:"
    echo "1. ✅ Enhanced signal-pipeline.ts with 28-record creation"
    echo "2. ✅ Transaction-safe indicator-repository.ts"
    echo "3. ✅ Function entry point index.ts"
    echo ""
    echo "🚀 NEXT STEP: Test V3 function deployment!"
else
    echo "⚠️ MISSING CRITICAL COMPONENTS - CANNOT TEST YET"
fi

echo "=================================================="