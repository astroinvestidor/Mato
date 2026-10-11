import React, { useState } from 'react';
import { ShoppingCart, Search, QrCode, CreditCard, CheckCircle2, Eye, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';
import { Sale } from '../../types';

export const SalesView: React.FC = () => {
  const { sales } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter(
    (s) =>
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.itemsSummary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="Vendas & Pedidos" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">Vendas</h2>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Gestão consolidada de pedidos realizados através de lojas, links e cobranças MATO Pay.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#0c1016] border border-[#1b2330] text-gray-300">
            Total de Pedidos: <strong className="text-white">48</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#0c1016] border border-[#1b2330] text-emerald-400 font-bold">
            R$ 12.487,30 faturados
          </div>
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
            placeholder="Buscar pedido por número, cliente ou item..."
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
                <th className="px-5 py-3.5">Pedido</th>
                <th className="px-5 py-3.5">Cliente</th>
                <th className="px-5 py-3.5">Itens</th>
                <th className="px-5 py-3.5">Forma</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Data</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18202c]">
              {filteredSales.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedSale(s)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-bold text-white font-mono">{s.code}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-200">{s.customerName}</p>
                    <span className="text-[10px] text-[#7e8b9b]">{s.customerEmail}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-300 max-w-xs truncate">{s.itemsSummary}</td>
                  <td className="px-5 py-3.5 uppercase font-bold text-gray-300">
                    <div className="flex items-center gap-1.5">
                      {s.method === 'pix' ? (
                        <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span>{s.method}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-extrabold text-emerald-400">
                    R$ {s.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-5 py-3.5 text-[#7e8b9b]">{s.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      <CheckCircle2 className="w-3 h-3" /> Aprovado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1218] border border-[#202b3c] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-base font-bold text-white">Detalhes do Pedido {selectedSale.code}</span>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Cliente:</span>
                <span className="font-semibold text-white">{selectedSale.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Itens:</span>
                <span className="text-white">{selectedSale.itemsSummary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valor Pago:</span>
                <span className="text-emerald-400 font-bold">R$ {selectedSale.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data e Hora:</span>
                <span>{selectedSale.date}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedSale(null)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs mt-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
