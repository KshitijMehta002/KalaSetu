import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import APP_CONFIG from '../config/app.config';
import { Sparkles, Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === 'artisan') {
      navigate('/artisan/dashboard', { replace: true });
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/marketplace', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');
    try {
      const user = await login(demoEmail, demoPassword);
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card-craft max-w-md w-full p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B4513] to-[#D97706] text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            Welcome to {APP_CONFIG.appName}
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">
            Log in to manage your artisan studio or explore authentic Indian handicrafts.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center space-x-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
              <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#8B4513] hover:bg-[#72370F] dark:bg-[#D97706] dark:hover:bg-[#B45309] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 touch-target disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-4 border-t border-[#FED7AA]/50 dark:border-[#3E3228] space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-center text-[#78716C] dark:text-[#A8A29E]">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('ramprasad@kalasetu.org', 'password123')}
              className="p-2 rounded-lg bg-[#D97706]/10 text-[#8B4513] dark:text-[#F59E0B] font-semibold border border-[#D97706]/30 hover:bg-[#D97706]/20 text-left transition-colors"
            >
              🏺 Ramprasad (Artisan)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('shanti@kalasetu.org', 'password123')}
              className="p-2 rounded-lg bg-[#D97706]/10 text-[#8B4513] dark:text-[#F59E0B] font-semibold border border-[#D97706]/30 hover:bg-[#D97706]/20 text-left transition-colors"
            >
              🧵 Shanti Devi (Artisan)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('aarav@customer.com', 'password123')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#292524] dark:text-[#F5F5F4] font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-200 text-left transition-colors"
            >
              🛍️ Aarav (Customer)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@kalasetu.org', 'admin123')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#292524] dark:text-[#F5F5F4] font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-200 text-left transition-colors"
            >
              🛡️ Administrator
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#8B4513] dark:text-[#F59E0B] hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
