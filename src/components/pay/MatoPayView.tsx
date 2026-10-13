import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  QrCode,
  CreditCard,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  XCircle,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Charge, PaymentStatus } from '../../types';
import { DemoBanner } from '../common/DemoBanner';
import { CreateChargeModal } from './CreateChargeModal';
import { ChargeDetailsModal } from './ChargeDetailsModal';

export const MatoPayView: React.FC = () => {
  const {
    charges,
    cancelCharge,
    deleteCharge,
    setIsCreateChargeModalOpen,
    setIsCreateLinkModalOpen,
  } = useApp();
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredCharges = charges.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCharges = charges.filter((c) => c.status !== 'cancelado');

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'pago':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3" /> Pago
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <Clock className="w-3 h-3" /> Pendente
          </span>
        );
      case 'expirado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/25">
            <Clock className="w-3 h-3" /> Expirado
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
            <AlertTriangle className="w-3 h-3" /> Cancelado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Sandbox Notice */}
      <DemoBanner moduleName="MATO Pay" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">MATO Pay</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Checkout & Pix
            </span>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Crie cobranças instantâneas, gere QR Code Pix e acompanhe liquidações com segurança.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateLinkModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#141b26] hover:bg-[#1a2332] text-gray-200 text-xs font-semibold border border-[#222e40] transition-colors"
          >
            Criar Link de Pagamento
          </button>
          <button
            onClick={() => setIsCreateChargeModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(123, 232, 1,0.3)] active:scale-95"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Nova Cobrança</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Pay */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Volume Total Emitido</span>
          <p className="text-2xl font-black text-white mt-1">
            R${' '}
            {activeCharges
              .reduce((acc, c) => acc + c.amount, 0)
              .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            {activeCharges.length} cobranças geradas
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Taxa Média Pix</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">0,99%</p>
          <span className="text-[11px] text-[#7e8b9b] mt-1 inline-block">
            Sem custo de manutenção mensal
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Cobranças Ativas</span>
          <p className="text-2xl font-black text-white mt-1">{activeCharges.length}</p>
          <span className="text-[11px] text-amber-400 font-semibold mt-1 inline-block">
            {charges.filter((c) => c.status === 'pendente').length} aguardando liquidação
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por pagador, ID ou título..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121822] border border-[#1e2736] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['todos', 'pendente', 'pago', 'expirado', 'cancelado'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white bg-[#121822] border border-transparent'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Charges Table */}
      <div className="rounded-2xl bg-[#0c1016] border border-[#1b2330] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111721] text-[#7e8b9b] border-b border-[#1b2330] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Código / Título</th>
                <th className="px-5 py-3.5">Pagador</th>
                <th className="px-5 py-3.5">Método</th>
                <th className="px-5 py-3.5">Valor Bruto</th>
                <th className="px-5 py-3.5">Líquido</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18202c]">
              {filteredCharges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Nenhuma cobrança encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredCharges.map((charge) => (
                  <tr
                    key={charge.id}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedCharge(charge)}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-white">{charge.title}</p>
                      <span className="text-[10px] text-[#7e8b9b] font-mono">{charge.code}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-200">{charge.customerName}</p>
                      <span className="text-[10px] text-[#7e8b9b]">{charge.customerEmail}</span>
                    </td>
                    <td className="px-5 py-3.5 uppercase font-bold text-gray-300">
                      <div className="flex items-center gap-1.5">
                        {charge.method === 'pix' ? (
                          <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                        ) : charge.method === 'cartao' ? (
                          <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>{charge.method}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">
                      R$ {charge.amount.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-400">
                      R$ {charge.netAmount.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(charge.status)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {charge.status === 'pendente' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelCharge(charge.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-[11px] font-bold transition-colors"
                            title="Cancelar cobrança"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancelar</span>
                          </button>
                        )}
                        {(charge.status === 'cancelado' || charge.status === 'expirado') && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCharge(charge.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-semibold transition-colors"
                            title="Excluir cobrança"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCharge(charge);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charge Detail Modal */}
      <ChargeDetailsModal
        charge={selectedCharge}
        onClose={() => setSelectedCharge(null)}
      />
      <CreateChargeModal />
    </div>
  );
};
