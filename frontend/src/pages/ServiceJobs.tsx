import { useState, useEffect } from 'react';
import ServiceJobWizard from '../components/widgets/ServiceJobWizard';
import { Clock, MapPin } from 'lucide-react';

export default function ServiceJobs({ isAdmin }: { isAdmin?: boolean }) {
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/jobs/history');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const todaysJobs = jobs.filter(j => {
    const d = new Date(j.recordedAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Service Jobs</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isAdmin && (
          <div className="lg:col-span-2 min-w-0">
            <ServiceJobWizard onJobLogged={fetchJobs} />
          </div>
        )}
        
        <div className={`space-y-4 ${isAdmin ? '' : 'lg:col-span-3'} min-w-0`}>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-default" />
            Today's Completed Jobs
          </h3>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 h-auto max-h-[600px] overflow-y-auto">
            {todaysJobs.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-8">No jobs logged today yet.</p>
            ) : (
              <div className="space-y-3">
                {todaysJobs.map((job: any) => (
                  <div key={job.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand-default/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">
                          {job.vehicleMake} {job.vehicleModel}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {job.customerName || 'Unknown'} • {isAdmin ? (job.customerPhone || 'No Phone') : (job.vehicleType)}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        job.engineType?.toLowerCase() === 'diesel' 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                        {job.engineType || 'Petrol'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.customerLocation || 'Location N/A'}
                      </div>
                      <div className="text-brand-default font-semibold flex items-center gap-1 ml-auto">
                        {job.revenue ? `₹${job.revenue}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
