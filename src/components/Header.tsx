import React from 'react';
import { ShieldCheck, Zap, MessageSquareText, Gamepad2, ShoppingCart } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/packages';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount = 0, onOpenCart }) => {
  return (
    <header className="relative bg-[#050b14]/85 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)] z-20">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
        {/* Mobile View: Compact, Sleek Bar */}
        <div className="flex sm:hidden items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/death_zone_logo.webp"
              alt="Logo de Recargas Death Zone"
              width="32"
              height="32"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-contain border border-cyan-500/40 shadow-md shadow-cyan-500/30 shrink-0 bg-black"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold uppercase font-['Oswald'] tracking-wide text-white leading-none">
                  RECARGAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">DEATH ZONE</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950 border border-red-500/60 text-red-300">
                  BS
                </span>
              </div>
              <p className="text-[10px] text-emerald-300 font-semibold leading-tight">
                Precios en Bs • Ref. en USD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="Abrir carrito de compras"
                className="relative bg-[#0b1626] hover:bg-[#12233c] text-cyan-300 border border-cyan-500/40 px-2 py-1.5 rounded-lg text-[11px] font-bold uppercase font-['Oswald'] tracking-wider flex items-center gap-1 shrink-0 shadow cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xs:inline">Carrito</span>
                {cartCount > 0 && (
                  <span className="bg-emerald-400 text-black font-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-mono px-1">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Contactar soporte por WhatsApp"
              className="bg-[#0b1626] hover:bg-[#12233c] text-white border border-cyan-500/40 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase font-['Oswald'] tracking-wider flex items-center gap-1.5 shrink-0 shadow"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Soporte</span>
            </a>
          </div>
        </div>

        {/* Desktop & Tablet View (Intact) */}
        <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3.5">
            <img
              src="/death_zone_logo.webp"
              alt="Logo de Recargas Death Zone"
              width="56"
              height="56"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-contain border border-cyan-500/40 shadow-xl shadow-cyan-500/20 shrink-0 bg-black"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                  <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Tienda Oficial de Recargas</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-bold tracking-wider uppercase">
                  <Gamepad2 className="w-3 h-3 text-red-400" />
                  Blood Strike
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase font-['Oswald'] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                RECARGAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300">DEATH ZONE</span>
              </h1>

              <p className="text-emerald-400 font-semibold text-xs tracking-wide flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Precios en Bolívares (Bs) y Referencia en Dólares ($ USD)</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="Abrir carrito de compras"
                className="bg-[#0b1626]/90 hover:bg-[#12233c] text-white border border-cyan-500/40 hover:border-cyan-400 px-3.5 py-2 rounded-xl text-xs font-bold uppercase font-['Oswald'] tracking-wider transition-all flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span>Carrito</span>
                {cartCount > 0 ? (
                  <span className="bg-emerald-400 text-black font-black text-xs px-2 py-0.5 rounded-full font-mono shadow-md animate-pulse">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">0</span>
                )}
              </button>
            )}

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Contactar atención al cliente por WhatsApp"
              className="bg-[#0b1626]/90 hover:bg-[#12233c] text-white border border-cyan-500/40 hover:border-cyan-400 px-3.5 py-2 rounded-xl text-xs font-bold uppercase font-['Oswald'] tracking-wider transition-all flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 active:scale-95"
            >
              <MessageSquareText className="w-4 h-4 text-emerald-400" />
              <span>Soporte WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};


