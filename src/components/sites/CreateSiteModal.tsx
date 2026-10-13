import React, { useState } from 'react';
import { X, Globe, Sparkles, ShoppingBag, Layout, Code, ArrowRight, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteType } from '../../types';
import { getPlanLimits, generateSiteHtmlWithAI } from '../../services/aiService';

export const CreateSiteModal: React.FC = () => {
  const {
    isCreateSiteModalOpen,
    setIsCreateSiteModalOpen,
    addSite,
    sites,
    userProfile,
    consumeAICredits,
    setActiveTab,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<SiteType>('loja_virtual');
  const [description, setDescription] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  if (!isCreateSiteModalOpen) return null;

  const limits = getPlanLimits(userProfile?.planName);
  const sitesRemaining = Math.max(0, limits.maxSites - sites.length);
  const isAtSiteLimit = sites.length >= limits.maxSites;

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
      desc: 'Página única de alta conversão para infoprodutos, mentorias e eventos.',
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Por favor, informe um nome para o site.', 'error');
      return;
    }

    // 1. Check plan site limit
    if (isAtSiteLimit) {
      showToast(
        `Limite de ${limits.maxSites} sites atingido no plano ${limits.planName}. Faça upgrade para criar mais sites!`,
        'warning'
      );
      setIsCreateSiteModalOpen(false);
      setActiveTab('configuracoes');
      return;
    }

    // 2. Check & consume AI credits for site generation
    if (!consumeAICredits(limits.siteGenerationCost)) {
      setIsCreateSiteModalOpen(false);
      return;
    }

    setIsGeneratingWithAI(true);
    try {
      const promptText =
        description.trim() ||
        `Crie um site completo e persuasivo para ${name} com foco em conversão e pagamento via Pix.`;

      const { html, blueprint } = await generateSiteHtmlWithAI({
        name: name.trim(),
        type,
        prompt: promptText,
      });

      const finalUrl =
        limits.allowCustomDomain && customDomain.trim()
          ? `https://${customDomain.trim().replace(/^https?:\/\//, '')}`
          : `https://${blueprint.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.mato.site`;

      addSite({
        name: blueprint.brandName,
        type,
        description: promptText,
        status: 'publicado',
        url: finalUrl,
        template: 'Multi-Model Studio IA',
        blueprint,
        generatedHtml: html,
      });

      setName('');
      setDescription('');
      setCustomDomain('');
      setIsCreateSiteModalOpen(false);
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#0d1117] border border-[#21293c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2334] bg-[#111722]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#7be801]/10 text-[#7be801] border border-[#7be801]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gerar Site com MATO IA</h3>
              <p className="text-[11px] text-[#7e8b9b]">
                Plano {limits.planName} • Custo: {limits.siteGenerationCost} créditos de IA
              </p>
            </div>
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
          {isAtSiteLimit && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span>
                Você atingiu o limite de <strong>{limits.maxSites} sites</strong> do plano{' '}
                <strong>{limits.planName}</strong>.
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCreateSiteModalOpen(false);
                  setActiveTab('configuracoes');
                }}
                className="px-2.5 py-1 rounded-lg bg-[#7be801] text-black font-bold text-[11px]"
              >
                Fazer Upgrade
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Nome do Projeto / Produto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Método Turbo Pix, Loja Urban..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b26] border border-[#232f42] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7be801]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Domínio Personalizado{' '}
                {!limits.allowCustomDomain && (
                  <span className="text-[10px] text-amber-400 font-normal">(Pro / Business)</span>
                )}
              </label>
              <input
                type="text"
                disabled={!limits.allowCustomDomain}
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder={
                  limits.allowCustomDomain
                    ? 'Ex: minhaloja.com.br'
                    : 'Disponível no MATO Pro+'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b26] border border-[#232f42] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7be801] disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Tipo de Estrutura
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
                        ? 'bg-[#7be801]/10 border-[#7be801]/60 shadow-[0_0_15px_rgba(123,232,1,0.12)]'
                        : 'bg-[#141a24] border-[#1e2636] hover:border-[#2d394e]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#7be801]' : 'text-gray-400'}`} />
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
                <Sparkles className="w-3.5 h-3.5 text-[#7be801]" />
                Descreva como você quer o site (Cores, Preço, Oferta)
              </label>
              <span className="text-[10px] text-[#7be801] font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> {limits.siteGenerationCost} créditos
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Crie uma página de vendas para meu curso de Finanças por R$ 97,00 com cor verde neon, garantia de 7 dias e botão de Pix..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b26] border border-[#232f42] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7be801]"
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
              className="flex-1 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-black text-xs transition-all shadow-[0_0_15px_rgba(123,232,1,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingWithAI ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Construindo Site com IA...</span>
                </>
              ) : (
                <>
                  <span>Gerar Site Agora</span>
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
