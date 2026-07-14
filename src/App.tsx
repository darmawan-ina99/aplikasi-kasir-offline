import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect } from 'react';
import { seedDatabase } from './db/seeds';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './views/auth/LoginPage';
import DashboardPage from './views/dashboard/DashboardPage';
import PosPage from './views/pos/PosPage';
import ProductListPage from './views/product/ProductListPage';
import CustomerListPage from './views/customer/CustomerListPage';
import ReportPage from './views/report/ReportPage';
import SettingsPage from './views/settings/SettingsPage';

function AppInit({ children }: { children: React.ReactNode }) {
  useEffect(() => { seedDatabase(); }, []);
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppInit>
            <BrowserRouter>
              <Toaster position="top-right" toastOptions={{ duration: 3000 }}/>
              <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
                  <Route index element={<DashboardPage/>}/>
                  <Route path="pos" element={<PosPage/>}/>
                  <Route path="products" element={<ProductListPage/>}/>
                  <Route path="customers" element={<CustomerListPage/>}/>
                  <Route path="reports" element={<ReportPage/>}/>
                  <Route path="settings" element={<SettingsPage/>}/>
                </Route>
                <Route path="*" element={<Navigate to="/"/>}/>
              </Routes>
            </BrowserRouter>
          </AppInit>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
