import { useState } from 'react';
import { Save, Bell, Moon, Shield } from 'lucide-react';

export default function Settings({ isAdmin }: { isAdmin?: boolean }) {
  const [whatsapp, setWhatsapp] = useState(true);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-brand-default" />
            Business Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
              <input type="text" defaultValue="Vutti Carbo Care" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Support Email</label>
              <input type="email" defaultValue="vutticarbocare@gmail.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default" />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-brand-default" />
            Notifications
          </h3>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white">WhatsApp Customer Updates</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Automatically text customers when a job is finished.</p>
            </div>
            <button 
              onClick={() => setWhatsapp(!whatsapp)}
              className={`w-12 h-6 rounded-full transition-colors relative ${whatsapp ? 'bg-brand-default' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${whatsapp ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-brand-default" />
            Appearance
          </h3>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Switch the dashboard to dark mode.</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-brand-default' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button 
              onClick={() => alert('Settings saved successfully!')}
              className="bg-brand-default hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
