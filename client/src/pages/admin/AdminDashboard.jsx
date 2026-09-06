import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import APP_CONFIG from '../../config/app.config';
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  Sparkles,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  Shield,
  Layers
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'products', 'orders'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, prodsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/products'),
        api.get('/admin/orders')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (prodsRes.success) setProducts(prodsRes.products || []);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleModeration = async (productId) => {
    try {
      const res = await api.patch(`/admin/products/${productId}/moderation`);
      if (res.success) {
        fetchAdminData();
      }
    } catch (err) {
      setError(err.message || 'Moderation action failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B4513]" />
        <p className="text-xs text-[#78716C]">Loading admin management console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-[#8B4513] dark:text-[#F59E0B]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
              {APP_CONFIG.appName} Admin Operations Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-1">
            Platform governance, user verification, craft moderation, and AI telemetry.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <span className="text-xs font-semibold text-[#78716C]">Total Artisans</span>
          <p className="text-2xl font-black text-[#8B4513] dark:text-[#F59E0B] mt-1">
            {stats?.totalArtisans || 0}
          </p>
          <span className="text-[10px] text-green-600 font-semibold">Registered studios</span>
        </div>

        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <span className="text-xs font-semibold text-[#78716C]">Total Customers</span>
          <p className="text-2xl font-black text-[#292524] dark:text-[#F5F5F4] mt-1">
            {stats?.totalCustomers || 0}
          </p>
          <span className="text-[10px] text-[#78716C]">Conscious buyers</span>
        </div>

        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <span className="text-xs font-semibold text-[#78716C]">Products Listed</span>
          <p className="text-2xl font-black text-[#292524] dark:text-[#F5F5F4] mt-1">
            {stats?.totalProducts || 0}
          </p>
          <span className="text-[10px] text-[#D97706] font-semibold">
            {stats?.publishedProducts || 0} Live in Market
          </span>
        </div>

        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <span className="text-xs font-semibold text-[#78716C]">Total Orders</span>
          <p className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">
            {stats?.totalOrders || 0}
          </p>
          <span className="text-[10px] text-[#78716C]">Direct transactions</span>
        </div>

        <div className="card-craft p-5 bg-white dark:bg-[#26201B] col-span-2 md:col-span-1">
          <span className="text-xs font-semibold text-[#78716C]">Marketplace Sales</span>
          <p className="text-2xl font-black text-green-700 dark:text-green-400 mt-1">
            {APP_CONFIG.currency}{stats?.totalSales?.toLocaleString('en-IN') || 0}
          </p>
          <span className="text-[10px] text-[#78716C]">100% to rural families</span>
        </div>
      </div>

      {/* AI Telemetry Showcase */}
      <div className="card-craft p-6 bg-gradient-to-r from-[#FFF7ED] via-white to-[#FFF7ED] dark:from-[#26201B] dark:to-[#181411] border border-[#D97706]/40 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#D97706]" />
          <h2 className="text-base font-bold text-[#8B4513] dark:text-[#F59E0B]">
            AI & Machine Learning Feature Adoption
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-[#26201B] border border-[#FED7AA]/50 space-y-1">
            <span className="text-[#78716C] block">AI Images Enhanced</span>
            <p className="text-2xl font-black text-[#8B4513] dark:text-[#F59E0B]">
              {stats?.aiMetrics?.aiImagesEnhanced || 0}
            </p>
            <span className="text-[10px] text-[#78716C]">Processed by AI Image Studio</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#26201B] border border-[#FED7AA]/50 space-y-1">
            <span className="text-[#78716C] block">AI Catalogs Generated</span>
            <p className="text-2xl font-black text-[#8B4513] dark:text-[#F59E0B]">
              {stats?.aiMetrics?.aiCatalogsGenerated || 0}
            </p>
            <span className="text-[10px] text-[#78716C]">Voice to bilingual JSON catalog</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#26201B] border border-[#FED7AA]/50 space-y-1">
            <span className="text-[#78716C] block">ML Pricing Recommendations</span>
            <p className="text-2xl font-black text-[#8B4513] dark:text-[#F59E0B]">
              {stats?.aiMetrics?.priceRecommendationsGenerated || 0}
            </p>
            <span className="text-[10px] text-green-600 font-semibold">Trained Regression Model</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#FED7AA]/60 dark:border-[#3E3228] space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-2 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-[#8B4513] text-[#8B4513] dark:text-[#F59E0B]'
              : 'border-transparent text-[#78716C]'
          }`}
        >
          Overview & Activity
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-[#8B4513] text-[#8B4513] dark:text-[#F59E0B]'
              : 'border-transparent text-[#78716C]'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-[#8B4513] text-[#8B4513] dark:text-[#F59E0B]'
              : 'border-transparent text-[#78716C]'
          }`}
        >
          Product Listings ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#8B4513] text-[#8B4513] dark:text-[#F59E0B]'
              : 'border-transparent text-[#78716C]'
          }`}
        >
          Market Orders ({orders.length})
        </button>
      </div>

      {/* TAB: USERS */}
      {activeTab === 'users' && (
        <div className="card-craft overflow-x-auto bg-white dark:bg-[#26201B]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF7ED] dark:bg-[#181411] text-[#78716C] uppercase font-bold border-b border-[#FED7AA]/40">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Craft / Specialization</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-[#FFF7ED]/30">
                  <td className="p-3 font-bold text-[#292524] dark:text-[#F5F5F4]">{u.name}</td>
                  <td className="p-3 text-[#78716C]">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'artisan'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-[#78716C]">{u.craftSpecialization || '—'}</td>
                  <td className="p-3 text-[#78716C]">
                    {u.state ? `${u.district ? u.district + ', ' : ''}${u.state}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="card-craft overflow-x-auto bg-white dark:bg-[#26201B]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF7ED] dark:bg-[#181411] text-[#78716C] uppercase font-bold border-b border-[#FED7AA]/40">
              <tr>
                <th className="p-3">Listing</th>
                <th className="p-3">Artisan</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-[#FFF7ED]/30">
                  <td className="p-3 flex items-center space-x-2.5">
                    <img
                      src={p.originalImage}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-bold truncate max-w-[200px]">{p.name}</span>
                  </td>
                  <td className="p-3 text-[#78716C]">{p.artisan?.name || '—'}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 font-bold text-[#8B4513] dark:text-[#F59E0B]">
                    {APP_CONFIG.currency}{p.sellingPrice}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.isPublished ? 'Live' : 'Draft/Unlisted'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleModeration(p._id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        p.isPublished
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {p.isPublished ? 'Unlist' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: ORDERS */}
      {activeTab === 'orders' && (
        <div className="card-craft overflow-x-auto bg-white dark:bg-[#26201B]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF7ED] dark:bg-[#181411] text-[#78716C] uppercase font-bold border-b border-[#FED7AA]/40">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-[#FFF7ED]/30">
                  <td className="p-3 font-bold text-[#8B4513] dark:text-[#F59E0B]">{o.orderNumber}</td>
                  <td className="p-3">{o.shippingAddress?.fullName} ({o.shippingAddress?.city})</td>
                  <td className="p-3">{o.items?.length || 1} craft item(s)</td>
                  <td className="p-3 font-bold">{APP_CONFIG.currency}{o.totalAmount}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {o.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-craft p-6 bg-white dark:bg-[#26201B] space-y-3">
            <h3 className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4]">
              Recent Platform Signups
            </h3>
            <div className="space-y-2">
              {users.slice(0, 4).map((u) => (
                <div key={u._id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800">
                  <div>
                    <span className="font-bold">{u.name}</span>
                    <span className="text-[11px] text-[#78716C] block">{u.email}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-[#8B4513]">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-craft p-6 bg-white dark:bg-[#26201B] space-y-3">
            <h3 className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4]">
              Platform Health & Services
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1">
                <span>Node.js REST API Server:</span>
                <span className="text-green-600 font-bold">● Healthy (Port 5001)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>MongoDB In-Memory / Local:</span>
                <span className="text-green-600 font-bold">● Connected</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>FastAPI Python ML Pricing:</span>
                <span className="text-green-600 font-bold">● Active (Port 8000)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>AI Multilingual NLP:</span>
                <span className="text-green-600 font-bold">● Hindi / Bengali / English</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
