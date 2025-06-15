
import React from 'react';

const TrustSignalsBar: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 py-4 mt-8 border-y border-blue-800/30 bg-slate-900/20 backdrop-blur-sm">
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <span>🔒</span> Bank-Level Encryption
      </span>
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <span>⚡</span> 99.9% Uptime
      </span>
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <span>👥</span> 2,847 Active Traders
      </span>
    </div>
  );
};

export default TrustSignalsBar;
