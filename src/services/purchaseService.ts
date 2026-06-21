import { db } from './firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/app';

export const PRODUCTS = {
  premiumMonthly: 'waggly-001-month',
  premiumYearly: 'waggly-001-year',
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

export function getPlatform(): 'ios' | 'android' | 'web' {
  try {
    if (typeof (window as any).Capacitor === 'undefined') return 'web';
    const p: string = (window as any).Capacitor.getPlatform();
    if (p === 'ios') return 'ios';
    if (p === 'android') return 'android';
    return 'web';
  } catch {
    return 'web';
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('PURCHASE_TIMEOUT')), ms),
    ),
  ]);
}

let billingInitialized = false;

/** Initialize the native billing client. Must be called once before any purchase. */
async function ensureBillingInitialized(): Promise<void> {
  if (billingInitialized || !isNativePlatform()) return;
  try {
    const { NativePurchases } = await import('@capgo/native-purchases');
    if (typeof (NativePurchases as any).setup === 'function') {
      await (NativePurchases as any).setup({});
    }
    billingInitialized = true;
  } catch (e) {
    console.warn('[Purchase] Billing init warning:', e);
    // Non-fatal — proceed and let the purchase call surface a real error
    billingInitialized = true;
  }
}

/** Verify that a product ID is available in the store before attempting purchase. */
async function verifyProductExists(productId: string): Promise<boolean> {
  try {
    const { NativePurchases } = await import('@capgo/native-purchases');
    if (typeof (NativePurchases as any).getProducts !== 'function') return true;
    const result: any = await withTimeout(
      (NativePurchases as any).getProducts({ productIdentifiers: [productId] }),
      10_000,
    );
    const products: any[] = result?.products ?? [];
    const found = products.some(
      (p: any) => p.productIdentifier === productId || p.productId === productId,
    );
    if (!found) {
      console.warn(
        `[Purchase] Product "${productId}" not found in store. ` +
        'Ensure it is created and active in the Play Console / App Store Connect ' +
        'and that the app is in a valid testing track.',
      );
    }
    return found;
  } catch {
    // getProducts failed — proceed and let purchaseProduct surface the real error
    return true;
  }
}

function friendlyError(error: any, platform: 'ios' | 'android' | 'web'): string {
  const msg: string = (error?.message ?? '').toLowerCase();
  const code: string = (error?.code ?? '').toLowerCase();

  if (msg === 'purchase_timeout') {
    return 'The purchase took too long. Please check your connection and try again.';
  }
  if (msg.includes('cancel') || code === 'user_cancelled' || code === '1') {
    return 'Purchase cancelled.';
  }
  if (
    msg.includes('not found') ||
    msg.includes('invalid product') ||
    msg.includes('itemunavailable') ||
    code === 'item_unavailable' ||
    code === '4'
  ) {
    const store = platform === 'android' ? 'Google Play Console' : 'App Store Connect';
    return (
      `This subscription is not yet available in the store. ` +
      `Please ensure the product is active in ${store} and try again later.`
    );
  }
  if (msg.includes('billing unavailable') || code === 'billing_unavailable') {
    return 'Google Play Billing is not available on this device or account. ' +
      'Make sure you are signed in with a Google account that has access to the Play Store.';
  }
  if (msg.includes('not entitled') || msg.includes('not signed in')) {
    const store = platform === 'android' ? 'Google Play' : 'App Store';
    return `Please sign in to ${store} and try again.`;
  }
  if (msg.includes('network') || msg.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (msg.includes('already') || msg.includes('duplicate') || code === 'item_already_owned') {
    return 'You already have an active subscription. Try restoring your purchases.';
  }
  console.error('[Purchase] Unhandled error:', error);
  return 'Purchase failed. Please try again or contact support.';
}

function isCancellation(error: any): boolean {
  const msg: string = (error?.message ?? '').toLowerCase();
  const code: string = (error?.code ?? '').toLowerCase();
  return (
    msg.includes('cancel') ||
    code === 'user_cancelled' ||
    code === '1'
  );
}

export async function purchasePremium(
  productId: string,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return {
      success: false,
      message: 'In-app purchases are only available on the mobile app.',
    };
  }

  const platform = getPlatform();

  try {
    await ensureBillingInitialized();

    const { NativePurchases } = await import('@capgo/native-purchases');

    // Pre-check: verify the product is available before trying to buy
    const productExists = await verifyProductExists(productId);
    if (!productExists) {
      const store = platform === 'android' ? 'Google Play Console' : 'App Store Connect';
      return {
        success: false,
        message:
          `This subscription plan is not yet configured in the ${store}. ` +
          'Please contact support if this issue persists.',
      };
    }

    await withTimeout(
      NativePurchases.purchaseProduct({ productIdentifier: productId }),
      60_000,
    );

    await setPremiumStatus(userId, true);
    return { success: true, message: 'Welcome to Waggly Premium!' };
  } catch (error: any) {
    if (!isCancellation(error)) {
      console.error('[Purchase] Error:', error);
    }
    return { success: false, message: friendlyError(error, platform) };
  }
}

export async function restorePurchases(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return {
      success: false,
      message: 'Restore is only available on the mobile app.',
    };
  }

  const platform = getPlatform();

  try {
    await ensureBillingInitialized();

    const { NativePurchases } = await import('@capgo/native-purchases');
    await withTimeout(NativePurchases.restorePurchases(), 30_000);

    const userRef = doc(db, COLLECTIONS.users, userId);
    const snap = await getDoc(userRef);
    const isPremiumNow: boolean = snap.exists()
      ? (snap.data().isPremium ?? false)
      : false;

    if (isPremiumNow) {
      return { success: true, message: 'Premium restored successfully!' };
    }
    const storeLabel =
      platform === 'android' ? 'Google Account' : 'Apple ID';
    return {
      success: false,
      message: `No active subscriptions found for this ${storeLabel}.`,
    };
  } catch (error: any) {
    console.error('[Purchase] Restore error:', error);
    return { success: false, message: friendlyError(error, platform) };
  }
}

export async function setPremiumStatus(
  userId: string,
  isPremium: boolean,
): Promise<void> {
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
