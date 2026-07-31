import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import ProductsPage from '../features/products/ProductsPage';
import SalesPage from '../features/sales/SalesPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ReportsPage from '../features/reports/ReportsPage';
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/reports"
  element={
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
