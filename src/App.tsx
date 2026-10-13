import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { MatoPayView } from './components/pay/MatoPayView';
import { MatoSitesView } from './components/sites/MatoSitesView';
import { MatoAIView } from './components/ai/MatoAIView';
import { ProductsView } from './components/products/ProductsView';
import { CustomersView } from './components/customers/CustomersView';
import { SalesView } from './components/sales/SalesView';
import { PaymentLinksView } from './components/links/PaymentLinksView';
import { AffiliatesView } from './components/affiliates/AffiliatesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { FloatingMatoIAWidget } from './components/dashboard/FloatingMatoIAWidget';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';

const MainAppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <AuthModal />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'inicio':
        return <DashboardView />;
      case 'receber':
        return <MatoPayView />;
      case 'sites':
        return <MatoSitesView />;
      case 'ia':
        return <MatoAIView />;
      case 'produtos':
        return <ProductsView />;
      case 'clientes':
        return <CustomersView />;
      case 'vendas':
        return <SalesView />;
      case 'links':
        return <PaymentLinksView />;
      case 'afiliados':
        return <AffiliatesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'configuracoes':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08090b] text-[#e2e8f0] font-sans flex overflow-x-hidden">
      {/* Background Grass Wallpaper Cover with Dark Elegant Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity filter saturate-150 contrast-125"
        style={{ backgroundImage: `url('/mato-bg-grass.jpg')` }}
      />
      {/* Radial Vignette & Gradient to maintain perfect contrast and readability */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#08090b]/80 via-[#08090b]/85 to-[#08090b]/95" />

      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        {/* Top Header */}
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating MATO IA Assistant Widget */}
      <FloatingMatoIAWidget />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
};

export default App;
