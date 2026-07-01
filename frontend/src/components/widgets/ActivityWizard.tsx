import { useState } from 'react';
import { Plane, Zap, Droplet, Trash2, Utensils, ShoppingBag, Info, ChevronRight, CheckCircle2 } from 'lucide-react';

const categories = [
  { id: 'travel', name: 'Travel', desc: 'Flights, Road Trips, Commute', icon: Plane, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'energy', name: 'Home Energy', desc: 'Electricity, Gas, Solar', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'water', name: 'Water', desc: 'Water Usage', icon: Droplet, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'waste', name: 'Waste', desc: 'Waste Generated, Recycling', icon: Trash2, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'food', name: 'Food', desc: 'Diet, Groceries, Food Waste', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'shopping', name: 'Shopping', desc: 'Products, Orders, Deliveries', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function ActivityWizard({ onActivityLogged }: { onActivityLogged: () => void }) {
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNext = async () => {
    if (step === 0 && !selectedCategory) return;
    if (step === 1 && !inputValue) return;
    
    if (step === 3) {
      // Final confirm
      setIsSubmitting(true);
      try {
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, value: Number(inputValue) })
        });
        setSuccess(true);
        onActivityLogged();
        setTimeout(() => {
          setSuccess(false);
          setStep(0);
          setSelectedCategory(null);
          setInputValue('');
        }, 3000);
      } catch (err) {
        console.error('Failed to log activity', err);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    
    setStep(s => Math.min(s + 1, 3));
  };

  const currentCat = categories.find(c => c.id === selectedCategory);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Add Activity Data</h3>
      
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative px-4">
        <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-100 z-0"></div>
        <div className="absolute left-8 right-8 top-4 h-0.5 bg-brand-default z-0 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
        
        {['Select Category', 'Enter Details', 'Review', 'Confirm'].map((stepName, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 bg-white transition-colors ${
              step === idx ? 'border-brand-default text-brand-default' : 
              idx < step ? 'border-brand-default bg-brand-default text-white' : 
              'border-slate-200 text-slate-400'
            }`}>
              {idx < step ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
            </div>
            <span className={`text-xs font-medium ${idx <= step ? 'text-slate-800' : 'text-slate-400'}`}>{stepName}</span>
          </div>
        ))}
      </div>

      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2">Activity Logged!</h4>
          <p className="text-slate-500">Your carbon footprint has been updated and a WhatsApp notification was sent.</p>
        </div>
      ) : (
        <>
          {step === 0 && (
            <>
              <div className="mb-4 text-sm font-medium text-slate-700">Select a category to add your activity data</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 flex-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-brand-default bg-brand-light/30 shadow-sm shadow-brand-default/10' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${cat.bg}`}>
                        <Icon className={`w-6 h-6 ${cat.color}`} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1 leading-tight">{cat.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
              <div className="w-full space-y-4">
                <label className="block text-sm font-medium text-slate-700">Enter {currentCat?.name} Metric (e.g. km, kWh)</label>
                <input 
                  type="number" 
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-default/20 text-lg"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="bg-slate-50 rounded-2xl p-6 w-full max-w-sm border border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-2">You are logging</p>
                <h4 className="text-2xl font-bold text-slate-800 mb-1">{inputValue} units</h4>
                <p className="text-brand-default font-medium uppercase tracking-wide">{currentCat?.name}</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h4 className="text-xl font-bold text-slate-800 mb-2">Ready to submit?</h4>
              <p className="text-slate-500 mb-6">Click confirm to save this activity and update your carbon tracker.</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 bg-brand-light px-4 py-2.5 rounded-lg text-sm text-brand-dark">
              <Info className="w-4 h-4 text-brand-default" />
              <span className="font-medium text-xs">Tip: Adding accurate data helps us calculate your carbon footprint more precisely.</span>
            </div>
            <div className="flex gap-3">
              {step > 0 && (
                <button 
                  onClick={() => setStep(s => s - 1)}
                  className="px-6 py-2.5 rounded-lg font-medium transition-colors text-slate-600 hover:bg-slate-100"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNext}
                disabled={isSubmitting || (step === 0 && !selectedCategory) || (step === 1 && !inputValue)}
                className="bg-brand-default hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm shadow-brand-default/20"
              >
                {step === 3 ? (isSubmitting ? 'Submitting...' : 'Confirm') : 'Next'}
                {step !== 3 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
