import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PortalPage from './pages/PortalPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard'; 
import CustomerDashboard from './pages/CustomerDashboard'; 
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistory from './pages/OrderHistory';
import OrderHistoryAdmin from './pages/AdminOrders'; 
import SupplierRegistry from './pages/SupplierRegistry'; 
import StockAdjustment from './pages/StockAdjustment'; 
import InventoryReport from './pages/InventoryReport'; 
import AuditLogView from './pages/AuditLogView'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import OrderSuccess from './pages/OrderSuccess';
import CuratedList from './pages/CuratedList'; 
import CustomerProfile from './pages/CustomerProfile'; // NEW: Personal Registry Page
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          },
        }} 
      />
      
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* --- CUSTOMER ROUTES --- */}
        <Route path="/shopping-cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        
        
        {/* --- NEW: CUSTOMER PROFILE & REGISTRY ROUTE --- */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'STAFF']}>
              <CustomerProfile />
            </ProtectedRoute>
          } 
        />

        {/* --- CURATED LIST PROTOCOL ROUTE --- */}
        <Route 
          path="/curated-list" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'STAFF']}>
              <CuratedList />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/customer-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'STAFF']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- STAFF ROUTES --- */}
        <Route 
          path="/staff-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff/adjust-stock" 
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <StockAdjustment />
            </ProtectedRoute>
          } 
        />

        {/* --- ADMIN ROUTES: FULL SYSTEM ACCESS --- */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <OrderHistoryAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/suppliers" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SupplierRegistry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <InventoryReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/audit-logs" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AuditLogView />
            </ProtectedRoute>
          } 
        />

        {/* --- ERROR HANDLING --- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;