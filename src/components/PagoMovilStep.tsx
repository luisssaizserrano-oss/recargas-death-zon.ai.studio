import React, { useState } from 'react';
import { PackageItem, CartItem } from '../types';
import { PAYMENT_DETAILS, WHATSAPP_NUMBER, calculateCartTotals, formatBs, formatUsd } from '../data/packages';
import { CreditCard, Copy, Check, Building2, Phone, FileText, Hash, AlertCircle, MessageSquareText, ShieldCheck, ArrowRight, ShoppingCart, Camera, Upload, CheckCircle2, Trash2 } from 'lucide-react';

interface PagoMovilStepProps {
  playerId: string;
  isVerified?: boolean;
  selectedPackage: PackageItem | null;
  cart?: CartItem[];
  referenceNumber: string;
  setReferenceNumber: (ref: string) => void;
  appliedCoupon: { code: string; percent: number } | null;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  stepNumber?: number;
  onOpenCart?: () => void;
}

export const PagoMovilStep: React.FC<PagoMovilStepProps> = ({
  playerId,
  isVerified = false,
  selectedPackage,
  cart = [],
  referenceNumber,
  setReferenceNumber,
  appliedCoupon,
  onToast,
  stepNumber = 3,
  onOpenCart,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onToast('Captura de pago cargada correctamente', 'success');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedField(label);
          onToast(`¡${label} copiado!`, 'success');
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(() => {
          fallbackCopy(text, label);
        });
    } else {
      fallbackCopy(text, label);
    }
  };

  const fallbackCopy = (text: string, label: string) => {
    prompt(`Copia el dato de ${label}:`, text);
    onToast(`Dato de ${label} mostrado para copiar`, 'info');
  };

  const copyAllPaymentData = () => {
    const fullText = `Pago Móvil - Recargas Death Zone\nBanco: ${PAYMENT_DETAILS.bank} (${PAYMENT_DETAILS.bankCode})\nCI: ${PAYMENT_DETAILS.idNumber.replace(/\./g, '')}\nTel: ${PAYMENT_DETAILS.phone}`;
    copyToClipboard(fullText, 'Datos de Pago Móvil');
  };

  const effectiveCart: CartItem[] =
    cart && cart.length > 0
      ? cart
      : selectedPackage
      ? [{ packageItem: selectedPackage, quantity: 1 }]
      : [];

  const discountPercent = appliedCoupon ? appliedCoupon.percent : 0;
  const totals = calculateCartTotals(effectiveCart, discountPercent);
  const hasItems = effectiveCart.length > 0;

  const isRefValid = referenceNumber.trim().length === 6 && /^\d{6}$/.test(referenceNumber.trim());
  const isCaptureValid = !!(receiptFile || receiptPreview);
  const isFormValid = playerId && hasItems && isRefValid && isCaptureValid;

  const handleWhatsAppCheckout = () => {
    if (!playerId || playerId.trim().length < 5) {
      onToast('Por favor ingresa tu ID de usuario de Blood Strike (Paso 1)', 'error');
      return;
    }

    if (!hasItems) {
      onToast('Por favor selecciona al menos un paquete de recarga (Paso 2)', 'error');
      return;
    }

    const cleanRef = referenceNumber.trim();
    if (cleanRef.length !== 6 || !/^\d{6}$/.test(cleanRef)) {
      onToast('El N° de Referencia de Pago Móvil debe tener exactamente 6 dígitos (ej. 123456)', 'error');
      return;
    }

    if (!receiptFile && !receiptPreview) {
      onToast('⚠️ Es OBLIGATORIO adjuntar la captura/comprobante de pago antes de continuar', 'error');
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
      `🆔 *User ID:* ${playerId.trim()}${isVerified ? ' (Verificado ✓)' : ''}\n` +
      itemsList +
      `💳 *Método de Pago:* Pago Móvil\n` +
      `🔢 *N° Referencia (6 dígitos):* ${referenceNumber.trim()}\n` +
      `📸 *Capture de Pago:* Adjuntado ✓ (${receiptFile ? receiptFile.name : 'Captura cargada'})\n`;

    if (appliedCoupon) {
      mensaje += `🏷️ *Cupón Aplicado:* ${appliedCoupon.code} (-${appliedCoupon.percent}%)\n`;
      mensaje += `💵 *Monto Total:* ${totals.formattedTotalBs} (Ref: ${totals.formattedTotalUsd})\n`;
    } else {
      mensaje += `💰 *Monto Total:* ${totals.formattedTotalBs} (Ref: ${totals.formattedTotalUsd})\n`;
    }

    mensaje += `\n📌 *Estado:* Pago realizado por Pago Móvil. Se adjunta el comprobante en el chat de WhatsApp.`;

    const encodedText = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    onToast('Redirigiendo a WhatsApp... ¡Recuerda adjuntar la imagen de tu captura!', 'success');
  };

  return (
    <section id={`step-${stepNumber}`} className="bg-[#09111f]/90 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-3 sm:p-5 shadow-2xl space-y-3 sm:space-y-4 scroll-mt-20">
      {/* Step Header */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500 text-black font-extrabold font-['Oswald'] text-xs sm:text-sm shadow-md shadow-cyan-500/30 shrink-0">
          {stepNumber}
        </span>
        <div>
          <h2 className="font-['Oswald'] text-sm sm:text-lg uppercase tracking-wider text-white">
            Pago Móvil y Confirmación
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-300 hidden xs:block">Realiza tu Pago Móvil y registra tu comprobante</p>
        </div>
      </div>

      {/* Cart Summary Banner */}
      {hasItems && (
        <div className="bg-[#040812] border border-cyan-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShoppingCart className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Monto Exacto a Transferir ({totals.itemCount} {totals.itemCount === 1 ? 'artículo' : 'artículos'}):
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold font-['Oswald'] text-emerald-400 tracking-wide">
                  {totals.formattedTotalBs}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  (Ref: {totals.formattedTotalUsd})
                </span>
              </div>
            </div>
          </div>

          {onOpenCart && effectiveCart.length > 0 && (
            <button
              type="button"
              onClick={onOpenCart}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold font-['Oswald'] uppercase tracking-wider flex items-center gap-1 cursor-pointer ml-auto sm:ml-0 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors"
            >
              <span>Ver Carrito</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* PAGO MÓVIL DETAILS DISPLAY */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Banco */}
          <div 
            onClick={() => copyToClipboard(`${PAYMENT_DETAILS.bank} (${PAYMENT_DETAILS.bankCode})`, 'Banco')}
            className="bg-[#040812] border border-slate-700/80 hover:border-cyan-400 p-2.5 rounded-xl cursor-pointer transition-all group flex items-start justify-between"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-cyan-400" /> Banco
              </span>
              <p className="text-xs font-bold text-cyan-200 font-mono group-hover:text-white transition-colors">
                {PAYMENT_DETAILS.bank}
              </p>
              <span className="text-[10px] text-slate-300 font-mono block">Cod: {PAYMENT_DETAILS.bankCode}</span>
            </div>
            <button
              type="button"
              aria-label="Copiar datos del banco"
              className="text-slate-300 group-hover:text-cyan-300 p-0.5"
            >
              {copiedField === 'Banco' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Cédula */}
          <div 
            onClick={() => copyToClipboard(PAYMENT_DETAILS.idNumber.replace(/\./g, ''), 'Cédula')}
            className="bg-[#040812] border border-slate-700/80 hover:border-cyan-400 p-2.5 rounded-xl cursor-pointer transition-all group flex items-start justify-between"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1">
                <FileText className="w-3 h-3 text-cyan-400" /> Cédula
              </span>
              <p className="text-xs font-bold text-cyan-200 font-mono group-hover:text-white transition-colors">
                {PAYMENT_DETAILS.idNumber}
              </p>
              <span className="text-[10px] text-slate-300 block">V-{PAYMENT_DETAILS.idNumber.replace(/\./g, '')}</span>
            </div>
            <button
              type="button"
              aria-label="Copiar número de cédula"
              className="text-slate-300 group-hover:text-cyan-300 p-0.5"
            >
              {copiedField === 'Cédula' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Teléfono */}
          <div 
            onClick={() => copyToClipboard(PAYMENT_DETAILS.phone.replace(/-/g, ''), 'Teléfono')}
            className="bg-[#040812] border border-slate-700/80 hover:border-cyan-400 p-2.5 rounded-xl cursor-pointer transition-all group flex items-start justify-between"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-cyan-400" /> Teléfono
              </span>
              <p className="text-xs font-bold text-cyan-200 font-mono group-hover:text-white transition-colors">
                {PAYMENT_DETAILS.phone}
              </p>
              <span className="text-[10px] text-slate-300 font-mono block">{PAYMENT_DETAILS.phone.replace(/-/g, '')}</span>
            </div>
            <button
              type="button"
              aria-label="Copiar número de teléfono"
              className="text-slate-300 group-hover:text-cyan-300 p-0.5"
            >
              {copiedField === 'Teléfono' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Copy All Data Button */}
      <button
        type="button"
        onClick={copyAllPaymentData}
        aria-label="Copiar todos los datos de Pago Móvil"
        className="w-full bg-[#040812] hover:bg-cyan-500 hover:text-black border border-cyan-500/30 hover:border-cyan-400 text-slate-200 font-['Oswald'] uppercase tracking-wider text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-md"
      >
        <CreditCard className="w-3.5 h-3.5 text-cyan-400 group-hover:text-black transition-colors" />
        <span>Copiar datos de Pago Móvil</span>
      </button>

      {/* Reference Input */}
      <div className="pt-1">
        <label 
          htmlFor="ref-input" 
          className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Hash className="w-3.5 h-3.5 text-cyan-400" />
            N° de Referencia Pago Móvil (6 dígitos)
          </span>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            6 dígitos
          </span>
        </label>
        
        <input
          type="text"
          id="ref-input"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Ej. 123456 (exactamente 6 dígitos)"
          maxLength={6}
          required
          className={`w-full px-3 py-2 bg-[#040812] border rounded-xl text-white font-mono text-xs placeholder-slate-500 focus:outline-none transition-colors ${
            isRefValid 
              ? 'border-emerald-500/80 focus:border-emerald-400' 
              : 'border-slate-800 focus:border-amber-500'
          }`}
        />
        {referenceNumber.length > 0 && referenceNumber.length < 6 && (
          <p className="text-[10px] text-amber-400 font-medium mt-1">
            Faltan {6 - referenceNumber.length} dígitos (debe tener exactamente 6 dígitos)
          </p>
        )}
      </div>

      {/* CAPTURA DE PAGO (COMPROBANTE) - OBLIGATORIO */}
      <div className="pt-1">
        <label 
          htmlFor="receipt-upload" 
          className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            Captura de Pago (Comprobante)
          </span>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Obligatorio
          </span>
        </label>

        {receiptPreview ? (
          <div className="relative bg-[#040812] border border-emerald-500/60 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md shadow-emerald-500/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <img 
                src={receiptPreview} 
                alt="Captura de Pago" 
                className="w-12 h-12 object-cover rounded-lg border border-emerald-500/40 shrink-0" 
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Captura Cargada Correctamente</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate font-mono">
                  {receiptFile ? receiptFile.name : 'comprobante_pago.png'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setReceiptFile(null);
                setReceiptPreview(null);
              }}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-colors shrink-0"
              title="Quitar captura"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="receipt-upload"
            className="flex flex-col items-center justify-center p-3.5 bg-[#040812] hover:bg-[#060e1f] border-2 border-dashed border-amber-500/50 hover:border-cyan-400 rounded-xl cursor-pointer transition-all text-center space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-full bg-amber-500/10 group-hover:bg-cyan-500/10 border border-amber-500/30 group-hover:border-cyan-500/40 flex items-center justify-center text-amber-400 group-hover:text-cyan-300 transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                Haz clic aquí para subir el Capture / Comprobante
              </p>
              <p className="text-[10px] text-slate-400">Adjunta la foto o captura de tu pago en PNG, JPG o WEBP</p>
            </div>
            <input
              type="file"
              id="receipt-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* MANDATORY INSTRUCTION BANNER BEFORE WHATSAPP BUTTON */}
      <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-2.5 flex items-start gap-2 text-amber-200 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-amber-300 uppercase tracking-wide text-[11px]">
            Instrucción Obligatoria:
          </p>
          <p className="leading-snug text-[11px]">
            Ingresa tu <span className="underline font-bold text-white">referencia de 6 dígitos</span> y sube tu <span className="underline font-bold text-white">capture de pago</span> para habilitar el envío del pedido por WhatsApp.
          </p>
        </div>
      </div>

      {/* Main WhatsApp Button */}
      <button
        type="button"
        onClick={handleWhatsAppCheckout}
        disabled={!isFormValid}
        aria-label="Enviar comprobante de pago por WhatsApp"
        className={`w-full py-3 px-4 rounded-xl font-['Oswald'] uppercase tracking-wider text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-xl ${
          isFormValid
            ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30 active:scale-[0.99] cursor-pointer'
            : 'bg-slate-800 text-slate-300 border border-slate-700/60 cursor-not-allowed opacity-80'
        }`}
      >
        <MessageSquareText className="w-5 h-5" />
        <span>Enviar Comprobante por WhatsApp</span>
        <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
      </button>

      {/* Guarantee Note */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-300 pt-0.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Atención rápida e inmediata por soporte de WhatsApp</span>
      </div>
    </section>
  );
};
