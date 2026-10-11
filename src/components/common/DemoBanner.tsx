import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface DemoBannerProps {
  moduleName: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ moduleName }) => {
  return (
    <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Ambiente de Demonstração Ativo ({moduleName}):</strong> Os registros exibidos são dados simulados para testes e arquitetura. Pagamentos reais requerem configuração de webhook e credenciais bancárias de produção.
        </span>
      </div>
      <span className="hidden md:inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
        Sandbox
      </span>
    </div>
  );
};
