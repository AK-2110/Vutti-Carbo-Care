import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { TrendingDown, ChevronRight } from 'lucide-react';

export default function EmissionTrends({ monthlyTrends, onViewHistory }: { monthlyTrends: { name: string, value: number }[], onViewHistory?: () => void }) {
  const chartData = monthlyTrends && monthlyTrends.length > 0 ? monthlyTrends : [
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "May", value: 0 },
    { name: "Jun", value: 0 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1.5">Monthly Service Volume</h3>
          <p className="text-sm text-slate-500 mt-1">Jobs completed over the last 12 months</p>
        </div>
        <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-default/20">
          <option>2026</option>
          <option>2025</option>
        </select>
      </div>
      
      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={{ value: 'Jobs', position: 'top', offset: -10, fontSize: 10, fill: '#64748b', dx: 20 }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={30}>
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === chartData.length - 1 ? '#1a6337' : '#a7f3d0'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-brand-light rounded-sm"></div>
          <span className="text-xs text-slate-500 font-medium">Service Volume</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-brand-light p-1 rounded">
            <TrendingDown className="w-4 h-4 text-brand-default" />
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total jobs this year: <strong className="text-slate-800 dark:text-white">{chartData.reduce((acc, curr) => acc + curr.value, 0)} jobs</strong></span>
        </div>
        <button 
          onClick={onViewHistory}
          className="text-sm font-semibold text-brand-default hover:text-brand-dark flex items-center gap-1 transition-colors">
          View History
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
