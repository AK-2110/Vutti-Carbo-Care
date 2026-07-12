import { Car, Bike, Truck, ChevronRight, Circle } from 'lucide-react';

const iconMap: Record<string, any> = {
  'Two Wheeler': { icon: Bike, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  'Three Wheeler': { icon: Circle, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  'Car': { icon: Car, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  'Van / Tractor / JCB / Generator': { icon: Truck, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  'Bus / Truck': { icon: Truck, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
};

export default function EmissionBreakdown({ categoryBreakdown, onViewAll }: { categoryBreakdown: { category: string, value: number }[], onViewAll?: () => void }) {
  const total = categoryBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-white">Service Breakdown</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-brand-default dark:text-brand-light text-sm font-medium hover:text-brand-dark dark:hover:text-white flex items-center transition-colors">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categoryBreakdown.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">No data available this month.</p>}
        {categoryBreakdown.map((item) => {
          const config = iconMap[item.category] || iconMap['Car'];
          const Icon = config.icon;
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.category} className="flex items-center gap-3 shrink-0 min-w-[140px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.category}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{percentage}%</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.value} Jobs</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
