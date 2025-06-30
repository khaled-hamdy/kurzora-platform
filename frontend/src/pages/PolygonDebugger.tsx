import React, { useState } from "react";

const PolygonApiDebugger: React.FC = () => {
  const [apiKey, setApiKey] = useState("u13ghgrLUGDGY_bNd16XpDkhWRRXhaTS");
  const [testTicker, setTestTicker] = useState("AAPL");
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const testPolygonApi = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Polygon.io API key");
      return;
    }

    setIsLoading(true);
    setError("");
    setApiResponse(null);

    try {
      console.log(`🔍 Testing Polygon.io API for ${testTicker}...`);

      // Test the exact same URL structure from your code
      const snapshotUrl = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${testTicker}?apikey=${apiKey}`;

      console.log(`📡 API URL: ${snapshotUrl}`);

      const response = await fetch(snapshotUrl);

      console.log(`📊 Response Status: ${response.status}`);
      console.log(`📊 Response Headers:`, response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(`📊 Raw API Response:`, data);

      setApiResponse(data);

      // Analyze the structure
      if (data.results && data.results.length > 0) {
        const tickerData = data.results[0];
        console.log(`📊 First Ticker Data:`, tickerData);

        // Test the field extraction logic from your code
        console.log("🔍 Field Analysis:");
        console.log(`tickerData.value: ${tickerData.value}`);
        console.log(
          `tickerData.lastQuote?.price: ${tickerData.lastQuote?.price}`
        );
        console.log(`tickerData.prevDay?.c: ${tickerData.prevDay?.c}`);
        console.log(
          `tickerData.session?.volume: ${tickerData.session?.volume}`
        );
        console.log(`tickerData.prevDay?.v: ${tickerData.prevDay?.v}`);
        console.log(`tickerData.marketCap: ${tickerData.marketCap}`);

        // Show all available fields
        console.log("🗂️ All Available Fields:", Object.keys(tickerData));
      }
    } catch (err) {
      console.error("❌ API Test Failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🔍 Polygon.io API Debugger
          </h1>
          <p className="text-slate-400 mt-2">
            Debug the actual API response structure to fix field mapping
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Test Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Polygon.io API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API key is pre-filled from .env.local"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Test Ticker Symbol
              </label>
              <input
                type="text"
                value={testTicker}
                onChange={(e) => setTestTicker(e.target.value.toUpperCase())}
                placeholder="AAPL"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <button
              onClick={testPolygonApi}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 px-8 py-3 rounded-lg font-medium"
            >
              {isLoading ? "🔍 Testing API..." : "🚀 Test Polygon.io API"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-400">❌ {error}</p>
            </div>
          )}
        </div>

        {/* API Response */}
        {apiResponse && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <span className="text-green-400">📊</span>
                Raw API Response for {testTicker}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                This shows exactly what Polygon.io returns
              </p>
            </div>

            <div className="p-6">
              {/* Quick Analysis */}
              {apiResponse.results && apiResponse.results.length > 0 && (
                <div className="mb-6 p-4 bg-slate-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-emerald-400">
                    🔍 Field Analysis
                  </h3>

                  {(() => {
                    const tickerData = apiResponse.results[0];
                    const fields = [
                      { name: "tickerData.value", value: tickerData.value },
                      {
                        name: "tickerData.lastQuote?.price",
                        value: tickerData.lastQuote?.price,
                      },
                      {
                        name: "tickerData.prevDay?.c",
                        value: tickerData.prevDay?.c,
                      },
                      {
                        name: "tickerData.session?.volume",
                        value: tickerData.session?.volume,
                      },
                      {
                        name: "tickerData.prevDay?.v",
                        value: tickerData.prevDay?.v,
                      },
                      {
                        name: "tickerData.marketCap",
                        value: tickerData.marketCap,
                      },
                    ];

                    return (
                      <div className="space-y-2">
                        {fields.map((field, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-slate-300">
                              {field.name}:
                            </span>
                            <span
                              className={
                                field.value !== undefined
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {field.value !== undefined
                                ? field.value
                                : "undefined"}
                            </span>
                          </div>
                        ))}

                        <div className="mt-4 pt-4 border-t border-slate-600">
                          <p className="text-sm text-slate-400">
                            <strong>All Available Fields:</strong>{" "}
                            {Object.keys(tickerData).join(", ")}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Raw JSON */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">
                  📄 Complete Raw Response
                </h3>
                <pre className="bg-slate-900 border border-slate-600 rounded-lg p-4 text-sm overflow-auto max-h-96 text-green-400">
                  {formatJson(apiResponse)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">
            📝 How to Use This Debugger
          </h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              1. <strong>API key is pre-filled</strong> (from your .env.local
              file)
            </p>
            <p>
              2. <strong>Choose a test ticker</strong> (default: AAPL)
            </p>
            <p>
              3. <strong>Click "Test Polygon.io API"</strong> to see the actual
              response structure
            </p>
            <p>
              4. <strong>Check the "Field Analysis"</strong> to see which fields
              are undefined
            </p>
            <p>
              5. <strong>Look at "All Available Fields"</strong> to find the
              correct field names
            </p>
            <p>
              6. <strong>We'll then fix the field mapping</strong> in your
              SignalsTest.tsx code
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
            <p className="text-blue-300 text-sm">
              💡 <strong>Expected Result:</strong> We should see which fields
              contain the actual price and volume data, then update the
              fetchMarketSnapshot method to use the correct field names.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolygonApiDebugger;
