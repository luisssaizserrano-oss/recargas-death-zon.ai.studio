import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md transition-all ${
        type === 'success' 
          ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-emerald-900/30' 
          : type === 'error'
          ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-rose-900/30'
          : 'bg-cyan-950/90 border-cyan-500 text-cyan-200 shadow-cyan-900/30'
      }`}>
        {type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
        
        <p className="text-sm font-medium tracking-wide flex-1">{message}</p>
        
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
