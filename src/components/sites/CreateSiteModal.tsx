import React, { useState } from 'react';
import { X, Globe, Sparkles, ShoppingBag, Layout, Code, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteType } from '../../types';

export const CreateSiteModal: React.FC = () => {
  const { isCreateSiteModalOpen, setIsCreateSiteModalOpen, addSite, showToast } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<SiteType>('loja_virtual');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('Minimal Dark Commerce');
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  if (!isCreateSiteModalOpen) return null;

  const typeOptions: { id: SiteType; label: string; desc: string; icon: any }[] = [
    {
      id: 'loja_virtual',
      label: 'Loja Virtual',
      desc: 'Catálogo de produtos, carrinho e checkout Pix/Cartão integrado.',
      icon: ShoppingBag,
    },
    {
      id: 'landing_page',
      label: 'Landing Page',
      desc: 'Página única de alta conversão para serviços, mentorias e eventos.',
      icon: Layout,
    },
    {
      id: 'institucional',
      label: 'Site Institucional',
      desc: 'Apresentação corporativa de marcas, empresas e negócios locais.',
      icon: Globe,
    },
    {
      id: 'sistema_web',
      label: 'Sistema Web / SaaS',
      desc: 'Portal de membros, dashboard de clientes e ferramentas online.',
      icon: Code,
    },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Por favor, informe um nome para o site.', 'error');
      return;
    }

    setIsGeneratingWithAI(true);
    setTimeout(() => {
      addSite({
        name,
        type,
        description: description || `Projeto ${name} estruturado automaticamente com MATO IA.`,
        status: 'publicado',
        url: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.mato.site`,
        template,
      });
      setIsGeneratingWithAI(false);
      setIsCreateSiteModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#0d1117] border border-[#21293c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2334] bg-[#111722]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Criar Novo Site no MATO Sites</h3>
          </div>
          <button
            onClick={() => setIsCreateSiteModalOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Nome do Projeto / Empresa *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sneakers Urban, Dra. Amanda Odonto, Nexus Tech..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b26] border border-[#232f42] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Tipo de Aplicação
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {typeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = type === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setType(opt.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500/60 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                        : 'bg-[#141a24] border-[#1e2636] hover:border-[#2d394e]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                    </div>
                    <p className="text-[11px] text-[#7e8b9b] leading-tight">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Prompt para a MATO IA (Geração de Conteúdo e Design)
              </label>
              <span className="text-[10px] text-purple-400 font-medium">Assistido por IA</span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva seu nicho, cores preferidas e objetivos de venda. Ex: Loja de tênis streetwear modernos com foco em público jovem, paleta escura com detalhes neon verde..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b26] border border-[#232f42] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsCreateSiteModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-[#141a24] text-gray-300 hover:text-white font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGeneratingWithAI}
              className="flex-1 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingWithAI ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Gerando com MATO IA...</span>
                </>
              ) : (
                <>
                  <span>Criar e Publicar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
