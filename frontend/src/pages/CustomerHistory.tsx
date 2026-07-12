import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Edit2, Save, X, Star, Check } from 'lucide-react';

export default function CustomerHistory({ isAdmin }: { isAdmin?: boolean }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchJobs = () => {
    fetch('/api/jobs/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          console.error('API returned non-array:', data);
          setJobs([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch jobs', err);
        setJobs([]);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleEdit = (job: any) => {
    setEditingJobId(job.id);
    // Format date for the date input (YYYY-MM-DD)
    const formattedDate = new Date(job.recordedAt).toISOString().split('T')[0];
    setEditForm({ ...job, recordedAt: formattedDate });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/jobs/history/${editingJobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      setEditingJobId(null);
      fetchJobs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (jobId: number) => {
    if (!window.confirm('Are you sure you want to delete this record? This cannot be undone.')) return;
    try {
      await fetch(`/api/jobs/history/${jobId}`, { method: 'DELETE' });
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job', error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (job.customerName?.toLowerCase().includes(term)) ||
      (job.customerPhone?.toLowerCase().includes(term)) ||
      (job.customerLocation?.toLowerCase().includes(term)) ||
      (job.vehicleMake?.toLowerCase().includes(term)) ||
      (job.vehicleModel?.toLowerCase().includes(term)) ||
      (job.vehicleType?.toLowerCase().includes(term)) ||
      (job.vehicleNumberPlate?.toLowerCase().includes(term))
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
                <th className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Customer Name</th>
                {isAdmin && <th className="px-6 py-4 font-medium whitespace-nowrap">Phone Number</th>}
                <th className="px-6 py-4 font-medium whitespace-nowrap">Place (Location)</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Vehicle</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Number Plate</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Mileage</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Review</th>
                {isAdmin && <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Price</th>}
                {isAdmin && <th className="px-6 py-4 font-medium text-center whitespace-nowrap">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 10 : 7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No history found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const isEditing = editingJobId === job.id;
                  
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {isEditing ? (
                          <input 
                            type="date"
                            value={editForm.recordedAt}
                            onChange={(e) => setEditForm({...editForm, recordedAt: e.target.value})}
                            className="w-32 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                          />
                        ) : (
                          new Date(job.recordedAt).toLocaleDateString()
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                        {isEditing ? (
                          <input 
                            type="text"
                            value={editForm.customerName}
                            onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                            className="w-32 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                          />
                        ) : (
                          job.customerName || 'Walk-in'
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {isEditing ? (
                            <input 
                              type="text"
                              value={editForm.customerPhone}
                              onChange={(e) => setEditForm({...editForm, customerPhone: e.target.value})}
                              className="w-32 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                            />
                          ) : (
                            job.customerPhone || 'N/A'
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {isEditing ? (
                          <input 
                            type="text"
                            value={editForm.customerLocation}
                            onChange={(e) => setEditForm({...editForm, customerLocation: e.target.value})}
                            className="w-28 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                          />
                        ) : (
                          job.customerLocation || 'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {isEditing ? (
                          <div className="flex gap-2 w-48">
                            <input 
                              type="text"
                              placeholder="Make"
                              value={editForm.vehicleMake}
                              onChange={(e) => setEditForm({...editForm, vehicleMake: e.target.value})}
                              className="w-1/2 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                            />
                            <input 
                              type="text"
                              placeholder="Model"
                              value={editForm.vehicleModel}
                              onChange={(e) => setEditForm({...editForm, vehicleModel: e.target.value})}
                              className="w-1/2 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                              {job.vehicleType || 'Car'}
                            </span>
                            <span className="whitespace-nowrap">{job.vehicleMake} {job.vehicleModel}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs uppercase">
                        {isEditing ? (
                          <input 
                            type="text"
                            value={editForm.vehicleNumberPlate || ''}
                            onChange={(e) => setEditForm({...editForm, vehicleNumberPlate: e.target.value.toUpperCase()})}
                            className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default uppercase"
                          />
                        ) : (
                          job.vehicleNumberPlate || 'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {isEditing ? (
                          <input 
                            type="number"
                            value={editForm.mileage}
                            onChange={(e) => setEditForm({...editForm, mileage: e.target.value})}
                            className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                          />
                        ) : (
                          job.mileage?.toLocaleString() || 'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            <input 
                              type="number"
                              min="0"
                              max="5"
                              value={editForm.rating || 0}
                              onChange={(e) => setEditForm({...editForm, rating: parseInt(e.target.value) || 0})}
                              className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default text-xs"
                              placeholder="Rating 0-5"
                            />
                            <input 
                              type="text"
                              value={editForm.review || ''}
                              onChange={(e) => setEditForm({...editForm, review: e.target.value})}
                              className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default"
                              placeholder="Review"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {job.rating > 0 && (
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-3 h-3 ${job.rating >= star ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`} 
                                    fill={job.rating >= star ? 'currentColor' : 'none'} 
                                  />
                                ))}
                              </div>
                            )}
                            <div className="max-w-[150px] truncate" title={job.review || ''}>
                              {job.review || '-'}
                            </div>
                          </div>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right font-medium text-brand-default">
                          {isEditing ? (
                            <input 
                              type="number"
                              value={editForm.revenue}
                              onChange={(e) => setEditForm({...editForm, revenue: e.target.value})}
                              className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-brand-default focus:border-brand-default text-right ml-auto"
                            />
                          ) : (
                            job.revenue ? `₹${job.revenue}` : 'N/A'
                          )}
                        </td>
                      )}
                      {isAdmin && (
                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md transition-colors"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingJobId(null)} 
                                className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => handleEdit(job)}
                                className="p-1.5 text-slate-400 hover:text-brand-default hover:bg-brand-50 dark:hover:bg-slate-800 rounded-md transition-colors inline-flex justify-center"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(job.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-colors inline-flex justify-center"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
