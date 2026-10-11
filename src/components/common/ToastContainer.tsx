import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-[#0e141c]/95 border border-[#1f2838] shadow-2xl backdrop-blur-md animate-in slide-in-from-right-4 fade-in"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          {(toast.type === 'info' || toast.type === 'warning') && (
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs text-gray-200 leading-snug">{toast.message}</div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
