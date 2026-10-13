import React, { useState } from 'react';
import { TrendingUp, BarChart3, DollarSign, Users, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';
import { revenueDataPoints } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  const { sales, customers, transactions, charges } = useApp();
  const [period, setPeriod] = useState('7d');

  // Exact calculations based on actual platform data
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOrders = sales.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const pixOrdersCount = sales.filter((s) => s.method === 'pix').length;
  const pixShare = totalOrders > 0 ? ((pixOrdersCount / totalOrders) * 100).toFixed(0) : '0';
  const cardShare = totalOrders > 0 ? (100 - Number(pixShare)).toFixed(0) : '0';

  // Checkout Conversion metrics based on real charges/orders
  const totalCompleted = sales.length + charges.filter((c) => c.status === 'pago').length;
  const totalPendingOrAbandoned = charges.filter((c) => c.status === 'pendente' || c.status === 'expirado' || c.status === 'cancelado').length;
  const totalCheckoutStarts = totalCompleted + totalPendingOrAbandoned;

  const completionRate = totalCheckoutStarts > 0 ? ((totalCompleted / totalCheckoutStarts) * 100).toFixed(1) : '0.0';
  const abandonmentRate = totalCheckoutStarts > 0 ? ((totalPendingOrAbandoned / totalCheckoutStarts) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="Analytics & Inteligência" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">Analytics</h2>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Métricas calculadas em tempo real com base no histórico de pedidos e faturamento.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0c1016] border border-[#1b2330] p-1 rounded-xl text-xs">
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition-colors ${
                period === p ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Faturamento Total</span>
          <p className="text-2xl font-black text-white mt-1">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +28% vs período anterior
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Ticket Médio Real</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            R$ {averageTicket.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[11px] text-[#7e8b9b] mt-1 block">
            Calculado a partir de {totalOrders} transações
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Total de Compradores</span>
          <p className="text-2xl font-black text-white mt-1">{customers.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> 100% taxa de retenção
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Mix de Pagamentos</span>
          <p className="text-2xl font-black text-white mt-1">{pixShare}% Pix</p>
          <span className="text-[11px] text-purple-400 font-semibold mt-1 block">
            {cardShare}% Cartão de Crédito
          </span>
        </div>
      </div>

      {/* Visual Chart Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0c1016] border border-[#1b2330] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Desempenho Diário por Dia da Semana</h4>
            <span className="text-[11px] text-[#7e8b9b]">Volume em Reais (R$)</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {revenueDataPoints.map((pt, i) => {
              const heightPercent = (pt.value / 3000) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    R$ {pt.value}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-emerald-600/20 to-emerald-500/80 group-hover:from-emerald-500 group-hover:to-emerald-400 transition-all shadow-[0_0_12px_rgba(123, 232, 1,0.2)]"
                  />
                  <span className="text-[10px] text-[#7e8b9b] font-medium">{pt.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0c1016] border border-[#1b2330] space-y-4 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-white">Conversão de Checkout</h4>
          
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Inícios de Checkout (Pix/Cartão):</span>
                <span className="font-bold text-white">{totalCheckoutStarts}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div 
                  style={{ width: `${totalCheckoutStarts > 0 ? 100 : 0}%` }} 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Pagamentos Concluídos:</span>
                <span className="font-bold text-emerald-400">
                  {totalCompleted} ({completionRate}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div 
                  style={{ width: `${completionRate}%` }} 
                  className="h-full bg-[#7be801] rounded-full transition-all duration-300" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Taxa de Abandono:</span>
                <span className="font-bold text-amber-400">
                  {totalPendingOrAbandoned} ({abandonmentRate}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div 
                  style={{ width: `${abandonmentRate}%` }} 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300" 
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            A recuperação automática de Pix pendente aumenta a conversão média em até 18%.
          </div>
        </div>
      </div>
    </div>
  );
};
