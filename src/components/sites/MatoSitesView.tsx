import React, { useState } from 'react';
import {
  Globe,
  Plus,
  ExternalLink,
  Eye,
  Sparkles,
  ShoppingBag,
  Layout,
  Code,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteProject } from '../../types';
import { DemoBanner } from '../common/DemoBanner';
import { CreateSiteModal } from './CreateSiteModal';
import { SitePreviewModal } from './SitePreviewModal';

export const MatoSitesView: React.FC = () => {
  const { sites, setIsCreateSiteModalOpen } = useApp();
  const [selectedPreviewSite, setSelectedPreviewSite] = useState<SiteProject | null>(null);

  const getTypeIcon = (type: SiteProject['type']) => {
    switch (type) {
      case 'loja_virtual':
        return <ShoppingBag className="w-4 h-4 text-purple-400" />;
      case 'landing_page':
        return <Layout className="w-4 h-4 text-emerald-400" />;
      case 'institucional':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'sistema_web':
        return <Code className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="MATO Sites" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">MATO Sites</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Gerador com IA
            </span>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Crie sites profissionais, landing pages e e-commerces com IA e checkout integrado.
          </p>
        </div>

        <button
          onClick={() => setIsCreateSiteModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Site</span>
        </button>
      </div>

      {/* Site Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sites.map((site) => (
          <div
            key={site.id}
            className="group rounded-2xl bg-[#0c1017] border border-[#1b2332] hover:border-purple-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.1)]"
          >
            <div className="space-y-4">
              {/* Top tag & status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#141b26] border border-white/5">
                    {getTypeIcon(site.type)}
                  </div>
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                    {site.type.replace('_', ' ')}
                  </span>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                    site.status === 'publicado'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                  }`}
                >
                  {site.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {site.name}
                </h3>
                <p className="text-xs text-[#7e8b9b] mt-1 line-clamp-2 leading-relaxed">
                  {site.description}
                </p>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#121722] border border-white/5 text-[11px]">
                <div>
                  <span className="text-[#64748b] block">Visitas</span>
                  <span className="font-bold text-white">{site.views.toLocaleString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block">Conversões</span>
                  <span className="font-bold text-emerald-400">{site.conversions}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-[#64748b]">Atualizado: {site.updatedAt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPreviewSite(site)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visualizar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateSiteModal />
      <SitePreviewModal
        site={selectedPreviewSite}
        onClose={() => setSelectedPreviewSite(null)}
      />
    </div>
  );
};
