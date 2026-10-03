import React, { useState, useEffect } from 'react';
import { User, HelpCircle, CheckCircle2, History, Trash2, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { validarIdGame } from '../services/vothApi';

interface UserIdStepProps {
  playerId: string;
  setPlayerId: (id: string) => void;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  playerNickname?: string;
  setPlayerNickname?: (name: string) => void;
  onOpenGuide: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const UserIdStep: React.FC<UserIdStepProps> = ({
  playerId,
  setPlayerId,
  isVerified,
  setIsVerified,
  playerNickname = '',
  setPlayerNickname,
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
    if (playerNickname && setPlayerNickname) {
      setPlayerNickname('');
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

  const handleVerifyPlayer = async () => {
    if (!playerId || playerId.length < 5) {
      onToast('Por favor ingresa un ID válido (mínimo 5 dígitos)', 'error');
      return;
    }

    setIsVerifying(true);
    setIsVerified(false);

    try {
      const resultado = await validarIdGame(playerId);

      if (resultado.success && resultado.valid) {
        // ÉXITO: El ID existe y te devuelve el nombre del personaje
        setIsVerified(true);
        if (setPlayerNickname) {
          setPlayerNickname(resultado.nickname || '');
        }
        handleSaveId(playerId);
        onToast(`Jugador encontrado: ${resultado.nickname || 'Cuenta Verificada'}`, 'success');
      } else {
        // ERROR: El ID no se encuentra en los servidores de NetEase
        setIsVerified(false);
        if (setPlayerNickname) {
          setPlayerNickname('');
        }
        onToast(resultado.error || 'ID Inválido. Por favor verifica tus datos.', 'error');
      }
    } catch (error) {
      console.error('Error en la conexión de la API de validación:', error);
      setIsVerified(false);
      onToast('Error temporal del sistema. Intenta de nuevo.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectRecent = async (id: string) => {
    setPlayerId(id);
    setIsVerifying(true);
    setIsVerified(false);
    try {
      const resultado = await validarIdGame(id);
      if (resultado.success && resultado.valid) {
        setIsVerified(true);
        if (setPlayerNickname) {
          setPlayerNickname(resultado.nickname || '');
        }
        onToast(`Jugador encontrado: ${resultado.nickname || id}`, 'success');
      } else {
        onToast(resultado.error || 'ID Inválido. Por favor verifica tus datos.', 'error');
      }
    } catch {
      onToast('Error temporal del sistema. Intenta de nuevo.', 'error');
    } finally {
      setIsVerifying(false);
    }
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
            <p className="text-[11px] sm:text-xs text-slate-300 hidden xs:block">Verifica tu cuenta de Blood Strike para recargar</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenGuide}
          aria-label="¿Dónde encuentro mi User ID? Ver guía paso a paso"
          className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all shrink-0 shadow-sm"
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300">
              <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isVerified ? 'text-emerald-400' : isValidId ? 'text-cyan-400' : 'text-slate-400'}`} />
            </div>

            <input
              type="text"
              id="player-id"
              aria-label="User ID de Blood Strike"
              value={playerId}
              onChange={handleIdChange}
              placeholder="Ej. 1234567890"
              maxLength={15}
              className={`w-full pl-8 sm:pl-10 pr-9 sm:pr-11 py-2 sm:py-3 bg-[#040812] border rounded-xl text-white font-mono text-sm sm:text-base placeholder-slate-400 focus:outline-none transition-all ${
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
            aria-label="Verificar User ID de Blood Strike"
            className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl font-['Oswald'] uppercase tracking-wider text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              isVerified
                ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300'
                : isValidId
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-300 border border-slate-700/60 cursor-not-allowed opacity-70'
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
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 px-1 pt-0.5">
          <span>
            {isVerified ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                ID verificado correctamente
              </span>
            ) : isValidId ? (
              <span className="text-cyan-300">Presiona <b>"Verificar ID"</b> para confirmar</span>
            ) : playerId.length > 0 ? (
              <span className="text-amber-300 font-medium">Mínimo 5 dígitos (solo números)</span>
            ) : (
              'Ingresa tu ID de Blood Strike'
            )}
          </span>

          {/* Recent IDs tags */}
          {recentIds.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
              <span className="text-[10px] uppercase text-slate-300 font-medium flex items-center gap-1">
                <History className="w-3 h-3 text-cyan-400" /> Recientes:
              </span>
              {recentIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectRecent(id)}
                  aria-label={`Usar ID reciente ${id}`}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-200 font-mono text-[11px] border border-slate-600 transition-colors"
                >
                  {id}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearRecent}
                className="p-1 text-slate-300 hover:text-rose-300 transition-colors"
                aria-label="Limpiar historial de IDs recientes"
                title="Limpiar recientes"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Jugador Encontrado / Nickname Card */}
        {isVerified && playerNickname && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-emerald-950/70 via-[#06201a] to-emerald-950/70 border border-emerald-500/50 flex items-center justify-between shadow-lg shadow-emerald-950/40 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/40 shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                  <span>Jugador Encontrado (Servidores NetEase)</span>
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-white font-['Oswald'] tracking-wide">
                  {playerNickname}
                </p>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 shrink-0 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verificado
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
