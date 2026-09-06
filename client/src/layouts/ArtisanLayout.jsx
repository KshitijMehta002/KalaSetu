import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import APP_CONFIG from '../config/app.config';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Home,
  LogOut,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export const ArtisanLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/artisan/dashboard', icon: LayoutDashboard },
    { label: 'My Products', path: '/artisan/products', icon: Package },
    { label: '+ Add Product', path: '/artisan/products/new', icon: PlusCircle, highlight: true },
    { label: 'Market Orders', path: '/artisan/orders', icon: ShoppingBag }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FFF7ED] dark:bg-[#181411] text-[#292524] dark:text-[#F5F5F4] flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-[#26201B] border-r border-[#FED7AA]/60 dark:border-[#3E3228] p-6 justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#D97706] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#8B4513] dark:text-[#F59E0B]">
                {APP_CONFIG.appName}
              </h2>
              <span className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wide">
                Artisan Studio
              </span>
            </div>
          </Link>

          {/* Artisan Profile Card */}
          <div className="p-3.5 rounded-xl bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA]/70 dark:border-[#3E3228]">
            <div className="flex items-center space-x-3">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#D97706]"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#292524] dark:text-[#F5F5F4] truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E] truncate">
                  {user?.craftSpecialization || 'Traditional Craft'}
                </p>
                <span className="text-[10px] text-[#D97706] font-semibold">
                  {user?.district ? `${user.district}, ${user.state}` : 'Verified Artisan'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all touch-target ${
                    item.highlight
                      ? 'bg-[#8B4513] hover:bg-[#72370F] text-white shadow-md hover:shadow-lg'
                      : active
                      ? 'bg-[#D97706]/15 text-[#8B4513] dark:text-[#F59E0B] border border-[#D97706]/30'
                      : 'text-[#292524] dark:text-[#F5F5F4] hover:bg-[#FFF7ED] dark:hover:bg-[#181411]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.highlight ? 'text-white' : active ? 'text-[#D97706]' : 'text-[#78716C]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-[#FED7AA]/50 dark:border-[#3E3228]">
          <Link
            to="/marketplace"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium text-[#78716C] hover:text-[#292524] dark:hover:text-[#F5F5F4]"
          >
            <Home className="w-4 h-4" />
            <span>Go to Public Market</span>
          </Link>

          <div className="flex items-center justify-between px-2">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-xs text-[#78716C] hover:text-[#292524] dark:hover:text-[#F5F5F4]"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Artisan Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#26201B] border-b border-[#FED7AA]/60 dark:border-[#3E3228] sticky top-0 z-30">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B4513] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-[#8B4513] dark:text-[#F59E0B]">
              {APP_CONFIG.appName} Studio
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-[#78716C]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar with large tap targets */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#26201B]/95 backdrop-blur-md border-t border-[#FED7AA]/70 dark:border-[#3E3228] flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-h-[50px] min-w-[64px] rounded-xl px-2 py-1 text-[11px] font-semibold transition-all ${
                item.highlight
                  ? 'bg-[#8B4513] text-white -mt-4 shadow-lg scale-105 border-2 border-[#FFF7ED]'
                  : active
                  ? 'text-[#D97706] font-bold'
                  : 'text-[#78716C] dark:text-[#A8A29E]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${item.highlight ? 'text-white' : ''}`} />
              <span>{item.label.replace('+ ', '')}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ArtisanLayout;
