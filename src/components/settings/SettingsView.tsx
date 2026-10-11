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

export const SettingsView: React.FC = () => {
  const { userProfile, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'perfil' | 'planos' | 'seguranca' | 'ia'>('perfil');

  const plans = [
    {
      name: 'Plano Gratuito',
      current: true,
      price: 'R$ 0',
      period: '/mês',
      desc: 'Ideal para validar produtos e começar a receber via Pix.',
      features: [
        'Taxa Pix de 0,99% por transação',
        'Até 3 sites publicados no MATO Sites',
        '50 créditos mensais na MATO IA',
        'Links de pagamento ilimitados',
        'Suporte padrão por e-mail',
      ],
      buttonText: 'Plano Atual',
      buttonDisabled: true,
    },
    {
      name: 'MATO Pro',
      current: false,
      price: 'R$ 97',
      period: '/mês',
      desc: 'Para criadores e empresas em aceleração de escala.',
      features: [
        'Taxa Pix reduzida de 0,79%',
        'Sites ilimitados com domínio próprio',
        '500 créditos mensais na MATO IA',
        'Checkout transparente sem redirecionamento',
        'Recuperação automática de Pix no WhatsApp',
        'Suporte prioritário via WhatsApp',
      ],
      buttonText: 'Fazer Upgrade para o Pro',
      highlight: true,
    },
    {
      name: 'MATO Enterprise',
      current: false,
      price: 'R$ 297',
      period: '/mês',
      desc: 'Para grandes operações de e-commerce e infoprodutores de alta escala.',
      features: [
        'Taxa Pix personalizada de 0,49%',
        'Multi-usuários com controle de permissões',
        'Créditos ilimitados na MATO IA',
        'Gerente de contas dedicado',
        'SLA garantido de 99.99%',
      ],
      buttonText: 'Falar com Especialista',
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Alterações de perfil salvas com sucesso!');
  };

  const handlePlanAction = (planName: string) => {
    showToast(`Solicitação para o plano "${planName}" registrada. Modo demonstração: cobranças recorrentes requerem integração com gateway.`);
  };

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
          { id: 'seguranca', label: 'Segurança & RLS', icon: Shield },
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
                {userProfile.avatarText}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{userProfile.name}</p>
                <span className="text-[#7e8b9b]">{userProfile.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  defaultValue={userProfile.name}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121822] border border-[#1f2838] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">E-mail Comercial</label>
                <input
                  type="email"
                  defaultValue={userProfile.email}
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  p.highlight
                    ? 'bg-[#0f171e] border-2 border-emerald-500 shadow-[0_0_30px_rgba(123, 232, 1,0.15)] relative'
                    : 'bg-[#0c1016] border border-[#1b2330]'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider">
                    Mais Recomendado
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-black text-white">{p.name}</h4>
                    <p className="text-xs text-[#7e8b9b] mt-1">{p.desc}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{p.price}</span>
                      <span className="text-xs text-[#7e8b9b]">{p.period}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-gray-300">
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
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
              <h3 className="text-sm font-bold text-white">Consumo de Tokens & Créditos</h3>
              <p className="text-xs text-[#7e8b9b]">Ciclo mensal renova no dia 01 de cada mês.</p>
            </div>
            <button
              onClick={() => showToast('Pacote extra de 100 créditos adicionado! (Simulação)')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20"
            >
              Comprar Créditos Extras
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#121822] space-y-2 text-xs">
            <div className="flex justify-between font-bold text-white">
              <span>Uso do Limite Mensal:</span>
              <span className="text-emerald-400">
                {userProfile.aiCreditsUsed} de {userProfile.aiCreditsTotal} créditos (28%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="w-[28%] h-full bg-[#7be801] rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Segurança */}
      {activeTab === 'seguranca' && (
        <div className="max-w-2xl rounded-2xl bg-[#0c1016] border border-[#1b2330] p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">Segurança & Políticas de Isolamento de Dados</h3>

          <div className="space-y-3">
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
  );
};
