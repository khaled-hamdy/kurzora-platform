
import React from 'react';

const LivePerformanceTracker: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Live Performance Tracker</h2>
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-6 sm:p-8">
          <h3 className="text-xl font-semibold mb-6 text-slate-300">Last 30 Days</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Signals Sent:</span>
              <span className="font-medium text-white">67</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Profitable:</span>
              <span className="font-medium text-emerald-400">41 (61%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Win:</span>
              <span className="font-medium text-emerald-400">+4.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Loss:</span>
              <span className="font-medium text-red-400">-2.1%</span>
            </div>
            <div className="border-t border-slate-700 pt-4 mt-4">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-white">NET RESULT:</span>
                <span className="font-bold text-emerald-400">+37.2%</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-slate-300">
              <span className="font-semibold">If you traded all signals with $10,000:</span><br/>
              Your Account: <span className="text-emerald-400 font-bold">$13,720 (+37.2%)</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivePerformanceTracker;
