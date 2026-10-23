import LoginPage from './features/auth/pages/LoginPage';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { DemoBanner } from './components/common/DemoBanner';

// Portal Landing
import { LandingPortalPage } from './features/portal/LandingPortalPage';

// Login


// Customer
import { MenuPage } from './features/customer/pages/MenuPage';
import { OrderTrackPage } from './features/customer/pages/OrderTrackPage';

// Staff
import { WaiterDashboardPage } from './features/staff/pages/WaiterDashboardPage';

// Kitchen
import { KitchenDisplayPage } from './features/kitchen/pages/KitchenDisplayPage';

// Admin
import { AdminLayout } from './features/admin/components/AdminLayout';
import { AdminOverviewPage } from './features/admin/pages/AdminOverviewPage';
import { AdminMenuPage } from './features/admin/pages/AdminMenuPage';
import { AdminTablesPage } from './features/admin/pages/AdminTablesPage';
import { AdminStaffPage } from './features/admin/pages/AdminStaffPage';
import { AdminPaymentsPage } from './features/admin/pages/AdminPaymentsPage';
import { AdminReportsPage } from './features/admin/pages/AdminReportsPage';
import { AdminSettingsPage } from './features/admin/pages/AdminSettingsPage';

export function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <DemoBanner />

        <Routes>
          {/* Landing Portal */}
          <Route path="/" element={<LandingPortalPage />} />

          {/* Demo Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Customer QR Ordering & Tracking */}
          <Route path="/menu" element={<Navigate to="/menu/T-04" replace />} />
          <Route path="/menu/:tableCode" element={<MenuPage />} />
          <Route path="/track/:orderId" element={<OrderTrackPage />} />

          {/* Waiter / Staff */}
          <Route path="/staff" element={<Navigate to="/staff/orders" replace />} />
          <Route path="/staff/orders" element={<WaiterDashboardPage />} />

          {/* Kitchen Display System */}
          <Route path="/kitchen" element={<KitchenDisplayPage />} />

          {/* Admin Backoffice */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="tables" element={<AdminTablesPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RestaurantProvider>
  );
}

export default App;
