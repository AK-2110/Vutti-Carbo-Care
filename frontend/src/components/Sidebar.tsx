import { 
  LayoutDashboard, 
  Wrench, 
  BarChart3, 
  Settings,
  Clock
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isAdmin, onLogout, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'jobs', icon: Wrench, label: 'Service Jobs' },
    { id: 'history', icon: Clock, label: 'Customer History' },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Filter items for customers
  const visibleItems = isAdmin ? menuItems : menuItems.filter(item => 
    ['dashboard', 'jobs', 'history', 'insights'].includes(item.id)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in" 
          onClick={() => setIsOpen?.(false)} 
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-transform duration-300 ease-in-out`}>
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={onLogout}>
        <img src="/logo.jpg" alt="Vutti Carbo Care" className="w-12 h-12 object-cover object-center bg-white rounded-full shadow-sm" />
        <div>
          <h1 className="font-bold text-xl leading-none text-slate-800 dark:text-white">Vutti</h1>
          <span className="text-xs font-semibold text-brand-default tracking-widest uppercase">Carbo Care</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) setIsOpen?.(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-brand-default text-white shadow-md shadow-brand-default/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-brand-light/30 dark:bg-brand-default/10 rounded-2xl p-5 relative overflow-hidden border border-brand-default/20">
          <div className="relative z-10">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">Engine Carbon<br/>Specialists</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">Restore lost power!</p>
            <a 
              href="https://wa.me/918885041661?text=Hello!%20I%20would%20like%20to%20book%20an%20engine%20carbon%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-default hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Book Service
            </a>
          </div>
          <div className="absolute -bottom-4 -right-4 text-brand-default opacity-20">
            <Wrench className="w-24 h-24" />
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
