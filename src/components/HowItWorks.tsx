import React, { useState } from 'react';
import { ShieldCheck, Clock, ChevronDown, HelpCircle, Headphones } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: '¿Cuánto tiempo tarda en acreditarse mi recarga?',
      a: 'El proceso de recarga toma en promedio entre 5 y 15 minutos tras verificar el pago en WhatsApp. En momentos de alta demanda puede tomar un máximo de 30 minutos.'
    },
    {
      q: '¿Es seguro recargar por este sitio?',
      a: '¡Totalmente seguro! En Recargas Death Zone realizamos recargas 100% oficiales mediante User ID de Blood Strike. Jamás te pediremos contraseña ni acceso a tu cuenta.'
    },
    {
      q: '¿Qué hago si mi ID no aparece en la lista?',
      a: 'Asegúrate de copiar el User ID numérico directamente desde el juego. Si tienes alguna duda, puedes pulsar el botón de "Soporte Directo" para consultarnos directamente por WhatsApp.'
    },
    {
      q: '¿Qué métodos de pago aceptan?',
      a: 'Aceptamos Pago Móvil en Bolívares (Bs) a través del Banco de Venezuela (0102), Binance Pay (USDT) y PayPal ($ USD). Los datos exactos para transferir se muestran en el Paso 3.'
    }
  ];

  return (
    <section className="space-y-4 pt-4" aria-labelledby="garantias-faq-title">
      <div className="border-b border-slate-800 pb-2">
        <h2 id="garantias-faq-title" className="font-['Oswald'] text-base sm:text-lg uppercase tracking-wider text-white">
          Garantías y Preguntas Frecuentes
        </h2>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#0a1322]/85 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-['Oswald'] text-xs uppercase text-white tracking-wide">Entrega Rápida</h3>
            <p className="text-[11px] text-slate-300">Procesado en 5 a 15 min</p>
          </div>
        </div>

        <div className="bg-[#0a1322]/85 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-['Oswald'] text-xs uppercase text-white tracking-wide">100% Garantizado</h3>
            <p className="text-[11px] text-slate-300">Sin contraseñas ni riesgos</p>
          </div>
        </div>

        <div className="bg-[#0a1322]/85 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-['Oswald'] text-xs uppercase text-white tracking-wide">Atención VIP</h3>
            <p className="text-[11px] text-slate-300">Soporte por WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Accordion FAQ */}
      <div className="bg-[#0a1322]/85 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="font-['Oswald'] text-base sm:text-lg uppercase tracking-wider text-white">Preguntas Frecuentes</h3>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-[#020610] border border-[#1e2d42] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  aria-label={`Pregunta: ${faq.q}`}
                  className="w-full text-left p-4 font-semibold text-sm text-slate-200 hover:text-white flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold text-xs">Q.</span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-900 leading-relaxed"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
