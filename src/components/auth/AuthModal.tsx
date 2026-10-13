import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (!success) {
          setError('E-mail ou senha incorretos.');
        }
      } else {
        if (!name.trim()) {
          setError('Informe seu nome completo.');
          setIsLoading(false);
          return;
        }
        const success = await register(name, email, password);
        if (!success) {
          setError('Não foi possível criar a conta. Tente novamente.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090b]/90 backdrop-blur-md overflow-y-auto">
      {/* Background wallpaper glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity filter saturate-150 contrast-125"
        style={{ backgroundImage: `url('/mato-bg-grass.jpg')` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#08090b]/80 via-[#08090b]/90 to-[#08090b]/98" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0c1016]/95 border border-[#1d2736] p-7 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3.5 mb-6">
          <div className="w-full flex items-center justify-center">
            <img
              src="/mato-brand-solid-white.png?v=3"
              alt="MATO"
              className="h-9 sm:h-10 w-auto mx-auto block object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta na MATO'}
            </h2>
            <p className="text-xs text-[#7e8b9b] mt-1">
              {mode === 'login'
                ? 'Plataforma de pagamentos para infoprodutos e sites'
                : 'Comece a vender online e receber via Pix hoje mesmo'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou da sua empresa"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121822] border border-[#1f2838] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7be801]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121822] border border-[#1f2838] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7be801]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121822] border border-[#1f2838] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7be801]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#7be801] hover:bg-[#68c700] text-black font-black text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(123,232,1,0.3)] hover:shadow-[0_0_25px_rgba(123,232,1,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Processando...</span>
            ) : mode === 'login' ? (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Criar Conta Gratuita</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-5 text-center text-xs text-[#7e8b9b]">
          {mode === 'login' ? (
            <>
              Não tem uma conta ainda?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-[#7be801] font-bold hover:underline"
              >
                Cadastre-se grátis
              </button>
            </>
          ) : (
            <>
              Já possui conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#7be801] font-bold hover:underline"
              >
                Fazer login
              </button>
            </>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-[#7e8b9b]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7be801]" />
          <span>Ambiente 100% seguro e criptografado</span>
        </div>
      </div>
    </div>
  );
};
