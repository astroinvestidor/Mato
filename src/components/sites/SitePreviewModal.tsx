import React from 'react';
import { X, ExternalLink, Globe, Smartphone, Monitor, ShoppingBag, ArrowRight, Download } from 'lucide-react';
import { SiteProject } from '../../types';
import { useApp } from '../../context/AppContext';

interface SitePreviewModalProps {
  site: SiteProject | null;
  onClose: () => void;
}

export const SitePreviewModal: React.FC<SitePreviewModalProps> = ({ site, onClose }) => {
  const { showToast } = useApp();
  if (!site) return null;

  const handleExport = () => {
    showToast(`Arquivos estáticos do projeto "${site.name}" preparados para download!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl h-[85vh] rounded-3xl bg-[#0c1017] border border-[#202b3c] shadow-2xl flex flex-col overflow-hidden">
        {/* Preview Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#111722] border-b border-[#1b2535]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-300 font-mono">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>{site.url || `https://${site.name.toLowerCase()}.mato.site`}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Site Simulation Preview Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#07090d] p-6 space-y-8">
          {/* Site Navbar */}
          <nav className="flex items-center justify-between py-4 border-b border-white/10 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-wider">{site.name}</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-xs text-gray-300">
              <span className="text-[#7be801] font-semibold">Início</span>
              <span>Catálogo</span>
              <span>Novidades</span>
              <span>Contato</span>
            </div>
            <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/15">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Carrinho (0)</span>
            </button>
          </nav>

          {/* Site Hero Banner */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#121b24] via-[#0d141b] to-[#0a0d12] border border-white/10 p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-md space-y-4 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[#7be801]/15 text-[#7be801] border border-[#7be801]/30">
                Coleção Exclusiva 2026
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Design Futurista, Conforto Extremo.
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {site.description}
              </p>
              <div className="pt-2 flex gap-3">
                <button className="px-5 py-2.5 rounded-xl bg-[#7be801] text-black font-bold text-xs flex items-center gap-2 hover:bg-[#68c700] transition-all">
                  <span>Comprar Agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="absolute right-4 -bottom-6 w-72 h-72 opacity-90 hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
                alt="Product Showcase"
                className="w-full h-full object-contain transform -rotate-12 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Grid Sample */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Destaques da Loja</h3>
              <span className="text-xs text-[#7be801] font-semibold">Ver todos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'MATO Sneaker Stealth', price: 'R$ 269,90', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
                { name: 'Cyber Oversized Hoodie', price: 'R$ 199,90', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&q=80' },
                { name: 'Carteira Carbon Fiber', price: 'R$ 89,90', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80' },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl bg-[#0f141d] border border-white/5 p-4 space-y-3">
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-sm font-extrabold text-[#7be801] mt-1">{item.price}</p>
                  </div>
                  <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#7be801] hover:text-black text-gray-200 text-xs font-semibold transition-all">
                    Adicionar ao Carrinho
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#111722] border-t border-[#1b2535] flex items-center justify-between text-xs text-gray-400">
          <span>Checkout MATO Pay integrado e responsivo.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
