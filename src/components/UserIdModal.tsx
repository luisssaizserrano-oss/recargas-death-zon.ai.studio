import React from 'react';
import { X, HelpCircle, UserCheck, ShieldAlert } from 'lucide-react';

interface UserIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserIdModal: React.FC<UserIdModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-id-title"
        className="relative w-full max-w-lg bg-[#0d1726] border-2 border-cyan-500/40 rounded-2xl p-6 text-white shadow-2xl shadow-cyan-950/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-id-title" className="font-['Oswald'] text-xl uppercase tracking-wider text-white">¿Dónde encuentro mi User ID?</h2>
              <p className="text-xs text-slate-300">Guía paso a paso para Blood Strike</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de ayuda"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 bg-[#050b14] border border-slate-800 rounded-xl">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-black font-bold text-xs shrink-0 mt-0.5">1</span>
            <p>Abre el juego <strong className="text-white">Blood Strike</strong> en tu dispositivo móvil o PC.</p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#050b14] border border-slate-800 rounded-xl">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-black font-bold text-xs shrink-0 mt-0.5">2</span>
            <p>Toca la foto de tu <strong className="text-white">Perfil / Avatar</strong> en la esquina superior izquierda de la pantalla principal.</p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#050b14] border border-slate-800 rounded-xl">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-black font-bold text-xs shrink-0 mt-0.5">3</span>
            <p>En la pestaña de resumen de tu cuenta verás tu <strong className="text-cyan-400 font-mono">User ID de 12 dígitos (ej. 109847562301)</strong>. Toca el botón de copiar junto al número.</p>
          </div>

          {/* Visual ID Box Mockup */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-[#0a1220] border border-cyan-500/30 rounded-xl text-center space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-300">Ejemplo de ID en el Juego</span>
            <div className="font-mono text-lg font-bold text-cyan-400 bg-[#020610] py-2 px-4 rounded-lg border border-cyan-500/20 inline-flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>109847562301</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Asegúrate de copiar el ID numérico exacto sin espacios para que tu recarga llegue de inmediato.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de ayuda y continuar"
            className="w-full sm:w-auto px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-['Oswald'] uppercase tracking-wider rounded-xl transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
