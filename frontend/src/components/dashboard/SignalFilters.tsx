
import React from 'react';
import { Filter, Calendar, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface SignalFiltersProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  scoreThreshold: number[];
  setScoreThreshold: (value: number[]) => void;
  sectorFilter: string;
  setSectorFilter: (value: string) => void;
  marketFilter: string;
  setMarketFilter: (value: string) => void;
  language: string;
}

const SignalFilters: React.FC<SignalFiltersProps> = ({
  timeFilter,
  setTimeFilter,
  scoreThreshold,
  setScoreThreshold,
  sectorFilter,
  setSectorFilter,
  marketFilter,
  setMarketFilter,
  language
}) => {
  const timeframes = ['1H', '4H', '1D', '1W'];

  return (
    <div className="space-y-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
      {/* Row 1: Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Threshold - Wider */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Label className="text-slate-300 text-sm font-medium">
              {language === 'ar' ? `الحد الأدنى: ${scoreThreshold[0]}%` : 
               language === 'de' ? `Min Score: ${scoreThreshold[0]}%` : 
               `Min Score: ${scoreThreshold[0]}%`}
            </Label>
          </div>
          <div className="px-2">
            <Slider
              value={scoreThreshold}
              onValueChange={setScoreThreshold}
              max={100}
              min={60}
              step={5}
              className="w-full [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_.slider-track]:h-3 [&_.slider-range]:h-3 [&_.slider-range]:bg-emerald-500"
            />
          </div>
        </div>

        {/* Market Filter - Larger */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <Label className="text-slate-300 text-sm font-medium">
              {language === 'ar' ? 'السوق' : language === 'de' ? 'Markt' : 'Market'}
            </Label>
          </div>
          <Select value={marketFilter} onValueChange={setMarketFilter}>
            <SelectTrigger className="w-full h-11 bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:ring-2 focus:ring-emerald-400 transition-all duration-200 rounded-lg shadow-lg text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 rounded-lg shadow-xl z-50">
              <SelectItem value="global" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🌐 Global</SelectItem>
              <SelectItem value="usa" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🇺🇸 USA</SelectItem>
              <SelectItem value="saudi" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🇸🇦 Saudi Arabia</SelectItem>
              <SelectItem value="uae" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🇦🇪 UAE</SelectItem>
              <SelectItem value="qatar" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🇶🇦 Qatar</SelectItem>
              <SelectItem value="kuwait" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🇰🇼 Kuwait</SelectItem>
              <SelectItem value="bahrain" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🇧🇭 Bahrain</SelectItem>
              <SelectItem value="oman" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">🇴🇲 Oman</SelectItem>
              <SelectItem value="crypto" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">₿ Crypto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sector Filter - Larger */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Label className="text-slate-300 text-sm font-medium">
              {language === 'ar' ? 'القطاع' : language === 'de' ? 'Sektor' : 'Sector'}
            </Label>
          </div>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-full h-11 bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:ring-2 focus:ring-emerald-400 transition-all duration-200 rounded-lg shadow-lg text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 rounded-lg shadow-xl z-50">
              <SelectItem value="all" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">
                {language === 'ar' ? 'جميع القطاعات' : language === 'de' ? 'Alle Sektoren' : 'All Sectors'}
              </SelectItem>
              <SelectItem value="tech" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">
                {language === 'ar' ? 'التكنولوجيا' : language === 'de' ? 'Technologie' : 'Technology'}
              </SelectItem>
              <SelectItem value="finance" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">
                {language === 'ar' ? 'المالية' : language === 'de' ? 'Finanzen' : 'Finance'}
              </SelectItem>
              <SelectItem value="healthcare" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">
                {language === 'ar' ? 'الرعاية الصحية' : language === 'de' ? 'Gesundheitswesen' : 'Healthcare'}
              </SelectItem>
              <SelectItem value="energy" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">
                {language === 'ar' ? 'الطاقة' : language === 'de' ? 'Energie' : 'Energy'}
              </SelectItem>
              <SelectItem value="crypto" className="hover:bg-slate-600 focus:bg-slate-600 rounded cursor-pointer py-3 text-base">
                {language === 'ar' ? 'العملات المشفرة' : language === 'de' ? 'Kryptowährung' : 'Crypto'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Timeframe Buttons */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Label className="text-slate-300 text-sm font-medium">
            {language === 'ar' ? 'الإطار الزمني' : language === 'de' ? 'Zeitrahmen' : 'Timeframe'}
          </Label>
        </div>
        <div className="flex flex-wrap gap-3">
          {timeframes.map((period) => (
            <Button
              key={period}
              variant={timeFilter === period ? 'default' : 'outline'}
              size="lg"
              onClick={() => setTimeFilter(period)}
              className={`px-6 py-3 text-base font-medium transition-all duration-200 rounded-lg shadow-md hover:shadow-lg min-w-[80px] ${
                timeFilter === period 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-400/25' 
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white hover:border-slate-500'
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignalFilters;
