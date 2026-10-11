import React from 'react';
import { X, QrCode, CreditCard, FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Copy } from 'lucide-react';
import { Charge } from '../../types';
import { useApp } from '../../context/AppContext';

interface ChargeDetailsModalProps {
  charge: Charge | null;
  onClose: () => void;
}

export const ChargeDetailsModal: React.FC<ChargeDetailsModalProps> = ({ charge, onClose }) => {
  const { showToast } = useApp();
  if (!charge) return null;

  const handleCopyPix = () => {
    if (charge.copyPastePix) {
      navigator.clipboard?.writeText(charge.copyPastePix);
      showToast('Código Pix copia-e-cola copiado!');
    }
  };

  const getStatusBadge = (status: Charge['status']) => {
    switch (status) {
      case 'pago':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pago
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Aguardando Pagamento
          </span>
        );
      case 'expirado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
            <Clock className="w-3.5 h-3.5" /> Expirado
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Cancelado
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d1218] border border-[#202b3c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2535] bg-[#111721]">
          <div>
            <span className="text-[11px] text-[#7e8b9b] font-mono">{charge.code}</span>
            <h3 className="text-base font-bold text-white">{charge.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#131b26] border border-white/5">
            <div>
              <span className="text-xs text-[#7e8b9b] block">Valor Cobrado</span>
              <p className="text-2xl font-black text-white">
                R$ {charge.amount.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div>{getStatusBadge(charge.status)}</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-gray-400 uppercase text-[10px] tracking-wider block">
              Detalhamento Financeiro
            </span>
            <div className="rounded-xl bg-[#111722] p-3 space-y-2 border border-white/5">
              <div className="flex justify-between text-gray-300">
                <span>Valor bruto:</span>
                <span>R$ {charge.amount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Taxa da plataforma ({charge.method.toUpperCase()}):</span>
                <span className="text-red-400">- R$ {charge.fee.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between font-bold text-white">
                <span>Valor líquido a receber:</span>
                <span className="text-emerald-400">R$ {charge.netAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-gray-400 uppercase text-[10px] tracking-wider block">
              Dados do Pagador
            </span>
            <div className="rounded-xl bg-[#111722] p-3 space-y-1.5 border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-400">Nome:</span>
                <span className="text-white font-medium">{charge.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">E-mail:</span>
                <span className="text-white font-medium">{charge.customerEmail}</span>
              </div>
              {charge.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Telefone:</span>
                  <span className="text-white font-medium">{charge.customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Data de emissão:</span>
                <span className="text-gray-300">{charge.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expira em:</span>
                <span className="text-gray-300">{charge.expiresAt}</span>
              </div>
            </div>
          </div>

          {/* Pix string copy if applicable */}
          {charge.method === 'pix' && charge.status === 'pendente' && (
            <div className="space-y-2">
              <button
                onClick={handleCopyPix}
                className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copiar Código Pix Copia e Cola
              </button>
            </div>
          )}

          {/* Security policy notice */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2 text-[11px] text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Em produção, pagamentos só são confirmados via Webhook assinado por HMAC-SHA256 emitido pelo provedor de pagamentos.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#111721] border-t border-[#1b2535] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
