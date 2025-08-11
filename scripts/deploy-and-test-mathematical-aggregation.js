const https = require('https');
const fs = require('fs');

console.log('🧮 KURZORA MATHEMATICAL AGGREGATION TEST');

const projectId = 'jmblsasofgvzizypiaci';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYmxzYXNvZmd2eml6eXBpYWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjM1OTQzOCwiZXhwIjoyMDUxOTM1NDM4fQ.PovV6ZbrYsKthFtiRzJWKLaamNQ2HnYHv2SiK9IJmJg7ccyukFaiCpF3RM56aXUkOa';

const url = `https://${projectId}.supabase.co/functions/v1/automated-signal-generation-v4`;
const data = JSON.stringify({ action: 'full_analysis', tickers: ['A', 'AAPL'] });

const options = {
  hostname: projectId + '.supabase.co',
  port: 443,
  path: '/functions/v1/automated-signal-generation-v4',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
    'Content-Length': data.length
  }
};

console.log('📡 Testing mathematical aggregation...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`📥 Status: ${res.statusCode}`);
    try {
      const result = JSON.parse(body);
      if (result.signals && result.signals.length) {
        console.log(`✅ Signals: ${result.signals.length}`);
        const stats = { '1H': 0, '4H': 0, '1D': 0, '1W': 0 };
        result.signals.forEach(s => {
          if (s.signals) Object.keys(s.signals).forEach(tf => { if (stats[tf] !== undefined) stats[tf]++; });
        });
        Object.entries(stats).forEach(([tf, count]) => {
          console.log(`   ${count > 0 ? '✅' : '❌'} ${tf}: ${count}`);
        });
        console.log(stats['4H'] > 0 && stats['1W'] > 0 ? '🏆 SUCCESS!' : '⚠️ Needs work');
      } else {
        console.log('❌ No signals');
        console.log('Response:', JSON.stringify(result).substring(0, 300));
      }
    } catch (e) {
      console.log('❌ Error:', e.message);
      console.log('Raw response:', body.substring(0, 300));
    }
  });
});

req.on('error', (error) => console.error('❌ Failed:', error.message));
req.write(data);
req.end();
