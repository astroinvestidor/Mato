import React, { useState } from 'react';
import { Calendar, TrendingUp, ShoppingCart, Users, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MetricsSummary: React.FC = () => {
  const { periodFilter, setPeriodFilter } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filterLabels: Record<string, string> = {
    '24h': 'Hoje',
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '90d': 'Este trimestre',
  };

  const metrics = [
    {
      title: 'Vendas hoje',
      value: 'R$ 1.248,90',
      change: '↑ 12%',
      icon: Calendar,
    },
    {
      title: 'Vendas este mês',
      value: 'R$ 12.487,30',
      change: '↑ 28%',
      icon: TrendingUp,
    },
    {
      title: 'Pedidos',
      value: '48',
      change: '↑ 15%',
      icon: ShoppingCart,
    },
    {
      title: 'Clientes',
      value: '243',
      change: '↑ 20%',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Resumo do seu dia</h3>
          <p className="text-xs text-[#7e8b9b]">Acompanhe seus números em tempo real.</p>
        </div>

        {/* Dropdown period selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e131a] hover:bg-[#141b24] border border-[#1e2736] text-xs font-medium text-gray-200 transition-colors"
          >
            <span>{filterLabels[periodFilter] || 'Últimos 7 dias'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7e8b9b]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 rounded-xl bg-[#0f141d] border border-[#20293a] shadow-xl p-1 z-30 animate-in fade-in">
              {Object.entries(filterLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setPeriodFilter(key);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    periodFilter === key
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#0c1016] border border-[#1b2330] p-4.5 flex flex-col justify-between hover:border-[#273448] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#7e8b9b]">{item.title}</span>
                <div className="p-2 rounded-xl bg-[#121822] text-[#8e9cb0] border border-white/5">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                  {item.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#7be801]">
                  <span>{item.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
