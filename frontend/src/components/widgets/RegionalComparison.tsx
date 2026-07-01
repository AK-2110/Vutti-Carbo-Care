import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';

export default function RegionalComparison({ categoryBreakdown }: { categoryBreakdown: { category: string, value: number }[] }) {
  const chartData = categoryBreakdown.length > 0 
    ? categoryBreakdown.map(c => ({
        category: c.category,
        count: c.value,
        target: 10
      }))
    : [{ category: 'None', count: 0, target: 0 }];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Service Type Volume</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Jobs completed vs target</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="count" name="Completed Jobs" fill="#1a6337" radius={[0, 2, 2, 0]} />
            <Bar dataKey="target" name="Target Jobs" fill="#94a3b8" radius={[0, 2, 2, 0]} fillOpacity={0.2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
