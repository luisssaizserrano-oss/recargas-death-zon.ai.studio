import React, { useEffect } from 'react';
import { CartItem } from '../types';
import { calculateCartTotals, formatBs, formatUsd, getPackageCartLimit } from '../data/packages';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (pkgId: string, quantity: number) => void;
  onRemoveItem: (pkgId: string) => void;
  onClearCart: () => void;
  appliedCoupon: { code: string; percent: number } | null;
  onProceedToCheckout: () => void;
  isVerified?: boolean;
  onToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onProceedToCheckout,
  isVerified = false,
  onToast,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const discountPercent = appliedCoupon ? appliedCoupon.percent : 0;
  const totals = calculateCartTotals(cart, discountPercent);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="relative z-10 w-full max-w-md bg-[#070e1c] border-l border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col h-full animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-[#050b16]/95 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Oswald'] text-lg uppercase tracking-wider text-white">
                  Carrito de Compras
                </h2>
                <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {totals.itemCount} {totals.itemCount === 1 ? 'ítem' : 'ítems'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Recargas Death Zone • Blood Strike</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito de compras"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500">
              <ShoppingCart className="w-8 h-8 opacity-40" />
            </div>
            <div className="space-y-1">
              <h3 className="font-['Oswald'] uppercase tracking-wider text-base text-white">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Selecciona paquetes de oro o pases oficiales en la tienda para hacer un pedido combinado.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl font-['Oswald'] uppercase tracking-wider text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Ver Paquetes Disponibles</span>
            </button>
          </div>
        ) : (
          <>
            {/* Clear Cart Action Bar */}
            <div className="px-4 py-2 bg-[#091122] border-b border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {totals.distinctCount} {totals.distinctCount === 1 ? 'producto diferente' : 'productos diferentes'}
              </span>
              <button
                type="button"
                onClick={onClearCart}
                className="text-rose-400 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Vaciar Carrito</span>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-800/50">
              {cart.map((item) => {
                const pkg = item.packageItem;
                const itemTotalBs = pkg.priceNumeric * item.quantity;
                const itemTotalUsd = pkg.priceUsd * item.quantity;

                return (
                  <div
                    key={pkg.id}
                    className="pt-2.5 first:pt-0 flex items-center gap-3 bg-[#0a1426]/70 p-2.5 rounded-xl border border-slate-800/80"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-black/60 border border-slate-700/60 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {pkg.image ? (
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          width="48"
                          height="48"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-amber-400 font-bold text-xs text-center font-['Oswald']">
                          🪙
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="font-bold text-xs text-white truncate font-['Oswald'] tracking-wide">
                            {pkg.name}
                          </h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                            getPackageCartLimit(pkg) === 1
                              ? 'bg-purple-950/80 border border-purple-500/40 text-purple-300'
                              : 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                          }`}>
                            Máx {getPackageCartLimit(pkg)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(pkg.id)}
                          aria-label={`Eliminar ${pkg.name} del carrito`}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-bold text-emerald-400 font-['Oswald']">
                          {formatBs(itemTotalBs)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({formatUsd(itemTotalUsd)})
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                        <span className="text-[10px] text-slate-400">
                          Unit: {formatBs(pkg.priceNumeric)}
                        </span>

                        <div className="flex items-center gap-1.5 bg-[#040812] border border-slate-700/80 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(pkg.id, item.quantity - 1)}
                            aria-label="Disminuir cantidad"
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-6 text-center text-xs font-bold text-cyan-300 font-mono">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label="Aumentar cantidad"
                            disabled={item.quantity >= getPackageCartLimit(pkg)}
                            onClick={() => {
                              const limit = getPackageCartLimit(pkg);
                              if (item.quantity >= limit) {
                                if (onToast) {
                                  onToast(limit === 1 ? `Solo se permite 1 unidad de ${pkg.name} por pedido.` : `Límite máximo de 10 unidades de Oro alcanzado.`, 'error');
                                }
                                return;
                              }
                              onUpdateQuantity(pkg.id, item.quantity + 1);
                            }}
                            title={item.quantity >= getPackageCartLimit(pkg) ? `Límite máximo (${getPackageCartLimit(pkg)}) alcanzado` : 'Aumentar cantidad'}
                            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                              item.quantity >= getPackageCartLimit(pkg)
                                ? 'text-slate-600 bg-slate-900 cursor-not-allowed opacity-40'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Footer / Totals & Actions */}
            <div className="p-4 bg-[#050b16] border-t border-slate-800/90 space-y-3">
              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'producto' : 'productos'}):</span>
                  <span className="text-white font-mono font-medium">
                    {totals.formattedSubtotalBs} ({totals.formattedSubtotalUsd})
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Descuento cupón ({appliedCoupon.code} -{appliedCoupon.percent}%):
                    </span>
                    <span className="font-mono font-bold">
                      -{totals.formattedDiscountBs}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                  <span className="font-['Oswald'] uppercase text-xs font-bold text-slate-300">
                    Total a Pagar:
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-bold font-['Oswald'] text-emerald-400 tracking-wide">
                      {totals.formattedTotalBs}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Ref: {totals.formattedTotalUsd}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  if (!isVerified) {
                    if (onToast) {
                      onToast('ID Inválido o Error de Token. Verifica tu ID de Blood Strike antes de continuar.', 'error');
                    }
                    onClose();
                    document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' });
                    return;
                  }
                  onProceedToCheckout();
                  onClose();
                }}
                className={`w-full py-3 px-4 rounded-xl font-['Oswald'] uppercase tracking-wider text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                  isVerified
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-emerald-500/20 active:scale-[0.99]'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}
              >
                <span>{isVerified ? `Proceder al Pago (${totals.itemCount})` : '⚠️ Verificar ID de Usuario Primero'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pago Móvil, Binance Pay & PayPal con entrega instantánea</span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
