export type PackageCategory = 'all' | 'gold' | 'pass' | 'special';

export interface PackageItem {
  id: string;
  name: string;
  category: PackageCategory;
  priceBs: string;
  priceNumeric: number;
  priceUsd: number;
  discountBadge: string;
  popular?: boolean;
  iconType: 'gold' | 'pass' | 'special';
  description?: string;
  amountLabel?: string;
  bonusBadge?: string;
  passBadge?: string;
  cardType?: 'gold' | 'strikepass' | 'levelup';
  image?: string;
}

export interface PaymentInfo {
  bank: string;
  bankCode: string;
  idNumber: string;
  phone: string;
  recipient: string;
}

export interface BinancePaymentInfo {
  email: string;
  instructions: string;
}

export interface PaypalPaymentInfo {
  email: string;
  recipientName: string;
}

export interface OrderState {
  playerId: string;
  selectedPackage: PackageItem | null;
  referenceNumber: string;
  receiptImage: string | null;
}

export interface CartItem {
  packageItem: PackageItem;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  distinctCount: number;
  subtotalBs: number;
  subtotalUsd: number;
  discountBs: number;
  discountUsd: number;
  totalBs: number;
  totalUsd: number;
  formattedSubtotalBs: string;
  formattedSubtotalUsd: string;
  formattedDiscountBs: string;
  formattedDiscountUsd: string;
  formattedTotalBs: string;
  formattedTotalUsd: string;
}
