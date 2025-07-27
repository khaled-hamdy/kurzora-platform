# Navigate to V3 function directory
cd ~/Desktop/kurzora/kurzora-platform/supabase/functions/automated-signal-generation-v3

# Backup the current gatekeeper rules
cp analysis/gatekeeper-rules.ts analysis/gatekeeper-rules.ts.backup

# Temporarily lower longTerm threshold from 70 to 60 for testing
sed -i '' 's/longTerm: 70, \/\/ Either Daily ≥70% OR Weekly ≥70% (preserved exactly)/longTerm: 60, \/\/ 🧪 SESSION #321 TEST: Temporarily lowered for testing/' analysis/gatekeeper-rules.ts

echo "✅ Gatekeeper threshold temporarily lowered for testing!"
echo ""
echo "🔍 Verification - checking the change:"
grep -n "longTerm.*60" analysis/gatekeeper-rules.ts

echo ""
echo "📊 NEW REQUIREMENTS:"
echo "   1H: ≥70% (unchanged)"
echo "   4H: ≥70% (unchanged)" 
echo "   Daily/Weekly: ≥60% (lowered from 70% for testing)"
echo ""
echo "🎯 ABBV should now PASS:"
echo "   1H=85% ✅, 4H=85% ✅, Daily=66% ✅ (now above 60%)"
echo ""
echo "🚀 Ready to deploy and test Session #321!"