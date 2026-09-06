import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import APP_CONFIG from '../../config/app.config';
import {
  Package,
  CheckCircle,
  Clock,
  IndianRupee,
  ShoppingBag,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
  Loader2,
  Sparkles
} from 'lucide-react';

export const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/artisan/dashboard');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
        <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">Loading your artisan studio...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    totalOrders: 0,
    totalSales: 0
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
              Namaste, {user?.name}! 🙏
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-1">
            {user?.businessName || user?.craftSpecialization} • {user?.district ? `${user.district}, ${user.state}` : user?.state || 'Artisan Hub'}
          </p>
        </div>

        <Link
          to="/artisan/products/new"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#8B4513] hover:bg-[#72370F] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all touch-target"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#78716C] dark:text-[#A8A29E]">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#292524] dark:text-[#F5F5F4] mt-2">
            {stats.totalProducts}
          </p>
          <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
            {stats.draftProducts} in drafts
          </p>
        </div>

        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#78716C] dark:text-[#A8A29E]">
              Live in Market
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-green-700 dark:text-green-400 mt-2">
            {stats.publishedProducts}
          </p>
          <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
            Discoverable by buyers
          </p>
        </div>

        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#78716C] dark:text-[#A8A29E]">
              Orders Received
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#292524] dark:text-[#F5F5F4] mt-2">
            {stats.totalOrders}
          </p>
          <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
            Handmade orders
          </p>
        </div>

        <div className="card-craft p-5 bg-white dark:bg-[#26201B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#78716C] dark:text-[#A8A29E]">
              Total Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#8B4513]/10 text-[#8B4513] dark:text-[#F59E0B] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#8B4513] dark:text-[#F59E0B] mt-2">
            {APP_CONFIG.currency}{stats.totalSales.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-green-600 font-semibold mt-0.5">
            100% direct artisan share
          </p>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="card-craft p-6 bg-gradient-to-r from-[#FFF7ED] via-[#FED7AA]/30 to-[#FFF7ED] dark:from-[#26201B] dark:to-[#181411] border border-[#D97706]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#D97706]" />
            <h3 className="text-base font-bold text-[#8B4513] dark:text-[#F59E0B]">
              Photograph a New Craft Item
            </h3>
          </div>
          <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
            Upload your camera photo, speak in your mother tongue, and get instant pricing suggestions.
          </p>
        </div>
        <Link
          to="/artisan/products/new"
          className="px-5 py-2.5 rounded-xl bg-[#8B4513] text-white text-xs font-bold whitespace-nowrap hover:bg-[#72370F] transition-colors"
        >
          Start AI Catalog Wizard
        </Link>
      </div>

      {/* Grid: Recent Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#292524] dark:text-[#F5F5F4]">
              Recent Craft Products
            </h2>
            <Link
              to="/artisan/products"
              className="text-xs font-semibold text-[#8B4513] dark:text-[#F59E0B] hover:text-[#D97706] flex items-center space-x-1"
            >
              <span>View All ({stats.totalProducts})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentProducts?.length === 0 ? (
              <div className="card-craft p-8 text-center text-xs text-[#78716C]">
                No craft products added yet. Click "Add New Product" to create your first listing!
              </div>
            ) : (
              data?.recentProducts?.map((product) => (
                <div
                  key={product._id}
                  className="card-craft p-4 bg-white dark:bg-[#26201B] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <img
                      src={product.originalImage}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#FED7AA]/50"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs sm:text-sm text-[#292524] dark:text-[#F5F5F4] truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
                        <span>{product.category}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#8B4513] dark:text-[#F59E0B]">
                          {APP_CONFIG.currency}{product.sellingPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        product.isPublished
                          ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {product.isPublished ? 'Live' : 'Draft'}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="p-1.5 rounded-lg text-[#78716C] hover:text-[#292524] hover:bg-gray-100"
                      title="Preview Product"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#292524] dark:text-[#F5F5F4]">
              Recent Orders
            </h2>
            <span className="text-xs text-[#78716C]">
              {data?.recentOrders?.length || 0} recent
            </span>
          </div>

          <div className="space-y-3">
            {data?.recentOrders?.length === 0 ? (
              <div className="card-craft p-8 text-center text-xs text-[#78716C]">
                No customer orders received yet. Once customers purchase your items, they will appear here.
              </div>
            ) : (
              data?.recentOrders?.map((order) => (
                <div
                  key={order._id}
                  className="card-craft p-4 bg-white dark:bg-[#26201B] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#292524] dark:text-[#F5F5F4]">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                    Ship to: {order.shippingAddress?.fullName} ({order.shippingAddress?.city}, {order.shippingAddress?.state})
                  </div>
                  <div className="pt-2 border-t border-[#FED7AA]/40 dark:border-[#3E3228] flex items-center justify-between text-xs">
                    <span className="text-[#78716C]">Order Value:</span>
                    <span className="font-bold text-[#8B4513] dark:text-[#F59E0B]">
                      {APP_CONFIG.currency}{order.totalAmount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
