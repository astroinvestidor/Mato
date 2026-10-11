import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, User, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { userProfile, setActiveTab, showToast } = useApp();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Pix recebido de R$ 97,00',
      time: 'Há 12 minutos',
      read: false,
    },
    {
      id: 2,
      title: 'Novo pedido #PED-1093 aprovado',
      time: 'Há 1 hora',
      read: false,
    },
    {
      id: 3,
      title: 'Loja "Sua Loja Sneakers" atingiu 1.840 acessos',
      time: 'Hoje, 09:30',
      read: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#08090b]/90 backdrop-blur-md border-b border-[#141820]">
      {/* Left greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 text-gray-400 rounded-lg hover:text-white hover:bg-white/5 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center p-2 rounded-2xl bg-[#101913] border border-[#7be801]/30 shadow-[0_0_20px_rgba(123,232,1,0.2)] flex-shrink-0">
            <img
              src="/mato-leaf-icon.png"
              alt="MATO"
              className="w-7 h-5 object-contain filter drop-shadow-[0_0_10px_rgba(123,232,1,0.6)]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white lg:text-2xl">
                Olá, Mateus <span className="inline-block animate-pulse">👋</span>
              </h1>
            </div>
            <p className="text-[13px] text-[#7e8b9b] hidden sm:block mt-0.5">
              Bem-vindo ao seu painel. Aqui você gerencia seus pagamentos, sites e muito mais.
            </p>
          </div>
        </div>
      </div>

      {/* Right user controls */}
      <div className="flex items-center gap-4">
        {/* Notifications popover */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileMenuOpen(false);
            }}
            className="relative p-2 rounded-xl text-[#9aa5b5] hover:text-white hover:bg-[#141820] border border-[#1d232e] transition-all"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#08090b]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f131a] border border-[#1f2735] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/5 mb-2">
                <span className="text-xs font-semibold text-white">Notificações</span>
                <span className="text-[11px] text-emerald-400 cursor-pointer hover:underline" onClick={() => showToast('Todas as notificações marcadas como lidas')}>
                  Marcar como lidas
                </span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-left"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-white">{n.title}</p>
                        <span className="text-[10px] text-[#7e8b9b]">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile capsule */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl bg-[#11151c] hover:bg-[#161c26] border border-[#1c2432] transition-all"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1e2634] text-xs font-bold text-white border border-white/10">
              {userProfile.avatarText}
            </div>
            <span className="text-xs font-medium text-white hidden md:inline-block">
              {userProfile.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7e8b9b]" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f131a] border border-[#1f2735] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-xs font-semibold text-white">{userProfile.name}</p>
                <p className="text-[11px] text-[#7e8b9b] truncate">{userProfile.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {userProfile.planName}
                </span>
              </div>

              <button
                onClick={() => {
                  setActiveTab('configuracoes');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#9aa5b5] hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
              >
                <User className="w-3.5 h-3.5" />
                <span>Meu Perfil</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('configuracoes');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#9aa5b5] hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configurações</span>
              </button>

              <div className="my-1 border-t border-white/5" />

              <button
                onClick={() => {
                  showToast('Sessão encerrada com segurança.');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair da conta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
