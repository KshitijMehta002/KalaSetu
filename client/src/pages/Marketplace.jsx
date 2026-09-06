import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import APP_CONFIG from '../config/app.config';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Sparkles,
  Loader2,
  PackageOpen
} from 'lucide-react';

export const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Query parameters state
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Local inputs
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [priceRange, setPriceRange] = useState({
    min: currentMinPrice,
    max: currentMaxPrice
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.success) setCategories(res.categories || []);
      } catch (err) {
        console.warn('Failed to load categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const queryString = searchParams.toString();
        const res = await api.get(`/products?limit=12&${queryString}`);
        if (res.success) {
          setProducts(res.products || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.totalCount || 0);
        }
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handlePriceApply = () => {
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min) newParams.set('minPrice', priceRange.min);
    else newParams.delete('minPrice');

    if (priceRange.max) newParams.set('maxPrice', priceRange.max);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setPriceRange({ min: '', max: '' });
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4] tracking-tight">
              Artisan Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-1">
              Directly supporting {totalCount} authentic handcrafted creations from across India
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search pottery, silk sarees, brass lamps, artisan..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-sm text-[#292524] dark:text-[#F5F5F4] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
              />
              <Search className="w-5 h-5 text-[#78716C] absolute left-3.5 top-3.5" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateParam('search', '');
                  }}
                  className="absolute right-3 top-3.5 text-[#78716C] hover:text-[#292524]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Toolbar: Category Chips & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#FED7AA]/40 dark:border-[#3E3228]">
          {/* Active filter summary & Mobile Filter button */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#26201B] border border-[#FED7AA] text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D97706]" />
              <span>Filters</span>
            </button>

            {/* Quick Category Pills */}
            <button
              onClick={() => updateParam('category', 'all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                currentCategory === 'all'
                  ? 'bg-[#8B4513] text-white shadow-sm'
                  : 'bg-white dark:bg-[#26201B] text-[#78716C] border border-[#FED7AA]/60 hover:border-[#D97706]'
              }`}
            >
              All Items
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateParam('category', cat.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  currentCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-[#8B4513] text-white shadow-sm'
                    : 'bg-white dark:bg-[#26201B] text-[#78716C] border border-[#FED7AA]/60 hover:border-[#D97706]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-[#292524] dark:text-[#F5F5F4] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#D97706]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          <div className="card-craft p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#FED7AA]/40 dark:border-[#3E3228] pb-3">
              <h3 className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D97706]" />
                <span>Filter Products</span>
              </h3>
              {(currentCategory !== 'all' || currentSearch || currentMinPrice || currentMaxPrice) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#D97706] hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                Category
              </h4>
              <div className="space-y-1">
                <label className="flex items-center space-x-2 text-xs cursor-pointer py-1 text-[#292524] dark:text-[#F5F5F4]">
                  <input
                    type="radio"
                    name="category"
                    checked={currentCategory === 'all'}
                    onChange={() => updateParam('category', 'all')}
                    className="text-[#D97706] focus:ring-[#D97706]"
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center justify-between text-xs cursor-pointer py-1 text-[#292524] dark:text-[#F5F5F4] hover:text-[#D97706]"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="category"
                        checked={currentCategory.toLowerCase() === cat.name.toLowerCase()}
                        onChange={() => updateParam('category', cat.name)}
                        className="text-[#D97706] focus:ring-[#D97706]"
                      />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                      ({cat.productCount || 0})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 pt-4 border-t border-[#FED7AA]/40 dark:border-[#3E3228]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                Price Range ({APP_CONFIG.currency})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-[#292524] dark:text-[#F5F5F4] placeholder:text-[#A8A29E]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-[#292524] dark:text-[#F5F5F4] placeholder:text-[#A8A29E]"
                />
              </div>
              <button
                onClick={handlePriceApply}
                className="w-full py-2 rounded-lg bg-[#8B4513] hover:bg-[#72370F] text-white text-xs font-bold transition-colors"
              >
                Apply Price
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">Curating artisan listings...</p>
            </div>
          ) : error ? (
            <div className="card-craft p-8 text-center space-y-3 bg-red-50/50 border-red-200">
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs font-bold px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="card-craft p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FED7AA]/30 text-[#D97706] flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#292524] dark:text-[#F5F5F4]">
                No handcrafted treasures found
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] max-w-sm mx-auto">
                We couldn't find any products matching your current filters. Try changing keywords or resetting filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-[#8B4513] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product.slug}`}
                  className="card-craft group overflow-hidden block hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={product.originalImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#8B4513]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {product.category}
                    </div>
                    {product.enhancedImage && (
                      <div className="absolute top-2.5 right-2.5 bg-[#D97706] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Studio</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                      <span className="font-medium text-[#D97706] truncate max-w-[140px]">
                        {product.craftType || product.material || 'Handcrafted'}
                      </span>
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="font-bold text-[11px] text-[#292524] dark:text-[#F5F5F4]">
                          {product.rating || '4.8'}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4] line-clamp-2 group-hover:text-[#D97706] transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
                      <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                      <span className="truncate">
                        {product.artisan?.district
                          ? `${product.artisan.district}, ${product.artisan.state}`
                          : product.artisan?.state || 'Verified Artisan'}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-[#FED7AA]/40 dark:border-[#3E3228] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#78716C] dark:text-[#A8A29E] block">Price</span>
                        <span className="text-base font-extrabold text-[#8B4513] dark:text-[#F59E0B]">
                          {APP_CONFIG.currency}{product.sellingPrice}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#D97706]/10 text-[#D97706] group-hover:bg-[#D97706] group-hover:text-white transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center space-x-3">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParam('page', (currentPage - 1).toString())}
                className="p-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FED7AA]/20"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold text-[#78716C] dark:text-[#A8A29E]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateParam('page', (currentPage + 1).toString())}
                className="p-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FED7AA]/20"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
