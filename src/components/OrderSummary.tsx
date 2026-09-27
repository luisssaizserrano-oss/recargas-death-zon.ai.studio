import React from 'react';
import { PackageItem } from '../types';
import { calculateEffectivePrice } from '../data/packages';
import { Sparkles, Gamepad2, UserCheck, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OrderSummaryProps {
  playerId: string;
  isVerified?: boolean;
  selectedPackage: PackageItem | null;
  referenceNumber: string;
  appliedCoupon: { code: string; percent: number } | null;
  stepNumber?: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  playerId,
  isVerified = false,
  selectedPackage,
  referenceNumber,
  appliedCoupon,
  stepNumber = 3,
}) => {
  const basePriceBs = selectedPackage ? selectedPackage.priceNumeric : 0;
  const basePriceUsd = selectedPackage ? selectedPackage.priceUsd : 0;
  const discountPercent = appliedCoupon ? appliedCoupon.percent : 0;
  const priceInfo = selectedPackage
    ? calculateEffectivePrice(basePriceBs, basePriceUsd, discountPercent)
    : {
        finalBsNumeric: 0,
        finalUsdNumeric: 0,
        formattedBs: '0,00 Bs',
        originalFormattedBs: '0,00 Bs',
        formattedUsd: '$0.00 USD',
        originalFormattedUsd: '$0.00 USD',
      };

  return (
    <section id="step-3" className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-3 sm:p-5 shadow-2xl space-y-2.5 sm:space-y-3.5 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 sm:pb-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500 text-black font-extrabold font-['Oswald'] text-xs sm:text-sm shadow-md shadow-cyan-500/30 shrink-0">
            {stepNumber}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <h2 className="font-['Oswald'] text-sm sm:text-lg uppercase tracking-wider text-white">
              Resumen de Pedido
            </h2>
          </div>
        </div>
        <span className="text-[9px] sm:text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 sm:px-2.5 py-0.5 rounded-full font-mono font-semibold">
          Blood Strike
        </span>
      </div>

      {/* Ticket Body */}
      <div className="bg-[#040812] border border-slate-800/80 rounded-xl p-2.5 sm:p-3.5 space-y-2 sm:space-y-2.5 font-sans text-xs">
        {/* Game */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Juego:
          </span>
          <span className="font-semibold text-slate-200">Blood Strike</span>
        </div>

        {/* Player ID */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
          <span className="text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> ID de Usuario:
          </span>
          {playerId ? (
            <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-800/50 flex items-center gap-1.5">
              {playerId}
              {isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </span>
          ) : (
            <span className="text-rose-400 italic text-[11px] font-medium">Pendiente en Paso 1...</span>
          )}
        </div>

        {/* Selected Package */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Producto:
          </span>
          {selectedPackage ? (
            <span className="font-bold text-white max-w-[220px] truncate text-right flex items-center justify-end gap-2">
              {selectedPackage.image && (
                <img
                  src={selectedPackage.image}
                  alt={selectedPackage.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded object-cover border border-white/20 flex-shrink-0"
                />
              )}
              <span>{selectedPackage.name}</span>
            </span>
          ) : (
            <span className="text-rose-400 italic text-[11px] font-medium">Selecciona un paquete en Paso 2</span>
          )}
        </div>

        {/* Reference Number status */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> N° Referencia / ID:
          </span>
          {referenceNumber.trim() ? (
            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              #{referenceNumber}
            </span>
          ) : (
            <span className="text-amber-400 italic text-[11px] font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Requerido en Paso 4
            </span>
          )}
        </div>

        {/* Coupon applied badge if any */}
        {appliedCoupon && (
          <div className="flex items-center justify-between py-1 border-b border-slate-900 text-emerald-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3" /> Cupón "{appliedCoupon.code}":
            </span>
            <span className="font-mono font-bold text-[11px]">-{appliedCoupon.percent}% OFF</span>
          </div>
        )}

        {/* Total Price Display */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total a Pagar</span>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['Oswald'] text-emerald-400 tracking-wide">
                  {selectedPackage ? priceInfo.formattedBs : '0,00 Bs'}
                </span>
                {appliedCoupon && selectedPackage && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    {priceInfo.originalFormattedBs}
                  </span>
                )}
              </div>
              {selectedPackage && (
                <span className="text-xs text-slate-400 font-mono font-medium">
                  Referencia en Dólares: <strong className="text-slate-200">{priceInfo.formattedUsd}</strong>
                </span>
              )}
            </div>
          </div>

          {appliedCoupon && (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              -{appliedCoupon.percent}% APLICADO
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
