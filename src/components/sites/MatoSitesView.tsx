import React, { useState } from 'react';
import {
  Globe,
  Eye,
  Sparkles,
  ShoppingBag,
  Layout,
  Code,
  Zap,
  ArrowUp,
  Trash2,
  Rocket,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteProject, SiteType } from '../../types';
import { DemoBanner } from '../common/DemoBanner';
import { CreateSiteModal } from './CreateSiteModal';
import { SitePreviewModal } from './SitePreviewModal';
import {
  getPlanLimits,
  extractBrandNameFromText,
  generateSiteHtmlWithAI,
} from '../../services/aiService';

export const MatoSitesView: React.FC = () => {
  const {
    sites,
    addSite,
    updateSite,
    deleteSite,
    userProfile,
    consumeAICredits,
    showToast,
  } = useApp();

  const [selectedPreviewSiteId, setSelectedPreviewSiteId] = useState<string | null>(null);
  const [heroPrompt, setHeroPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<SiteType>('landing_page');
  const [isBuilding, setIsBuilding] = useState(false);

  const limits = getPlanLimits(userProfile?.planName);
  const selectedPreviewSite = sites.find((s) => s.id === selectedPreviewSiteId) || null;


  const handleInstantBuild = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!heroPrompt.trim() || isBuilding) return;

    consumeAICredits(limits.siteGenerationCost);

    setIsBuilding(true);
    try {
      const promptText = heroPrompt.trim();
      const detectedBrand = extractBrandNameFromText(promptText);
      const initialName = detectedBrand || 'Studio Prime';
      const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const { html, blueprint, assistantReply } = await generateSiteHtmlWithAI({
        name: initialName,
        type: selectedType,
        prompt: promptText,
      });

      const visualStyleLabel =
        blueprint.visualTheme === 'futuristic'
          ? 'Futurístico Cyber / Neon'
          : blueprint.visualTheme === 'minimalist'
          ? 'Claro e minimalista'
          : blueprint.visualTheme === 'luxury'
          ? 'Luxo & Dourado (High-Ticket)'
          : blueprint.bgMode === 'light'
          ? 'Claro e minimalista'
          : 'Escuro e moderno (Dark)';

      const created = addSite({
        name: blueprint.brandName,
        type: selectedType,
        description: promptText,
        status: 'publicado',
        url: `https://${blueprint.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.mato.site`,
        template: 'Multi-Model Studio IA',
        visualStyle: visualStyleLabel,
        blueprint,
        generatedHtml: html,
        discoveryConfig: {
          brandName: blueprint.brandName,
          whatToSell: blueprint.niche,
          visualStyle: visualStyleLabel,
          layoutStructure: 'Split Editorial (Lado a lado)',
          selectedSections: [
            'Hero de Alto Impacto',
            'Destaques & Diferenciais',
            'Vitrine / Conteúdo Principal',
            'Depoimentos de Clientes',
            'Perguntas Frequentes (FAQ)',
            'Oferta / Checkout / Agendamento',
          ],
          priceOrOffer: blueprint.priceText,
        },
        chatHistory: [
          {
            id: `u-${Date.now()}`,
            role: 'user',
            text: promptText,
            timestamp: now,
          },
          {
            id: `b-${Date.now() + 1}`,
            role: 'assistant',
            thoughtSeconds: 2,
            activeModelBadge: 'Claude 3.7 + GPT-4o + Gemini 2.5 Flash',
            text: assistantReply,
            awaitingDiscovery: false,
            discoveryData: {
              brandName: blueprint.brandName,
              whatToSell: blueprint.niche,
              visualStyle: visualStyleLabel,
              layoutStructure: 'Split Editorial (Lado a lado)',
              selectedSections: [
                'Hero de Alto Impacto',
                'Destaques & Diferenciais',
                'Vitrine / Conteúdo Principal',
                'Depoimentos de Clientes',
                'Perguntas Frequentes (FAQ)',
                'Oferta / Checkout / Agendamento',
              ],
              priceOrOffer: blueprint.priceText,
            },
            milestoneTitle: `Gerou o site completo ${blueprint.brandName}`,
            timestamp: now,
          },
        ],
      });

      setHeroPrompt('');
      setSelectedPreviewSiteId(created.id);
    } finally {
      setIsBuilding(false);
    }
  };

  const getTypeIcon = (type: SiteProject['type']) => {
    switch (type) {
      case 'loja_virtual':
        return <ShoppingBag className="w-4 h-4 text-purple-400" />;
      case 'landing_page':
        return <Layout className="w-4 h-4 text-[#7be801]" />;
      case 'institucional':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'sistema_web':
        return <Code className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="MATO Sites" />

      {/* Top Plan & Credits Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">MATO Sites</h2>
            <p className="text-xs text-[#7e8b9b]">
              Cole qualquer prompt de IA ou converse para gerar e personalizar seu site na hora.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-[#0c1016] border border-[#1b2330] text-xs flex items-center gap-3">
          <div>
            <span className="text-[10px] text-[#7e8b9b] uppercase font-bold block">
              Projetos ({limits.planName})
            </span>
            <span className="font-bold text-white">
              {sites.length} / {limits.maxSites > 500 ? 'Ilimitados' : `${limits.maxSites} sites`}
            </span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#7be801]" />
            <div>
              <span className="text-[10px] text-[#7e8b9b] uppercase font-bold block">Créditos IA</span>
              <span className="font-bold text-white">Ilimitados</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTRAL CONVERSATIONAL PROMPT BUILDER */}
      <div className="relative rounded-3xl bg-[#111318] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>MATO Sites • Construtor Interativo & Leitor de Prompts</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            O que vamos criar e publicar hoje?
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Cole um prompt completo (feito em qualquer IA) ou descreva seu site (ex: <em>"quero que deixe o site futurístico"</em>, <em>"quero que deixe o site minimalista"</em>). O site já nasce pronto com exemplos reais!
          </p>

          {/* Main Prompt Box */}
          <form
            onSubmit={handleInstantBuild}
            className="mt-4 rounded-2xl bg-[#18191E] border border-white/15 focus-within:border-purple-500/60 p-4 shadow-2xl transition-all text-left"
          >
            <textarea
              rows={4}
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleInstantBuild();
                }
              }}
              placeholder="Cole aqui seu prompt completo de criação de site ou escreva como você quer (ex: Crie um site futurístico para minha marca...)"
              className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 mt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'landing_page', label: 'Página de Vendas' },
                  { id: 'loja_virtual', label: 'Loja Virtual' },
                  { id: 'institucional', label: 'Site Institucional' },
                  { id: 'sistema_web', label: 'SaaS / Área de Membros' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(t.id as SiteType)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                      selectedType === t.id
                        ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                        : 'bg-white/5 text-gray-300 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  <strong className="text-purple-400">{limits.siteGenerationCost} créditos</strong>
                </span>
                <button
                  type="submit"
                  disabled={isBuilding || !heroPrompt.trim()}
                  className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-40 cursor-pointer"
                >
                  {isBuilding ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
                      <span>Iniciando IA...</span>
                    </>
                  ) : (
                    <>
                      <span>Construir</span>
                      <ArrowUp className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* My Created Sites Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">
            Minhas Criações ({sites.length})
          </h3>
        </div>

        {sites.length === 0 ? (
          <div className="rounded-2xl bg-[#111318] border border-white/10 p-8 text-center text-xs text-gray-400">
            Você ainda não possui nenhum site criado. Digite <strong className="text-white">"crie uma página de venda"</strong> acima e clique em{' '}
            <strong className="text-purple-400">Construir</strong> para iniciar a conversa com a IA!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sites.map((site) => (
              <div
                key={site.id}
                className="group rounded-2xl bg-[#111318] border border-white/10 hover:border-[#7be801]/40 p-5 flex flex-col justify-between transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top tag, status & Delete button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        {getTypeIcon(site.type)}
                      </div>
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                        {site.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Publicado
                      </span>

                      <button
                        type="button"
                        onClick={() => deleteSite(site.id)}
                        title="Excluir criação"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#7be801] transition-colors">
                      {site.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {site.description}
                    </p>
                  </div>

                  {/* Live URL preview */}
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px] flex items-center justify-between">
                    <span className="text-gray-400 truncate">{site.url}</span>
                    <span className="text-[#7be801] font-bold ml-2 flex-shrink-0">Online</span>
                  </div>
                </div>

                {/* Actions: Excluir | Abrir Studio | Publicar o site */}
                <div className="pt-4 mt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSite(site.id)}
                    className="px-2.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1 transition"
                    title="Excluir projeto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPreviewSiteId(site.id)}
                    className="flex-1 justify-center px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Editar com IA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateSite(site.id, { status: 'publicado' });
                      setSelectedPreviewSiteId(site.id);
                      showToast(`Site "${site.name}" publicado em ${site.url}!`);
                    }}
                    className="flex-1 justify-center px-3 py-2 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black text-xs font-black flex items-center gap-1.5 transition"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Publicar o site</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateSiteModal />
      <SitePreviewModal
        site={selectedPreviewSite}
        onClose={() => setSelectedPreviewSiteId(null)}
      />
    </div>
  );
};
