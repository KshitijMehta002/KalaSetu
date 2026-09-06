import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import ArtisanLayout from './layouts/ArtisanLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerOrders from './pages/customer/Orders';
import Login from './pages/Login';
import Register from './pages/Register';

import ArtisanDashboard from './pages/artisan/Dashboard';
import ArtisanProducts from './pages/artisan/Products';
import AddProductWizard from './pages/artisan/AddProductWizard';
import ArtisanOrders from './pages/artisan/Orders';

import AdminDashboard from './pages/admin/AdminDashboard';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Marketplace & Customer Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="product/:slug" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customer/orders"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
                    <CustomerOrders />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected Admin Routes */}
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Artisan Studio Routes */}
            <Route
              path="/artisan"
              element={
                <ProtectedRoute allowedRoles={['artisan', 'admin']}>
                  <ArtisanLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/artisan/dashboard" replace />} />
              <Route path="dashboard" element={<ArtisanDashboard />} />
              <Route path="products" element={<ArtisanProducts />} />
              <Route path="products/new" element={<AddProductWizard />} />
              <Route path="orders" element={<ArtisanOrders />} />
            </Route>

            {/* Catch-all 404 */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <div className="py-24 text-center">
                    <h2 className="text-3xl font-bold">Page Not Found</h2>
                    <p className="mt-2 text-sm text-[#78716C]">
                      The page you requested does not exist.
                    </p>
                  </div>
                </MainLayout>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
