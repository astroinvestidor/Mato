import React from 'react';
import { Share2, Users, DollarSign, Copy, CheckCircle2, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';

export const AffiliatesView: React.FC = () => {
  const { affiliates, showToast } = useApp();

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('https://mato.digital/r/mateus-silva');
    showToast('Link de convite do programa de afiliados copiado!');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="Programa de Afiliados" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">Afiliados & Indicações</h2>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Escale suas vendas com parceiros e influenciadores recebendo comissões automáticas no Pix.
          </p>
        </div>

        <button
          onClick={handleCopyReferral}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141b26] hover:bg-[#1a2332] text-white text-xs font-semibold border border-[#222e40] transition-colors"
        >
          <Copy className="w-4 h-4 text-emerald-400" />
          <span>Copiar Link de Convite</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Afiliados Cadastrados</span>
          <p className="text-2xl font-black text-white mt-1">{affiliates.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            +3 novos esta semana
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Vendas por Indicação</span>
          <p className="text-2xl font-black text-white mt-1">57 vendas</p>
          <span className="text-[11px] text-[#7e8b9b] mt-1 inline-block">
            Taxa média de comissão: 15%
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <span className="text-xs font-medium text-[#7e8b9b]">Comissões Pagas</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">R$ 2.915,00</p>
          <span className="text-[11px] text-[#7e8b9b] mt-1 inline-block">
            Liquidado via Pix sem burocracia
          </span>
        </div>
      </div>

      {/* Affiliates List */}
      <div className="rounded-2xl bg-[#0c1016] border border-[#1b2330] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111721] text-[#7e8b9b] border-b border-[#1b2330] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Afiliado</th>
                <th className="px-5 py-3.5">Cupom / Código</th>
                <th className="px-5 py-3.5">Cliques / Leads</th>
                <th className="px-5 py-3.5">Vendas Geradas</th>
                <th className="px-5 py-3.5">Comissão Acumulada</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18202c]">
              {affiliates.map((aff) => (
                <tr key={aff.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-white">{aff.name}</p>
                    <span className="text-[10px] text-[#7e8b9b]">{aff.email}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                    {aff.code}
                  </td>
                  <td className="px-5 py-3.5 text-white font-medium">
                    {aff.referralsCount}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white">
                    {aff.salesCount}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-400">
                    R$ {aff.commissionEarned.toFixed(2).replace('.', ',')}
                  </td>
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
