import React, { useState } from 'react';
import { X, Package, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreateProductModal: React.FC = () => {
  const { isCreateProductModalOpen, setIsCreateProductModalOpen, addProduct, showToast } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | ''>(199.90);
  const [stock, setStock] = useState<number | ''>(20);
  const [category, setCategory] = useState('Calçados');
  const [imageUrl, setImageUrl] = useState('');

  if (!isCreateProductModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || Number(price) <= 0) {
      showToast('Por favor, informe um nome e preço válidos.', 'error');
      return;
    }

    addProduct({
      name,
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: Number(price),
      stock: Number(stock) || 0,
      category,
      status: 'ativo',
      image: imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    });

    setIsCreateProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d1218] border border-[#202b3c] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2535] bg-[#111721]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Cadastrar Novo Produto</h3>
          </div>
          <button
            onClick={() => setIsCreateProductModalOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Nome do Produto *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tênis MATO Runner Black Neon"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Quantidade em Estoque
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Calçados">Calçados</option>
                <option value="Roupas">Roupas</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Infoprodutos">Infoprodutos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Código SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ex: TNS-NEON-01"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b25] border border-[#232f42] text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setIsCreateProductModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-[#141b25] text-gray-300 hover:text-white font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(123, 232, 1,0.3)]"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
