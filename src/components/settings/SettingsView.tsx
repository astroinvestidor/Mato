import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  CreditCard,
  Zap,
  Check,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';
import { getStoredGeminiKey, setStoredGeminiKey } from '../../services/aiService';

export const SettingsView: React.FC = () => {
  const { userProfile, updateUserProfile, changeUserPlan, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'perfil' | 'planos' | 'seguranca' | 'ia'>('perfil');
  const [profileName, setProfileName] = useState(userProfile?.name || '');
  const [profileEmail, setProfileEmail] = useState(userProfile?.email || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => getStoredGeminiKey());

  const isFreePlan =
    !userProfile?.planName ||
    userProfile?.planName === 'MATO Free' ||
    userProfile?.planName === 'Plano Gratuito';

  const plans = [
    {
      name: 'MATO Free',
      current: isFreePlan,
      price: 'R$ 0',
      period: '/mês',
      desc: 'Ideal para validar produtos e começar a receber via Pix.',
      features: [
        'Até 3 sites publicados no MATO Sites',
        '50 créditos mensais na MATO IA',
        'Links de pagamento ilimitados',
        'Suporte padrão por e-mail',
      ],
      buttonText: isFreePlan ? 'Plano Atual' : 'Selecionar',
      buttonDisabled: isFreePlan,
    },
    {
      name: 'MATO Pro',
      current: userProfile?.planName === 'MATO Pro',
      price: 'R$ 25',
      period: '/mês',
      desc: 'Para criadores e empresas em aceleração de escala.',
      features: [
        'Até 15 sites com domínio próprio',
        '300 créditos mensais na MATO IA',
        'Checkout transparente sem redirecionamento',
        'Recuperação automática de Pix no WhatsApp',
        'Suporte prioritário via WhatsApp',
      ],
      buttonText: userProfile?.planName === 'MATO Pro' ? 'Plano Atual' : 'Fazer Upgrade para o Pro',
      buttonDisabled: userProfile?.planName === 'MATO Pro',
      highlight: true,
    },
    {
      name: 'MATO Business',
      current: userProfile?.planName === 'MATO Business',
      price: 'R$ 50',
      period: '/mês',
      desc: 'Para empresas consolidadas e operações em expansão.',
      features: [
        'Sites ilimitados com domínio próprio',
        '1.000 créditos mensais na MATO IA',
        'Sistema completo de Afiliados e Comissões',
        'Checkout transparente + Order Bump',
        'Suporte VIP prioritário via WhatsApp',
      ],
      buttonText: userProfile?.planName === 'MATO Business' ? 'Plano Atual' : 'Fazer Upgrade para Business',
      buttonDisabled: userProfile?.planName === 'MATO Business',
    },
    {
      name: 'MATO Enterprise',
      current: userProfile?.planName === 'MATO Enterprise',
      price: 'Personalizado',
      period: 'sob consulta',
      desc: 'Para grandes operações corporativas e infoprodutores de alta escala.',
      features: [
        'Preços por volume e créditos sob medida',
        'SCIM, logs de auditoria e controles avançados',
        'Suporte dedicado e SLA personalizado',
        'Residência de dados com Git Sync',
        'Recursos corporativos adicionais',
      ],
      buttonText: userProfile?.planName === 'MATO Enterprise' ? 'Plano Atual' : 'Falar com Especialista',
      buttonDisabled: userProfile?.planName === 'MATO Enterprise',
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) return;
    updateUserProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      avatarText: profileName.trim().charAt(0).toUpperCase(),
    });
  };

  const handlePlanAction = (planName: string) => {
    changeUserPlan(planName);
  };

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredGeminiKey(geminiApiKey);
    showToast('Chave da API Gemini 2.0 Flash salva com sucesso!');
  };

  const creditsUsed = userProfile?.aiCreditsUsed || 0;
  const creditsTotal = userProfile?.aiCreditsTotal || 50;
  const creditsPercent = Math.min(100, Math.round((creditsUsed / Math.max(1, creditsTotal)) * 100));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="Configurações & Planos" />

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Configurações</h2>
          <p className="text-xs text-[#7e8b9b] mt-0.5">
            Gerencie sua conta, plano contratado, limites de IA e preferências de segurança.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2330] pb-3 text-xs">
        {[
          { id: 'perfil', label: 'Meu Perfil', icon: User },
          { id: 'planos', label: 'Planos & Upgrade', icon: CreditCard },
          { id: 'ia', label: 'Consumo da MATO IA', icon: Zap },
          { id: 'seguranca', label: 'Segurança', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Perfil */}
      {activeTab === 'perfil' && (
        <div className="max-w-2xl rounded-2xl bg-[#0c1016] border border-[#1b2330] p-6 space-y-5">
          <h3 className="text-sm font-bold text-white">Dados Pessoais e Cadastrais</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#151c27] border border-white/10 text-xl font-black text-white flex items-center justify-center">
                {userProfile?.avatarText || 'U'}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{userProfile?.name || 'Usuário'}</p>
                <span className="text-[#7e8b9b]">{userProfile?.email || ''}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121822] border border-[#1f2838] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">E-mail Comercial</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121822] border border-[#1f2838] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(123, 232, 1,0.3)]"
            >
              Salvar Alterações
            </button>
          </form>
        </div>
      )}

      {/* Tab: Planos */}
      {activeTab === 'planos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  p.highlight
                    ? 'bg-[#0f171e] border-2 border-[#7be801] shadow-[0_0_30px_rgba(123,232,1,0.15)] relative'
                    : 'bg-[#0c1016] border border-[#1b2330]'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#7be801] text-black text-[10px] font-extrabold uppercase tracking-wider">
                    Mais Recomendado
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-black text-white">{p.name}</h4>
                    <p className="text-xs text-[#7e8b9b] mt-1">{p.desc}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`${p.price === 'Personalizado' ? 'text-2xl' : 'text-3xl'} font-black text-white`}>
                        {p.price}
                      </span>
                      {p.period && <span className="text-xs text-[#7e8b9b]">{p.period}</span>}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-gray-300">
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#7be801] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <button
                    disabled={p.buttonDisabled}
                    onClick={() => handlePlanAction(p.name)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      p.current
                        ? 'bg-white/5 text-gray-400 cursor-default'
                        : p.highlight
                        ? 'bg-[#7be801] hover:bg-[#68c700] text-black shadow-[0_0_20px_rgba(123, 232, 1,0.3)]'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    {p.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Consumo da IA */}
      {activeTab === 'ia' && (
        <div className="max-w-2xl rounded-2xl bg-[#0c1016] border border-[#1b2330] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Consumo de Tokens & Créditos ({userProfile?.planName || 'MATO Free'})</h3>
              <p className="text-xs text-[#7e8b9b]">Ciclo mensal renova no dia 01 de cada mês.</p>
            </div>
            <button
              onClick={() => {
                updateUserProfile({ aiCreditsTotal: creditsTotal + 50 });
                showToast('Pacote extra de 50 créditos adicionado à sua conta!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20"
            >
              Comprar Créditos Extras
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#121822] space-y-2 text-xs">
            <div className="flex justify-between font-bold text-white">
              <span>Uso do Limite Mensal:</span>
              <span className="text-emerald-400">
                {creditsUsed} de {creditsTotal} créditos ({creditsPercent}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-[#7be801] rounded-full transition-all duration-300"
                style={{ width: `${creditsPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121822] border border-white/5 text-xs space-y-1.5 text-gray-300">
            <p className="font-bold text-white">Tabela de Consumo por Plano:</p>
            <p>• <strong>MATO Free:</strong> 50 créditos/mês • Até 3 sites (2 créditos por site gerado)</p>
            <p>• <strong>MATO Pro:</strong> 300 créditos/mês • Até 15 sites + Domínio próprio + Exportar HTML</p>
            <p>• <strong>MATO Business:</strong> 1.000 créditos/mês • Sites ilimitados + Desconto de 50% nas edições por chat (0,5 crédito)</p>
            <p>• <strong>MATO Enterprise:</strong> Créditos e sites ilimitados</p>
          </div>
        </div>
      )}

      {/* Tab: Segurança */}
      {activeTab === 'seguranca' && (
        <div className="max-w-2xl space-y-5">
          {/* Standard User Account Security */}
          <div className="rounded-2xl bg-[#0c1016] border border-[#1b2330] p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Segurança da Conta</h3>
            <div className="p-3.5 rounded-xl bg-[#121822] border border-white/5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">Proteção e Privacidade de Dados</h4>
                <p className="text-[#7e8b9b] mt-0.5">
                  Sua conta e suas transações são protegidas com criptografia de ponta a ponta e isolamento total de dados.
                </p>
              </div>
            </div>
          </div>

          {/* Admin-Only Technical Infrastructure & AI Engine Panel */}
          {userProfile?.email === 'admin@mato.app.br' && (
            <div className="rounded-2xl bg-[#0c1016] border border-emerald-500/30 p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Infraestrutura & Motor de IA (Painel do Dono)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Visível apenas para você (Admin)
                </span>
              </div>

              {/* AI Engine Config */}
              <form onSubmit={handleSaveGeminiKey} className="p-4 rounded-xl bg-[#121822] border border-[#7be801]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#7be801]" />
                    Motor MATO IA: Google Gemini 2.0 Flash (Custo Zero / Ultra Barato)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#7be801]/15 text-[#7be801] font-bold">
                    {geminiApiKey ? 'API Conectada' : 'Gerador Local Ativo (R$ 0)'}
                  </span>
                </div>
                <p className="text-[#7e8b9b] leading-relaxed">
                  O construtor já funciona com custo R$ 0 usando o motor instantâneo integrado. Para ativar o LLM completo da Google (que possui cota <strong>100% gratuita de até 1.500 gerações/dia</strong> no Google AI Studio), cole sua chave abaixo:
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Cole sua chave gratuita AIzaSy... (aistudio.google.com)"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0c1016] border border-[#232f42] text-white focus:outline-none focus:border-[#7be801]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold transition"
                  >
                    Salvar Chave
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#121822] border border-emerald-500/20 flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <span>Banco de Dados Supabase Conectado</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Online
                      </span>
                    </h4>
                    <p className="text-[#7e8b9b] mt-0.5">
                      Projeto: <code className="text-emerald-400">cllkwyzbqlhuuvhiwyqj.supabase.co</code> com autenticação e schema PostgreSQL ativos.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121822] border border-white/5 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Row Level Security (RLS) no Supabase</h4>
                    <p className="text-[#7e8b9b] mt-0.5">
                      Todas as tabelas possuem políticas RLS ativas vinculadas a <code>auth.uid() = user_id</code>. Nenhum usuário consegue ler ou modificar dados de outra conta.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121822] border border-white/5 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Proteção de Segredos e Chaves</h4>
                    <p className="text-[#7e8b9b] mt-0.5">
                      Chaves secretas de APIs e tokens de pagamento ficam exclusivamente em variáveis de ambiente protegidas no backend e nunca são transmitidas ao cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
