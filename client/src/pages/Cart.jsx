import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import APP_CONFIG from '../config/app.config';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FED7AA]/30 text-[#D97706] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#292524] dark:text-[#F5F5F4]">
          Your Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] max-w-sm mx-auto">
          Explore our marketplace to discover authentic Indian handicrafts directly from rural artisans.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#8B4513] text-white text-xs font-bold shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
          Shopping Cart ({totalItems} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="card-craft p-4 bg-white dark:bg-[#26201B] flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 overflow-hidden">
                <img
                  src={item.product.originalImage}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#FED7AA]/50"
                />
                <div className="overflow-hidden">
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4] hover:text-[#D97706] line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                    {item.product.category}
                  </p>
                  <p className="text-xs font-extrabold text-[#8B4513] dark:text-[#F59E0B] mt-1">
                    {APP_CONFIG.currency}{item.product.sellingPrice}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="flex items-center border border-[#FED7AA] dark:border-[#3E3228] rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="px-2.5 py-1 text-xs font-bold text-[#78716C]"
                  >
                    -
                  </button>
                  <span className="px-2.5 py-1 text-xs font-bold text-[#292524] dark:text-[#F5F5F4]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="px-2.5 py-1 text-xs font-bold text-[#78716C]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 card-craft p-6 bg-white dark:bg-[#26201B] space-y-4">
          <h3 className="font-bold text-base text-[#292524] dark:text-[#F5F5F4]">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#78716C]">
              <span>Subtotal ({totalItems} items)</span>
              <span>{APP_CONFIG.currency}{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#78716C]">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-bold">FREE (Artisan Initiative)</span>
            </div>
            <div className="pt-2 border-t border-[#FED7AA]/40 dark:border-[#3E3228] flex justify-between font-extrabold text-sm text-[#292524] dark:text-[#F5F5F4]">
              <span>Total Amount</span>
              <span className="text-[#8B4513] dark:text-[#F59E0B]">
                {APP_CONFIG.currency}{subtotal}
              </span>
            </div>
          </div>

          <button
            onClick={() => alert('Phase 5 Commerce Checkout will complete this order. 100% of proceeds go directly to the artisan!')}
            className="w-full py-3 rounded-xl bg-[#8B4513] hover:bg-[#72370F] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
