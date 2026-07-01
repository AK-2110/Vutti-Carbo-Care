import { useState } from 'react';
import { ShieldCheck, UserCircle, Wind, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'user') => void;
  onBack: () => void;
  requestedRole: 'admin' | 'user';
}

export default function LoginPage({ onLogin, onBack, requestedRole }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success && data.role === requestedRole) {
        onLogin(data.role);
      } else if (data.success && data.role !== requestedRole) {
         setError(`You are trying to log in as ${requestedRole}, but provided credentials for ${data.role}.`);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="w-8 h-8 rounded-lg bg-brand-default flex items-center justify-center">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white">Vutti Carbo Care</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${requestedRole === 'admin' ? 'bg-brand-default/10 text-brand-default' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>
              {requestedRole === 'admin' ? <ShieldCheck className="w-8 h-8" /> : <UserCircle className="w-8 h-8" />}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
            {requestedRole === 'admin' ? 'Admin Login' : 'Customer Login'}
          </h2>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
            {requestedRole === 'admin' ? 'Sign in to access your business dashboard.' : 'Sign in to access your customer portal.'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <input 
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-default/50 focus:border-brand-default transition-colors"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input 
                type="password"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-default/50 focus:border-brand-default transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-colors mt-6 ${requestedRole === 'admin' ? 'bg-brand-default hover:bg-brand-dark' : 'bg-blue-600 hover:bg-blue-700'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={onBack}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
