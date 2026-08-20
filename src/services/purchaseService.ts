import { db } from './firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/app';

/**
 * Google Play holds a single subscription product; the billing periods are
 * base plans inside it. Play Billing 5 dropped the old "one product per
 * period" shape, so a purchase needs both ids: the product to buy and the
 * base plan to buy it on.
 */
export const SUBSCRIPTION_ID = 'waggly_premium';

/**
 * Base plans inside SUBSCRIPTION_ID, and the app-wide key for a plan: the
 * UI selects one of these, prices are looked up under them, and
 * purchasePremium resolves them to whatever the current store expects.
 */
export const BASE_PLANS = {
  monthly: 'waggly-001-month',
  yearly: 'waggly-001-year',
} as const;

export type PlanId = (typeof BASE_PLANS)[keyof typeof BASE_PLANS];

/**
 * App Store Connect has no equivalent of a base plan — each billing period is
 * a separate product inside a subscription group — so iOS needs its own id per
 * plan. Keyed by PlanId so the rest of the app never branches on platform.
 *
 * These must match the product ids in App Store Connect, which are not
 * required to look like the Play ids. Apple documents the allowed characters
 * as alphanumerics, underscores and periods, so check the hyphens are
 * accepted when creating the products, and change the values here (not the
 * keys) if you have to pick different ones.
 */
const IOS_PRODUCT_IDS: Record<PlanId, string> = {
  [BASE_PLANS.monthly]: 'waggly-001-month',
  [BASE_PLANS.yearly]: 'waggly-001-year',
};

export interface PremiumPlan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  savings?: string;
  recommended?: boolean;
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: BASE_PLANS.monthly,
    name: 'Monthly',
    price: '4,99 €',
    period: '/month',
  },
  {
    id: BASE_PLANS.yearly,
    name: 'Yearly',
    price: '29,99 €',
    period: '/year',
    savings: 'Save 50%',
    recommended: true,
  },
];

/**
 * The ids to hand the store for a given plan.
 *
 * On Android a subscription is bought as (product, base plan); the plugin
 * documents planIdentifier as required for Android subscriptions. On iOS the
 * plan is the product and planIdentifier is ignored.
 */
function purchaseTarget(planId: string): { productIdentifier: string; planIdentifier?: string } {
  if (getPlatform() === 'android') {
    return { productIdentifier: SUBSCRIPTION_ID, planIdentifier: planId };
  }
  return { productIdentifier: IOS_PRODUCT_IDS[planId as PlanId] ?? planId };
}

/**
 * What to ask the store about when fetching prices. Android returns one entry
 * per base plan from the single subscription id, so asking for the base plans
 * directly would match nothing.
 */
function pricingQueryIds(): string[] {
  return getPlatform() === 'android' ? [SUBSCRIPTION_ID] : Object.values(IOS_PRODUCT_IDS);
}

export interface LiveProductPricing {
  priceString: string;
  title: string;
}

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

/**
 * Fetches real, localized subscription prices from StoreKit / Google Play Billing.
 *
 * App Store review checks that displayed prices match what StoreKit actually
 * charges for the user's storefront — the static `PREMIUM_PLANS` prices are
 * only a fallback (web preview, offline, or products not yet configured in
 * App Store Connect / Play Console).
 */
export async function fetchProductPricing(): Promise<Record<string, LiveProductPricing> | null> {
  if (!isNativePlatform()) return null;

  try {
    const { NativePurchases, PURCHASE_TYPE } = await import('@capgo/native-purchases');
    const { products } = await withTimeout(
      NativePurchases.getProducts({
        productIdentifiers: pricingQueryIds(),
        // Without this the plugin queries in-app products, and Play returns
        // nothing at all for a subscription id.
        productType: PURCHASE_TYPE.SUBS,
      }),
      15_000,
    );

    // `identifier` is the base plan id on Android (the subscription product id
    // is in `planIdentifier`, the reverse of the purchase arguments) and the
    // product id on iOS — so on both platforms it is the PlanId the UI holds.
    const pricing: Record<string, LiveProductPricing> = {};
    for (const product of products) {
      pricing[product.identifier] = { priceString: product.priceString, title: product.title };
    }
    return Object.keys(pricing).length > 0 ? pricing : null;
  } catch (error) {
    console.error('[Purchase] Failed to fetch live product pricing:', error);
    return null;
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
  planId: string,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return { success: false, message: 'In-app purchases are only available on the mobile app.' };
  }

  try {
    const { NativePurchases, PURCHASE_TYPE } = await import('@capgo/native-purchases');

    await withTimeout(
      NativePurchases.purchaseProduct({
        ...purchaseTarget(planId),
        // Defaults to in-app, which would make Play reject the flow outright.
        productType: PURCHASE_TYPE.SUBS,
      }),
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
    return { success: false, message: 'Restore is only available on the mobile app.' };
  }

  const platform = getPlatform();

  try {
    const { NativePurchases } = await import('@capgo/native-purchases');
    await withTimeout(NativePurchases.restorePurchases(), 30_000);

    // Read premium status from Firestore — the plugin fires restored transactions
    // which update the entitlements; we verify the result rather than granting
    // premium unconditionally.
    const userRef = doc(db, COLLECTIONS.users, userId);
    const snap = await getDoc(userRef);
    const isPremiumNow: boolean = snap.exists() ? (snap.data().isPremium ?? false) : false;

    if (isPremiumNow) {
      return { success: true, message: 'Premium restored successfully!' };
    }
    const storeLabel = platform === 'android' ? 'Google Account' : 'Apple ID';
    return { success: false, message: `No active subscriptions found for this ${storeLabel}.` };
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
