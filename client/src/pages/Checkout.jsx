import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import APP_CONFIG from '../config/app.config';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: 'Flat 402, Lotus Greens, Sector 78',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pinCode: '201301'
  });

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const items = cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      const res = await api.post('/orders', {
        items,
        shippingAddress,
        paymentMethod
      });

      if (res.success && res.order) {
        clearCart();
        navigate('/customer/orders', {
          state: { newOrderNumber: res.order.orderNumber }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#292524] dark:text-[#F5F5F4]">
          No Items in Cart to Checkout
        </h2>
        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#8B4513] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#78716C]">
        <Link to="/cart" className="hover:text-[#D97706] flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
        Artisan Direct Checkout
      </h1>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping & Payment Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address */}
          <div className="card-craft p-6 bg-white dark:bg-[#26201B] space-y-4">
            <h3 className="text-base font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
              <Truck className="w-5 h-5 text-[#D97706]" />
              <span>Delivery Shipping Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#78716C] dark:text-[#A8A29E] mb-1">
                Street Address / House No.
              </label>
              <input
                type="text"
                name="address"
                required
                value={shippingAddress.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pinCode"
                  required
                  value={shippingAddress.pinCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card-craft p-6 bg-white dark:bg-[#26201B] space-y-4">
            <h3 className="text-base font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-[#D97706]" />
              <span>Select Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#8B4513] bg-[#8B4513]/5'
                    : 'border-[#FED7AA]/60'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="text-[#8B4513]"
                />
                <div>
                  <p className="text-xs font-bold text-[#292524] dark:text-[#F5F5F4]">
                    Cash on Delivery (COD)
                  </p>
                  <p className="text-[11px] text-[#78716C]">Pay when artisan piece arrives</p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('ONLINE_MOCK')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center space-x-3 transition-all ${
                  paymentMethod === 'ONLINE_MOCK'
                    ? 'border-[#8B4513] bg-[#8B4513]/5'
                    : 'border-[#FED7AA]/60'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'ONLINE_MOCK'}
                  onChange={() => setPaymentMethod('ONLINE_MOCK')}
                  className="text-[#8B4513]"
                />
                <div>
                  <p className="text-xs font-bold text-[#292524] dark:text-[#F5F5F4]">
                    UPI / Card (Test Online)
                  </p>
                  <p className="text-[11px] text-[#78716C]">Instant direct mock settlement</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-craft p-6 bg-white dark:bg-[#26201B] space-y-4">
            <h3 className="font-bold text-base text-[#292524] dark:text-[#F5F5F4]">
              Order Summary
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[170px]">
                    {item.product.name} (x{item.quantity})
                  </span>
                  <span className="font-bold text-[#8B4513] dark:text-[#F59E0B]">
                    {APP_CONFIG.currency}{item.product.sellingPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#FED7AA]/40 dark:border-[#3E3228] space-y-2 text-xs">
              <div className="flex justify-between text-[#78716C]">
                <span>Items Subtotal:</span>
                <span>{APP_CONFIG.currency}{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Artisan Direct Shipping:</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-[#FED7AA]/40 flex justify-between text-sm font-extrabold text-[#292524] dark:text-[#F5F5F4]">
                <span>Total Amount:</span>
                <span className="text-[#8B4513] dark:text-[#F59E0B]">
                  {APP_CONFIG.currency}{subtotal}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#8B4513] hover:bg-[#72370F] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 touch-target disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order ({APP_CONFIG.currency}{subtotal})</span>
                </>
              )}
            </button>

            <div className="p-3 rounded-lg bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA]/50 flex items-center space-x-2 text-[11px] text-[#78716C]">
              <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>Prices verified securely server-side from active catalog listings.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
