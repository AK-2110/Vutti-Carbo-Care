import { useState, useEffect } from 'react';
import CarbonSummary from '../components/widgets/CarbonSummary';
import EmissionTrends from '../components/widgets/EmissionTrends';
import { MessageCircle, X, Star, Camera, Play, Gift } from 'lucide-react';

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
          <h2 className="text-3xl font-bold mb-2">Welcome to Vutti Carbo Care</h2>
          <p className="text-brand-light/80 dark:text-slate-400 text-sm">
            You can use this dashboard to view our community carbon impact, track service history, and easily book your next engine carbon cleaning service.
          </p>
        </div>
        <div className="hidden md:block relative z-10 pr-8">
          <img src="/logo.jpg" alt="Vutti Carbo Care Logo" className="w-32 h-32 object-cover object-center bg-white rounded-full shadow-xl border-4 border-white/20" />
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="flex items-center gap-4 relative z-10 mb-4 md:mb-0">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Special Follower Discount! 🎁</h3>
            <p className="text-white/90 text-sm sm:text-base">Get a <span className="font-extrabold text-yellow-300">₹100 DISCOUNT</span> on your service by following us.</p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10 w-full md:w-auto">
          <a 
            href="https://www.instagram.com/vutticarbocare?utm_source=qr&igsh=MXMwczBjaTF6c3Y0NQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 font-semibold py-2.5 px-5 rounded-xl transition-all"
          >
            <Camera className="w-5 h-5" />
            Follow
          </a>
          <a 
            href="https://youtube.com/@vutticarbocare7?si=gbUPYJPdTfjrlXUN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 font-semibold py-2.5 px-5 rounded-xl transition-all"
          >
            <Play className="w-5 h-5" />
            Subscribe
          </a>
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
                <td className="px-4 py-3 font-medium">Two Wheeler</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">799/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3 font-medium">Three Wheeler</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">3</td>
                <td className="px-4 py-3 font-medium">Car</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">1,999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">4</td>
                <td className="px-4 py-3 font-medium">Van / Tractor / JCB</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">2,999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3 font-medium">Bus / Truck</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">3,999/-</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-4 py-3">6</td>
                <td className="px-4 py-3 font-medium">Generator</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-500">2,999/-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Our Service Locations</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">We provide engine carbon cleaning services across these regions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/5 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30 text-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mb-3"></span>
            <h4 className="text-xl font-bold text-blue-800 dark:text-blue-400">Kadapa</h4>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/10 dark:to-emerald-800/5 rounded-xl p-6 border border-emerald-100 dark:border-emerald-900/30 text-center">
            <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block mb-3"></span>
            <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">Tirupati</h4>
          </div>
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
