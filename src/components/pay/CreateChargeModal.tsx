import React, { useState } from 'react';
import { X, QrCode, CreditCard, FileText, ArrowRight, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

export const CreateChargeModal: React.FC = () => {
  const { isCreateChargeModalOpen, setIsCreateChargeModalOpen, addCharge, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [createdChargeCode, setCreatedChargeCode] = useState<string | null>(null);

  if (!isCreateChargeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !customerName.trim()) {
      showToast('Por favor, informe um valor válido e o nome do pagador.', 'error');
      return;
    }

    const calculatedFee = method === 'pix' ? amount * 0.0099 : method === 'cartao' ? amount * 0.0349 : 3.50;
    const net = amount - calculatedFee;

    const charge = addCharge({
      title: title || 'Cobrança Avulsa MATO Pay',
      customerName,
      customerEmail,
      customerPhone,
      amount: Number(amount),
      fee: Number(calculatedFee.toFixed(2)),
      netAmount: Number(net.toFixed(2)),
      method,
      expiresAt: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR'),
    });

    setCreatedChargeCode(charge.code);
  };

  const handleClose = () => {
    setIsCreateChargeModalOpen(false);
    setCreatedChargeCode(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d1218] border border-[#202b3c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2535] bg-[#111721]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {createdChargeCode ? 'Cobrança Gerada' : 'Nova Cobrança MATO Pay'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Result */}
        {createdChargeCode ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs text-[#7e8b9b] block">Identificador</span>
              <p className="text-lg font-black text-white">{createdChargeCode}</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                R$ {Number(amount).toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* QR Code visual */}
            <div className="w-40 h-40 mx-auto p-2 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MATO-${createdChargeCode}`}
                alt="QR Code da cobrança"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="rounded-xl bg-[#131b26] p-3 text-xs text-left text-gray-300 space-y-1 border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-400">Pagador:</span>
                <span className="font-semibold text-white">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Meio:</span>
                <span className="uppercase text-emerald-400 font-bold">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-amber-400 font-medium">Aguardando Pagamento</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-sm transition-all"
            >
              Concluir e Voltar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Descrição ou Título da Cobrança
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Consultoria, Kit Especial, Mensalidade..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Forma de Recebimento
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="pix">Pix (Instantâneo)</option>
                  <option value="cartao">Cartão de Crédito</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-1 border-t border-white/5">
              <span className="text-xs font-bold text-[#7e8b9b] block">Dados do Pagador</span>
              
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Nome do Pagador *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl bg-[#141b25] text-gray-300 hover:text-white font-medium text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(123, 232, 1,0.3)]"
              >
                Gerar Cobrança
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
