import React, { useState } from 'react';
import { Users, Search, Mail, Phone, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';

export const CustomersView: React.FC = () => {
  const { customers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="Base de Clientes" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">Clientes</h2>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Histórico completo de compradores, valor do ciclo de vida (LTV) e canais de contato.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#0c1016] border border-[#1b2330] text-xs">
          <span className="text-[#7e8b9b]">Total Cadastrados: </span>
          <strong className="text-white font-bold">{customers.length}</strong>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121822] border border-[#1e2736] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0c1016] border border-[#1b2330] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111721] text-[#7e8b9b] border-b border-[#1b2330] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Cliente</th>
                <th className="px-5 py-3.5">Contato</th>
                <th className="px-5 py-3.5">Pedidos</th>
                <th className="px-5 py-3.5">Total Gasto (LTV)</th>
                <th className="px-5 py-3.5">Última Compra</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18202c]">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/20">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-300">
                    <div>{c.email}</div>
                    <span className="text-[10px] text-[#7e8b9b]">{c.phone}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white">
                    {c.totalOrders} pedidos
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-400">
                    R$ {c.totalSpent.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-5 py-3.5 text-[#7e8b9b]">{c.lastOrderDate}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
