import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import ProductsPage from '../features/products/ProductsPage';
import SalesPage from '../features/sales/SalesPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ReportsPage from '../features/reports/ReportsPage';
import AppLayout from '../components/layout/AppLayout';
import InventoryPage from '../features/inventory/InventoryPage';
import TransactionsPage from '../features/transactions/TransactionsPage';
import SettingsPage from '../features/settings/SettingsPage';
import LandingPage from '../features/landing/LandingPage';
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
