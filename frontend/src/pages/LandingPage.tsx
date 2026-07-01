import { Car, Wind, ShieldCheck, ArrowRight, Settings } from 'lucide-react';

interface LandingPageProps {
  onStartLogin: (role: 'admin' | 'user') => void;
}

export default function LandingPage({ onStartLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Vutti Carbo Care" className="w-10 h-10 object-cover object-center bg-white rounded-full shadow-sm" />
          <span className="text-xl font-bold text-slate-800 dark:text-white">Vutti Carbo Care</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light/50 dark:bg-brand-default/10 text-brand-default border border-brand-default/20 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-default opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-default"></span>
          </span>
          Next-Gen Carbon Cleaning Technology
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
          Restore Your Engine's <span className="text-brand-default">Lost Power</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl leading-relaxed">
          Experience smoother rides, better fuel economy, and lower emissions with our advanced engine carbon cleaning services. Don't let carbon build-up hold your vehicle back.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button 
            onClick={() => onStartLogin('user')}
            className="w-full sm:w-auto bg-brand-default hover:bg-brand-dark text-white px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-brand-default/30 flex items-center justify-center gap-3"
          >
            Book a Carbon Service
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => onStartLogin('admin')}
            className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-sm flex items-center justify-center gap-3"
          >
            <Settings className="w-5 h-5" />
            Admin Login
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Better Mileage</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Improve your fuel efficiency and save money at the pump by restoring optimal engine conditions.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-4">
              <Wind className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Lower Emissions</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reduce your carbon footprint significantly by clearing out toxic particulate build-up.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Engine Longevity</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Prevent expensive repairs by maintaining clean valves, injectors, and combustion chambers.</p>
          </div>
        </div>

        {/* Advantages Section */}
        <div className="mt-24 mb-12 w-full max-w-5xl text-left">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Advantages of Carbon Cleaning</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Experience a transformation in how your vehicle drives. Our specialized service clears out years of build-up in just 30-60 minutes.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-light/30 dark:bg-brand-default/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-default font-bold">1</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Restores Engine Power & Torque</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Carbon buildup restricts air and fuel flow. Cleaning it out instantly brings back the lost horsepower and throttle response your car had when new.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-light/30 dark:bg-brand-default/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-default font-bold">2</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Reduces Engine Noise & Vibrations</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">A cleaner combustion chamber means a smoother running engine. You will notice a significantly quieter idle and fewer cabin vibrations.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-light/30 dark:bg-brand-default/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-default font-bold">3</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Improves Fuel Economy (Mileage)</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">By restoring optimal combustion, your engine burns fuel more efficiently. This directly translates to better mileage and money saved on gas.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-light/30 dark:bg-brand-default/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-default font-bold">4</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Lowers Harmful Exhaust Emissions</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Significantly reduces CO and hydrocarbon emissions, helping your vehicle pass strict emission tests and reducing your carbon footprint.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
