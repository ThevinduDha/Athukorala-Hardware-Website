import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PortalPage from './pages/PortalPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard'; // IMPORTED
import CustomerDashboard from './pages/CustomerDashboard'; // IMPORTED

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

        {/* --- ROLE-BASED DASHBOARDS --- */}
        
        {/* 1. ADMIN: Full system access [cite: 100, 165] */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* 2. STAFF: Operational & Inventory access [cite: 102, 167] */}
        <Route path="/staff-dashboard" element={<StaffDashboard />} />

        {/* 3. CUSTOMER: Catalog & Order access [cite: 103, 168] */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />

        {/* --- ERROR HANDLING --- */}
        {/* Auto-redirect any typos back to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;