import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import APP_CONFIG from '../config/app.config';
import {
  Sparkles,
  Camera,
  Mic,
  FileText,
  TrendingUp,
  Store,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Layers
} from 'lucide-react';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [catRes, artRes, prodRes] = await Promise.all([
          api.get('/products/categories'),
          api.get('/products/featured-artisans'),
          api.get('/products?limit=6')
        ]);
        if (catRes.success) setCategories(catRes.categories || []);
        if (artRes.success) setFeaturedArtisans(artRes.artisans || []);
        if (prodRes.success) setFeaturedProducts(prodRes.products || []);
      } catch (err) {
        console.warn('Landing data notice:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Take a Photo',
      desc: 'Snap a picture on your mobile phone or upload craft images with automatic lighting & background enhancement.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Speak in Your Language',
      desc: 'Simply speak about materials and craft history in Hindi, Bengali, or English — no typing required.',
      icon: Mic
    },
    {
      num: '03',
      title: 'AI Generates Catalog',
      desc: 'Structured descriptions, titles, cultural context, and bilingual search tags created in seconds.',
      icon: FileText
    },
    {
      num: '04',
      title: 'Smart Fair Pricing',
      desc: 'Enter your raw material and labor costs to receive machine-learning market price recommendations.',
      icon: TrendingUp
    },
    {
      num: '05',
      title: 'Publish & Earn',
      desc: 'Go live on the open marketplace with 1 click and connect directly with art patrons year-round.',
      icon: Store
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#FED7AA]/40 dark:border-[#3E3228]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D97706]/15 border border-[#D97706]/30 text-[#8B4513] dark:text-[#F59E0B] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Empowering India's Heritage Artisans</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#292524] dark:text-[#F5F5F4] leading-[1.15]">
                {APP_CONFIG.brandTagline.split(' — ')[0]} —{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] via-[#D97706] to-[#F59E0B] dark:from-[#F59E0B] dark:to-[#FCD34D]">
                  Powered by AI
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#78716C] dark:text-[#A8A29E] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {APP_CONFIG.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-[#8B4513] hover:bg-[#72370F] dark:bg-[#D97706] dark:hover:bg-[#B45309] shadow-lg shadow-[#8B4513]/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 touch-target"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/register?role=artisan"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-[#8B4513] dark:text-[#F59E0B] bg-white dark:bg-[#26201B] border-2 border-[#D97706] hover:bg-[#FFF7ED] dark:hover:bg-[#181411] transition-all flex items-center justify-center space-x-2 touch-target"
                >
                  <Sparkles className="w-5 h-5 text-[#D97706]" />
                  <span>Start Selling as Artisan</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start space-x-6 text-xs text-[#78716C] dark:text-[#A8A29E]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                  <span>100% Authentic Handcraft</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                  <span>Direct Artisan Linkage</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                  <span>Voice in Native Languages</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Floating Artisan Card */}
                <div className="card-craft p-5 bg-white dark:bg-[#26201B] relative z-10 transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
                      alt="Bankura Terracotta Horse"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#8B4513]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      AI Enhanced
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-[#181411]/95 text-[#8B4513] dark:text-[#F59E0B] text-xs font-bold px-3 py-1 rounded-full shadow">
                      ₹999 (ML Fair Price)
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-[#292524] dark:text-[#F5F5F4]">
                    Handcrafted Bishnupur Terracotta Bankura Horse
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#78716C] dark:text-[#A8A29E]">
                    <span>By Ramprasad Kumbhakar</span>
                    <span className="text-[#D97706] font-semibold">Bankura, West Bengal</span>
                  </div>
                </div>

                {/* AI Assistant Callout Badge */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-[#FFF7ED] dark:bg-[#181411] border-2 border-[#D97706] rounded-2xl p-4 shadow-xl flex items-center space-x-3 max-w-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#8B4513] dark:text-[#F59E0B]">Voice Auto-Catalog</p>
                    <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                      "यह बांकुरा की लाल मिट्टी से बना पारंपरिक घोड़ा है..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
            Simplified 5-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            How {APP_CONFIG.appName} Works
          </h2>
          <p className="text-sm sm:text-base text-[#78716C] dark:text-[#A8A29E]">
            Designed specifically for artisans with minimal digital experience. No complicated paperwork or typing needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="card-craft p-6 flex flex-col justify-between hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-[#D97706]/30 font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#292524] dark:text-[#F5F5F4] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#78716C] dark:text-[#A8A29E]">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Timeless Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
              Popular Craft Categories
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="mt-4 sm:mt-0 text-sm font-semibold text-[#8B4513] dark:text-[#F59E0B] hover:text-[#D97706] flex items-center space-x-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              to={`/marketplace?category=${encodeURIComponent(cat.name)}`}
              className="group card-craft overflow-hidden block"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm leading-tight">{cat.name}</h3>
                  <p className="text-[11px] text-[#FDE68A] mt-0.5">
                    {cat.productCount || 0} listings
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Handmade Treasures
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
              Featured Artisan Creations
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="mt-4 sm:mt-0 text-sm font-semibold text-[#8B4513] dark:text-[#F59E0B] hover:text-[#D97706] flex items-center space-x-1"
          >
            <span>Explore All {APP_CONFIG.currency} Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product.slug}`}
              className="card-craft group overflow-hidden block"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.originalImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#8B4513]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {product.category}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base text-[#292524] dark:text-[#F5F5F4] line-clamp-1 group-hover:text-[#D97706] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E] line-clamp-2">
                  {product.shortDescription || product.descriptionEnglish}
                </p>
                <div className="pt-2 border-t border-[#FED7AA]/40 dark:border-[#3E3228] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#78716C] dark:text-[#A8A29E] block">Artisan Price</span>
                    <span className="text-lg font-extrabold text-[#8B4513] dark:text-[#F59E0B]">
                      {APP_CONFIG.currency}{product.sellingPrice}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-[#292524] dark:text-[#F5F5F4] block">
                      {product.artisan?.name || 'Heritage Artisan'}
                    </span>
                    <span className="text-[11px] text-[#D97706]">
                      {product.artisan?.state || 'India'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Meet Our Artisans Section */}
      <section id="artisans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
            Guardians of Culture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            Meet the Masters Behind the Craft
          </h2>
          <p className="text-sm text-[#78716C] dark:text-[#A8A29E]">
            Directly supporting families, passing ancestral know-how across generations without middleman exploitation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArtisans.map((artisan) => (
            <div key={artisan._id} className="card-craft p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={artisan.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt={artisan.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#D97706]"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#292524] dark:text-[#F5F5F4]">
                      {artisan.name}
                    </h3>
                    <p className="text-xs font-medium text-[#D97706]">
                      {artisan.businessName || artisan.craftSpecialization}
                    </p>
                    <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                      {artisan.district ? `${artisan.district}, ${artisan.state}` : artisan.state}
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#78716C] dark:text-[#A8A29E]">
                  "{artisan.bio}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#FED7AA]/40 dark:border-[#3E3228]">
                <Link
                  to={`/marketplace?search=${encodeURIComponent(artisan.name)}`}
                  className="text-xs font-bold text-[#8B4513] dark:text-[#F59E0B] hover:text-[#D97706] flex items-center justify-between"
                >
                  <span>Explore {artisan.name.split(' ')[0]}'s Work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Impact Stats */}
      <section className="bg-gradient-to-r from-[#8B4513] via-[#72370F] to-[#54280B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#FDE68A]">1,200+</p>
              <p className="text-xs sm:text-sm text-[#FED7AA] mt-1 font-medium">Rural Artisans Linked</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#FDE68A]">8,500+</p>
              <p className="text-xs sm:text-sm text-[#FED7AA] mt-1 font-medium">Catalogs Generated</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#FDE68A]">₹42.5 Lakh</p>
              <p className="text-xs sm:text-sm text-[#FED7AA] mt-1 font-medium">Direct Artisan Earnings</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#FDE68A]">18</p>
              <p className="text-xs sm:text-sm text-[#FED7AA] mt-1 font-medium">States Represented</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="card-craft p-10 sm:p-14 bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA]/40 dark:from-[#26201B] dark:to-[#181411] border-2 border-[#D97706]/40 space-y-6 max-w-4xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#D97706]/20 text-[#D97706] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            Ready to Take Your Craft to the World?
          </h2>
          <p className="text-sm sm:text-base text-[#78716C] dark:text-[#A8A29E] max-w-xl mx-auto">
            Join thousands of artisans using AI to photograph, catalog, price, and sell without middlemen.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register?role=artisan"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-[#8B4513] hover:bg-[#72370F] dark:bg-[#D97706] dark:hover:bg-[#B45309] shadow-md"
            >
              Start Free Artisan Registration
            </Link>
            <Link
              to="/marketplace"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[#8B4513] dark:text-[#F59E0B] border border-[#D97706] bg-white dark:bg-[#26201B]"
            >
              Browse Handicrafts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
