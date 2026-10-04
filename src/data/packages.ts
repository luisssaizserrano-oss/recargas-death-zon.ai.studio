import { PackageItem, PaymentInfo, BinancePaymentInfo, PaypalPaymentInfo, CartItem, CartTotals } from '../types';
import strikePassEliteImg from '../assets/images/strike_pass_elite.webp';
import strikePassPremiumImg from '../assets/images/strike_pass_premium.webp';
import levelUpPassImg from '../assets/images/level_up_pass.webp';
import bsUltraChestImg from '../assets/images/bs_ultra_chest.webp';

export const PAYMENT_DETAILS: PaymentInfo = {
  bank: 'Banco de Venezuela',
  bankCode: '0102',
  idNumber: '30.794.288',
  phone: '0414-8015751',
  recipient: 'Recargas Death Zone'
};

export const BINANCE_DETAILS: BinancePaymentInfo = {
  email: 'manuelsaiz982@gmail.com',
  instructions: 'Ingresar los últimos 6 dígitos del Order ID (Ejemplo: Si tu Order ID es 123456789012345678291840, ingresa: 291840)'
};

export const PAYPAL_DETAILS: PaypalPaymentInfo = {
  email: 'llluis_ms@hotmail.com',
  recipientName: 'Luis Saiz'
};

export const WHATSAPP_NUMBER = '584148015751';

export const VALID_COUPONS: Record<string, number> = {
  LAOSTIA: 3,
  BETANVOID: 3,
  FIREBALL: 3,
  SHIJARU: 3,
  ZIDOZO: 3,
};

export function formatBs(amount: number): string {
  const parts = amount.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${integerPart},${parts[1]} Bs`;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)} USD`;
}

export function calculateEffectivePrice(
  basePriceNumericBs: number,
  basePriceNumericUsd: number,
  discountPercent: number = 0
): {
  finalBsNumeric: number;
  finalUsdNumeric: number;
  formattedBs: string;
  originalFormattedBs: string;
  formattedUsd: string;
  originalFormattedUsd: string;
} {
  const discountedBs = basePriceNumericBs * (1 - discountPercent / 100);
  const discountedUsd = basePriceNumericUsd * (1 - discountPercent / 100);

  return {
    finalBsNumeric: discountedBs,
    finalUsdNumeric: discountedUsd,
    formattedBs: formatBs(discountedBs),
    originalFormattedBs: formatBs(basePriceNumericBs),
    formattedUsd: formatUsd(discountedUsd),
    originalFormattedUsd: formatUsd(basePriceNumericUsd),
  };
}

export function calculateCartTotals(
  cart: CartItem[],
  discountPercent: number = 0
): CartTotals {
  let subtotalBs = 0;
  let subtotalUsd = 0;
  let itemCount = 0;

  for (const item of cart) {
    const qty = Math.max(1, item.quantity);
    itemCount += qty;
    subtotalBs += item.packageItem.priceNumeric * qty;
    subtotalUsd += item.packageItem.priceUsd * qty;
  }

  const discountBs = (subtotalBs * discountPercent) / 100;
  const discountUsd = (subtotalUsd * discountPercent) / 100;
  const totalBs = Math.max(0, subtotalBs - discountBs);
  const totalUsd = Math.max(0, subtotalUsd - discountUsd);

  return {
    itemCount,
    distinctCount: cart.length,
    subtotalBs,
    subtotalUsd,
    discountBs,
    discountUsd,
    totalBs,
    totalUsd,
    formattedSubtotalBs: formatBs(subtotalBs),
    formattedSubtotalUsd: formatUsd(subtotalUsd),
    formattedDiscountBs: formatBs(discountBs),
    formattedDiscountUsd: formatUsd(discountUsd),
    formattedTotalBs: formatBs(totalBs),
    formattedTotalUsd: formatUsd(totalUsd),
  };
}

/**
 * Obtiene el límite máximo permitido en el carrito para un paquete:
 * - Pases (Pase Premium, Pase Élite, Pase de Nivel, Bolsa Semanal y Cofre de la Suerte): Límite 1 unidad por pedido
 * - Oro (Gold): Límite 10 unidades sin importar la cantidad de oro
 */
export function getPackageCartLimit(pkg: PackageItem): number {
  if (
    pkg.category === 'pass' ||
    pkg.category === 'special' ||
    pkg.cardType === 'strikepass' ||
    pkg.cardType === 'levelup' ||
    pkg.id.startsWith('pass-')
  ) {
    return 1;
  }
  return 10;
}

