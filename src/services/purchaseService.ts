import { db } from './firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/app';
import {
  BASE_PLANS,
  IOS_PRODUCT_IDS,
  SUBSCRIPTION_ID,
  type PlanId,
} from '../constants/billing';
import { getPlatform, isNativePlatform } from './platform';
import { cacheEntitlement, syncEntitlementForUser } from './entitlementService';

/**
 * Buying, pricing and managing the subscription.
 *
 * Whether the user *has* premium is not decided here — that is
 * entitlementService, which asks the store. This module only performs the
 * actions that change what the store holds, then hands over to it.
 */

export { SUBSCRIPTION_ID, BASE_PLANS, type PlanId };

export interface PremiumPlan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  savings?: string;
  recommended?: boolean;
}

/**
 * Fallback catalogue. Real prices come from the store via
 * `fetchProductPricing`; these show only where no store can answer (browser
 * preview, offline first paint, products not yet configured). They are
 * marketing copy, not a source of truth — never charge from them.
 */
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

export interface LiveProductPricing {
  priceString: string;
  title: string;
}

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

/**
 * Fetches real, localized subscription prices from StoreKit / Google Play Billing.
 *
 * Store review checks that displayed prices match what the store actually
 * charges for the user's storefront, so `PREMIUM_PLANS` is only a fallback.
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

export async function purchasePremium(
  planId: string,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return { success: false, message: 'In-app purchases are only available on the mobile app.' };
  }

  try {
    const { NativePurchases, PURCHASE_TYPE } = await import('@capgo/native-purchases');

    const transaction = await withTimeout(
      NativePurchases.purchaseProduct({
        ...purchaseTarget(planId),
        // Defaults to in-app, which would make Play reject the flow outright.
        productType: PURCHASE_TYPE.SUBS,
      }),
      60_000, // 60-second timeout
    );

    // Judge the purchase from the transaction the store just handed back, not
    // from a fresh getPurchases(): querying a purchase made a second ago can
    // race its propagation, and answering "payment being processed" to
    // someone who has just paid is far worse than the check is worth.
    //
    // Play reports a deferred payment method — cash, carrier billing — as
    // PENDING. The purchase call still resolves, but no money has moved, so
    // no premium yet; the resume sync grants it once the payment clears.
    // StoreKit has no equivalent: it does not resolve a pending purchase.
    if (getPlatform() === 'android' && transaction?.purchaseState === '0') {
      return {
        success: false,
        message: 'Your payment is being processed. Premium unlocks as soon as it completes.',
      };
    }

    await cacheEntitlement(userId, true);
    return { success: true, message: 'Welcome to Waggly Premium!' };
  } catch (error: any) {
    if (!isCancellation(error)) {
      console.error('[Purchase]', error);
    }
    return { success: false, message: friendlyError(error) };
  }
}

/**
 * Re-grants premium to someone who already paid — after a reinstall, on a new
 * device, or under a new app account.
 *
 * Both stores require this to work, and it previously could not: it awaited
 * `restorePurchases()`, whose signature returns void, then read the very
 * Firestore flag that nothing had updated. Anyone whose cached flag was false
 * was told they had no subscription, however much they had paid. The store is
 * now asked directly.
 */
export async function restorePurchases(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return { success: false, message: 'Restore is only available on the mobile app.' };
  }

  try {
    const { NativePurchases } = await import('@capgo/native-purchases');
    // Prompts for store credentials where the platform needs them, and
    // replays transactions into the plugin so the query below sees them.
    await withTimeout(NativePurchases.restorePurchases(), 30_000);

    if (await syncEntitlementForUser(userId)) {
      return { success: true, message: 'Premium restored successfully!' };
    }

    const storeLabel = getPlatform() === 'android' ? 'Google Account' : 'Apple ID';
    return { success: false, message: `No active subscriptions found for this ${storeLabel}.` };
  } catch (error: any) {
    console.error('[Purchase] Restore error:', error);
    return { success: false, message: friendlyError(error) };
  }
}

/**
 * Opens the store's own subscription management page.
 *
 * Both stores require a subscribed user to be able to reach cancellation from
 * inside the app, and neither lets the app cancel on their behalf. Sending
 * them to the native page is the only compliant way to offer it.
 */
export async function manageSubscription(): Promise<boolean> {
  if (!isNativePlatform()) return false;
  try {
    const { NativePurchases } = await import('@capgo/native-purchases');
    await NativePurchases.manageSubscriptions();
    return true;
  } catch (error) {
    console.error('[Purchase] Could not open subscription management:', error);
    return false;
  }
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
