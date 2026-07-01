import { useState } from 'react';
import { Bell, Settings, LogOut, ChevronDown, Menu } from 'lucide-react';

export default function TopBar({ setActiveTab, isAdmin, onMenuClick, onLogout }: { setActiveTab?: (tab: string) => void, isAdmin?: boolean, onMenuClick?: () => void, onLogout?: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-cover object-center rounded-full shadow-sm" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            {isAdmin 
              ? 'Track service jobs. Understand your metrics. Grow your business.' 
              : 'Track your service history and understand your community impact.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-brand-default rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                <span className="text-xs text-brand-default font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">You're all caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No new notifications at this time.</p>
              </div>
            </div>
          )}
        </div>
        
        {isAdmin && (
          <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                <img src="/logo.jpg" alt="Profile" className="w-full h-full object-cover object-center" />
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-semibold text-slate-800 dark:text-white">Admin</p>
                <p className="text-brand-default font-medium">Vutti Carbo Care</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => {
                    setActiveTab?.('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-default dark:hover:text-brand-default transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Business Profile
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
