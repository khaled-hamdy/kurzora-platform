const https = require('https');
const fs = require('fs');

console.log('🧮 KURZORA MATHEMATICAL AGGREGATION TEST');

const projectId = 'jmblsasofgvzizypiaci';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmxzYXNvZmd2eml6eXBpYWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjM1OTQzOCwiZXhwIjoyMDUxOTM1NDM4fQ.PovV6ZbrYsKthFtiRzJWKLaamNQ2HnYHv2SiK9IJmJg7ccyukFaiCpF3RM56aXUkOa';

const data = JSON.stringify({ action: 'full_analysis', tickers: ['A', 'AAPL'], include_debug: true });

const options = {
  hostname: 'jmblsasofgvzizypiaci.supabase.co',
  port: 443,
  path: '/functions/v1/automated-signal-generation-v4',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
    'Content-Length': data.length
  }
};

console.log('📡 Testing current state (before mathematical aggregation)...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`📥 Status: ${res.statusCode}`);
    
    if (res.statusCode !== 200) {
      console.log('❌ HTTP Error - Response:', body.substring(0, 500));
      return;
    }
    
    try {
      const result = JSON.parse(body);
      
      if (result.signals?.length) {
        console.log(`✅ Generated ${result.signals.length} signals`);
        
        const stats = { '1H': 0, '4H': 0, '1D': 0, '1W': 0 };
        let macdSuccesses = 0;
        
        result.signals.forEach(signal => {
          if (signal.signals) {
            Object.keys(signal.signals).forEach(tf => {
              if (stats[tf] !== undefined) stats[tf]++;
            });
          }
          if (signal.indicator_name === 'MACD' && signal.raw_value !== null) {
            macdSuccesses++;
          }
        });
        
        console.log('\n📊 Current Timeframe Results:');
        Object.entries(stats).forEach(([tf, count]) => {
          const percentage = (count / result.signals.length * 100).toFixed(1);
          const status = count > 0 ? '✅' : '❌';
          console.log(`   ${status} ${tf}: ${count} signals (${percentage}%)`);
        });
        
        console.log(`\n🔧 MACD Success: ${macdSuccesses} (should be > 0 after ticker bug fix)`);
        
        if (stats['4H'] === 0 || stats['1W'] === 0) {
          console.log('\n⚠️  As expected: 4H/1W timeframes need mathematical aggregation');
          console.log('📋 Ready for mathematical aggregation integration!');
        } else {
          console.log('\n🎉 4H/1W are already working - great!');
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.writeFileSync(`baseline-test-${timestamp}.json`, JSON.stringify(result, null, 2));
        console.log(`\n💾 Baseline saved: baseline-test-${timestamp}.json`);
        
      } else {
        console.log('❌ No signals generated');
        console.log('Response preview:', JSON.stringify(result || {}).substring(0, 300));
      }
      
    } catch (e) {
      console.log('❌ Parse error:', e.message);
      console.log('Raw response:', body.substring(0, 300));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection failed:', error.message);
  console.log('💡 Try: supabase functions serve automated-signal-generation-v4');
});

req.write(data);
req.end();
