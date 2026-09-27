import { PackageItem, PaymentInfo, BinancePaymentInfo, PaypalPaymentInfo } from '../types';
import strikePassEliteImg from '../assets/images/strike_pass_elite_1790404061640.jpg';
import strikePassPremiumImg from '../assets/images/strike_pass_premium_1790404070746.jpg';
import levelUpPassImg from '../assets/images/level_up_pass_1790404080850.jpg';

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
  LAOSTIA: 5,
  BETANVOID: 5,
  FIREBALL: 5,
  SHIJARU: 5,
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

export const PACKAGES: PackageItem[] = [
  // ORO (GOLD) - NUEVA LISTA DE PRECIOS OFICIAL
  {
    id: 'gold-105',
    name: '100 + 5 Golds',
    category: 'gold',
    priceBs: '882,70 Bs',
    priceNumeric: 882.70,
    priceUsd: 0.91,
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
    priceBs: '2.418,36 Bs',
    priceNumeric: 2418.36,
    priceUsd: 2.60,
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
    priceBs: '4.016,51 Bs',
    priceNumeric: 4016.51,
    priceUsd: 4.75,
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
    priceBs: '8.904,60 Bs',
    priceNumeric: 8904.60,
    priceUsd: 9.18,
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
    priceBs: '17.799,50 Bs',
    priceNumeric: 17799.50,
    priceUsd: 18.35,
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
    priceBs: '44.367,80 Bs',
    priceNumeric: 44367.80,
    priceUsd: 45.74,
    discountBadge: '',
    iconType: 'gold',
    cardType: 'gold',
    amountLabel: '5000 Gold',
    bonusBadge: '+800 BONUS',
    description: 'Mega Pack: 5.800 Gold en total con bono masivo.'
  },

  // PASES OFICIALES BLOOD STRIKE
  {
    id: 'pass-mejora',
    name: 'Level-Up Pass',
    category: 'pass',
    priceBs: '2.800,00 Bs',
    priceNumeric: 2800.00,
    priceUsd: 3.30,
    discountBadge: '',
    iconType: 'pass',
    cardType: 'levelup',
    amountLabel: 'Level Up Pass',
    passBadge: 'PROGRESO',
    description: 'Consigue hasta 1,200 Gold acumulativos a medida que subes de nivel en tu cuenta.',
    image: levelUpPassImg
  },
  {
    id: 'pass-elite',
    name: 'Strike Pass Elite',
    category: 'pass',
    priceBs: '3.200,00 Bs',
    priceNumeric: 3200.00,
    priceUsd: 3.80,
    discountBadge: '',
    popular: true,
    iconType: 'pass',
    cardType: 'strikepass',
    amountLabel: 'Strike Pass Elite',
    passBadge: 'TEMPORADA',
    description: 'Desbloquea Skins de Striker Exclusivas, Armas Legendarias y Oro de la Temporada.',
    image: strikePassEliteImg
  },
  {
    id: 'pass-elite-plus',
    name: 'Strike Pass Premium',
    category: 'pass',
    priceBs: '9.389,60 Bs',
    priceNumeric: 9389.60,
    priceUsd: 9.68,
    discountBadge: '',
    iconType: 'pass',
    cardType: 'strikepass',
    amountLabel: 'Strike Pass Premium',
    passBadge: 'PREMIUM',
    description: 'Pase Elite completo + subida instantánea de niveles y recompensas exclusivas.',
    image: strikePassPremiumImg
  }
];
