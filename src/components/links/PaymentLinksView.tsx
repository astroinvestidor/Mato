import React, { useState } from 'react';
import { Link2, Plus, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';
import { CreateLinkModal } from './CreateLinkModal';

export const PaymentLinksView: React.FC = () => {
  const { paymentLinks, setIsCreateLinkModalOpen, showToast } = useApp();

  const handleCopyLink = (slug: string) => {
    const url = `https://pay.mato.digital/p/${slug}`;
    navigator.clipboard?.writeText(url);
    showToast(`Link de pagamento copiado: ${url}`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="Links de Pagamento" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Link2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">Links de Pagamento</h2>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Venda em qualquer lugar: WhatsApp, redes sociais, bios e e-mails com checkouts rápidos.
          </p>
        </div>

        <button
          onClick={() => setIsCreateLinkModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(123, 232, 1,0.3)] active:scale-95"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Criar Novo Link</span>
        </button>
      </div>

      {/* Grid of payment links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {paymentLinks.map((link) => (
          <div
            key={link.id}
            className="rounded-2xl bg-[#0c1016] border border-[#1b2330] p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  Ativo
                </span>
                <span className="text-[10px] text-[#7e8b9b]">{link.createdAt}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{link.title}</h4>
                <p className="text-lg font-black text-emerald-400 mt-1">
                  R$ {link.price.toFixed(2).replace('.', ',')}
                </p>
                <span className="text-[11px] text-[#7e8b9b] font-mono mt-0.5 block truncate">
                  /p/{link.slug}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#121822] text-center text-[10px]">
                <div>
                  <span className="text-[#64748b] block">Cliques</span>
                  <strong className="text-white text-xs">{link.clicks}</strong>
                </div>
                <div>
                  <span className="text-[#64748b] block">Vendas</span>
                  <strong className="text-emerald-400 text-xs">{link.salesCount}</strong>
                </div>
                <div>
                  <span className="text-[#64748b] block">Receita</span>
                  <strong className="text-white text-xs">R$ {link.totalRevenue}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-white/5 flex gap-2">
              <button
                onClick={() => handleCopyLink(link.slug)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Link</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateLinkModal />
    </div>
  );
};
