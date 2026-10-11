import React from 'react';
import { Wallet, Globe, Package, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingSteps: React.FC = () => {
  const {
    setActiveTab,
    setIsCreateChargeModalOpen,
    setIsCreateSiteModalOpen,
    setIsCreateProductModalOpen,
    setIsAIChatOpen,
  } = useApp();

  const steps = [
    {
      icon: Wallet,
      title: 'Apenas receber pagamentos',
      description: 'Use o MATO Pay para cobrar, receber e gerenciar suas vendas.',
      actionText: 'Quero só receber',
      onClick: () => {
        setActiveTab('receber');
        setIsCreateChargeModalOpen(true);
      },
    },
    {
      icon: Globe,
      title: 'Criar um site para vender',
      description: 'Deixe sua marca online com um site profissional e integrado ao MATO Pay.',
      actionText: 'Quero criar um site',
      onClick: () => {
        setActiveTab('sites');
        setIsCreateSiteModalOpen(true);
      },
    },
    {
      icon: Package,
      title: 'Vender produtos ou serviços',
      description: 'Cadastre seus produtos, defina preços e comece a vender.',
      actionText: 'Quero cadastrar um produto',
      onClick: () => {
        setActiveTab('produtos');
        setIsCreateProductModalOpen(true);
      },
    },
    {
      icon: Sparkles,
      title: 'Explorar a MATO IA',
      description: 'Deixe a IA te ajudar a criar, vender, converter e analisar seus resultados.',
      actionText: 'Quero conversar com a IA',
      onClick: () => {
        setIsAIChatOpen(true);
        setActiveTab('ia');
      },
    },
  ];

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight">Como você quer começar?</h3>
        <p className="text-xs text-[#7e8b9b]">Escolha o caminho que faz mais sentido para o seu momento.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="group rounded-2xl bg-[#0c1016] border border-[#1b2330] p-5 flex flex-col justify-between hover:border-[#273448] transition-all hover:shadow-[0_0_20px_rgba(123, 232, 1,0.06)]"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#7be801] border border-emerald-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#7e8b9b] mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <button
                  onClick={step.onClick}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-0.5"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
