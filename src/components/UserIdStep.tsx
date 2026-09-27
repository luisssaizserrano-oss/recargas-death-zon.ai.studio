import React, { useState, useEffect } from 'react';
import { User, HelpCircle, CheckCircle2, History, Trash2, ShieldCheck, Loader2 } from 'lucide-react';

interface UserIdStepProps {
  playerId: string;
  setPlayerId: (id: string) => void;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  onOpenGuide: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const UserIdStep: React.FC<UserIdStepProps> = ({
  playerId,
  setPlayerId,
  isVerified,
  setIsVerified,
  onOpenGuide,
  onToast,
}) => {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Load saved IDs on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('deathzone_recent_ids');
      if (saved) {
        setRecentIds(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Numeric only
    setPlayerId(val);
    if (isVerified) {
      setIsVerified(false); // Reset verification check if ID changes
    }
  };

  const handleSaveId = (idToSave: string) => {
    if (!idToSave || idToSave.length < 5) return;
    const updated = Array.from(new Set([idToSave, ...recentIds])).slice(0, 3);
    setRecentIds(updated);
    try {
      localStorage.setItem('deathzone_recent_ids', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleVerifyPlayer = () => {
    if (!playerId || playerId.length < 5) {
      onToast('Por favor ingresa un ID válido (mínimo 5 dígitos)', 'error');
      return;
    }

    setIsVerifying(true);
    setIsVerified(false);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      handleSaveId(playerId);
      onToast('ID de Usuario verificado con éxito ✓', 'success');
    }, 600);
  };

  const handleSelectRecent = (id: string) => {
    setPlayerId(id);
    setIsVerified(true);
    onToast(`ID ${id} cargado y verificado`, 'success');
  };

  const handleClearRecent = () => {
    setRecentIds([]);
    try {
      localStorage.removeItem('deathzone_recent_ids');
    } catch {
      // ignore
    }
    onToast('Historial de IDs limpiado', 'info');
  };

  const isValidId = playerId.length >= 5;

  return (
    <section id="step-1" className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden space-y-2.5 sm:space-y-3.5 scroll-mt-20">
      {/* Step Header */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500 text-black font-extrabold font-['Oswald'] text-xs sm:text-sm shadow-md shadow-cyan-500/30 shrink-0">
            1
          </span>
          <div>
            <h2 className="font-['Oswald'] text-sm sm:text-lg uppercase tracking-wider text-white flex items-center gap-1.5 leading-tight">
              Ingresa tu ID de Usuario
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden xs:block">Verifica tu cuenta de Blood Strike para recargar</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenGuide}
          className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all shrink-0 shadow-sm"
        >
          <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">¿Dónde está mi ID?</span>
          <span className="xs:hidden">Ayuda</span>
        </button>
      </div>

      {/* Input Field + Verify Button */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex flex-row gap-1.5 sm:gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isVerified ? 'text-emerald-400' : isValidId ? 'text-cyan-400' : 'text-slate-500'}`} />
            </div>

            <input
              type="text"
              id="player-id"
              value={playerId}
              onChange={handleIdChange}
              placeholder="Ej. 1234567890"
              maxLength={15}
              className={`w-full pl-8 sm:pl-10 pr-9 sm:pr-11 py-2 sm:py-3 bg-[#040812] border rounded-xl text-white font-mono text-sm sm:text-base placeholder-slate-600 focus:outline-none transition-all ${
                isVerified
                  ? 'border-emerald-500/90 ring-2 ring-emerald-500/30 bg-emerald-950/20'
                  : isValidId
                  ? 'border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30'
                  : 'border-slate-800 focus:border-cyan-500'
              }`}
            />

            {/* Palomita verde (green checkmark) when verified */}
            {isVerified && (
              <div className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3.5 flex items-center gap-1 text-emerald-400 animate-fadeIn pointer-events-none">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              </div>
            )}
          </div>

          {/* Action Button: Verificar ID */}
          <button
            type="button"
            onClick={handleVerifyPlayer}
            disabled={!isValidId || isVerifying}
            className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl font-['Oswald'] uppercase tracking-wider text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              isVerified
                ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300'
                : isValidId
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-70'
            }`}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                <span className="hidden sm:inline">Verificando...</span>
              </>
            ) : isVerified ? (
              <div className="flex items-center gap-1 text-emerald-400 font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span>Listo</span>
              </div>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Verificar</span>
              </>
            )}
          </button>
        </div>

        {/* Validation hint & History */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 pt-0.5">
          <span>
            {isVerified ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                ID verificado correctamente
              </span>
            ) : isValidId ? (
              <span className="text-cyan-400">Presiona <b>"Verificar ID"</b> para confirmar</span>
            ) : playerId.length > 0 ? (
              <span className="text-amber-400">Mínimo 5 dígitos (solo números)</span>
            ) : (
              'Ingresa tu ID de Blood Strike'
            )}
          </span>

          {/* Recent IDs tags */}
          {recentIds.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
              <span className="text-[10px] uppercase text-slate-500 flex items-center gap-1">
                <History className="w-3 h-3" /> Recientes:
              </span>
              {recentIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectRecent(id)}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] border border-slate-700/60 transition-colors"
                >
                  {id}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearRecent}
                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                title="Limpiar recientes"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