export const PACKAGES: PackageItem[] = [
  // ORO (GOLD) - NUEVA LISTA DE PRECIOS OFICIAL
  {
    id: 'gold-105',
    name: '100 + 5 Golds',
    category: 'gold',
    priceBs: '820,00 Bs',
    priceNumeric: 820.00,
    priceUsd: 0.85,
    discountBadge: '',
    iconType: 'gold',
    cardType: 'gold',
    amountLabel: '100 Gold',
    bonusBadge: '+5 BONUS',
    description: 'Recarga instantánea de 105 monedas Gold en Blood Strike.'
  },
  {
    id: 'gold-320',
    name: '300 + 20 Golds',
    category: 'gold',
    priceBs: '2.500,00 Bs',
    priceNumeric: 2500.00,
    priceUsd: 2.59,
    discountBadge: '',
    iconType: 'gold',
    cardType: 'gold',
    amountLabel: '300 Gold',
    bonusBadge: '+20 BONUS',
    description: '320 monedas Gold de acreditación directa.'
  },
  {
    id: 'gold-540',
    name: '500 + 40 Golds',
    category: 'gold',
    priceBs: '4.130,00 Bs',
    priceNumeric: 4130.00,
    priceUsd: 4.28,
    discountBadge: '',
    iconType: 'gold',
    cardType: 'gold',
    amountLabel: '500 Gold',
    bonusBadge: '+40 BONUS',
    description: 'Recarga de 540 monedas Gold.'
  },
  {
    id: 'gold-1100',
    name: '1000 + 100 Golds',
    category: 'gold',
    priceBs: '8.300,00 Bs',
    priceNumeric: 8300.00,
    priceUsd: 8.61,
    discountBadge: '',
    popular: true,
    iconType: 'gold',
    cardType: 'gold',
    amountLabel: '1000 Gold',
    bonusBadge: '+100 BONUS',
    description: 'Pack Más Vendido: 1.100 Gold para giros y cofres.'
  },
  {
    id: 'gold-2260',
    name: '2000 + 260 Golds',
    category: 'gold',
    priceBs: '16.500,00 Bs',
    priceNumeric: 16500.00,
    priceUsd: 17.12,
    discountBadge: '',
    iconType: 'gold',
    cardType: 'gold',
    amountLabel: '2000 Gold',
    bonusBadge: '+260 BONUS',
    description: 'Pack Pro: 2.260 Gold con bono especial.'
  },
  {
    id: 'gold-5800',
    name: '5000 + 800 Golds',
    category: 'gold',
    priceBs: '41.200,00 Bs',
    priceNumeric: 41200.00,
    priceUsd: 42.74,
    discountBadge: '',
    iconType: 'gold',
    cardType: 'gold',
    amountLabel: '5000 Gold',
    bonusBadge: '+800 BONUS',
    description: 'Mega Pack: 5.800 Gold en total con bono masivo.'
  },

  // PASES Y ESPECIALES OFICIALES BLOOD STRIKE
  {
    id: 'pass-elite-plus',
    name: 'Pase Premium',
    category: 'pass',
    priceBs: '8.250,00 Bs',
    priceNumeric: 8250.00,
    priceUsd: 8.56,
    discountBadge: '',
    popular: true,
    iconType: 'pass',
    cardType: 'strikepass',
    amountLabel: 'Strike Pass Premium',
    passBadge: 'PREMIUM',
    description: 'Pase Elite completo + subida instantánea de niveles y recompensas exclusivas.',
    image: strikePassPremiumImg
  },
  {
    id: 'pass-elite',
    name: 'Pase Élite',
    category: 'pass',
    priceBs: '3.700,00 Bs',
    priceNumeric: 3700.00,
    priceUsd: 3.84,
    discountBadge: '',
    iconType: 'pass',
    cardType: 'strikepass',
    amountLabel: 'Strike Pass Elite',
    passBadge: 'ELITE',
    description: 'Desbloquea Skins de Striker Exclusivas, Armas Legendarias y Oro de la Temporada.',
    image: strikePassEliteImg
  },
  {
    id: 'pass-mejora',
    name: 'Pase de Nivel',
    category: 'pass',
    priceBs: '2.100,00 Bs',
    priceNumeric: 2100.00,
    priceUsd: 2.18,
    discountBadge: '',
    iconType: 'pass',
    cardType: 'levelup',
    amountLabel: 'Pase de Nivel',
    passBadge: 'PROGRESO',
    description: 'Consigue hasta 1,200 Gold acumulativos a medida que subes de nivel en tu cuenta.',
    image: levelUpPassImg
  },
  {
    id: 'pass-cofre-ultra-skin',
    name: 'Cofre de la Suerte',
    category: 'pass',
    priceBs: '500,00 Bs',
    priceNumeric: 500.00,
    priceUsd: 0.52,
    discountBadge: '',
    popular: true,
    iconType: 'pass',
    cardType: 'strikepass',
    amountLabel: 'Cofre Ultra Skin',
    passBadge: 'ULTRA SKIN',
    description: 'Cofre Ultra Skin con probabilidades de armas legendarias y skins de alto nivel.',
    image: bsUltraChestImg
  }
];
