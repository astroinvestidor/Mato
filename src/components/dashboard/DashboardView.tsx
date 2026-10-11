import React from 'react';
import { HeroBanner } from './HeroBanner';
import { QuickAccessCards } from './QuickAccessCards';
import { MetricsSummary } from './MetricsSummary';
import { RevenueAndTransactions } from './RevenueAndTransactions';
import { OnboardingSteps } from './OnboardingSteps';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Hero Banner matching reference image */}
      <HeroBanner />

      {/* 2. Quick Access (MATO Pay, MATO Sites, MATO IA) */}
      <QuickAccessCards />

      {/* 3. Daily Summary with 4 KPI cards & period dropdown */}
      <MetricsSummary />

      {/* 4. Revenue SVG Chart & Recent Transactions List */}
      <RevenueAndTransactions />

      {/* 5. Onboarding Pathways: "Como você quer começar?" */}
      <OnboardingSteps />

      {/* 6. Rodapé da Página Inicial com o Ícone Oficial MATO */}
      <footer className="mt-14 pt-8 border-t border-[#171f2b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center p-2.5 rounded-2xl bg-[#101913] border border-[#7be801]/35 shadow-[0_0_22px_rgba(123,232,1,0.25)] flex-shrink-0 hover:border-[#7be801]/60 transition-all">
            <img
              src="/mato-leaf-icon.png"
              alt="MATO"
              className="w-9 h-7 object-contain filter drop-shadow-[0_0_12px_rgba(123,232,1,0.7)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-[#7e8b9b]">
          <span className="inline-flex items-center gap-1.5 text-[#7be801] font-semibold px-2.5 py-1 rounded-full bg-[#7be801]/10 border border-[#7be801]/20">
            <span className="w-2 h-2 rounded-full bg-[#7be801] animate-pulse shadow-[0_0_8px_#7be801]" />
            Sistemas 100% Operacionais
          </span>
          <span className="text-[#3a4759]">|</span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacidade & Termos</span>
          <span className="text-[#3a4759]">|</span>
          <span>© 2026 MATO Tecnologia S.A.</span>
        </div>
      </footer>
    </div>
  );
};
