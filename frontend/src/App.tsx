import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ServiceJobs from './pages/ServiceJobs';
import CustomerHistory from './pages/CustomerHistory';
import BusinessInsights from './pages/BusinessInsights';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>('landing');
  const [requestedRole, setRequestedRole] = useState<'admin' | 'user'>('user');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleStartLogin = (role: 'admin' | 'user') => {
    if (role === 'user') {
      setIsAdmin(false);
      setIsAuthenticated(true);
      setViewMode('app');
      setActiveTab('dashboard');
    } else {
      setRequestedRole('admin');
      setViewMode('login');
    }
  };

  const handleLoginSuccess = (role: 'admin' | 'user') => {
    setIsAdmin(role === 'admin');
    setIsAuthenticated(true);
    setViewMode('app');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setViewMode('landing');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return isAdmin ? <AdminDashboard setActiveTab={setActiveTab} /> : <UserDashboard setActiveTab={setActiveTab} />;
      case 'jobs': return <ServiceJobs isAdmin={isAdmin} />;
      case 'history': return <CustomerHistory isAdmin={isAdmin} />;
      case 'insights': return <BusinessInsights setActiveTab={setActiveTab} />;
      case 'settings': return <Settings isAdmin={isAdmin} />;
      default: return isAdmin ? <AdminDashboard setActiveTab={setActiveTab} /> : <UserDashboard setActiveTab={setActiveTab} />;
    }
  };

  if (viewMode === 'landing') {
    return <LandingPage onStartLogin={handleStartLogin} />;
  }

  if (viewMode === 'login') {
    return <LoginPage onLogin={handleLoginSuccess} onBack={() => setViewMode('landing')} requestedRole={requestedRole} />;
  }

  if (!isAuthenticated) {
    return <LandingPage onStartLogin={handleStartLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} onLogout={handleLogout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <TopBar setActiveTab={setActiveTab} isAdmin={isAdmin} onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
