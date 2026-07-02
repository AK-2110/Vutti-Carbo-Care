import { useState, useEffect } from 'react';
import CarbonSummary from '../components/widgets/CarbonSummary';
import EmissionTrends from '../components/widgets/EmissionTrends';
import { Wrench, Users, ArrowRight } from 'lucide-react';

export default function AdminDashboard({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch dashboard stats', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-brand-default dark:bg-slate-900 rounded-2xl p-8 text-white flex items-center justify-between shadow-md overflow-hidden relative border border-transparent dark:border-brand-default/20">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
          <p className="text-brand-light/80 dark:text-slate-400 text-sm">
            Here's a quick overview of your automotive carbon cleaning business today. Navigate to the sidebar to log new jobs, view customer history, or analyze business trends.
          </p>
        </div>
        <div className="hidden md:block relative z-10 pr-8">
          <img src="/logo.jpg" alt="Vutti Carbo Care Logo" className="w-32 h-32 object-cover object-center bg-white rounded-full shadow-xl border-4 border-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 min-w-0">
          <CarbonSummary 
            totalJobsToday={stats?.totalJobsToday || 0}
            totalJobsThisMonth={stats?.totalJobsThisMonth || 0} 
            totalJobsLastMonth={stats?.totalJobsLastMonth || 0}
            totalJobsThisYear={stats?.totalJobsThisYear || 0}
            onViewInsights={() => setActiveTab?.('insights')} 
          />
        </div>
        <div className="md:col-span-2 min-w-0">
          <EmissionTrends 
            monthlyTrends={stats?.monthlyTrends || []} 
            trendsByYear={stats?.trendsByYear || {}}
            onViewHistory={() => setActiveTab?.('history')} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Action */}
        <div 
          onClick={() => setActiveTab?.('jobs')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-brand-default/50 dark:hover:border-brand-default/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Log a New Job</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Record a completed engine carbon service.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-brand-default transition-colors" />
        </div>

        {/* Quick Action */}
        <div 
          onClick={() => setActiveTab?.('history')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-brand-default/50 dark:hover:border-brand-default/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Customer History</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">View past jobs and contact details.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-brand-default transition-colors" />
        </div>
      </div>
    </div>
  );
}
