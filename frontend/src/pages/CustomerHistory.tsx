import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function CustomerHistory({ isAdmin }: { isAdmin?: boolean }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:3001/api/jobs/history')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Failed to fetch jobs', err));
  }, []);

  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (job.customerName?.toLowerCase().includes(term)) ||
      (job.customerPhone?.toLowerCase().includes(term)) ||
      (job.customerLocation?.toLowerCase().includes(term)) ||
      (job.vehicleMake?.toLowerCase().includes(term)) ||
      (job.vehicleModel?.toLowerCase().includes(term)) ||
      (job.vehicleType?.toLowerCase().includes(term))
    );

    if (!matchesSearch) return false;

    const jobDate = new Date(job.recordedAt);
    const now = new Date();

    if (dateFilter === '7days') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      return jobDate >= sevenDaysAgo;
    }
    
    if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      return jobDate >= thirtyDaysAgo;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Customer History</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search customers or vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default text-sm transition-colors"
            />
          </div>
          
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 sticky top-0 border-b border-slate-200 dark:border-slate-800 z-10">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer Name</th>
                {isAdmin && <th className="px-6 py-4 font-medium">Phone Number</th>}
                <th className="px-6 py-4 font-medium">Place (Location)</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Mileage</th>
                {isAdmin && <th className="px-6 py-4 font-medium text-right">Revenue</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No history found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(job.recordedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                      {job.customerName || 'Walk-in'}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {job.customerPhone || 'N/A'}
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {job.customerLocation || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span className="font-semibold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                        {job.vehicleType || 'Car'}
                      </span>
                      {job.vehicleMake} {job.vehicleModel}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {job.mileage?.toLocaleString() || 'N/A'}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right font-medium text-brand-default">
                        {job.revenue ? `₹${job.revenue}` : 'N/A'}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
