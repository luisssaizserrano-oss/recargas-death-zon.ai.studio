import React, { useState } from 'react';
import { VALID_COUPONS } from '../data/packages';
import { Tag, Check, X, Sparkles } from 'lucide-react';

interface CouponSectionProps {
  appliedCoupon: { code: string; percent: number } | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CouponSection: React.FC<CouponSectionProps> = ({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onToast,
}) => {
  const [couponInput, setCouponInput] = useState<string>('');

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      onToast('Ingresa un código de descuento', 'info');
      return;
    }
    if (VALID_COUPONS[code]) {
      onApplyCoupon(code);
      setCouponInput('');
    } else {
      onToast('Código de descuento no válido', 'error');
    }
  };

  return (
    <section id="coupon-section" className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-2.5 sm:p-4 shadow-xl space-y-2 sm:space-y-2.5 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="p-1 sm:p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-['Oswald'] text-xs sm:text-base uppercase tracking-wider text-white leading-tight">
              ¿Tienes un Cupón de Descuento?
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-300 hidden xs:block">Ingresa tu código promocional para obtener un descuento</p>
          </div>
        </div>
        {appliedCoupon && (
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300 bg-emerald-950 border border-emerald-500/60 px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
            -{appliedCoupon.percent}% Activo
          </span>
        )}
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/60 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-300 font-mono tracking-wider text-xs">{appliedCoupon.code}</span>
            <span className="text-[10px] sm:text-[11px] text-emerald-300 font-medium">(-{appliedCoupon.percent}%)</span>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            aria-label="Remover cupón de descuento aplicado"
            className="p-1 text-slate-300 hover:text-rose-300 transition-colors flex items-center gap-1 text-[11px]"
            title="Remover cupón"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quitar</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleCouponSubmit} className="flex gap-1.5 sm:gap-2">
          <input
            type="text"
            placeholder="Código de cupón..."
            aria-label="Código de cupón de descuento"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 bg-[#040812] border border-slate-700 rounded-xl px-3 py-1.5 sm:py-2 text-xs text-white placeholder-slate-400 uppercase font-mono focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            aria-label="Canjear código de cupón"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-black font-bold text-xs rounded-xl font-['Oswald'] uppercase tracking-wider transition-all shrink-0 shadow-md shadow-cyan-500/20"
          >
            Canjear
          </button>
        </form>
      )}
    </section>
  );
};
