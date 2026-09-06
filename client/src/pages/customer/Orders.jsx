import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import APP_CONFIG from '../../config/app.config';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ArrowLeft,
  Loader2,
  Sparkles
} from 'lucide-react';

export const CustomerOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const newOrderNumber = location.state?.newOrderNumber;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {newOrderNumber && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 flex items-center space-x-3 text-xs text-green-800 dark:text-green-300">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="font-bold">Order Confirmed Successfully! (Order ID: {newOrderNumber})</p>
            <p className="text-[11px] text-green-700">The artisan has been notified and will prepare your handcrafted piece.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            My Order History
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-1">
            Track your handcrafted orders directly supporting rural artisans.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[#FED7AA] text-xs font-bold hover:bg-[#FED7AA]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
          <p className="text-xs text-[#78716C]">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card-craft p-12 text-center space-y-3 bg-white dark:bg-[#26201B]">
          <ShoppingBag className="w-10 h-10 text-[#D97706] mx-auto" />
          <h3 className="font-bold text-base text-[#292524] dark:text-[#F5F5F4]">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            Discover authentic Indian handicrafts directly from rural artisans on our marketplace.
          </p>
          <Link
            to="/marketplace"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#8B4513] text-white text-xs font-bold"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="card-craft p-6 bg-white dark:bg-[#26201B] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 gap-2">
                <div>
                  <span className="text-xs font-bold text-[#8B4513] dark:text-[#F59E0B]">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-xs text-[#78716C] block">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                    Status: {order.orderStatus}
                  </span>
                  <span className="text-sm font-extrabold text-[#8B4513] dark:text-[#F59E0B]">
                    {APP_CONFIG.currency}{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#FED7AA]/50"
                      />
                      <div>
                        <p className="font-bold text-[#292524] dark:text-[#F5F5F4] truncate max-w-sm">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#78716C]">
                          Quantity: {item.quantity} • By {item.artisan?.name || 'Artisan Partner'}
                        </p>
                      </div>
                    </div>

                    <span className="font-bold text-[#8B4513] dark:text-[#F59E0B] shrink-0">
                      {APP_CONFIG.currency}{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Destination */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#78716C] gap-2">
                <span>
                  Delivery Address: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
                </span>
                <span className="font-semibold text-green-700 dark:text-green-400">
                  Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Paid'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
