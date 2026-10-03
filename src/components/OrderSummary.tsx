import React from 'react';
import { PackageItem, CartItem } from '../types';
import { calculateCartTotals, formatBs, formatUsd, WHATSAPP_NUMBER } from '../data/packages';
import { Sparkles, Gamepad2, UserCheck, CreditCard, AlertTriangle, CheckCircle2, MessageSquareText, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

interface OrderSummaryProps {
  playerId: string;
  isVerified?: boolean;
  playerNickname?: string;
  selectedPackage: PackageItem | null;
  cart?: CartItem[];
  referenceNumber: string;
  appliedCoupon: { code: string; percent: number } | null;
  stepNumber?: number;
  onToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenCart?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  playerId,
  isVerified = false,
  playerNickname = '',
  selectedPackage,
  cart = [],
  referenceNumber,
  appliedCoupon,
  stepNumber = 4,
  onToast,
  onOpenCart,
}) => {
  const effectiveCart: CartItem[] =
    cart && cart.length > 0
      ? cart
      : selectedPackage
      ? [{ packageItem: selectedPackage, quantity: 1 }]
      : [];

  const discountPercent = appliedCoupon ? appliedCoupon.percent : 0;
  const totals = calculateCartTotals(effectiveCart, discountPercent);
  const hasItems = effectiveCart.length > 0;

  const handleWhatsAppSend = () => {
    if (!playerId || playerId.trim().length < 5) {
      if (onToast) onToast('Por favor ingresa tu ID de usuario de Blood Strike (Paso 1)', 'error');
      document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!hasItems) {
      if (onToast) onToast('Por favor selecciona al menos un paquete para tu pedido (Paso 2)', 'error');
      document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!referenceNumber || referenceNumber.trim().length < 3) {
      if (onToast) onToast('El N° de Referencia es OBLIGATORIO (Paso 3)', 'error');
      document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    let itemsList = '';
    if (effectiveCart.length === 1 && effectiveCart[0].quantity === 1) {
      itemsList = `📦 *Producto:* ${effectiveCart[0].packageItem.name}\n`;
    } else {
      itemsList =
        `🛒 *DETALLE DEL PEDIDO (${totals.itemCount} unidades):*\n` +
        effectiveCart
          .map(
            (item) =>
              `• ${item.quantity}x ${item.packageItem.name} - ${formatBs(
                item.packageItem.priceNumeric * item.quantity
              )} (Ref: ${formatUsd(item.packageItem.priceUsd * item.quantity)})`
          )
          .join('\n') +
        `\n━━━━━━━━━━━━━━━━━━━━\n📦 *Total Artículos:* ${totals.itemCount} unidades\n`;
    }

    let mensaje =
      `⚡ *NUEVA RECARGA - DEATH ZONE* ⚡\n\n` +
      `🎮 *Juego:* Blood Strike\n` +
      `🆔 *User ID:* ${playerId.trim()}${playerNickname ? ` (${playerNickname})` : ''}${isVerified ? ' (Verificado ✓)' : ''}\n` +
      (playerNickname ? `👤 *Jugador:* ${playerNickname}\n` : '') +
      itemsList +
      `🔢 *N° Referencia / ID:* ${referenceNumber.trim()}\n`;

    if (appliedCoupon) {
      mensaje += `🏷️ *Cupón Aplicado:* ${appliedCoupon.code} (-${appliedCoupon.percent}%)\n`;
      mensaje += `💵 *Monto Total:* ${totals.formattedTotalBs} (Ref: ${totals.formattedTotalUsd})\n`;
    } else {
      mensaje += `💰 *Monto Total:* ${totals.formattedTotalBs} (Ref: ${totals.formattedTotalUsd})\n`;
    }

    mensaje += `\n📌 *Estado:* Comprobante registrado. Listo para verificación y entrega.`;

    const encodedText = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    if (onToast) onToast('Redirigiendo a WhatsApp...', 'success');
  };

  return (
    <section id={`step-${stepNumber}`} className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-3 sm:p-5 shadow-2xl space-y-2.5 sm:space-y-3.5 scroll-mt-20">
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
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Juego:
          </span>
          <span className="font-semibold text-slate-100">Blood Strike</span>
        </div>

        {/* Player ID & Nickname */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> ID de Usuario:
          </span>
          {playerId ? (
            <div className="flex flex-col items-end">
              <span className="font-mono font-bold text-cyan-200 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-500/50 flex items-center gap-1.5">
                {playerId}
                {isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </span>
              {playerNickname && (
                <span className="text-[11px] text-emerald-300 font-bold tracking-wide mt-0.5 flex items-center gap-1">
                  <span>🎮</span> {playerNickname}
                </span>
              )}
            </div>
          ) : (
            <span className="text-rose-300 italic text-[11px] font-medium">Pendiente en Paso 1...</span>
          )}
        </div>

        {/* Products in Cart or Selected Package */}
        <div className="py-1.5 border-b border-slate-900/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
              <span>{effectiveCart.length > 1 || (effectiveCart[0]?.quantity > 1) ? `Pedido (${totals.itemCount} artículos):` : 'Producto:'}</span>
            </span>

            {onOpenCart && effectiveCart.length > 0 && (
              <button
                type="button"
                onClick={onOpenCart}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Ver / Modificar Carrito
              </button>
            )}
          </div>

          {effectiveCart.length > 0 ? (
            <div className="space-y-1.5 mt-1.5">
              {effectiveCart.map((item) => (
                <div
                  key={item.packageItem.id}
                  className="flex items-center justify-between gap-2 text-xs bg-slate-900/60 p-1.5 sm:p-2 rounded-lg border border-slate-800"
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.packageItem.image ? (
                      <img
                        src={item.packageItem.image}
                        alt={item.packageItem.name}
                        width="24"
                        height="24"
                        className="w-6 h-6 rounded object-cover border border-white/20 shrink-0"
                      />
                    ) : (
                      <span className="text-xs">🪙</span>
                    )}
                    <span className="font-semibold text-white truncate">
                      <span className="text-emerald-400 font-bold font-mono mr-1.5">x{item.quantity}</span>
                      {item.packageItem.name}
                    </span>
                  </div>
                  <span className="font-mono text-cyan-200 shrink-0 text-right">
                    {formatBs(item.packageItem.priceNumeric * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-rose-300 italic text-[11px] font-medium">Selecciona al menos un paquete en Paso 2</span>
          )}
        </div>

        {/* Reference Number status */}
        <div className="flex items-center justify-between py-1 border-b border-slate-900/80">
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> N° Referencia / ID:
          </span>
          {referenceNumber.trim() ? (
            <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/50">
              #{referenceNumber}
            </span>
          ) : (
            <span className="text-amber-300 italic text-[11px] font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" /> Requerido en Paso 3 (Pago)
            </span>
          )}
        </div>

        {/* Coupon applied badge if any */}
        {appliedCoupon && (
          <div className="flex items-center justify-between py-1 border-b border-slate-900 text-emerald-300">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3" /> Cupón "{appliedCoupon.code}":
            </span>
            <span className="font-mono font-bold text-[11px]">-{appliedCoupon.percent}% OFF (-{totals.formattedDiscountBs})</span>
          </div>
        )}

        {/* Total Price Display */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">Total a Pagar</span>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['Oswald'] text-emerald-400 tracking-wide">
                  {hasItems ? totals.formattedTotalBs : '0,00 Bs'}
                </span>
                {appliedCoupon && hasItems && (
                  <span className="text-xs text-slate-300 line-through font-mono">
                    {totals.formattedSubtotalBs}
                  </span>
                )}
              </div>
              {hasItems && (
                <span className="text-xs text-slate-300 font-mono font-medium">
                  Referencia en Dólares: <strong className="text-slate-100">{totals.formattedTotalUsd}</strong>
                </span>
              )}
            </div>
          </div>

          {appliedCoupon && (
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              -{appliedCoupon.percent}% APLICADO
            </span>
          )}
        </div>

        {/* Final WhatsApp Button at the bottom of the Ticket (Step 4) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
          <button
            type="button"
            onClick={handleWhatsAppSend}
            disabled={!playerId || !hasItems || !referenceNumber.trim()}
            aria-label="Enviar pedido por WhatsApp al soporte oficial"
            className={`w-full py-3 px-4 rounded-xl font-['Oswald'] uppercase tracking-wider text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-xl ${
              playerId && hasItems && referenceNumber.trim()
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30 active:scale-[0.99] cursor-pointer'
                : 'bg-slate-800 text-slate-300 border border-slate-700/60 cursor-not-allowed opacity-80'
            }`}
          >
            <MessageSquareText className="w-5 h-5" />
            <span>Enviar Pedido por WhatsApp</span>
            <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Verificación rápida por User ID y entrega en 5 a 15 minutos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

