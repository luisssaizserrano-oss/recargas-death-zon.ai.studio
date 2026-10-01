import React, { useState } from 'react';
import { PackageCategory, PackageItem } from '../types';
import { PACKAGES, calculateEffectivePrice } from '../data/packages';
import { Search, Tag, Sparkles } from 'lucide-react';

interface PackageGridProps {
  selectedPackage: PackageItem | null;
  onSelectPackage: (pkg: PackageItem) => void;
  appliedCoupon: { code: string; percent: number } | null;
}

export const PackageGrid: React.FC<PackageGridProps> = ({
  selectedPackage,
  onSelectPackage,
  appliedCoupon,
}) => {
  const [activeTab, setActiveTab] = useState<PackageCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPackages = PACKAGES.filter((pkg) => {
    const matchesCategory = activeTab === 'all' || pkg.category === activeTab;
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.amountLabel && pkg.amountLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const goldPackages = filteredPackages.filter((pkg) => pkg.category === 'gold');
  const passPackages = filteredPackages.filter((pkg) => pkg.category === 'pass');
  const otherPackages = filteredPackages.filter((pkg) => pkg.category !== 'gold' && pkg.category !== 'pass');

  // SVG renderers matching the user's exact 3D sharp illustrations
  const renderGoldSvg = (id: string) => {
    if (id === 'gold-105') {
      return (
        <svg className="gold-bars-icon" viewBox="0 0 100 100" fill="none">
          <path d="M25 52 L50 38 L75 52 L50 66 Z" fill="#FFD166" stroke="#FFF5D6" strokeWidth="2" />
          <path d="M25 52 L25 66 L50 80 L50 66 Z" fill="#FFB703" />
          <path d="M75 52 L75 66 L50 80 L50 66 Z" fill="#FB8500" />
        </svg>
      );
    }

    if (id === 'gold-320') {
      return (
        <svg className="gold-bars-icon" viewBox="0 0 100 100" fill="none">
          <path d="M20 60 L50 45 L80 60 L50 75 Z" fill="#FFB703" stroke="#FFE394" strokeWidth="2" />
          <path d="M20 60 L20 72 L50 87 L50 75 Z" fill="#FB8500" />
          <path d="M80 60 L80 72 L50 87 L50 75 Z" fill="#D46200" />
          {/* Lingote Superior */}
          <path d="M30 42 L50 32 L70 42 L50 52 Z" fill="#FFD166" stroke="#FFF5D6" strokeWidth="2" />
          <path d="M30 42 L30 52 L50 62 L50 52 Z" fill="#FFB703" />
          <path d="M70 42 L70 52 L50 62 L50 52 Z" fill="#FB8500" />
        </svg>
      );
    }

    if (id === 'gold-540') {
      return (
        <svg className="gold-bars-icon" viewBox="0 0 100 100" fill="none">
          <path d="M15 65 L50 48 L85 65 L50 82 Z" fill="#FFB703" stroke="#FFE394" strokeWidth="2" />
          <path d="M15 65 L15 78 L50 95 L50 82 Z" fill="#FB8500" />
          <path d="M85 65 L85 78 L50 95 L50 82 Z" fill="#D46200" />
          <path d="M25 45 L50 32 L75 45 L50 58 Z" fill="#FFD166" stroke="#FFF5D6" strokeWidth="2" />
          <path d="M25 45 L25 57 L50 70 L50 58 Z" fill="#FFB703" />
          <path d="M75 45 L75 57 L50 70 L50 58 Z" fill="#FB8500" />
          <path d="M35 28 L50 20 L65 28 L50 36 Z" fill="#FFF5D6" />
        </svg>
      );
    }

    if (id === 'gold-1100') {
      return (
        <svg className="gold-bars-icon" viewBox="0 0 100 100" fill="none">
          <path d="M12 68 L50 48 L88 68 L50 88 Z" fill="#FFB703" stroke="#FFE394" strokeWidth="2" />
          <path d="M12 68 L12 80 L50 97 L50 88 Z" fill="#FB8500" />
          <path d="M88 68 L88 80 L50 97 L50 88 Z" fill="#D46200" />
          <path d="M20 50 L50 35 L80 50 L50 65 Z" fill="#FFD166" stroke="#FFF5D6" strokeWidth="2" />
          <path d="M20 50 L20 62 L50 77 L50 65 Z" fill="#FFB703" />
          <path d="M80 50 L80 62 L50 77 L50 65 Z" fill="#FB8500" />
          <path d="M30 34 L50 24 L70 34 L50 46 Z" fill="#FFF5D6" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M30 34 L30 44 L50 56 L50 46 Z" fill="#FFD166" />
          <path d="M70 34 L70 44 L50 56 L50 46 Z" fill="#FFB703" />
          {/* Shine glint */}
          <path d="M76 18 L78 12 L80 18 L86 20 L80 22 L78 28 L76 22 L70 20 Z" fill="#FFF5D6" />
        </svg>
      );
    }

    if (id === 'gold-5800') {
      return (
        <svg className="gold-bars-icon" viewBox="0 0 100 100" fill="none">
          {/* Base bottom layer */}
          <path d="M8 74 L50 54 L92 74 L50 94 Z" fill="#FFB703" stroke="#FFE394" strokeWidth="2" />
          <path d="M8 74 L8 86 L50 100 L50 94 Z" fill="#D46200" />
          <path d="M92 74 L92 86 L50 100 L50 94 Z" fill="#993D00" />
          
          {/* Second layer */}
          <path d="M14 58 L50 40 L86 58 L50 76 Z" fill="#FFC300" stroke="#FFF5D6" strokeWidth="2" />
          <path d="M14 58 L14 68 L50 82 L50 76 Z" fill="#FF9E00" />
          <path d="M86 58 L86 68 L50 82 L50 76 Z" fill="#D46200" />
          
          {/* Third layer */}
          <path d="M22 42 L50 28 L78 42 L50 56 Z" fill="#FFD166" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M22 42 L22 51 L50 62 L50 56 Z" fill="#FFB703" />
          <path d="M78 42 L78 51 L50 62 L50 56 Z" fill="#FB8500" />
          
          {/* Top pinnacle ingot */}
          <path d="M32 26 L50 16 L68 26 L50 36 Z" fill="#FFFBE6" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M32 26 L32 34 L50 42 L50 36 Z" fill="#FFE394" />
          <path d="M68 26 L68 34 L50 42 L50 36 Z" fill="#FFD166" />
          
          {/* Sparkles / glints */}
          <path d="M80 12 L82 6 L84 12 L90 14 L84 16 L82 22 L80 16 L74 14 Z" fill="#FFFFFF" />
          <path d="M18 18 L20 12 L22 18 L28 20 L22 22 L20 28 L18 22 L12 20 Z" fill="#FFF5D6" />
          <path d="M50 6 L51.5 1 L53 6 L58 7.5 L53 9 L51.5 14 L50 9 L45 7.5 Z" fill="#FFFFFF" />
        </svg>
      );
    }

    // Default or 2260 pack: Max Vault Stack
    return (
      <svg className="gold-bars-icon" viewBox="0 0 100 100" fill="none">
        <path d="M10 72 L50 52 L90 72 L50 92 Z" fill="#FFB703" stroke="#FFE394" strokeWidth="2" />
        <path d="M10 72 L10 84 L50 100 L50 92 Z" fill="#E07A00" />
        <path d="M90 72 L90 84 L50 100 L50 92 Z" fill="#B35200" />
        <path d="M16 54 L50 38 L84 54 L50 70 Z" fill="#FFD166" stroke="#FFF5D6" strokeWidth="2" />
        <path d="M16 54 L16 66 L50 80 L50 70 Z" fill="#FFB703" />
        <path d="M84 54 L84 66 L50 80 L50 70 Z" fill="#FB8500" />
        <path d="M26 38 L50 26 L74 38 L50 50 Z" fill="#FFF5D6" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M26 38 L26 48 L50 60 L50 50 Z" fill="#FFD166" />
        <path d="M74 38 L74 48 L50 60 L50 50 Z" fill="#FFB703" />
        <path d="M36 22 L50 15 L64 22 L50 31 Z" fill="#FFFFFF" />
        {/* Dual sparkles */}
        <path d="M82 14 L84 8 L86 14 L92 16 L86 18 L84 24 L82 18 L76 16 Z" fill="#FFF" />
        <path d="M18 24 L20 18 L22 24 L28 26 L22 28 L20 34 L18 28 L12 26 Z" fill="#FFE394" />
      </svg>
    );
  };

  const renderProductCard = (pkg: PackageItem) => {
    const isSelected = selectedPackage?.id === pkg.id;
    const discountPercent = appliedCoupon ? appliedCoupon.percent : 0;
    const priceInfo = calculateEffectivePrice(pkg.priceNumeric, pkg.priceUsd, discountPercent);

    if (pkg.category === 'gold' || pkg.cardType === 'gold') {
      return (
        <div
          key={pkg.id}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          aria-label={`Seleccionar paquete ${pkg.amountLabel || pkg.name}, precio ${priceInfo.formattedBs}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectPackage(pkg);
            }
          }}
          onClick={() => onSelectPackage(pkg)}
          className={`product-card card-gold ${isSelected ? 'card-selected' : ''}`}
        >
          {isSelected && <div className="selected-check-badge">✓</div>}
          {renderGoldSvg(pkg.id)}
          <h4 className="gold-qty">{pkg.amountLabel || pkg.name}</h4>
          <span className="badge-bonus">{pkg.bonusBadge || '+BONUS'}</span>
          <div className="price-box">
            {appliedCoupon && (
              <div className="text-[11px] text-slate-300 line-through font-mono mb-0.5">
                {priceInfo.originalFormattedBs}
              </div>
            )}
            <div className="bs-price">{priceInfo.formattedBs}</div>
            <div className="usd-ref">Ref: {priceInfo.formattedUsd}</div>
          </div>
        </div>
      );
    }

    if (pkg.id === 'pass-mejora' || pkg.cardType === 'levelup') {
      return (
        <div
          key={pkg.id}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          aria-label={`Seleccionar ${pkg.name}, precio ${priceInfo.formattedBs}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectPackage(pkg);
            }
          }}
          onClick={() => onSelectPackage(pkg)}
          className={`product-card card-levelup ${isSelected ? 'card-selected' : ''}`}
        >
          {isSelected && <div className="selected-check-badge">✓</div>}
          <span className="pass-badge" style={{ background: 'var(--purple-pass)' }}>
            {pkg.passBadge || 'PROGRESO'}
          </span>
          <div className="pass-icon-container">
            {pkg.image ? (
              <img
                src={pkg.image}
                alt={pkg.name}
                width="92"
                height="92"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-xl drop-shadow-[0_6px_14px_rgba(157,78,221,0.45)] hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <rect x="20" y="20" width="60" height="60" rx="12" fill="#9D4EDD" opacity="0.2" stroke="#9D4EDD" strokeWidth="3" />
                <path d="M35 65 L50 35 L65 65 L55 65 L50 50 L45 65 Z" fill="#C77DFF" />
                <path d="M50 25 L65 45 L35 45 Z" fill="#E0AAFF" />
              </svg>
            )}
          </div>
          <h4 className="gold-qty">{pkg.name}</h4>
          <p className="pass-description">{pkg.description}</p>
          <div className="price-box">
            {appliedCoupon && (
              <div className="text-[11px] text-slate-300 line-through font-mono mb-0.5">
                {priceInfo.originalFormattedBs}
              </div>
            )}
            <div className="bs-price">{priceInfo.formattedBs}</div>
            <div className="usd-ref">Ref: {priceInfo.formattedUsd}</div>
          </div>
        </div>
      );
    }

    // Strike Pass (Elite / Premium), Chests or Other Passes
    const isPremium = pkg.id.includes('plus') || pkg.id.includes('premium');
    const isElite = pkg.id === 'pass-elite';
    const isUltraSkin = pkg.passBadge === 'ULTRA SKIN';
    const isWeekly = pkg.passBadge === 'SEMANAL';
    const cardClass = isPremium
      ? 'card-strikepass-premium'
      : isElite
      ? 'card-strikepass-elite'
      : isUltraSkin
      ? 'card-strikepass-ultra'
      : isWeekly
      ? 'card-strikepass-weekly'
      : 'card-strikepass';

    return (
      <div
        key={pkg.id}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={`Seleccionar ${pkg.name}, precio ${priceInfo.formattedBs}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectPackage(pkg);
          }
        }}
        onClick={() => onSelectPackage(pkg)}
        className={`product-card ${cardClass} ${isSelected ? 'card-selected' : ''}`}
      >
        {isSelected && <div className="selected-check-badge">✓</div>}
        <span
          className="pass-badge"
          style={
            isPremium
              ? { background: 'linear-gradient(90deg, #ffb703, #fb8500)', color: '#000' }
              : isElite
              ? { background: '#00d2ff', color: '#000' }
              : isUltraSkin
              ? { background: 'linear-gradient(90deg, #d946ef, #8b5cf6)', color: '#fff' }
              : isWeekly
              ? { background: 'linear-gradient(90deg, #10b981, #06b6d4)', color: '#000' }
              : undefined
          }
        >
          {pkg.passBadge || (isPremium ? 'PREMIUM' : isElite ? 'ELITE' : 'TEMPORADA')}
        </span>
        <div className="pass-icon-container">
          {pkg.image ? (
            <img
              src={pkg.image}
              alt={pkg.name}
              width="92"
              height="92"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105 ${
                isPremium
                  ? 'border border-amber-400/40 drop-shadow-[0_6px_14px_rgba(255,183,3,0.45)]'
                  : isElite
                  ? 'border border-cyan-400/40 drop-shadow-[0_6px_14px_rgba(0,210,255,0.45)]'
                  : isUltraSkin
                  ? 'border border-fuchsia-400/50 drop-shadow-[0_6px_14px_rgba(217,70,239,0.45)]'
                  : isWeekly
                  ? 'border border-emerald-400/50 drop-shadow-[0_6px_14px_rgba(16,185,129,0.45)]'
                  : 'border border-slate-700/60'
              }`}
            />
          ) : (
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <polygon
                points="50,10 90,30 90,70 50,90 10,70 10,30"
                fill="#FF2A5F"
                opacity="0.2"
                stroke={isPremium ? '#FFB703' : '#FF2A5F'}
                strokeWidth="3"
              />
              <path d="M35 30 L65 30 L75 50 L50 75 L25 50 Z" fill="#FF2A5F" />
              <path d="M50 20 L70 50 L50 80 L30 50 Z" fill={isPremium ? '#FFB703' : '#FF7597'} />
              {isPremium && (
                <path d="M38 18 L50 10 L62 18 L57 24 L43 24 Z" fill="#FFD166" stroke="#FFAA00" strokeWidth="1.2" />
              )}
            </svg>
          )}
        </div>
        <h4 className="gold-qty">{pkg.name}</h4>
        <p className="pass-description">{pkg.description}</p>
        <div className="price-box">
          {appliedCoupon && (
            <div className="text-[11px] text-slate-300 line-through font-mono mb-0.5">
              {priceInfo.originalFormattedBs}
            </div>
          )}
          <div className="bs-price">{priceInfo.formattedBs}</div>
          <div className="usd-ref">Ref: {priceInfo.formattedUsd}</div>
        </div>
      </div>
    );
  };

  return (
    <div id="step-2" className="shop-container scroll-mt-20">
      {/* Step Header & Filters */}
      <div className="bg-[#0e1526]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-5 mb-3 sm:mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-2.5 sm:mb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ffd166] text-black font-extrabold text-xs sm:text-sm shadow-md shrink-0">
              2
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-extrabold text-sm sm:text-lg uppercase tracking-wider leading-tight">
                  Selecciona tu Paquete
                </h2>
                {appliedCoupon && (
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                    -{appliedCoupon.percent}% Dcto
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 hidden xs:block">Packs de Gold y Pases Oficiales para Blood Strike</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar paquete..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-7 py-1.5 sm:py-2 bg-[#060a12] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ffb703] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Borrar texto de búsqueda de paquetes"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 no-scrollbar border-t border-white/5 pt-2 sm:pt-3">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'gold', label: '🏆 Oro (Gold)' },
            { id: 'pass', label: '🔥 Pases Oficiales' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PackageCategory | 'all')}
              aria-pressed={activeTab === tab.id}
              aria-label={`Filtrar paquetes por categoría: ${tab.label}`}
              className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#ffd166] to-[#ffb703] text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#060a12] text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="py-8 sm:py-12 text-center text-slate-300 bg-[#0e1526]/80 rounded-2xl border border-white/10 space-y-2">
          <Tag className="w-6 h-6 sm:w-7 sm:h-7 mx-auto text-slate-300" />
          <p className="text-xs sm:text-sm font-semibold text-slate-200">No se encontraron productos con "{searchQuery}"</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Restablecer y limpiar búsqueda"
            className="text-xs text-[#ffd166] hover:underline font-semibold"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-8">
          {/* SECCIÓN RECARGAS DE ORO */}
          {(activeTab === 'all' || activeTab === 'gold') && goldPackages.length > 0 && (
            <div>
              <h3 className="section-title">🏆 Recarga de Gold</h3>
              <div className="products-grid">
                {goldPackages.map((pkg) => renderProductCard(pkg))}
              </div>
            </div>
          )}

          {/* SECCIÓN PASES DE TEMPORADA */}
          {(activeTab === 'all' || activeTab === 'pass') && passPackages.length > 0 && (
            <div className={activeTab === 'all' && goldPackages.length > 0 ? 'mt-4 sm:mt-8' : undefined}>
              <h3 className="section-title">🔥 Pases Oficiales</h3>
              <div className="products-grid">
                {passPackages.map((pkg) => renderProductCard(pkg))}
              </div>
            </div>
          )}

          {/* Otros paquetes si existen */}
          {otherPackages.length > 0 && (
            <div className="mt-4 sm:mt-8">
              <h3 className="section-title">⚡ Paquetes Especiales</h3>
              <div className="products-grid">
                {otherPackages.map((pkg) => renderProductCard(pkg))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
