import React from 'react';
import {
  Home,
  Wallet,
  Globe,
  Package,
  Users,
  ShoppingCart,
  Link2,
  Share2,
  TrendingUp,
  Sparkles,
  Settings,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab } = useApp();

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const navItems = [
    { id: 'inicio' as NavigationTab, label: 'Início', icon: Home },
    { id: 'receber' as NavigationTab, label: 'Receber', icon: Wallet, badge: 'Pay', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'sites' as NavigationTab, label: 'Sites', icon: Globe, badge: 'Sites', badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    { id: 'produtos' as NavigationTab, label: 'Produtos', icon: Package },
    { id: 'clientes' as NavigationTab, label: 'Clientes', icon: Users },
    { id: 'vendas' as NavigationTab, label: 'Vendas', icon: ShoppingCart },
    { id: 'links' as NavigationTab, label: 'Links de pagamento', icon: Link2 },
    { id: 'afiliados' as NavigationTab, label: 'Afiliados', icon: Share2 },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: TrendingUp },
    { id: 'ia' as NavigationTab, label: 'MATO IA', icon: Sparkles, badge: 'Novo', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'configuracoes' as NavigationTab, label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[260px] bg-[#0c0f13] border-r border-[#191e26] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#161b22]">
          <div
            className="flex items-center cursor-pointer group py-0.5"
            onClick={() => handleNavClick('inicio')}
          >
            <img
              src="/mato-brand-solid-white.png"
              alt="MATO"
              className="h-9 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] group-hover:brightness-105 transition-all"
            />
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onMobileClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#12281b] text-[#7be801] border border-[#7be801]/20 shadow-[0_0_15px_rgba(123, 232, 1,0.1)]'
                    : 'text-[#9aa5b5] hover:text-white hover:bg-[#141820]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors ${
                      isActive ? 'text-[#7be801]' : 'text-[#7e8b9b]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Plan card on bottom */}
        <div className="p-3 mx-3 mb-3 rounded-2xl bg-[#11161d] border border-[#1d2430]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-5.5 rounded-full bg-[#0a140d] border border-[#7be801] shadow-[0_0_12px_rgba(123,232,1,0.4)] p-0.5">
                <img
                  src="/mato-leaf-icon.png"
                  alt="Plano"
                  className="w-4.5 h-3 object-contain filter drop-shadow-[0_0_5px_#7be801]"
                />
              </div>
              <span className="text-[12.5px] font-semibold text-white">Plano Gratuito</span>
            </div>
            <button
              onClick={() => handleNavClick('configuracoes')}
              className="text-[11px] font-semibold text-[#7be801] hover:underline flex items-center gap-0.5"
            >
              Ver planos <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <p className="text-[11px] text-[#7e8b9b] leading-relaxed">
            Receba pagamentos e crie cobranças. Sem custo. Crédito quando quiser.
          </p>
        </div>

        {/* Help button footer */}
        <div className="px-5 py-3 border-t border-[#161b22]">
          <button
            onClick={() => handleNavClick('configuracoes')}
            className="flex items-center gap-2.5 text-[13px] font-medium text-[#7e8b9b] hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ajuda</span>
          </button>
        </div>
      </aside>
    </>
  );
};
