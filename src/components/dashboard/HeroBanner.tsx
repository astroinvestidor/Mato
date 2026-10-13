import React from 'react';
import { ArrowRight, QrCode, CreditCard, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { setActiveTab, setIsCreateChargeModalOpen, setIsCreateSiteModalOpen } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1410] via-[#090e13] to-[#07090c] border border-[#1b2b20]/60 p-6 md:p-10 shadow-2xl">
      {/* Grass subtle wallpaper texture inside Hero banner */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-15 mix-blend-screen pointer-events-none"
        style={{ backgroundImage: `url('/mato-bg-grass.jpg')` }}
      />
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Text & CTA buttons */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <img
                src="/mato-bold-official.png"
                alt="MATO - Crie. Venda. Cresça."
                className="h-24 sm:h-32 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(123,232,1,0.2)]"
              />
            </div>
            <p className="text-[#9aa5b5] text-sm sm:text-base max-w-lg leading-relaxed pt-1">
              A plataforma completa para você vender online e receber seus pagamentos com segurança, rapidez e sem complicação.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => {
                setActiveTab('receber');
                setIsCreateChargeModalOpen(true);
              }}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(123, 232, 1,0.35)] hover:shadow-[0_0_25px_rgba(123, 232, 1,0.5)] active:scale-[0.98]"
            >
              <QrCode className="w-4 h-4 text-black" />
              <span>Receber pagamento</span>
              <ArrowRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                setActiveTab('sites');
                setIsCreateSiteModalOpen(true);
              }}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#12161f]/80 hover:bg-[#18202c] text-white font-medium text-sm tracking-wide border border-[#232d3d] hover:border-[#384860] transition-all active:scale-[0.98]"
            >
              <span>Criar meu site</span>
              <ArrowRight className="w-4 h-4 text-[#7e8b9b] group-hover:text-white transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right column: Realistic smartphone & laptop mockups */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-4">
          <div className="relative w-full max-w-[540px] flex items-center justify-center">
            
            {/* Realistic Laptop Mockup */}
            <div className="relative w-[340px] sm:w-[410px] rounded-2xl bg-[#0c0f14] border border-[#222b3a] shadow-2xl overflow-hidden transform lg:translate-x-6 z-10">
              {/* Laptop Top Browser Bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#12161f] border-b border-[#1f2634]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <div className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded bg-black/30 border border-white/5">
                  sualoja.mato.site
                </div>
                <div className="w-4" />
              </div>

              {/* Laptop Store Content */}
              <div className="p-3.5 bg-gradient-to-b from-[#0f141c] to-[#0a0d12] space-y-3">
                {/* Store Header */}
                <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-2">
                  <span className="font-bold text-white tracking-wide">Sua Loja</span>
                  <div className="flex gap-2.5 text-[#7e8b9b] text-[10px]">
                    <span className="text-white">Início</span>
                    <span>Produtos</span>
                    <span>Sobre</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded bg-white/10" />
                </div>

                {/* Store Hero Area */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-7 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Sua loja online, <br />
                      <span className="text-[#7be801]">em minutos.</span>
                    </h4>
                    <p className="text-[9px] text-[#7e8b9b] leading-tight line-clamp-2">
                      Crie um site profissional com IA e venda seus produtos integrados ao checkout.
                    </p>
                    <button
                      onClick={() => setActiveTab('sites')}
                      className="px-2.5 py-1 text-[10px] font-semibold rounded bg-[#7be801] text-black inline-flex items-center gap-1 hover:bg-[#68c700] transition-all"
                    >
                      Começar agora <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="col-span-5 flex justify-center">
                    <div className="relative w-24 h-20 rounded-xl bg-gradient-to-br from-[#1c2432] to-[#121620] border border-white/10 overflow-hidden flex items-center justify-center p-1">
                      <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=260&q=80"
                        alt="Sneaker Showcase"
                        className="w-full h-full object-cover rounded-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">Tênis</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-[#7e8b9b]">Roupas</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-[#7e8b9b]">Acessórios</span>
                </div>
              </div>
            </div>

            {/* Realistic Smartphone Mockup Overlaid on Left */}
            <div className="absolute -left-2 sm:left-2 bottom-[-15px] sm:bottom-[-20px] w-[170px] sm:w-[195px] rounded-[24px] bg-[#0c1015] border-[3px] border-[#252f3f] shadow-2xl p-2.5 z-20 backdrop-blur-md">
              {/* Dynamic Island / Speaker */}
              <div className="w-12 h-2.5 bg-black rounded-full mx-auto mb-2" />

              {/* Phone App Header */}
              <div className="flex items-center justify-between text-[10px] text-gray-300 px-1 mb-2">
                <span className="text-[9px] text-[#7e8b9b]">&lt;</span>
                <img src="/mato-leaf-icon.png" alt="" className="h-4 w-auto object-contain" />
                <span className="w-2" />
              </div>

              {/* Charge Card Inside Phone */}
              <div className="rounded-xl bg-[#111722] border border-[#1f293b] p-2.5 text-center space-y-1.5">
                <span className="text-[9px] text-[#7e8b9b] block">Cobrança</span>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  R$ 150,00
                </div>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[8px] font-semibold">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" /> Pix
                </div>

                {/* QR Code graphic (Ilustração autêntica, fixa e original) */}
                <div className="w-24 h-24 mx-auto my-2 p-1.5 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                  <img
                    src="/pix-real-qr.png"
                    alt="Pix QR Code"
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>

                {/* Payment Options Bottom Bar */}
                <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-white/5 text-[8px] text-[#7e8b9b]">
                  <div className="flex flex-col items-center text-emerald-400 font-semibold">
                    <QrCode className="w-3 h-3" />
                    <span>Pix</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CreditCard className="w-3 h-3" />
                    <span>Cartão</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge Bottom Right: "A MATO IA cria seu site em poucos minutos" */}
            <div className="absolute -bottom-3 right-0 sm:right-2 z-30 flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#0f141d]/95 border border-[#7be801]/40 shadow-[0_0_20px_rgba(123, 232, 1,0.2)] backdrop-blur-md">
              <div className="p-1 rounded-lg bg-[#7be801]/20 text-[#7be801]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-gray-200">
                A <strong className="text-[#7be801]">MATO IA</strong> cria seu site em poucos minutos.
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
