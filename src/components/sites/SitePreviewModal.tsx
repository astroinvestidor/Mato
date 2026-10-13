import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Globe,
  Smartphone,
  Monitor,
  Download,
  Sparkles,
  Code2,
  Eye,
  Trash2,
  ExternalLink,
  Check,
  ChevronDown,
  Bookmark,
  Plus,
  Mic,
  ArrowUp,
  Type,
  Pencil,
  MessageCircle,
  Copy,
  Rocket,
  Layers,
  Cpu,
  CreditCard,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import {
  SiteProject,
  SiteChatMessage,
  SiteDiscoveryConfig,
  SitePaymentGatewayConfig,
} from '../../types';
import { useApp } from '../../context/AppContext';
import {
  getPlanLimits,
  generateSiteHtmlWithAI,
  extractBrandNameFromText,
  renderBlueprintToHtml,
  buildDefaultBlueprint,
  generateSmartImageForSubject,
} from '../../services/aiService';

interface SitePreviewModalProps {
  site: SiteProject | null;
  onClose: () => void;
}

const WHAT_TO_SELL_OPTIONS = [
  'Curso ou infoproduto',
  'Loja / E-commerce físico',
  'Mentoria ou consultoria',
  'Clínica / Estética / Saúde',
  'Restaurante / Delivery',
  'Software / SaaS / App',
  'Barbearia / Estúdio / Salão',
  'Agência / Serviços B2B',
];

const VISUAL_STYLE_OPTIONS = [
  'Futurístico Cyber / Neon',
  'Claro e minimalista',
  'Escuro e moderno (Dark)',
  'Luxo & Dourado (High-Ticket)',
  'Corporativo & Clean (Azul/Branco)',
  'Vibrante & Criativo',
];

const LAYOUT_STRUCTURE_OPTIONS = [
  'Split Editorial (Lado a lado)',
  'Impacto Centralizado (Hero amplo + Vitrine)',
];

const SECTION_OPTIONS = [
  'Hero de Alto Impacto',
  'Destaques & Diferenciais',
  'Vitrine / Conteúdo Principal',
  'Depoimentos de Clientes',
  'Perguntas Frequentes (FAQ)',
  'Oferta / Checkout / Agendamento',
];

const GATEWAY_PROVIDERS: {
  id: SitePaymentGatewayConfig['provider'];
  name: string;
  desc: string;
}[] = [
  { id: 'mato_pay', name: 'MATO Pay (Automático na Conta)', desc: 'Cai direto no seu saldo MATO Pay • PIX & Cartão' },
  { id: 'mercado_pago', name: 'Mercado Pago', desc: 'Checkout Transparente • PIX & Cartão' },
  { id: 'stripe', name: 'Stripe', desc: 'Cartão Global & Checkout' },
  { id: 'asaas', name: 'Asaas', desc: 'PIX Instantâneo & Cartão' },
  { id: 'pagbank', name: 'PagBank / PagSeguro', desc: 'PIX & Cartão Parcelado' },
  { id: 'kiwify', name: 'Kiwify / Hotmart', desc: 'Infoprodutos & Cursos' },
];

