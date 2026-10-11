import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FloatingMatoIAWidget: React.FC = () => {
  const { isAIChatOpen, setIsAIChatOpen, aiMessages, sendAIMessage } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    sendAIMessage(inputValue.trim());
    setInputValue('');
  };

  const handleSuggestionClick = (prompt: string) => {
    // Strip leading '+'
    const cleanPrompt = prompt.replace(/^\+\s*/, '');
    sendAIMessage(cleanPrompt);
  };

  if (!isAIChatOpen) {
    return (
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0c1412] border border-emerald-500/40 text-white font-semibold text-xs shadow-[0_0_25px_rgba(123, 232, 1,0.3)] hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="p-1 rounded-full bg-emerald-500/20 text-[#7be801]">
          <Bot className="w-4 h-4" />
        </div>
        <span>MATO IA</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
          Novo
        </span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Assistente MATO IA"
      className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] rounded-2xl bg-[#0b1016] border border-[#1b2636] shadow-2xl flex flex-col overflow-hidden transition-all duration-200 backdrop-blur-xl ${
        isMinimized ? 'h-14' : 'h-[500px]'
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e141c] border-b border-[#1b2536]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#7be801]">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white">MATO IA</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Novo
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#7e8b9b]">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsAIChatOpen(false)}
            className="p-1 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Body */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#7be801] flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-black font-medium rounded-br-none shadow-[0_0_15px_rgba(123, 232, 1,0.2)]'
                      : 'bg-[#121924] border border-[#1e2a3a] text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-black/60' : 'text-[#67778b]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Clickable Suggested Prompt Chips */}
            {aiMessages.length === 1 && aiMessages[0].suggestedPrompts && (
              <div className="space-y-1.5 pt-1 pl-9">
                {aiMessages[0].suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-[#111722] hover:bg-[#162030] border border-[#1e2b3c] hover:border-emerald-500/40 text-[11px] text-gray-300 hover:text-white transition-all flex items-center gap-1.5 group"
                  >
                    <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">+</span>
                    <span>{prompt.replace(/^\+\s*/, '')}</span>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mode notice */}
          <div className="px-3.5 py-1 bg-[#090d12] border-t border-white/5 text-[10px] text-[#67778b] flex justify-between items-center">
            <span>Modo: Demonstração Interativa</span>
            <span className="text-emerald-400">Pronto para backend</span>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-2.5 bg-[#0e141c] border-t border-[#1a2434] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-[#141b26] border border-[#222f42] rounded-xl px-3 py-2 text-xs text-white placeholder-[#5a6b80] focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-[#7be801] hover:bg-[#68c700] disabled:opacity-40 disabled:hover:bg-[#7be801] text-black transition-all active:scale-95 shadow-[0_0_10px_rgba(123, 232, 1,0.3)]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </aside>
  );
};
