/**
 * In-App Purchase Service for Waggly Premium
 *
 * Uses @capgo/native-purchases for direct StoreKit 2 integration.
 * No third-party service required — talks directly to App Store.
 *
 * Setup:
 * 1. npm install @capgo/native-purchases
 * 2. npx cap sync ios
 * 3. Configure products in App Store Connect
 * 4. Enable "In-App Purchase" capability in Xcode
 */
import { db } from './firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/app';

// Product IDs configured in App Store Connect
export const PRODUCTS = {
  premiumMonthly: 'com.waggly.app.premium.monthly',
  premiumYearly: 'com.waggly.app.premium.yearly',
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

export const PREMIUM_FEATURES = [
  { title: 'Unlimited AI Diagnoses', desc: 'No daily limit on symptom analysis' },
  { title: 'Priority AI Responses', desc: 'Faster, more detailed analysis' },
  { title: 'Health Reports', desc: 'Monthly pet health summaries' },
  { title: 'Exclusive Badges', desc: 'Premium-only achievements' },
  { title: 'Ad-Free Experience', desc: 'No interruptions, ever' },
];

function isNativePlatform(): boolean {
  try {
    return typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

let nativePurchases: any = null;
let purchaseType: any = null;

async function getNativePurchases() {
  if (nativePurchases) return { NativePurchases: nativePurchases, PURCHASE_TYPE: purchaseType };
  try {
    const mod = await import('@capgo/native-purchases');
    nativePurchases = mod.NativePurchases;
    purchaseType = mod.PURCHASE_TYPE;
    return { NativePurchases: nativePurchases, PURCHASE_TYPE: purchaseType };
  } catch {
    return null;
  }
}

/**
 * Initialize and check billing availability.
 */
export async function initializePurchases(): Promise<void> {
  if (!isNativePlatform()) {
    console.log('[Purchases] Not on native platform, skipping init');
    return;
  }

  const plugins = await getNativePurchases();
  if (!plugins) {
    console.log('[Purchases] @capgo/native-purchases not available');
    return;
  }

  try {
    const { isBillingSupported } = await plugins.NativePurchases.isBillingSupported();
    console.log('[Purchases] Billing supported:', isBillingSupported);
  } catch (error) {
    console.error('[Purchases] Init error:', error);
  }
}

/**
 * Initiate a purchase for a premium plan.
 */
export async function purchasePremium(
  productId: string,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return {
      success: false,
      message: 'In-app purchases are only available on iOS. Please use the app on your iPhone.',
    };
  }

  const plugins = await getNativePurchases();
  if (!plugins) {
    return { success: false, message: 'Purchase service not available. Please try again later.' };
  }

  try {
    const transaction = await plugins.NativePurchases.purchaseProduct({
      productIdentifier: productId,
      productType: plugins.PURCHASE_TYPE.SUBS,
      quantity: 1,
    });

    if (transaction) {
      await setPremiumStatus(userId, true);
      return { success: true, message: 'Welcome to Waggly Premium!' };
    }

    return { success: false, message: 'Purchase was cancelled.' };
  } catch (error: any) {
    if (error?.message?.includes('cancelled') || error?.code === 2) {
      return { success: false, message: 'Purchase cancelled.' };
    }
    console.error('[Purchases] Error:', error);
    return { success: false, message: error?.message || 'Purchase failed. Please try again.' };
  }
}

/**
 * Restore previous purchases (required by App Store).
 */
export async function restorePurchases(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return { success: false, message: 'Restore is only available on iOS.' };
  }

  const plugins = await getNativePurchases();
  if (!plugins) {
    return { success: false, message: 'Purchase service not available.' };
  }

  try {
    await plugins.NativePurchases.restorePurchases();
    const { purchases } = await plugins.NativePurchases.getPurchases({
      productType: plugins.PURCHASE_TYPE.SUBS,
    });

    const hasActive = purchases?.some(
      (p: any) => p.isActive === true || p.purchaseState === '1',
    );

    if (hasActive) {
      await setPremiumStatus(userId, true);
      return { success: true, message: 'Premium restored successfully!' };
    }

    return { success: false, message: 'No active subscriptions found.' };
  } catch (error: any) {
    console.error('[Purchases] Restore error:', error);
    return { success: false, message: 'Failed to restore purchases.' };
  }
}

/**
 * Update Firestore premium status.
 */
export async function setPremiumStatus(userId: string, isPremium: boolean): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, userId);
  await updateDoc(userRef, { isPremium });
}

/**
 * Increment AI diagnosis usage counter.
 */
export async function incrementDiagnosisUsage(userId: string): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, userId);
  await updateDoc(userRef, { aiDiagnosisUsed: increment(1) });
}

/**
 * Check if user can use AI diagnosis (free limit or premium).
 */
export function canUseDiagnosis(isPremium: boolean, aiDiagnosisUsed: number, freeLimit: number): boolean {
  if (isPremium) return true;
  return aiDiagnosisUsed < freeLimit;
}

/**
 * Get remaining free diagnoses.
 */
export function getRemainingDiagnoses(isPremium: boolean, aiDiagnosisUsed: number, freeLimit: number): number {
  if (isPremium) return -1;
  return Math.max(0, freeLimit - aiDiagnosisUsed);
}
