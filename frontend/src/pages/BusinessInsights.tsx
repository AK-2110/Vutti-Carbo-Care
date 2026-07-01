import { useState, useEffect } from 'react';
import EmissionTrends from '../components/widgets/EmissionTrends';
import RegionalComparison from '../components/widgets/RegionalComparison';
import EmissionBreakdown from '../components/widgets/EmissionBreakdown';

export default function BusinessInsights({ isAdmin, setActiveTab }: { isAdmin?: boolean, setActiveTab?: (tab: string) => void }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Business Insights</h2>
        <div className="flex gap-2">
          {['7D', '30D', '3M', 'YTD'].map(period => (
            <button 
              key={period}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === '30D' 
                  ? 'bg-brand-default text-white' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmissionTrends monthlyTrends={stats?.monthlyTrends || []} />
        <div className="space-y-6 flex flex-col">
          <div className="flex-1">
            <RegionalComparison categoryBreakdown={stats?.categoryBreakdown || []} />
          </div>
          <EmissionBreakdown categoryBreakdown={stats?.categoryBreakdown || []} onViewAll={() => setActiveTab && setActiveTab('history')} />
        </div>
      </div>
    </div>
  );
}
