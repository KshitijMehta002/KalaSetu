import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import APP_CONFIG from '../../config/app.config';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Loader2,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const ArtisanOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchArtisanOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/artisan-orders');
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch received orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisanOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        setNotice(`Order status updated to "${newStatus}"!`);
        setTimeout(() => setNotice(''), 3000);
        fetchArtisanOrders();
      }
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
            Marketplace Orders Received
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-1">
            Fulfill and update shipping status for orders containing your handcrafted creations.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 text-xs text-green-700 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D97706]" />
          <p className="text-xs text-[#78716C]">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card-craft p-12 text-center space-y-3 bg-white dark:bg-[#26201B]">
          <ShoppingBag className="w-10 h-10 text-[#D97706] mx-auto" />
          <h3 className="font-bold text-base text-[#292524] dark:text-[#F5F5F4]">
            No Orders Received Yet
          </h3>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            Once patrons order your live products from the marketplace, you will see customer delivery details and status controls here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="card-craft p-6 bg-white dark:bg-[#26201B] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#8B4513] dark:text-[#F59E0B]">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <span className="text-xs text-[#78716C]">
                    Received on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Status Updater */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#78716C]">Fulfillment:</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="py-1.5 px-3 rounded-lg border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] text-xs font-bold text-[#8B4513] dark:text-[#F59E0B]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Crafting / Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-[#FED7AA]/50 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-[#292524] dark:text-[#F5F5F4]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#78716C]">
                          Quantity: {item.quantity} × {APP_CONFIG.currency}{item.price}
                        </p>
                      </div>
                    </div>

                    <span className="font-bold text-[#8B4513] dark:text-[#F59E0B]">
                      {APP_CONFIG.currency}{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Customer Shipping Address & Contact */}
              <div className="p-3.5 rounded-xl bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA]/50 dark:border-[#3E3228] text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-[#292524] dark:text-[#F5F5F4]">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Ship To: {order.shippingAddress?.fullName} ({order.shippingAddress?.phone})</span>
                </div>
                <p className="text-[#78716C] pl-5">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtisanOrders;
