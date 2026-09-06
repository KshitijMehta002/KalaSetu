import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import APP_CONFIG from '../../config/app.config';
import {
  PlusCircle,
  Search,
  Eye,
  Trash2,
  Globe,
  FileEdit,
  Loader2,
  AlertCircle,
  Package,
  CheckCircle2
} from 'lucide-react';

export const ArtisanProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      let url = '/artisan/products?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await api.get(url);
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMyProducts();
  };

  const handleTogglePublish = async (productId) => {
    try {
      const res = await api.post(`/artisan/products/${productId}/publish`);
      if (res.success) {
        setActionNotice(res.message);
        setTimeout(() => setActionNotice(''), 3000);
        fetchMyProducts();
      }
    } catch (err) {
      setError(err.message || 'Failed to update publish status');
    }
  };

  const handleDelete = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await api.delete(`/artisan/products/${productId}`);
      if (res.success) {
        setActionNotice(`"${name}" was deleted successfully.`);
        setTimeout(() => setActionNotice(''), 3000);
        fetchMyProducts();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            My Craft Inventory
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-1">
            Manage your listings, adjust pricing, and toggle marketplace visibility.
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

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 text-xs text-green-700 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="card-craft p-4 bg-white dark:bg-[#26201B] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#8B4513] text-white'
                : 'text-[#78716C] hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'published'
                ? 'bg-[#8B4513] text-white'
                : 'text-[#78716C] hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Live in Market
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'draft'
                ? 'bg-[#8B4513] text-white'
                : 'text-[#78716C] hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Drafts
          </button>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-[#FFF7ED]/50 dark:bg-[#181411] text-xs"
          />
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
          <p className="text-xs text-[#78716C]">Loading your listings...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card-craft p-12 text-center space-y-3 bg-white dark:bg-[#26201B]">
          <Package className="w-10 h-10 text-[#D97706] mx-auto" />
          <h3 className="font-bold text-base text-[#292524] dark:text-[#F5F5F4]">
            No listings found
          </h3>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            You don't have any items matching this status. Click below to add a new handcrafted product.
          </p>
          <Link
            to="/artisan/products/new"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#8B4513] text-white text-xs font-bold"
          >
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="card-craft overflow-hidden bg-white dark:bg-[#26201B] flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.originalImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full shadow ${
                      product.isPublished
                        ? 'bg-green-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {product.isPublished ? '● Live in Market' : 'Draft'}
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    {product.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] line-clamp-2">
                    {product.descriptionEnglish}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#78716C] block">Production Cost</span>
                      <span className="font-semibold text-[#78716C]">
                        {APP_CONFIG.currency}{product.totalProductionCost || 0}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#78716C] block">Selling Price</span>
                      <span className="text-base font-extrabold text-[#8B4513] dark:text-[#F59E0B]">
                        {APP_CONFIG.currency}{product.sellingPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTogglePublish(product._id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    product.isPublished
                      ? 'bg-gray-100 dark:bg-gray-800 text-[#78716C] hover:bg-gray-200'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {product.isPublished ? 'Unpublish' : 'Publish Live'}
                </button>

                <Link
                  to={`/product/${product.slug}`}
                  className="p-2 rounded-lg text-[#78716C] hover:bg-gray-100"
                  title="View Public Page"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(product._id, product.name)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtisanProducts;
