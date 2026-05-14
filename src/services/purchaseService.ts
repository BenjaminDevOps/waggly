import { db } from './firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/app';

export const PRODUCTS = {
  premiumMonthly: 'com.ministeredesapp.waggly.premium.monthly',
  premiumYearly: 'com.ministeredesapp.waggly.premium.yearly',
} as const;

export interface PremiumPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  recommended?: boolean;
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: PRODUCTS.premiumMonthly,
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
  },
  {
    id: PRODUCTS.premiumYearly,
    name: 'Yearly',
    price: '$29.99',
    period: '/year',
    savings: 'Save 50%',
    recommended: true,
  },
];

function isNativePlatform(): boolean {
  try {
    return typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function purchasePremium(
  productId: string,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return { success: false, message: 'In-app purchases are only available on iOS.' };
  }

  try {
    const { NativePurchases } = await import('@capgo/native-purchases');
    await NativePurchases.purchaseProduct({ productIdentifier: productId });
    await setPremiumStatus(userId, true);
    return { success: true, message: 'Welcome to Waggly Premium!' };
  } catch (error: any) {
    const msg: string = error?.message ?? '';
    if (msg.toLowerCase().includes('cancel') || error?.code === 'USER_CANCELLED') {
      return { success: false, message: 'Purchase cancelled.' };
    }
    console.error('[Purchase]', error);
    return { success: false, message: msg || 'Purchase failed. Please try again.' };
  }
}

export async function restorePurchases(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return { success: false, message: 'Restore is only available on iOS.' };
  }

  try {
    const { NativePurchases } = await import('@capgo/native-purchases');
    await NativePurchases.restorePurchases();
    await setPremiumStatus(userId, true);
    return { success: true, message: 'Premium restored successfully!' };
  } catch (error: any) {
    console.error('[Purchase] Restore error:', error);
    return { success: false, message: error?.message || 'No active subscriptions found.' };
  }
}

export async function setPremiumStatus(userId: string, isPremium: boolean): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, userId);
  await updateDoc(userRef, { isPremium });
}

export async function incrementDiagnosisUsage(userId: string): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, userId);
  await updateDoc(userRef, { aiDiagnosisUsed: increment(1) });
}

export function canUseDiagnosis(isPremium: boolean, aiDiagnosisUsed: number, freeLimit: number): boolean {
  if (isPremium) return true;
  return aiDiagnosisUsed < freeLimit;
}

export function getRemainingDiagnoses(isPremium: boolean, aiDiagnosisUsed: number, freeLimit: number): number {
  if (isPremium) return -1;
  return Math.max(0, freeLimit - aiDiagnosisUsed);
}
