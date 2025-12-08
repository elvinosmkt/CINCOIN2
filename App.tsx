
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useStore';
import { Layout } from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Wallet from './pages/wallet/Wallet';
import CinBank from './pages/bank/CinBank';
import Exchange from './pages/exchange/Exchange';
import Transparency from './pages/transparency/Transparency';
import Cinbusca from './pages/companies/Cinbusca';
import CompanySetup from './pages/companies/CompanySetup';

// Feature: CinPlace
import { CinPlaceListPage } from './features/cinplace/pages/CinPlaceListPage';
import { CinPlaceProductPage } from './features/cinplace/pages/CinPlaceProductPage';
import { CinPlaceCompanyProductsPage } from './features/cinplace/pages/CinPlaceCompanyProductsPage';
import { CinPlaceNegotiationsPage } from './features/cinplace/pages/CinPlaceNegotiationsPage';

// React Query Client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout><Outlet /></Layout>;
};

const App: React.FC = () => {
  const { theme } = useAuthStore();

  useEffect(() => {
    // Sync theme with HTML class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="wallet" element={<Wallet />} />
            
            {/* CinPlace Routes */}
            <Route path="cinplace" element={<CinPlaceListPage />} />
            <Route path="cinplace/:id" element={<CinPlaceProductPage />} />
            
            <Route path="cinbank" element={<CinBank />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="transparency" element={<Transparency />} />
            <Route path="companies" element={<Cinbusca />} />
            <Route path="company-setup" element={<CompanySetup />} />
            
            {/* Company Management Routes */}
            <Route path="companies/cinplace/products" element={<CinPlaceCompanyProductsPage />} />
            <Route path="companies/cinplace/negotiations" element={<CinPlaceNegotiationsPage />} />
            
            <Route path="admin" element={<div className="p-8 text-center text-muted-foreground">Módulo Admin (Em Breve)</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
