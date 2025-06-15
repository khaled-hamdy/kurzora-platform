
import { Signal } from '../types/signal';

export const calculateFinalScore = (signals: Signal['signals']): number => {
  const weighted = (
    signals['1H'] * 0.4 +
    signals['4H'] * 0.3 +
    signals['1D'] * 0.2 +
    signals['1W'] * 0.1
  );
  return Math.round(weighted);
};

export const filterSignals = (
  signals: Signal[],
  timeFilter: string,
  scoreThreshold: number[],
  sectorFilter: string,
  marketFilter: string
): Signal[] => {
  return signals.filter(signal => {
    const score = signal.signals[timeFilter as keyof typeof signal.signals];
    const meetsThreshold = score >= scoreThreshold[0];
    const meetsSector = sectorFilter === 'all' || signal.sector === sectorFilter;
    const meetsMarket = marketFilter === 'global' || signal.market === marketFilter;
    
    return meetsThreshold && meetsSector && meetsMarket;
  });
};
