import React, { useState } from 'react';
import { Package, Plus, Search, Tag, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';
import { CreateProductModal } from './CreateProductModal';

export const ProductsView: React.FC = () => {
  const { products, setIsCreateProductModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="Produtos & Catálogo" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">Produtos</h2>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Gerencie seu catálogo, estoque e vincule produtos aos seus sites e links de pagamento.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProductModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(123, 232, 1,0.3)] active:scale-95"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produto por nome, SKU ou categoria..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121822] border border-[#1e2736] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl bg-[#0c1016] border border-[#1b2330] hover:border-emerald-500/30 p-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="w-full h-40 rounded-xl overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center relative">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-gray-600" />
                )}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-sm text-white">
                  {prod.category}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#7e8b9b] font-mono block">{prod.sku}</span>
                <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{prod.name}</h4>
                <p className="text-base font-extrabold text-[#7be801] mt-1.5">
                  R$ {prod.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#7e8b9b]">
              <span>Estoque: <strong className="text-white">{prod.stock} un.</strong></span>
              <span className="text-emerald-400 font-semibold">{prod.salesCount} vendidos</span>
            </div>
          </div>
        ))}
      </div>

      <CreateProductModal />
    </div>
  );
};
