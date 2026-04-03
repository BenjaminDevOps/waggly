/**
 * In-App Purchase Service for Waggly Premium
 *
 * Uses Capacitor's native bridge for StoreKit 2 integration.
 * Products are configured in App Store Connect.
 *
 * To complete the native integration:
 * 1. Install: npm install cordova-plugin-purchase
 * 2. npx cap sync ios
 * 3. Configure products in App Store Connect
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

/**
 * Check if running on native iOS platform.
 */
function isNativePlatform(): boolean {
  try {
    return typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * Get the CdvPurchase store if available.
 */
function getStore(): any {
  return (window as any).CdvPurchase?.store ?? null;
}

/**
 * Initialize the store and load products.
 * Called once on app startup.
 */
export async function initializePurchases(): Promise<void> {
  if (!isNativePlatform()) {
    console.log('[Purchases] Not on native platform, skipping StoreKit init');
    return;
  }

  const store = getStore();
  if (!store) {
    console.log('[Purchases] cordova-plugin-purchase not available');
    return;
  }

  try {
    store.register([
      { id: PRODUCTS.premiumMonthly, type: store.PAID_SUBSCRIPTION, platform: store.APPLE_APPSTORE },
      { id: PRODUCTS.premiumYearly, type: store.PAID_SUBSCRIPTION, platform: store.APPLE_APPSTORE },
    ]);

    await store.initialize([store.APPLE_APPSTORE]);
    console.log('[Purchases] Products registered');
  } catch (error) {
    console.error('[Purchases] Init error:', error);
  }
}

/**
 * Initiate a purchase for a premium plan.
 * On native: uses StoreKit via cordova-plugin-purchase.
 * On web: shows info message.
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

  const store = getStore();
  if (!store) {
    return { success: false, message: 'Purchase service not available. Please try again later.' };
  }

  try {
    const offer = store.get(productId)?.getOffer();
    if (!offer) {
      return { success: false, message: 'Product not found. Please try again later.' };
    }

    const result = await store.order(offer);

    if (result && !result.isError) {
      await setPremiumStatus(userId, true);
      return { success: true, message: 'Welcome to Waggly Premium!' };
    }

    return { success: false, message: 'Purchase was cancelled.' };
  } catch (error: any) {
    if (error?.code === 'USER_CANCELLED' || error?.code === 6777010) {
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

  const store = getStore();
  if (!store) {
    return { success: false, message: 'Purchase service not available.' };
  }

  try {
    await store.restorePurchases();

    const monthly = store.get(PRODUCTS.premiumMonthly);
    const yearly = store.get(PRODUCTS.premiumYearly);
    const hasActive = monthly?.owned || yearly?.owned;

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
  if (isPremium) return -1; // unlimited
  return Math.max(0, freeLimit - aiDiagnosisUsed);
}
