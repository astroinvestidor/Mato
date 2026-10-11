import React from 'react';
import { ArrowRight, Wallet, Globe, Sparkles, Bot, QrCode } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickAccessCards: React.FC = () => {
  const { setActiveTab, setIsCreateChargeModalOpen, setIsCreateSiteModalOpen, setIsAIChatOpen } = useApp();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight">Acesso rápido</h3>
        <p className="text-xs text-[#7e8b9b]">Escolha o que você quer fazer agora.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        
        {/* Card 1: MATO Pay */}
        <div className="relative group overflow-hidden rounded-2xl bg-[#0c1116] border border-[#1d2735] hover:border-emerald-500/40 p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(123, 232, 1,0.12)] flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Top pill */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-[#7be801] border border-emerald-500/20">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white">MATO Pay</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pay
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Receber pagamentos
              </h4>
              <p className="text-xs text-[#8e9cb0] mt-1 line-clamp-2 leading-relaxed">
                Crie cobranças, links ou QR Code e receba via Pix, cartão e muito mais.
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-5 mt-2">
            <button
              onClick={() => {
                setActiveTab('receber');
                setIsCreateChargeModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(123, 232, 1,0.3)] active:scale-95"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>

            {/* Graphic illustration: Smartphone on pedestal */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/25 transition-all" />
              <div className="relative w-14 h-18 rounded-xl bg-[#141b24] border border-emerald-500/30 p-1.5 shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                <div className="w-4 h-1 bg-black/60 rounded-full mx-auto mb-1" />
                <div className="w-full h-8 bg-black/40 rounded flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-emerald-400/80" />
                </div>
                <div className="mt-1 h-1 w-6 bg-emerald-500/40 rounded mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: MATO Sites */}
        <div className="relative group overflow-hidden rounded-2xl bg-[#0c1018] border border-[#1f2435] hover:border-purple-500/40 p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Top pill */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white">MATO Sites</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Sites
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Criar meu site
              </h4>
              <p className="text-xs text-[#8e9cb0] mt-1 line-clamp-2 leading-relaxed">
                Tenha um site completo, com IA, checkout e tudo pronto para vender.
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-5 mt-2">
            <button
              onClick={() => {
                setActiveTab('sites');
                setIsCreateSiteModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] active:scale-95"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Graphic illustration: Laptop display with purple neon */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/25 transition-all" />
              <div className="relative w-18 h-13 rounded-lg bg-[#161a29] border border-purple-500/40 p-1.5 shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform">
                <div className="flex gap-1 mb-1">
                  <div className="w-1 h-1 rounded-full bg-purple-400/60" />
                  <div className="w-1 h-1 rounded-full bg-purple-400/40" />
                </div>
                <div className="w-full h-6 rounded bg-purple-950/40 border border-purple-500/20 flex items-center justify-around px-1">
                  <div className="w-4 h-3 bg-purple-500/30 rounded" />
                  <div className="w-4 h-3 bg-purple-500/30 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: MATO IA */}
        <div className="relative group overflow-hidden rounded-2xl bg-[#0b1213] border border-[#1a2928] hover:border-emerald-500/40 p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(123, 232, 1,0.12)] flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Top pill */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-[#7be801] border border-emerald-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white">MATO IA</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Novo
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Fale com sua IA
              </h4>
              <p className="text-xs text-[#8e9cb0] mt-1 line-clamp-2 leading-relaxed">
                Crie sites, gere textos, campanhas, analise vendas e muito mais.
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-5 mt-2">
            <button
              onClick={() => {
                setIsAIChatOpen(true);
                setActiveTab('ia');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141d22] hover:bg-[#1a282f] text-gray-200 hover:text-white font-medium text-xs tracking-wide border border-[#233535] transition-all active:scale-95"
            >
              <span>Conversar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7e8b9b]" />
            </button>

            {/* Graphic illustration: 3D Cute Robot */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/15 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative flex flex-col items-center">
                {/* Antennas */}
                <div className="w-1.5 h-2 bg-emerald-500/80 rounded-t-full mb-0.5 animate-pulse" />
                {/* Robot Head */}
                <div className="w-12 h-11 rounded-2xl bg-gradient-to-b from-[#132821] to-[#0d1a16] border border-emerald-400/50 p-1.5 shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-9 h-6 rounded-xl bg-black/80 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7be801] shadow-[0_0_8px_#7be801]" />
                    <span className="w-2 h-2 rounded-full bg-[#7be801] shadow-[0_0_8px_#7be801]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
