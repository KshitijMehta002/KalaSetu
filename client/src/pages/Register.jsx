import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import APP_CONFIG from '../config/app.config';
import { Sparkles, User, Mail, Phone, Lock, AlertCircle, Loader2, Palette, MapPin } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultRole = searchParams.get('role') === 'artisan' ? 'artisan' : 'customer';

  const [role, setRole] = useState(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    languagePreference: 'en',
    // Artisan specific
    businessName: '',
    craftSpecialization: '',
    state: '',
    district: '',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        role
      };
      const user = await register(payload);
      if (user.role === 'artisan') {
        navigate('/artisan/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="card-craft max-w-lg w-full p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B4513] to-[#D97706] text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            Join {APP_CONFIG.appName}
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">
            Create an account to start showcasing your handmade art or discover Indian crafts.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA] dark:border-[#3E3228]">
          <button
            type="button"
            onClick={() => setRole('artisan')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
              role === 'artisan'
                ? 'bg-[#8B4513] text-white shadow-sm'
                : 'text-[#78716C] hover:text-[#292524] dark:text-[#A8A29E]'
            }`}
          >
            I am an Artisan / Producer
          </button>
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
              role === 'customer'
                ? 'bg-[#8B4513] text-white shadow-sm'
                : 'text-[#78716C] hover:text-[#292524] dark:text-[#A8A29E]'
            }`}
          >
            I am a Customer / Patron
          </button>
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
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Meenakshi Devi"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
              <User className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="artisan@kalasetu.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
                <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
                <Phone className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* Artisan Specific Fields */}
          {role === 'artisan' && (
            <div className="p-4 rounded-xl bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA] dark:border-[#3E3228] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B4513] dark:text-[#F59E0B] flex items-center space-x-1.5">
                <Palette className="w-4 h-4 text-[#D97706]" />
                <span>Artisan Craft Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Studio / Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Madhubani Art Collective"
                    className="w-full px-3 py-2 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Craft Specialization
                  </label>
                  <input
                    type="text"
                    name="craftSpecialization"
                    value={formData.craftSpecialization}
                    onChange={handleChange}
                    placeholder="e.g. Pottery, Handloom, Woodcraft"
                    className="w-full px-3 py-2 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Rajasthan"
                    className="w-full px-3 py-2 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    District / Town
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Jaipur"
                    className="w-full px-3 py-2 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Preferred Voice / Catalog Language
                </label>
                <select
                  name="languagePreference"
                  value={formData.languagePreference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-xs font-medium"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#8B4513] hover:bg-[#72370F] dark:bg-[#D97706] dark:hover:bg-[#B45309] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 touch-target disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Create {role === 'artisan' ? 'Artisan Studio' : 'Patron'} Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#8B4513] dark:text-[#F59E0B] hover:underline">
            Log in to account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
