import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import APP_CONFIG from '../config/app.config';
import {
  Sparkles,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  PackageCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isArtisan, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FFF7ED]/95 dark:bg-[#181411]/95 backdrop-blur-md border-b border-[#FED7AA]/50 dark:border-[#3E3228]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#D97706] flex items-center justify-center shadow-md text-white group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-[#FFF7ED]" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#8B4513] dark:text-[#F59E0B]">
                {APP_CONFIG.appName}
              </span>
              <span className="hidden sm:block text-[11px] font-medium uppercase tracking-widest text-[#78716C] dark:text-[#A8A29E]">
                Craft to Customers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/marketplace"
              className={`text-sm font-medium transition-colors ${
                isActive('/marketplace')
                  ? 'text-[#8B4513] dark:text-[#F59E0B] font-semibold'
                  : 'text-[#292524] dark:text-[#F5F5F4] hover:text-[#D97706]'
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/marketplace?category=all"
              className="text-sm font-medium text-[#292524] dark:text-[#F5F5F4] hover:text-[#D97706] transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/#artisans"
              className="text-sm font-medium text-[#292524] dark:text-[#F5F5F4] hover:text-[#D97706] transition-colors"
            >
              Our Artisans
            </Link>
            <Link
              to="/#how-it-works"
              className="text-sm font-medium text-[#292524] dark:text-[#F5F5F4] hover:text-[#D97706] transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* Action Icons & Auth */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full text-[#78716C] hover:text-[#292524] dark:text-[#A8A29E] dark:hover:text-[#F5F5F4] hover:bg-[#FED7AA]/30 dark:hover:bg-[#26201B] transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-[#F59E0B]" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-full text-[#78716C] hover:text-[#292524] dark:text-[#A8A29E] dark:hover:text-[#F5F5F4] hover:bg-[#FED7AA]/30 dark:hover:bg-[#26201B] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#D97706] text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account / Auth Actions */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pl-2.5 pr-3 rounded-full border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] hover:shadow-sm transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#8B4513] text-white text-xs font-semibold flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-[#292524] dark:text-[#F5F5F4] max-w-[100px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#D97706]/10 text-[#D97706]">
                    {user.role}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#26201B] shadow-xl border border-[#FED7AA]/50 dark:border-[#3E3228] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#292524] dark:text-[#F5F5F4] truncate">
                        {user.email}
                      </p>
                    </div>

                    {isArtisan && (
                      <>
                        <Link
                          to="/artisan/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-[#292524] dark:text-[#F5F5F4] hover:bg-[#FFF7ED] dark:hover:bg-[#181411]"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2.5 text-[#D97706]" />
                          Artisan Dashboard
                        </Link>
                        <Link
                          to="/artisan/products/new"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-[#292524] dark:text-[#F5F5F4] hover:bg-[#FFF7ED] dark:hover:bg-[#181411]"
                        >
                          <PlusCircle className="w-4 h-4 mr-2.5 text-[#D97706]" />
                          Add Product (AI Wizard)
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-[#292524] dark:text-[#F5F5F4] hover:bg-[#FFF7ED] dark:hover:bg-[#181411]"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2.5 text-[#8B4513]" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left border-t border-gray-100 dark:border-gray-800"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#292524] dark:text-[#F5F5F4] hover:text-[#8B4513] dark:hover:text-[#F59E0B] px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register?role=artisan"
                  className="text-sm font-semibold text-white bg-[#8B4513] hover:bg-[#72370F] dark:bg-[#D97706] dark:hover:bg-[#B45309] px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Start Selling
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#78716C] hover:bg-[#FED7AA]/30"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#FED7AA]/50 dark:border-[#3E3228] space-y-3">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium rounded-lg text-[#292524] dark:text-[#F5F5F4] hover:bg-[#FED7AA]/30"
            >
              Explore Marketplace
            </Link>
            <Link
              to="/marketplace?category=all"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium rounded-lg text-[#292524] dark:text-[#F5F5F4] hover:bg-[#FED7AA]/30"
            >
              Categories
            </Link>
            {isArtisan && (
              <>
                <Link
                  to="/artisan/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium rounded-lg text-[#D97706] bg-[#D97706]/10"
                >
                  Artisan Dashboard
                </Link>
                <Link
                  to="/artisan/products/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium rounded-lg text-[#8B4513] dark:text-[#F59E0B]"
                >
                  + Add New Product
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-[#FED7AA]/50 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-[#FED7AA] font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register?role=artisan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-[#8B4513] text-white font-medium text-sm"
                >
                  Start Selling as Artisan
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
