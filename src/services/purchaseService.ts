import { db } from './firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/app';

export const PRODUCTS = {
  premiumMonthly: 'waggly_001_month',
  premiumYearly: 'waggly_001_year',
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
    price: '4,99 €',
    period: '/month',
  },
  {
    id: PRODUCTS.premiumYearly,
    name: 'Yearly',
    price: '29,99 €',
    period: '/year',
    savings: 'Save 50%',
    recommended: true,
  },
];

function isNativePlatform(): boolean {
  try {
    return (
      typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform()
    );
  } catch {
    return false;
  }
}

// Rejects after `ms` milliseconds with a timeout error.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('PURCHASE_TIMEOUT')),
        ms,
      ),
    ),
  ]);
}

function friendlyError(error: any): string {
  const msg: string = (error?.message ?? '').toLowerCase();
  if (msg === 'purchase_timeout') {
    return 'The purchase took too long. Please check your connection and try again.';
  }
  if (msg.includes('cancel') || error?.code === 'USER_CANCELLED') {
    return 'Purchase cancelled.';
  }
  if (msg.includes('not found') || msg.includes('invalid product')) {
    return 'This subscription plan is temporarily unavailable. Please try again later.';
  }
  if (msg.includes('network') || msg.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (msg.includes('already') || msg.includes('duplicate')) {
    return 'You already have an active subscription. Try restoring your purchases.';
  }
  return 'Purchase failed. Please try again or contact support.';
}

// Returns true if the error represents a user-initiated cancel (not an error to log).
function isCancellation(error: any): boolean {
  const msg: string = (error?.message ?? '').toLowerCase();
  return msg.includes('cancel') || error?.code === 'USER_CANCELLED';
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

    await withTimeout(
      NativePurchases.purchaseProduct({ productIdentifier: productId }),
      60_000, // 60-second timeout
    );

    await setPremiumStatus(userId, true);
    return { success: true, message: 'Welcome to Waggly Premium!' };
  } catch (error: any) {
    if (!isCancellation(error)) {
      console.error('[Purchase]', error);
    }
    return { success: false, message: friendlyError(error) };
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
    await withTimeout(NativePurchases.restorePurchases(), 30_000);

    // Read the current premium status from Firestore instead of blindly setting it.
    // StoreKit fires restored transactions which the plugin processes; if any active
    // subscription is found the plugin updates the entitlements — we just check the
    // result rather than granting premium unconditionally.
    const userRef = doc(db, COLLECTIONS.users, userId);
    const snap = await getDoc(userRef);
    const isPremiumNow: boolean = snap.exists() ? (snap.data().isPremium ?? false) : false;

    if (isPremiumNow) {
      return { success: true, message: 'Premium restored successfully!' };
    }
    return { success: false, message: 'No active subscriptions found for this Apple ID.' };
  } catch (error: any) {
    console.error('[Purchase] Restore error:', error);
    return { success: false, message: friendlyError(error) };
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

export function canUseDiagnosis(
  isPremium: boolean,
  aiDiagnosisUsed: number,
  freeLimit: number,
): boolean {
  if (isPremium) return true;
  return aiDiagnosisUsed < freeLimit;
}

export function getRemainingDiagnoses(
  isPremium: boolean,
  aiDiagnosisUsed: number,
  freeLimit: number,
): number {
  if (isPremium) return -1;
  return Math.max(0, freeLimit - aiDiagnosisUsed);
}
