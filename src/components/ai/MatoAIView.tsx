import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Plus,
  Zap,
  BarChart2,
  Megaphone,
  FileText,
  Layout,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoBanner } from '../common/DemoBanner';

export const MatoAIView: React.FC = () => {
  const { aiMessages, sendAIMessage, userProfile } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeCategory, setActiveCategory] = useState<'geral' | 'copys' | 'sites' | 'campanhas' | 'analytics'>('geral');

  const promptPresets = [
    {
      category: 'copys',
      title: 'Gerar Copy para Lançamento Pix',
      prompt: 'Crie uma copy persuasiva para WhatsApp oferecendo desconto de 10% para pagamentos via Pix no MATO Pay.',
    },
    {
      category: 'sites',
      title: 'Estruturar Loja Virtual de Roupas',
      prompt: 'Crie a estrutura de seções, headlines e chamadas para ação de um e-commerce streetwear dark mode.',
    },
    {
      category: 'campanhas',
      title: 'Campanha de Tráfego Pago',
      prompt: 'Monte um roteiro de 3 criativos de vídeo para anúncios no Instagram focados em conversão direta.',
    },
    {
      category: 'analytics',
      title: 'Análise de Desempenho Semanal',
      prompt: 'Analise meus números: R$ 12.487,30 faturados, 48 pedidos e 243 clientes. Quais pontos priorizar para escala?',
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendAIMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <DemoBanner moduleName="MATO IA Studio" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white">MATO IA Studio</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Versão 2.4 Pro
            </span>
          </div>
          <p className="text-xs text-[#7e8b9b] mt-1">
            Seu copiloto inteligente para acelerar vendas, criar sites de alta conversão e automatizar marketing.
          </p>
        </div>

        {/* AI credits counter */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0c1016] border border-[#1b2330]">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-[#7e8b9b] uppercase font-bold tracking-wider block">Créditos de IA</span>
            <span className="text-xs font-bold text-white">
              {userProfile?.aiCreditsUsed || 0} / {userProfile?.aiCreditsTotal || 50} utilizados
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[620px]">
        {/* Left Sidebar: Templates & presets */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0c1016] border border-[#1b2330] p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#7e8b9b] uppercase tracking-wider block">
              Atalhos & Especialidades
            </span>

            <div className="space-y-2">
              {promptPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => sendAIMessage(preset.prompt)}
                  className="p-3 rounded-xl bg-[#121822] hover:bg-[#18202c] border border-white/5 hover:border-emerald-500/30 cursor-pointer transition-all group text-left"
                >
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-[#7e8b9b] mt-1 line-clamp-2 leading-tight">
                    {preset.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121822] border border-white/5 text-[11px] text-[#7e8b9b] flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Arquitetura Segura: Nenhum segredo ou chave de API de LLM fica exposto no frontend. Todas as requisições passam pelo backend protegido.
            </span>
          </div>
        </div>

        {/* Right Chat Interface */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0c1016] border border-[#1b2330] flex flex-col overflow-hidden">
          {/* Conversation stream */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#7be801] flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-black font-semibold rounded-br-none shadow-[0_0_15px_rgba(123, 232, 1,0.2)]'
                      : 'bg-[#121822] border border-[#1d2736] text-gray-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-2 text-right ${
                      msg.sender === 'user' ? 'text-black/60' : 'text-[#64748b]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt input */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#111721] border-t border-[#1b2330] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida ou comando para a MATO IA..."
              className="flex-1 bg-[#141b25] border border-[#232f42] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(123, 232, 1,0.3)] active:scale-95"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
