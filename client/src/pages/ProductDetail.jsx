import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import APP_CONFIG from '../config/app.config';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Star,
  Check,
  Loader2,
  ChevronRight
} from 'lucide-react';

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('english'); // 'english' or 'hindi'
  const [addedNotice, setAddedNotice] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
          setSelectedImage(res.product.enhancedImage || res.product.originalImage);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#D97706]" />
        <p className="text-sm font-medium text-[#78716C] dark:text-[#A8A29E]">
          Loading product story and details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#292524] dark:text-[#F5F5F4]">
          {error || 'Craft Listing Not Found'}
        </h2>
        <p className="text-sm text-[#78716C] dark:text-[#A8A29E]">
          The product you are looking for may have been archived or unpublished by the artisan.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#8B4513] text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
        <Link to="/" className="hover:text-[#D97706]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/marketplace" className="hover:text-[#D97706]">Marketplace</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="hover:text-[#D97706]">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#292524] dark:text-[#F5F5F4] font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card-craft overflow-hidden relative rounded-2xl bg-white dark:bg-[#26201B] h-[440px] sm:h-[500px]">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            {product.enhancedImage && selectedImage === product.enhancedImage && (
              <div className="absolute top-4 left-4 bg-[#8B4513] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>AI Enhanced Studio View</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedImage(product.originalImage)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                selectedImage === product.originalImage
                  ? 'border-[#D97706] ring-2 ring-[#D97706]/20'
                  : 'border-[#FED7AA]/60 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={product.originalImage} alt="Original" className="w-full h-full object-cover" />
            </button>

            {product.enhancedImage && (
              <button
                onClick={() => setSelectedImage(product.enhancedImage)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all relative ${
                  selectedImage === product.enhancedImage
                    ? 'border-[#D97706] ring-2 ring-[#D97706]/20'
                    : 'border-[#FED7AA]/60 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.enhancedImage} alt="Enhanced" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-[#8B4513] text-[9px] text-white px-1 rounded font-bold">
                  AI
                </span>
              </button>
            )}

            {product.additionalImages?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === img
                    ? 'border-[#D97706] ring-2 ring-[#D97706]/20'
                    : 'border-[#FED7AA]/60 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                {product.category}
              </span>
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="text-xs font-bold text-[#292524] dark:text-[#F5F5F4]">
                  {product.rating || '4.8'}
                </span>
                <span className="text-xs text-[#78716C]">({product.views} views)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4] leading-tight">
              {product.name}
            </h1>

            {/* Origin & Craft Badge */}
            <div className="flex items-center space-x-2 text-xs text-[#78716C] dark:text-[#A8A29E] pt-1">
              <MapPin className="w-4 h-4 text-[#D97706]" />
              <span className="font-semibold text-[#292524] dark:text-[#F5F5F4]">
                {product.artisan?.district
                  ? `${product.artisan.district}, ${product.artisan.state}`
                  : product.artisan?.state || 'India'}
              </span>
              <span>•</span>
              <span className="text-[#D97706] font-medium">{product.craftType}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#26201B] border border-[#FED7AA]/70 dark:border-[#3E3228] flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#78716C] dark:text-[#A8A29E] block">Artisan Fair Price</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-[#8B4513] dark:text-[#F59E0B]">
                  {APP_CONFIG.currency}{product.sellingPrice}
                </span>
                {product.suggestedPrice > 0 && product.suggestedPrice !== product.sellingPrice && (
                  <span className="text-xs text-[#78716C] line-through">
                    {APP_CONFIG.currency}{product.suggestedPrice}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400">
                {product.stock > 0 ? `${product.stock} In Stock` : 'Made to Order'}
              </span>
            </div>
          </div>

          {/* Bilingual Description Tabs */}
          <div className="space-y-3">
            <div className="flex border-b border-[#FED7AA]/50 dark:border-[#3E3228]">
              <button
                onClick={() => setActiveTab('english')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'english'
                    ? 'border-[#D97706] text-[#8B4513] dark:text-[#F59E0B]'
                    : 'border-transparent text-[#78716C] hover:text-[#292524]'
                }`}
              >
                English Description
              </button>
              {product.descriptionHindi && (
                <button
                  onClick={() => setActiveTab('hindi')}
                  className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'hindi'
                      ? 'border-[#D97706] text-[#8B4513] dark:text-[#F59E0B]'
                      : 'border-transparent text-[#78716C] hover:text-[#292524]'
                  }`}
                >
                  हिन्दी विवरण
                </button>
              )}
            </div>

            <p className="text-sm leading-relaxed text-[#78716C] dark:text-[#A8A29E] min-h-[80px]">
              {activeTab === 'english' ? product.descriptionEnglish : product.descriptionHindi}
            </p>
          </div>

          {/* Material & Attributes Table */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA]/50 dark:border-[#3E3228]">
              <span className="text-[#78716C] dark:text-[#A8A29E] block text-[10px] uppercase font-bold">
                Raw Material
              </span>
              <span className="font-semibold text-[#292524] dark:text-[#F5F5F4]">
                {product.material || 'Organic / Clay / Silk'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA]/50 dark:border-[#3E3228]">
              <span className="text-[#78716C] dark:text-[#A8A29E] block text-[10px] uppercase font-bold">
                Color & Finish
              </span>
              <span className="font-semibold text-[#292524] dark:text-[#F5F5F4]">
                {product.color || 'Natural Pigments'}
              </span>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-4 pt-4 border-t border-[#FED7AA]/50 dark:border-[#3E3228]">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-semibold text-[#292524] dark:text-[#F5F5F4]">
                Quantity:
              </span>
              <div className="flex items-center border border-[#FED7AA] dark:border-[#3E3228] rounded-xl bg-white dark:bg-[#26201B]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-[#78716C] hover:text-[#292524]"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-[#292524] dark:text-[#F5F5F4]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-[#78716C] hover:text-[#292524]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-xl border-2 border-[#8B4513] text-[#8B4513] dark:border-[#D97706] dark:text-[#F59E0B] font-bold text-sm hover:bg-[#8B4513]/10 transition-colors flex items-center justify-center space-x-2 touch-target"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 rounded-xl bg-[#8B4513] hover:bg-[#72370F] dark:bg-[#D97706] dark:hover:bg-[#B45309] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2 touch-target"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Direct Payout Guarantee */}
            <div className="p-3 rounded-xl bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA]/60 dark:border-[#3E3228] flex items-center space-x-3 text-xs text-[#78716C] dark:text-[#A8A29E]">
              <ShieldCheck className="w-5 h-5 text-[#D97706] shrink-0" />
              <span>
                100% direct linkage: Your purchase funds the artisan directly, ensuring traditional art survival.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Story Card */}
      {product.artisan && (
        <section className="card-craft p-6 sm:p-8 bg-gradient-to-r from-white to-[#FFF7ED] dark:from-[#26201B] dark:to-[#181411]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={product.artisan.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
              alt={product.artisan.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#D97706]"
            />
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-[#292524] dark:text-[#F5F5F4]">
                  Crafted by {product.artisan.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D97706]/15 text-[#D97706] font-semibold">
                  Verified Master Artisan
                </span>
              </div>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                {product.artisan.district}, {product.artisan.state} • {product.artisan.craftSpecialization}
              </p>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                "{product.artisan.bio}"
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold text-[#292524] dark:text-[#F5F5F4]">
            More in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel._id}
                to={`/product/${rel.slug}`}
                className="card-craft group overflow-hidden block"
              >
                <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={rel.originalImage}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4] line-clamp-1">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] truncate">
                    {rel.artisan?.name}
                  </p>
                  <p className="text-sm font-extrabold text-[#8B4513] dark:text-[#F59E0B] pt-1">
                    {APP_CONFIG.currency}{rel.sellingPrice}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