export const SitePreviewModal: React.FC<SitePreviewModalProps> = ({ site, onClose }) => {
  const { userProfile, consumeAICredits, updateSite, deleteSite, receiveSitePayment, showToast } = useApp();
  const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [isUpdatingWithAI, setIsUpdatingWithAI] = useState(false);
  const [activeOrchestratorStep, setActiveOrchestratorStep] = useState<string>('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isEditingOptions, setIsEditingOptions] = useState(false);
  const [isPhotoNameModalOpen, setIsPhotoNameModalOpen] = useState(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [iframeRenderKey, setIframeRenderKey] = useState(0);

  // Interactive Discovery form states
  const [brandName, setBrandName] = useState('');
  const [selectedWhatToSell, setSelectedWhatToSell] = useState('Loja / E-commerce físico');
  const [customWhatToSell, setCustomWhatToSell] = useState('');
  const [selectedVisualStyle, setSelectedVisualStyle] = useState('Escuro e moderno (Dark)');
  const [selectedLayout, setSelectedLayout] = useState('Split Editorial (Lado a lado)');
  const [selectedSections, setSelectedSections] = useState<string[]>(SECTION_OPTIONS);
  const [priceOrOffer, setPriceOrOffer] = useState('');

  // Quick Photo & Name Editor states
  const [quickBrandInput, setQuickBrandInput] = useState('');
  const [quickTitleInput, setQuickTitleInput] = useState('');
  const [quickPriceInput, setQuickPriceInput] = useState('');
  const [quickPhotoUrlInput, setQuickPhotoUrlInput] = useState('');
  const [quickPhotoSubjectInput, setQuickPhotoSubjectInput] = useState('');
  const [applyPhotoToCardsToo, setApplyPhotoToCardsToo] = useState(false);

  // Payment Gateway Modal states (PIX + Cartão only, NO Boleto!)
  const [gwProvider, setGwProvider] = useState<SitePaymentGatewayConfig['provider']>('mato_pay');
  const [gwPixKey, setGwPixKey] = useState('');
  const [gwBeneficiary, setGwBeneficiary] = useState('');
  const [gwPublicKey, setGwPublicKey] = useState('');
  const [gwCheckoutUrl, setGwCheckoutUrl] = useState('');
  const [gwInstallments, setGwInstallments] = useState(12);
  const [gwMethods, setGwMethods] = useState<('pix' | 'credit_card')[]>([
    'pix',
    'credit_card',
  ]);

  // Listen for payments made inside the generated site iframe so they automatically credit the user's MATO account!
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.type === 'MATO_SITE_PAYMENT_COMPLETED' && site) {
        const rawPrice = String(data.itemPrice || site.blueprint?.priceText || '97')
          .replace(/[^\d,.-]/g, '')
          .replace(',', '.');
        const numericAmount = parseFloat(rawPrice) || 97;
        receiveSitePayment({
          siteId: site.id,
          siteName: site.blueprint?.brandName || site.name,
          itemTitle: data.itemTitle || site.blueprint?.brandName || site.name,
          amount: numericAmount,
          method: data.method === 'card' ? 'cartao' : 'pix',
          customerName: data.customerName || 'Cliente do Site',
          customerContact: data.customerContact || 'cliente@site.com.br',
        });
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [site?.id, site?.name, site?.blueprint?.brandName]);

  useEffect(() => {
    if (site) {
      const detectedFromDesc = extractBrandNameFromText(site.description);
      const initialBrand =
        site.blueprint?.brandName ||
        site.discoveryConfig?.brandName ||
        detectedFromDesc ||
        (site.name && !['Novo Projeto', 'Minha Marca', 'Sua Marca'].includes(site.name)
          ? site.name
          : '');
      setBrandName(initialBrand);
      setSelectedWhatToSell(site.discoveryConfig?.whatToSell || 'Loja / E-commerce físico');
      setSelectedVisualStyle(site.discoveryConfig?.visualStyle || 'Escuro e moderno (Dark)');
      setSelectedLayout(
        site.discoveryConfig?.layoutStructure || 'Split Editorial (Lado a lado)'
      );
      setSelectedSections(site.discoveryConfig?.selectedSections || SECTION_OPTIONS);
      setPriceOrOffer(site.discoveryConfig?.priceOrOffer || '');
      setIsEditingOptions(false);

      // Sync Quick Photo & Name fields
      const bp = site.blueprint;
      setQuickBrandInput(bp?.brandName || initialBrand || site.name);
      setQuickTitleInput(bp?.heroTitle || '');
      setQuickPriceInput(bp?.priceText || 'R$ 197,00');
      setQuickPhotoUrlInput(bp?.heroImage?.url || '');

      // Sync Payment Gateway fields
      const gw = bp?.paymentGateway;
      setGwProvider(gw?.provider || 'mato_pay');
      setGwPixKey(
        gw?.pixKey ||
          userProfile?.email ||
          `pix@${(bp?.brandName || site.name).toLowerCase().replace(/[^a-z0-9]/g, '') || 'loja'}.com.br`
      );
      setGwBeneficiary(gw?.pixBeneficiary || userProfile?.name || bp?.brandName || site.name);
      setGwPublicKey(gw?.publicKey || 'pk_live_mato_auto_connected');
      setGwCheckoutUrl(gw?.checkoutUrl || '');
      setGwInstallments(gw?.installmentsMax || 12);
      const filteredMethods = (gw?.methods || ['pix', 'credit_card']).filter(
        (m): m is 'pix' | 'credit_card' => m === 'pix' || m === 'credit_card'
      );
      setGwMethods(filteredMethods.length > 0 ? filteredMethods : ['pix', 'credit_card']);
    }
  }, [site?.id]);

  if (!site) return null;

  const limits = getPlanLimits(userProfile?.planName);
  const chatHistory: SiteChatMessage[] = site.chatHistory || [];

  // Always guarantee a complete, ready-made blueprint & HTML with working navigation and examples for all 4 sections
  const effectiveBlueprint =
    site.blueprint ||
    buildDefaultBlueprint({
      brandName: site.name,
      niche: site.discoveryConfig?.whatToSell || 'Negócio Digital',
      prompt: site.description || site.name,
      visualStyle: site.visualStyle,
    });
  const liveHtml = renderBlueprintToHtml(effectiveBlueprint);
  const isAwaitingInitialBuild = false;

  const toggleSection = (sec: string) => {
    setSelectedSections((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  const toggleGwMethod = (m: 'pix' | 'credit_card') => {
    setGwMethods((prev) => {
      if (prev.includes(m)) {
        return prev.length > 1 ? prev.filter((x) => x !== m) : prev;
      }
      return [...prev, m];
    });
  };

  // Handle uploading an image from user's computer/phone
  const handleFileUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setQuickPhotoUrlInput(reader.result);
        showToast('Foto carregada! Clique em "Salvar Foto & Nome" para aplicar.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save direct Photo & Brand Name changes
  const handleSavePhotoAndName = () => {
    const updatedBp = JSON.parse(JSON.stringify(effectiveBlueprint));
    const oldBrand = updatedBp.brandName;
    const newBrand = quickBrandInput.trim() || oldBrand;

    if (newBrand !== oldBrand) {
      updatedBp.brandName = newBrand;
      updatedBp.tagline = updatedBp.tagline.replace(new RegExp(oldBrand, 'gi'), newBrand);
      updatedBp.heroTitle = updatedBp.heroTitle.replace(new RegExp(oldBrand, 'gi'), newBrand);
      updatedBp.heroSubtitle = updatedBp.heroSubtitle.replace(new RegExp(oldBrand, 'gi'), newBrand);
      if (updatedBp.paymentGateway) {
        updatedBp.paymentGateway.pixBeneficiary = newBrand;
      }
    }

    if (quickTitleInput.trim()) {
      updatedBp.heroTitle = quickTitleInput.trim();
    }
    if (quickPriceInput.trim()) {
      updatedBp.priceText = quickPriceInput.trim();
    }

    let finalImgUrl = quickPhotoUrlInput.trim();
    if (quickPhotoSubjectInput.trim()) {
      finalImgUrl = generateSmartImageForSubject(quickPhotoSubjectInput.trim(), 0);
      setQuickPhotoUrlInput(finalImgUrl);
    }

    if (finalImgUrl) {
      updatedBp.heroImage = {
        url: finalImgUrl,
        alt: newBrand,
        position: updatedBp.heroImage?.position || 'right',
        shape: updatedBp.heroImage?.shape || 'rounded',
      };
      if (applyPhotoToCardsToo) {
        updatedBp.items = updatedBp.items.map((it: any, idx: number) => ({
          ...it,
          imageUrl: quickPhotoSubjectInput.trim()
            ? generateSmartImageForSubject(quickPhotoSubjectInput.trim(), idx)
            : finalImgUrl,
        }));
      }
    }

    const newHtml = renderBlueprintToHtml(updatedBp);
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    updateSite(site.id, {
      name: updatedBp.brandName,
      blueprint: updatedBp,
      generatedHtml: newHtml,
      url: `https://${updatedBp.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.mato.site`,
      chatHistory: [
        ...chatHistory,
        {
          id: `b-photo-${Date.now()}`,
          role: 'assistant',
          thoughtSeconds: 1,
          activeModelBadge: 'Editor Direto • Studio',
          text: `Pronto! Atualizei o nome para **${updatedBp.brandName}** e apliquei a nova foto diretamente no seu site.`,
          milestoneTitle: `Foto & Nome atualizados (${updatedBp.brandName})`,
          timestamp: now,
        },
      ],
    });

    setBrandName(updatedBp.brandName);
    setQuickPhotoSubjectInput('');
    setIframeRenderKey((k) => k + 1);
    setIsPhotoNameModalOpen(false);
    showToast('Foto e nome atualizados com sucesso!');
  };

  // Save & Connect Payment Gateway
  const handleSavePaymentGateway = () => {
    const updatedBp = JSON.parse(JSON.stringify(effectiveBlueprint));
    const providerObj = GATEWAY_PROVIDERS.find((p) => p.id === gwProvider);

    updatedBp.paymentGateway = {
      enabled: true,
      provider: gwProvider,
      connected: true,
      pixKey: gwPixKey.trim() || `pix@${updatedBp.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
      pixBeneficiary: gwBeneficiary.trim() || updatedBp.brandName,
      publicKey: gwPublicKey.trim() || 'pk_live_connected',
      checkoutUrl: gwCheckoutUrl.trim(),
      methods: gwMethods,
      installmentsMax: gwInstallments,
    };

    const newHtml = renderBlueprintToHtml(updatedBp);
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    updateSite(site.id, {
      blueprint: updatedBp,
      generatedHtml: newHtml,
      chatHistory: [
        ...chatHistory,
        {
          id: `b-gw-${Date.now()}`,
          role: 'assistant',
          thoughtSeconds: 1,
          activeModelBadge: 'Gateway Integrator',
          text: `Gateway **${providerObj?.name || gwProvider}** conectado e implementado com sucesso no site!\n• **Chave PIX**: \`${updatedBp.paymentGateway.pixKey}\`\n• **Métodos ativos**: ${gwMethods.join(', ').toUpperCase()} (em até ${gwInstallments}x)\n\nClique em qualquer botão de compra do site para testar o checkout transparente ao vivo!`,
          milestoneTitle: `Gateway ${providerObj?.name} Conectado`,
          timestamp: now,
        },
      ],
    });

    setIframeRenderKey((k) => k + 1);
    setIsGatewayModalOpen(false);
    showToast(`Gateway ${providerObj?.name} conectado e implementado no site!`);
  };

  const handleConfirmDiscovery = async () => {
    const detectedBrand =
      brandName.trim() ||
      extractBrandNameFromText(site.description) ||
      (site.name && !['Novo Projeto', 'Minha Marca', 'Sua Marca'].includes(site.name)
        ? site.name
        : 'Studio Oficial');
    const finalWhatToSell = customWhatToSell.trim() || selectedWhatToSell;

    const config: SiteDiscoveryConfig = {
      brandName: detectedBrand,
      whatToSell: finalWhatToSell,
      visualStyle: selectedVisualStyle,
      layoutStructure: selectedLayout,
      selectedSections,
      priceOrOffer: priceOrOffer.trim(),
    };

    setIsUpdatingWithAI(true);
    try {
      setActiveOrchestratorStep(`Aplicando opções para ${detectedBrand} (${finalWhatToSell})...`);
      const { html, blueprint, assistantReply } = await generateSiteHtmlWithAI({
        name: detectedBrand,
        type: site.type,
        prompt: `Marca: ${detectedBrand} | Nicho: ${finalWhatToSell} | Estilo: ${selectedVisualStyle}`,
        visualStyle: selectedVisualStyle,
        whatToSell: finalWhatToSell,
        layoutStructure: selectedLayout,
        selectedSections,
        priceOrOffer: priceOrOffer.trim(),
      });

      const hadAwaiting = chatHistory.some((m) => m.awaitingDiscovery);
      let updatedHistory: SiteChatMessage[] = chatHistory.map((m) =>
        m.awaitingDiscovery || m.discoveryData
          ? {
              ...m,
              awaitingDiscovery: false,
              activeModelBadge: 'Claude 3.7 + GPT-4o + Gemini 2.5 Flash',
              discoveryData: { ...config, brandName: blueprint.brandName },
              text: assistantReply,
              milestoneTitle: hadAwaiting
                ? `Criou o site ${blueprint.brandName}`
                : `Alterou as opções de ${blueprint.brandName}`,
            }
          : m
      );

      if (!hadAwaiting) {
        const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        updatedHistory = [
          ...updatedHistory,
          {
            id: `b-opt-${Date.now()}`,
            role: 'assistant',
            thoughtSeconds: 2,
            activeModelBadge: 'Claude 3.7 + Gemini 2.5 Flash',
            text: `Pronto! Atualizei todo o projeto **${blueprint.brandName}** para o nicho **${finalWhatToSell}** com o estilo **${selectedVisualStyle}**.`,
            milestoneTitle: `Opções atualizadas (${finalWhatToSell})`,
            timestamp: now,
          },
        ];
      }

      setBrandName(blueprint.brandName);
      setQuickBrandInput(blueprint.brandName);
      setQuickTitleInput(blueprint.heroTitle);
      setQuickPhotoUrlInput(blueprint.heroImage?.url || '');
      setIsEditingOptions(false);
      setIframeRenderKey((k) => k + 1);

      updateSite(site.id, {
        name: blueprint.brandName,
        visualStyle: selectedVisualStyle,
        discoveryConfig: { ...config, brandName: blueprint.brandName },
        blueprint,
        generatedHtml: html,
        status: 'publicado',
        url: `https://${blueprint.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.mato.site`,
        chatHistory: updatedHistory,
      });
    } catch (err) {
      console.error('Erro ao aplicar opções do site:', err);
    } finally {
      setIsUpdatingWithAI(false);
      setActiveOrchestratorStep('');
    }
  };

  const handleExport = () => {
    const htmlContent = liveHtml || '<!DOCTYPE html><html><body></body></html>';
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Código HTML de "${site.name}" baixado com sucesso!`);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([liveHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handlePublishSite = () => {
    updateSite(site.id, { status: 'publicado', generatedHtml: liveHtml, blueprint: effectiveBlueprint });
    setIsPublishModalOpen(true);
    showToast(`Site "${site.name}" publicado com sucesso!`);
  };

  const handleDelete = () => {
    deleteSite(site.id);
    onClose();
  };

  const submitPrompt = async (promptText: string) => {
    if (!promptText.trim() || isUpdatingWithAI) return;

    consumeAICredits(limits.chatEditCost);

    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: SiteChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: promptText.trim(),
      timestamp: now,
    };

    setIsUpdatingWithAI(true);
    setAiEditPrompt('');

    try {
      const explicitBrand = extractBrandNameFromText(promptText);
      const targetBrand =
        explicitBrand ||
        effectiveBlueprint.brandName ||
        brandName.trim() ||
        extractBrandNameFromText(site.description) ||
        (site.name && !['Novo Projeto', 'Minha Marca', 'Sua Marca'].includes(site.name)
          ? site.name
          : 'Studio Oficial');

      setActiveOrchestratorStep(
        `Aplicando modificação ("${promptText.trim().slice(0, 38)}...") no site...`
      );

      const { html, blueprint, assistantReply } = await generateSiteHtmlWithAI({
        name: targetBrand,
        type: site.type,
        prompt: promptText.trim(),
        visualStyle: site.visualStyle || selectedVisualStyle,
        whatToSell: site.discoveryConfig?.whatToSell || customWhatToSell.trim() || selectedWhatToSell,
        layoutStructure: site.discoveryConfig?.layoutStructure || selectedLayout,
        selectedSections: site.discoveryConfig?.selectedSections || selectedSections,
        priceOrOffer: site.discoveryConfig?.priceOrOffer || priceOrOffer,
        existingBlueprint: effectiveBlueprint,
      });

      setBrandName(blueprint.brandName);
      setQuickBrandInput(blueprint.brandName);
      setQuickTitleInput(blueprint.heroTitle);
      setQuickPhotoUrlInput(blueprint.heroImage?.url || '');
      setIframeRenderKey((k) => k + 1);

      const cleanedHistory = chatHistory.map((m) =>
        m.awaitingDiscovery
          ? {
              ...m,
              awaitingDiscovery: false,
              discoveryData: {
                brandName: blueprint.brandName,
                whatToSell: blueprint.niche,
                visualStyle:
                  blueprint.bgMode === 'light' ? 'Claro e minimalista' : 'Escuro e moderno (Dark)',
                layoutStructure: selectedLayout,
                selectedSections,
                priceOrOffer: blueprint.priceText,
              },
            }
          : m
      );

      const botMsg: SiteChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        thoughtSeconds: 2,
        activeModelBadge: 'Claude 3.7 + Gemini 2.5 Flash',
        text: assistantReply,
        milestoneTitle: `Modificou: ${promptText.trim().slice(0, 32)}`,
        timestamp: now,
      };

      updateSite(site.id, {
        name: blueprint.brandName,
        description: `${site.description} • ${promptText.trim()}`,
        blueprint,
        generatedHtml: html,
        status: 'publicado',
        url: `https://${blueprint.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.mato.site`,
        chatHistory: [...cleanedHistory, userMsg, botMsg],
      });
    } catch (err) {
      console.error('Erro ao processar mensagem no chat:', err);
    } finally {
      setIsUpdatingWithAI(false);
      setActiveOrchestratorStep('');
    }
  };

  const handleRefineWithAI = (e: React.FormEvent) => {
    e.preventDefault();
    submitPrompt(aiEditPrompt);
  };

  const siteLiveUrl =
    site.url || `https://${site.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.mato.site`;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex bg-[#111113] text-white animate-in fade-in">
      <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT PANE: INTERACTIVE MULTI-MODEL CONVERSATIONAL STUDIO */}
        <div className="w-full lg:w-[420px] xl:w-[450px] h-[50vh] lg:h-full bg-[#141416] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col flex-shrink-0">
          
          {/* Studio Top Navigation Bar */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#141416] gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition flex-shrink-0"
              >
                ← Voltar
              </button>
              <span className="text-xs font-bold text-white truncate">{site.name}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleDelete}
                title="Excluir esta criação"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            </div>
          </div>

          {/* Interactive Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {chatHistory.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="px-4 py-2.5 rounded-2xl bg-[#27272A] text-gray-100 text-xs font-medium max-w-[85%] shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      {msg.thoughtSeconds && (
                        <span className="text-[11px] text-gray-400 font-medium">
                          Thought for {msg.thoughtSeconds}s
                        </span>
                      )}
                      {msg.activeModelBadge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10 flex items-center gap-1">
                          <Cpu className="w-2.5 h-2.5 text-[#7be801]" />
                          {msg.activeModelBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-200 leading-relaxed font-medium whitespace-pre-line">{msg.text}</p>

                    {/* Milestone Bookmark Card */}
                    {msg.milestoneTitle && (
                      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1C1E26] border border-blue-500/30">
                        <span className="text-xs font-bold text-white">{msg.milestoneTitle}</span>
                        <Bookmark className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isUpdatingWithAI && (
              <div className="p-3.5 rounded-2xl bg-[#1C1C1F] border border-[#7be801]/40 text-xs text-gray-200 space-y-2 animate-pulse">
                <div className="flex items-center gap-2 text-[#7be801] font-bold">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Construindo sob medida...</span>
                </div>
                {activeOrchestratorStep && (
                  <p className="text-[11px] text-gray-400">{activeOrchestratorStep}</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Recommendation Pills */}
          {!isAwaitingInitialBuild && (
            <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setIsPhotoNameModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-[#7be801]/15 hover:bg-[#7be801]/25 border border-[#7be801]/40 text-[11px] font-bold text-[#7be801] whitespace-nowrap transition"
              >
                Mudar Foto & Nome
              </button>
              <button
                type="button"
                onClick={() => setIsGatewayModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 whitespace-nowrap transition"
              >
                Gateway Pagamento
              </button>
              {[
                {
                  label: 'Deixar futurístico',
                  prompt: 'Eu quero que deixe o site futurístico',
                },
                {
                  label: 'Deixar minimalista',
                  prompt: 'Eu quero que deixe o site minimalista',
                },
                {
                  label: 'Variar layout',
                  prompt: 'Mude para outro formato de layout diferente',
                },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => submitPrompt(chip.prompt)}
                  className="px-3 py-1.5 rounded-full bg-[#232327] hover:bg-[#2c2c31] border border-white/10 text-[11px] font-medium text-gray-200 whitespace-nowrap transition"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Interactive Chat Input Box */}
          <form onSubmit={handleRefineWithAI} className="p-3 pt-1 bg-[#141416]">
            <div className="rounded-2xl bg-[#222226] border border-white/10 focus-within:border-white/25 p-3 transition">
              <textarea
                rows={2}
                value={aiEditPrompt}
                onChange={(e) => setAiEditPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitPrompt(aiEditPrompt);
                  }
                }}
                placeholder='Cole um prompt ou peça: "Mude o nome para...", "Mude a foto para...", "Conecte o Mercado Pago"...'
                className="w-full bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between pt-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsPhotoNameModalOpen(true)}
                  title="Mudar Foto ou Nome da Marca"
                  className="w-7 h-7 rounded-full bg-[#2E2E33] hover:bg-[#38383E] text-gray-300 flex items-center justify-center transition"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#2E2E33] text-[11px] font-semibold text-gray-200 flex items-center gap-1">
                    <span>Construir</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </span>

                  <button
                    type="button"
                    className="w-7 h-7 rounded-full text-gray-400 hover:text-white flex items-center justify-center"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdatingWithAI || !aiEditPrompt.trim()}
                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-white text-black flex items-center justify-center transition disabled:opacity-40"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT PANE: LIVE PREVIEW OR INTERACTIVE BLUEPRINT */}
        <div className="flex-1 flex flex-col bg-[#0c0d10] h-[50vh] lg:h-full overflow-hidden relative">
          
          {/* Top Studio Action Bar with "Foto & Nome", "Gateway de Pagamento" & "Publicar o site" */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#141416] border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#202024] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition ${
                    viewMode === 'preview'
                      ? 'bg-white text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition ${
                    viewMode === 'code'
                      ? 'bg-white text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Código</span>
                </button>
              </div>

              {viewMode === 'preview' && (
                <div className="flex items-center bg-[#202024] p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setViewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs transition ${
                      viewDevice === 'desktop'
                        ? 'bg-white/15 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs transition ${
                      viewDevice === 'mobile'
                        ? 'bg-white/15 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Direct Button: Mudar Foto & Nome */}
              <button
                type="button"
                onClick={() => setIsPhotoNameModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#202024] hover:bg-[#2a2a30] text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#7be801]" />
                <span>Foto & Nome</span>
              </button>

              {/* Direct Button: Gateway de Pagamento */}
              <button
                type="button"
                onClick={() => setIsGatewayModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gateway de Pagamento</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* Live URL Bar */}
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#202024] border border-white/5 text-xs text-gray-300">
              <Globe className="w-3.5 h-3.5 text-[#7be801]" />
              <span className="truncate max-w-[180px]">{siteLiveUrl}</span>
              <button
                type="button"
                onClick={handleOpenNewTab}
                title="Abrir em nova aba"
                className="text-gray-400 hover:text-white ml-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Prominent "Publicar o site" Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="px-3 py-1.5 rounded-xl bg-[#202024] hover:bg-[#2a2a30] text-gray-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Baixar HTML</span>
              </button>

              <button
                type="button"
                onClick={handlePublishSite}
                className="px-4 py-1.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(123,232,1,0.3)] transition"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Publicar o site</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Website Viewport */}
          <div className="flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-3 relative">
            {viewMode === 'preview' ? (
              <div
                className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white ${
                  viewDevice === 'mobile' ? 'w-[375px]' : 'w-full'
                }`}
              >
                <iframe
                  key={`${site.id}-${iframeRenderKey}-${liveHtml.length}`}
                  title={`Preview ${site.name}`}
                  srcDoc={liveHtml}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-xl bg-[#090d14] border border-white/10 p-4 overflow-auto font-mono text-xs text-emerald-300">
                <pre className="whitespace-pre-wrap break-words">{liveHtml}</pre>
              </div>
            )}
          </div>

          {/* MODAL 1: EDITAR FOTO & NOME DIRETAMENTE */}
          {isPhotoNameModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg rounded-3xl bg-[#16181f] border border-white/15 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#7be801]" />
                    <h4 className="text-base font-black text-white">Mudar Foto & Nome do Site</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPhotoNameModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Nome da Marca / Empresa / Site
                    </label>
                    <input
                      type="text"
                      value={quickBrandInput}
                      onChange={(e) => setQuickBrandInput(e.target.value)}
                      placeholder="Ex: Snoop, Studio Lumina, Burger Prime..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7be801]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        Título Principal (Headline)
                      </label>
                      <input
                        type="text"
                        value={quickTitleInput}
                        onChange={(e) => setQuickTitleInput(e.target.value)}
                        placeholder="Título de destaque do topo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7be801]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        Preço / Valor Principal
                      </label>
                      <input
                        type="text"
                        value={quickPriceInput}
                        onChange={(e) => setQuickPriceInput(e.target.value)}
                        placeholder="Ex: R$ 197,00"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7be801]"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 space-y-3">
                    <label className="text-xs font-bold text-white block">
                      Trocar Foto do Site (Escolha uma das 3 opções):
                    </label>

                    {/* Option A: Upload from computer */}
                    <div className="p-3.5 rounded-2xl bg-[#22242c] border border-dashed border-white/20 flex items-center justify-between gap-3">
                      <div className="text-xs">
                        <p className="font-bold text-white">1. Enviar foto do seu computador/celular</p>
                        <p className="text-[11px] text-gray-400">JPG, PNG ou WebP</p>
                      </div>
                      <label className="px-3.5 py-2 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-extrabold text-xs cursor-pointer flex items-center gap-1.5 flex-shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Escolher Arquivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUploadPhoto}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Option B: Search by Subject */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                        2. Ou digite o tema da foto para gerar/buscar automaticamente:
                      </label>
                      <input
                        type="text"
                        value={quickPhotoSubjectInput}
                        onChange={(e) => setQuickPhotoSubjectInput(e.target.value)}
                        placeholder="Ex: unha decorada, barbearia, hambúrguer, dentista, tênis, carro, clínica..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7be801]"
                      />
                    </div>

                    {/* Option C: Paste Image URL */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                        3. Ou cole o link direto de uma imagem (URL):
                      </label>
                      <input
                        type="text"
                        value={quickPhotoUrlInput}
                        onChange={(e) => setQuickPhotoUrlInput(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7be801]"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={applyPhotoToCardsToo}
                        onChange={(e) => setApplyPhotoToCardsToo(e.target.checked)}
                        className="rounded accent-[#7be801]"
                      />
                      <span>Atualizar também as fotos dos cards de Destaques</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPhotoNameModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePhotoAndName}
                    className="flex-1 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-black text-xs"
                  >
                    Salvar Foto & Nome →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 2: IMPLEMENTAR & CONECTAR GATEWAY DE PAGAMENTO */}
          {isGatewayModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg rounded-3xl bg-[#16181f] border border-white/15 p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-base font-black text-white">
                        Gateway de Pagamento Automático
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Receba via PIX Imediato e Cartão em até 12x diretamente na sua conta MATO
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGatewayModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-emerald-200 leading-relaxed">
                    <strong>Recebimento Automático Ativo:</strong> Sempre que um cliente clicar em pagar no seu site, o valor cai automaticamente na sua conta <strong>MATO Pay</strong> e no painel de <strong>Vendas</strong>.
                  </div>
                </div>

                {/* Gateway Provider Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 block">
                    1. Escolha a operadora / gateway conectado:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GATEWAY_PROVIDERS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setGwProvider(p.id)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          gwProvider === p.id
                            ? 'bg-emerald-500/15 border-emerald-400 text-white'
                            : 'bg-[#22242c] border-white/10 text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold">{p.name}</span>
                          {gwProvider === p.id && (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PIX Key & Beneficiary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Sua Chave PIX (Para QR Code Automático)
                    </label>
                    <input
                      type="text"
                      value={gwPixKey}
                      onChange={(e) => setGwPixKey(e.target.value)}
                      placeholder="CPF, CNPJ, E-mail ou Celular"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Nome do Recebedor / Sua Conta
                    </label>
                    <input
                      type="text"
                      value={gwBeneficiary}
                      onChange={(e) => setGwBeneficiary(e.target.value)}
                      placeholder={userProfile?.name || effectiveBlueprint.brandName}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* API Key / Token & External Checkout Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Token / Public Key da Integração
                    </label>
                    <input
                      type="text"
                      value={gwPublicKey}
                      onChange={(e) => setGwPublicKey(e.target.value)}
                      placeholder="APP_USR-... ou pk_live_..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Link de Checkout Externo (Opcional)
                    </label>
                    <input
                      type="text"
                      value={gwCheckoutUrl}
                      onChange={(e) => setGwCheckoutUrl(e.target.value)}
                      placeholder="https://mpago.la/... ou https://pay..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#22242c] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Active Payment Methods (PIX + Credit Card only, NO Boleto!) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 block">
                    Formas de pagamento habilitadas no checkout do site:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'pix' as const, label: 'PIX Imediato (QR Code)' },
                      { id: 'credit_card' as const, label: `Cartão de Crédito até ${gwInstallments}x` },
                    ].map((m) => {
                      const active = gwMethods.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleGwMethod(m.id)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                            active
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-[#22242c] border-white/10 text-gray-400'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsGatewayModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePaymentGateway}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  >
                    Conectar e Salvar no Site →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Publish Success Modal */}
          {isPublishModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-3xl bg-[#16181f] border border-white/15 p-6 space-y-4 shadow-2xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#7be801]/15 border border-[#7be801]/30 text-[#7be801] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Seu site está publicado!</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Seu projeto com gateway de pagamento integrado já está pronto para receber clientes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#7be801] font-mono truncate">{siteLiveUrl}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(siteLiveUrl);
                      showToast('Link do site copiado!');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1 flex-shrink-0"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </button>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenNewTab}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Site</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublishModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-black text-xs"
                  >
                    Concluído
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
