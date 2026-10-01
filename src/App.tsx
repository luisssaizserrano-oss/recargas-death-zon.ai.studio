import React, { useState, Suspense, lazy, useEffect } from 'react';
import { PackageItem } from './types';
import { Header } from './components/Header';
import { UserIdStep } from './components/UserIdStep';
import { CouponSection } from './components/CouponSection';
import { PackageGrid } from './components/PackageGrid';
import { Toast } from './components/Toast';
import { VALID_COUPONS, calculateEffectivePrice, WHATSAPP_NUMBER } from './data/packages';
import { Gamepad2, ShieldCheck, MessageSquareText, Clock, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';

// Lazy load non-critical components to minimize initial JS payload, prevent request chaining and improve LCP
const UserIdModal = lazy(() => import('./components/UserIdModal').then((m) => ({ default: m.UserIdModal })));
const PagoMovilStep = lazy(() => import('./components/PagoMovilStep').then((m) => ({ default: m.PagoMovilStep })));
const OrderSummary = lazy(() => import('./components/OrderSummary').then((m) => ({ default: m.OrderSummary })));

export default function App() {
  const [playerId, setPlayerId] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  // Discount Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string | null; type: 'success' | 'error' | 'info' }>({
    message: null,
    type: 'success',
  });

  // Prefetch deferred steps during idle time so they are instant when the user scrolls or selects a package
  useEffect(() => {
    const prefetchModules = () => {
      import('./components/PagoMovilStep');
      import('./components/OrderSummary');
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
        prefetchModules,
        { timeout: 1500 }
      );
    } else {
      const timer = setTimeout(prefetchModules, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleSelectPackage = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    showToast(`Paquete "${pkg.name}" seleccionado`, 'success');

    // En móvil, desplazar suavemente al resumen para ahorrarle scroll al usuario
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setTimeout(() => {
        const target = document.getElementById('step-3');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    }
  };

  const handleApplyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    if (VALID_COUPONS[formattedCode]) {
      const percent = VALID_COUPONS[formattedCode];
      setAppliedCoupon({ code: formattedCode, percent });
      showToast(`¡Cupón "${formattedCode}" aplicado! ${percent}% de descuento`, 'success');
    } else {
      showToast('Código de descuento no válido', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'info');
  };

  const currentPriceInfo = selectedPackage
    ? calculateEffectivePrice(selectedPackage.priceNumeric, selectedPackage.priceUsd, appliedCoupon ? appliedCoupon.percent : 0)
    : null;

  return (
    <div className="relative min-h-screen bg-[#040812] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden pb-16 lg:pb-6">
      {/* Background Wallpaper */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/death_zone_wallpaper.webp"
          alt="Death Zone Fondo de Pantalla"
          width="1440"
          height="810"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top sm:object-center opacity-40 sm:opacity-45 scale-100"
        />
        {/* Subtle cinematic gradient and vignette for optimal visibility of the Death Zone artwork and text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040812]/70 via-[#050b14]/65 to-[#040812]/92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#040812_90%)] opacity-80" />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Toast Notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: null, type: 'success' })}
        />

        {/* User ID Guide Modal - Only loaded & mounted when opened */}
        {isGuideOpen && (
          <Suspense fallback={null}>
            <UserIdModal
              isOpen={isGuideOpen}
              onClose={() => setIsGuideOpen(false)}
            />
          </Suspense>
        )}

        {/* Header */}
        <Header />

        {/* Mobile Step Quick-Jump Bar (Only on mobile < 640px) */}
        <div className="sm:hidden sticky top-0 z-30 bg-[#060b16]/95 backdrop-blur-md border-b border-cyan-500/20 px-2 py-1.5 shadow-xl">
          <div className="flex items-center justify-between gap-1 text-[11px] font-['Oswald'] uppercase font-bold tracking-wider">
            <button
              type="button"
              onClick={() => document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Ir al paso 1: ID de Usuario"
              className={`flex-1 py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                isVerified
                  ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/40'
                  : playerId.length >= 5
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                  : 'text-slate-400 bg-[#0d1627] border border-slate-800'
              }`}
            >
              <span>1. ID</span>
              {isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Ir al paso 2: Paquetes"
              className={`flex-1 py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                selectedPackage
                  ? 'text-amber-300 bg-amber-950/60 border border-amber-500/40'
                  : 'text-slate-400 bg-[#0d1627] border border-slate-800'
              }`}
            >
              <span>2. Paquetes</span>
              {selectedPackage && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Ir al paso 3: Método de Pago"
              className={`flex-1 py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                referenceNumber.trim().length >= 3
                  ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/40'
                  : 'text-slate-400 bg-[#0d1627] border border-slate-800'
              }`}
            >
              <span>3. Pago</span>
              {referenceNumber.trim().length >= 3 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('step-4')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Ir al paso 4: Resumen del Pedido"
              className="flex-1 py-1 px-1 rounded-lg flex items-center justify-center gap-1 text-slate-300 bg-[#0d1627] border border-slate-800 hover:text-white transition-all"
            >
              <span>4. Resumen</span>
            </button>
          </div>
        </div>

        {/* Main Content Area - Orderly, structured flow */}
        <main className="flex-1 max-w-[1100px] w-full mx-auto px-2.5 sm:px-4 py-3 sm:py-5 space-y-3 sm:space-y-5">
          
          {/* 1. Comprobar e Ingresar ID */}
          <UserIdStep
            playerId={playerId}
            setPlayerId={setPlayerId}
            isVerified={isVerified}
            setIsVerified={setIsVerified}
            onOpenGuide={() => setIsGuideOpen(true)}
            onToast={showToast}
          />

          {/* Ranura de Cupón de Descuento (abajo de donde colocan el ID) */}
          <CouponSection
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onToast={showToast}
          />

          {/* 2. Selecciona tu Paquete */}
          <PackageGrid
            selectedPackage={selectedPackage}
            onSelectPackage={handleSelectPackage}
            appliedCoupon={appliedCoupon}
          />

          {/* 3. Métodos de Pago & Registro de Referencia */}
          <Suspense
            fallback={
              <div id="step-3" className="bg-[#0b1626]/90 border border-slate-800/80 rounded-2xl p-5 min-h-[320px] animate-pulse flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 animate-spin mb-3" />
                <p className="text-slate-300 text-xs font-['Oswald'] tracking-wider uppercase">Cargando métodos de pago...</p>
              </div>
            }
          >
            <PagoMovilStep
              playerId={playerId}
              isVerified={isVerified}
              selectedPackage={selectedPackage}
              referenceNumber={referenceNumber}
              setReferenceNumber={setReferenceNumber}
              appliedCoupon={appliedCoupon}
              onToast={showToast}
              stepNumber={3}
            />
          </Suspense>

          {/* 4. Resumen de Pedido (Último paso) */}
          <Suspense
            fallback={
              <div id="step-4" className="bg-[#0b1626]/90 border border-slate-800/80 rounded-2xl p-5 min-h-[220px] animate-pulse flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin mb-3" />
                <p className="text-slate-300 text-xs font-['Oswald'] tracking-wider uppercase">Cargando resumen de recarga...</p>
              </div>
            }
          >
            <OrderSummary
              playerId={playerId}
              isVerified={isVerified}
              selectedPackage={selectedPackage}
              referenceNumber={referenceNumber}
              appliedCoupon={appliedCoupon}
              stepNumber={4}
              onToast={showToast}
            />
          </Suspense>

          {/* Clean Trust & Features Bar */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-1">
            <div className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3 text-center sm:text-left shadow-lg">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <p className="font-['Oswald'] font-bold text-[10px] sm:text-xs uppercase text-white tracking-wide leading-tight">Entrega Rápida</p>
                <p className="text-[9px] sm:text-[11px] text-slate-300 hidden xs:block">5 a 15 min</p>
              </div>
            </div>

            <div className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3 text-center sm:text-left shadow-lg">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <p className="font-['Oswald'] font-bold text-[10px] sm:text-xs uppercase text-white tracking-wide leading-tight">100% Seguro</p>
                <p className="text-[9px] sm:text-[11px] text-slate-300 hidden xs:block">Vía User ID</p>
              </div>
            </div>

            <div className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3 text-center sm:text-left shadow-lg">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shrink-0">
                <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <p className="font-['Oswald'] font-bold text-[10px] sm:text-xs uppercase text-white tracking-wide leading-tight">Soporte Directo</p>
                <p className="text-[9px] sm:text-[11px] text-slate-300 hidden xs:block">WhatsApp</p>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Floating Sticky Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070e1c]/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 shadow-2xl">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block tracking-wider truncate max-w-[140px]">
                {selectedPackage ? selectedPackage.name : 'Paso 2: Elige Paquete'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold font-['Oswald'] text-emerald-400">
                  {currentPriceInfo ? currentPriceInfo.formattedBs : '0,00 Bs'}
                </span>
                {currentPriceInfo && (
                  <span className="text-[10px] text-slate-300 font-mono">
                    ({currentPriceInfo.formattedUsd})
                  </span>
                )}
              </div>
            </div>

            {!selectedPackage ? (
              <button
                type="button"
                onClick={() => document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Ver paquetes de recarga disponibles"
                className="px-3.5 py-2 rounded-xl font-['Oswald'] uppercase tracking-wider text-xs font-bold transition-all flex items-center gap-1.5 shadow-md bg-gradient-to-r from-amber-400 to-amber-500 active:from-amber-300 active:to-amber-400 text-black shadow-amber-500/20 cursor-pointer"
              >
                <span>Ver Paquetes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : !referenceNumber.trim() ? (
              <button
                type="button"
                onClick={() => document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Ir a métodos de pago y registrar comprobante"
                className="px-3.5 py-2 rounded-xl font-['Oswald'] uppercase tracking-wider text-xs font-bold transition-all flex items-center gap-1.5 shadow-md bg-cyan-500 active:bg-cyan-400 text-black shadow-cyan-500/20 cursor-pointer"
              >
                <span>Ir al Pago</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Finalizar compra y enviar comprobante por WhatsApp"
                onClick={() => {
                  if (!playerId || playerId.trim().length < 5) {
                    showToast('Ingresa tu ID de Usuario en el Paso 1', 'error');
                    document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' });
                    return;
                  }
                  if (!selectedPackage) {
                    showToast('Selecciona un paquete en el Paso 2', 'error');
                    document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' });
                    return;
                  }
                  if (!referenceNumber || referenceNumber.trim().length < 3) {
                    showToast('Ingresa tu N° de Referencia en el Paso 3 (Pago)', 'error');
                    document.getElementById('step-3')?.scrollIntoView({ behavior: 'smooth' });
                    return;
                  }

                  let mensaje = 
                    `⚡ *NUEVA RECARGA - DEATH ZONE* ⚡\n\n` +
                    `🎮 *Juego:* Blood Strike\n` +
                    `🆔 *User ID:* ${playerId.trim()}${isVerified ? ' (Verificado ✓)' : ''}\n` +
                    `📦 *Producto:* ${selectedPackage.name}\n` +
                    `🔢 *N° Referencia:* ${referenceNumber.trim()}\n`;

                  if (appliedCoupon) {
                    mensaje += `🏷️ *Cupón Aplicado:* ${appliedCoupon.code} (-${appliedCoupon.percent}%)\n`;
                    mensaje += `💰 *Monto Final:* ${currentPriceInfo?.formattedBs} (${currentPriceInfo?.formattedUsd})\n`;
                  } else {
                    mensaje += `💰 *Monto:* ${currentPriceInfo?.formattedBs} (${currentPriceInfo?.formattedUsd})\n`;
                  }

                  const encodedText = encodeURIComponent(mensaje);
                  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
                }}
                className="px-3.5 py-2 rounded-xl font-['Oswald'] uppercase tracking-wider text-xs font-bold transition-all flex items-center gap-1.5 shadow-md bg-emerald-500 active:bg-emerald-400 text-black shadow-emerald-500/30 cursor-pointer"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#020610]/90 border-t border-slate-800/80 py-4 mt-6 text-slate-300 text-xs">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-slate-200 font-['Oswald'] uppercase tracking-widest text-xs">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>RECARGAS DEATH ZONE</span>
              <span className="text-slate-400">•</span>
              <span>BLOOD STRIKE</span>
            </div>

            <p className="max-w-xl mx-auto leading-relaxed text-slate-300 text-[11px]">
              Servicios de recargas oficiales por User ID para Blood Strike en Venezuela. Aceptamos Pago Móvil (Bs), Binance Pay (USDT) y PayPal ($ USD).
            </p>

            <div className="pt-1 border-t border-slate-900/80 flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-400">
              <span>© {new Date().getFullYear()} Death Zone Recargas. Todos los derechos reservados.</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Transacciones Seguras
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
