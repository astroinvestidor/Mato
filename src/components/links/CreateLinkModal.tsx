import React, { useState } from 'react';
import { X, Link2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreateLinkModal: React.FC = () => {
  const { isCreateLinkModalOpen, setIsCreateLinkModalOpen, addPaymentLink, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<number | ''>(97.00);

  if (!isCreateLinkModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || Number(price) <= 0) {
      showToast('Por favor, informe título e preço válidos.', 'error');
      return;
    }

    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    addPaymentLink({
      title,
      slug: cleanSlug,
      price: Number(price),
      status: 'ativo',
    });

    setIsCreateLinkModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d1218] border border-[#202b3c] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2535] bg-[#111721]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Criar Link de Pagamento</h3>
          </div>
          <button
            onClick={() => setIsCreateLinkModalOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Título da Oferta / Produto *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Consultoria Express, Template VIP..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Valor Cobrado (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Slug Personalizado (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: consultoria-express"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#141b25] text-[11px] text-[#7e8b9b] border border-white/5">
            URL do checkout gerado:{' '}
            <span className="text-emerald-400 font-mono">
              https://pay.mato.digital/p/{slug || 'sua-oferta'}
            </span>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setIsCreateLinkModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-[#141b25] text-gray-300 hover:text-white font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(123, 232, 1,0.3)]"
            >
              Gerar Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
