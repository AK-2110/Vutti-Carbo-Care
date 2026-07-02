import { useState } from 'react';
import { Info, TrendingDown, BarChart2 } from 'lucide-react';

export default function CarbonSummary({ totalJobsToday, totalJobsThisMonth, totalJobsLastMonth, totalJobsThisYear, onViewInsights }: { totalJobsToday: number, totalJobsThisMonth: number, totalJobsLastMonth: number, totalJobsThisYear: number, onViewInsights?: () => void }) {
  const [period, setPeriod] = useState<'Today' | 'This Month' | 'Last Month' | 'This Year'>('This Month');
  
  const displayedJobs = period === 'Today' ? totalJobsToday : 
                        period === 'This Month' ? totalJobsThisMonth : 
                        period === 'Last Month' ? totalJobsLastMonth : 
                        totalJobsThisYear;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
          Your Carbon Summary
          <Info className="w-4 h-4 text-slate-400" />
        </h3>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'Today' | 'This Month' | 'Last Month' | 'This Year')}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-default/20"
        >
          <option value="Today">Today</option>
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      <div className="flex items-center justify-center gap-12 mb-8 flex-1">
        {/* Radial Arc SVG */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Arc */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="62.8"
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#1a6337" 
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="125.6"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-slate-800 dark:text-white leading-none mb-1">{displayedJobs}</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Jobs</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-semibold">Total Serviced</span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold mb-0.5">
              <TrendingDown className="w-4 h-4" />
              18%
            </div>
            <div className="text-xs text-slate-500 font-medium">vs Last Month</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold mb-0.5">
              <TrendingDown className="w-4 h-4" />
              12%
            </div>
            <div className="text-xs text-slate-500 font-medium">vs Regional Avg</div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex gap-3 mb-4">
          <div className="mt-0.5">
            <span className="text-lg">🌳</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Great job! You're emitting less than the regional average.
          </p>
        </div>
        <button 
          onClick={onViewInsights}
          className="w-full border border-brand-default text-brand-default dark:text-white dark:border-brand-default dark:bg-brand-default/20 hover:bg-brand-light dark:hover:bg-brand-default/40 rounded-lg py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          View Insights
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
