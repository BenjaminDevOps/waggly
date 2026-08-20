/**
 * Store product identifiers.
 *
 * Pure data, deliberately free of imports: both the purchase layer and the
 * entitlement layer read these, and neither should have to depend on the
 * other to learn what the app sells.
 *
 * These strings must match the store consoles exactly. A typo here does not
 * fail loudly — the store simply reports no such product, live prices fall
 * back to the hardcoded ones, and the purchase button does nothing.
 */

/**
 * Google Play holds a single subscription product; the billing periods are
 * base plans inside it. Play Billing 5 dropped the old "one product per
 * period" shape, so a purchase needs both ids: the product to buy and the
 * base plan to buy it on.
 */
export const SUBSCRIPTION_ID = 'waggly_premium';

/**
 * Base plans inside SUBSCRIPTION_ID, and the app-wide key for a plan: the UI
 * selects one of these, prices are looked up under them, and the purchase
 * layer resolves them to whatever the current store expects.
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
export const IOS_PRODUCT_IDS: Record<PlanId, string> = {
  [BASE_PLANS.monthly]: 'waggly-001-month',
  [BASE_PLANS.yearly]: 'waggly-001-year',
};

/**
 * Every identifier a purchase of ours can be filed under, across both stores.
 * Used to tell our subscription apart from anything else the account owns,
 * since the store hands back the user's purchases, not just this app's.
 */
export const OWNED_PRODUCT_IDS: readonly string[] = [
  SUBSCRIPTION_ID,
  ...Object.values(BASE_PLANS),
  ...Object.values(IOS_PRODUCT_IDS),
];
