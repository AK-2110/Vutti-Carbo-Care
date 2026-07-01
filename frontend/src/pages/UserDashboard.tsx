import { useState, useEffect } from 'react';
import CarbonSummary from '../components/widgets/CarbonSummary';
import EmissionTrends from '../components/widgets/EmissionTrends';
import { Wind, MessageCircle, X, Star, Camera, Play } from 'lucide-react';

export default function UserDashboard({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [stats, setStats] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [reviews, setReviews] = useState([
    { initials: 'RS', bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', name: 'Rahul S.', rating: 5, text: '"Got my i20 carbon cleaned here. The difference in engine noise and pickup is night and day! Highly recommended."' },
    { initials: 'VK', bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', name: 'Vikram K.', rating: 5, text: '"Excellent service. My Swift Diesel was smoking heavily, but after the deep clean, it passed the emissions test with flying colors."' },
    { initials: 'AM', bg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', name: 'Anil M.', rating: 5, text: '"Very professional setup. They explained the entire process clearly. Mileage improved slightly but throttle response is much better."' }
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    
    const initials = newReview.name.substring(0, 2).toUpperCase();
    const bgColors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
    ];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
    
    setReviews([{
      initials,
      bg: randomBg,
      name: newReview.name,
      rating: newReview.rating,
      text: `"${newReview.text}"`
    }, ...reviews]);
    
    setIsReviewModalOpen(false);
    setNewReview({ name: '', rating: 5, text: '' });
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch dashboard stats', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-brand-default dark:bg-slate-900 rounded-2xl p-8 text-white flex items-center justify-between shadow-md overflow-hidden relative border border-transparent dark:border-brand-default/20">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Welcome to Vutti Carbo Care</h2>
          <p className="text-brand-light/80 dark:text-slate-400 text-sm">
            You can use this dashboard to view our community carbon impact, track service history, and easily book your next engine carbon cleaning service.
          </p>
        </div>
        <div className="hidden md:block relative z-10 pr-8">
          <img src="/logo.jpg" alt="Vutti Carbo Care Logo" className="w-32 h-32 object-cover object-center bg-white rounded-full shadow-xl border-4 border-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 min-w-0">
          <CarbonSummary 
            totalJobsThisMonth={stats?.totalJobsThisMonth || 0} 
            totalJobsLastMonth={stats?.totalJobsLastMonth || 0}
            onViewInsights={() => setActiveTab?.('insights')} 
          />
        </div>
        <div className="md:col-span-2 min-w-0">
          <EmissionTrends monthlyTrends={stats?.monthlyTrends || []} onViewHistory={() => setActiveTab?.('history')} />
        </div>
      </div>

      {/* Book Service CTA */}
      <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-900/30 text-center">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ready to restore your engine?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
          Book your engine carbon service today and experience better mileage, smoother performance, and reduced emissions instantly.
        </p>
        
        <a 
          href="https://wa.me/918885041661?text=Hello!%20I%20would%20like%20to%20book%20an%20engine%20carbon%20service."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-10 rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 text-lg mb-8"
        >
          <MessageCircle className="w-6 h-6" />
          Book via WhatsApp
        </a>

        <div className="pt-8 border-t border-emerald-200 dark:border-emerald-800/50">
          <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-4 uppercase tracking-wider">Connect With Us</h4>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <a 
              href="https://www.instagram.com/vutticarbocare?utm_source=qr&igsh=MXMwczBjaTF6c3Y0NQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 shadow-lg shadow-pink-500/20"
            >
              <Camera className="w-5 h-5" />
              Instagram
            </a>

            <a 
              href="https://youtube.com/@vutticarbocare7?si=gbUPYJPdTfjrlXUN"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-500/20"
            >
              <Play className="w-5 h-5" />
              YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Our Services & Pricing</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700">S.No</th>
                <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700">Vehicle Type</th>
                <th className="px-4 py-3 font-semibold border-b border-slate-200 dark:border-slate-700 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3 font-medium">Two Wheeler (up to 200cc)</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">699/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3 font-medium">Two Wheeler (Above 200cc)</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">799/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">3</td>
                <td className="px-4 py-3 font-medium">Three Wheeler</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">4</td>
                <td className="px-4 py-3 font-medium">Car (up to 1500cc)</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">1,599/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3 font-medium">Car (above 1500cc)</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">1,999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">6</td>
                <td className="px-4 py-3 font-medium">Van / Tractor / JCB</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">2,499/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">7</td>
                <td className="px-4 py-3 font-medium">Bus</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">2,999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">8</td>
                <td className="px-4 py-3 font-medium">Generator</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">2,999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">9</td>
                <td className="px-4 py-3 font-medium">Truck</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">2,999/-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">What Our Customers Say</h3>
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="text-brand-default dark:text-brand-light text-sm font-medium hover:text-brand-dark flex items-center transition-colors"
          >
            Leave a Review
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${r.bg}`}>{r.initials}</div>
                  <span className="font-semibold text-slate-800 dark:text-white text-sm">{r.name}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Leave a Review</h3>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-default/50"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Review</label>
                <textarea 
                  required
                  value={newReview.text}
                  onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-default/50 min-h-[100px] resize-y"
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-brand-default hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-brand-default/20"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
