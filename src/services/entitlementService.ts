import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from '../constants/app';
import { OWNED_PRODUCT_IDS } from '../constants/billing';
import { getPlatform, isNativePlatform, type Platform } from './platform';

/**
 * Who is allowed to say whether a user has premium.
 *
 * The store is, and Firestore is a cache of its answer. That ordering is the
 * whole point of this module: before it existed, `isPremium` was written once
 * at purchase and never revisited, so cancelling, being refunded or letting a
 * payment fail left the user premium forever, and a reinstall left a paying
 * user with nothing to restore.
 *
 * What this does NOT do is prove the purchase is genuine. That needs the
 * Google Play Developer API or Apple's App Store Server API, both of which
 * are server-to-server and cannot run here — their credentials would ship
 * inside the app. What it does is make the honest path correct, which is the
 * path essentially every real user is on.
 */

/**
 * Deliberately three states, not a boolean.
 *
 * `unknown` is the one that matters: offline, store not ready, plugin missing.
 * Collapsing it into `false` would revoke premium from a paying user who
 * happens to open the app in a tunnel — the worst thing this code could do,
 * and the easy mistake to make. Every caller must handle it as "change
 * nothing", which the type forces them to notice.
 */
export type EntitlementStatus = 'active' | 'none' | 'unknown';

export interface EntitlementReading {
  status: EntitlementStatus;
  /** Why the store could not answer. Present only when status is 'unknown'. */
  reason?: string;
}

const UNKNOWN = (reason: string): EntitlementReading => ({ status: 'unknown', reason });

/**
 * The fields of a store transaction this decision rests on. Declared
 * structurally rather than imported from the plugin so the rule below can be
 * exercised against plain objects, and so it is obvious at a glance how little
 * of the transaction actually matters.
 */
export interface StoreTransaction {
  productIdentifier?: string;
  /** Android only. "1" is PURCHASED; "0" is PENDING. */
  purchaseState?: string;
  /** iOS only. True while the expiry date is in the future. */
  isActive?: boolean;
  /** iOS only. Set when Apple refunded or revoked the purchase. */
  revocationDate?: string;
}

/**
 * True when a store transaction represents a subscription the user holds
 * right now. The two stores report this through entirely different fields —
 * neither platform populates the other's — so there is no shared shortcut.
 *
 * Takes the platform as an argument rather than reading it, so the rule is a
 * pure function of its inputs and can be checked for every combination.
 */
export function isCurrentlyEntitled(
  transaction: StoreTransaction,
  platform: Platform,
): boolean {
  if (!transaction?.productIdentifier) return false;
  if (!OWNED_PRODUCT_IDS.includes(transaction.productIdentifier)) return false;

  if (platform === 'android') {
    // Play exposes neither expirationDate nor isActive. It does not have to:
    // queryPurchases only returns unexpired purchases, and refunds drop out of
    // the list entirely, so presence plus PURCHASED already means entitled.
    // A cancelled-but-not-yet-expired subscription is still PURCHASED here,
    // which is correct — the user paid through the end of the period.
    return transaction.purchaseState === '1';
  }

  // StoreKit keeps expired transactions in history, so presence proves
  // nothing; isActive is the field that accounts for the expiry date, and
  // revocationDate covers a refund Apple granted after the fact.
  return transaction.isActive === true && !transaction.revocationDate;
}

/**
 * Asks the store what the user currently owns.
 *
 * Returns 'unknown' rather than throwing: a failure to reach the store is an
 * expected, routine condition, not an exceptional one.
 */
export async function readStoreEntitlement(): Promise<EntitlementReading> {
  if (!isNativePlatform()) {
    // The browser build has no store to ask. Firestore stays the only source
    // available there, which is why this is 'unknown' and not 'none'.
    return UNKNOWN('not a native platform');
  }

  try {
    const { NativePurchases, PURCHASE_TYPE } = await import('@capgo/native-purchases');
    const { purchases } = await NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.SUBS,
      // iOS only: scope the answer to currently active entitlements for the
      // signed-in Apple ID, instead of every transaction the device has ever
      // seen. Ignored on Android.
      onlyCurrentEntitlements: true,
    });

    const platform = getPlatform();
    const active = purchases.some((p) => isCurrentlyEntitled(p, platform));
    return { status: active ? 'active' : 'none' };
  } catch (error: any) {
    // Offline, Play Services missing, billing unavailable on the device, user
    // not signed into a store account — all land here, and all mean the same
    // thing to callers: we did not find out.
    console.warn('[Entitlement] Store unreachable:', error?.message ?? error);
    return UNKNOWN(error?.message ?? 'store unreachable');
  }
}

/**
 * Reconciles the store's answer into Firestore and reports what the user is
 * entitled to now.
 *
 * @param cached what Firestore currently says, used when the store cannot answer
 * @returns the entitlement the app should act on
 *
 * Writes only on a real change. Firestore is behind a live snapshot listener,
 * so an unconditional write on every launch and resume would cost a write
 * apiece and re-render the tree for nothing.
 */
export async function syncEntitlement(userId: string, cached: boolean): Promise<boolean> {
  const reading = await readStoreEntitlement();

  if (reading.status === 'unknown') {
    // Keep whatever the user already had. Never downgrade on ignorance.
    return cached;
  }

  const active = reading.status === 'active';
  if (active === cached) return active;

  try {
    await updateDoc(doc(db, COLLECTIONS.users, userId), { isPremium: active });
    console.info(`[Entitlement] Premium ${active ? 'granted' : 'revoked'} from store state.`);
  } catch (error) {
    // A failed write must not change what the user sees this session; the next
    // launch or resume will try again.
    console.error('[Entitlement] Could not persist entitlement:', error);
  }

  return active;
}

/**
 * Records an entitlement the caller already established, without asking the
 * store again.
 *
 * Only for the moment a purchase completes: the transaction the store just
 * handed back is better evidence than a fresh query, which may not yet list a
 * purchase made a second ago. Everywhere else, ask the store.
 */
export async function cacheEntitlement(userId: string, active: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.users, userId), { isPremium: active });
  } catch (error) {
    // The next launch or resume reconciles, so a failure here costs the user
    // one session at most rather than the purchase.
    console.error('[Entitlement] Could not persist entitlement:', error);
  }
}

/**
 * Entitlement for a user whose cached value is not already in hand — used by
 * flows that run outside the auth subscription, such as restoring purchases.
 */
export async function syncEntitlementForUser(userId: string): Promise<boolean> {
  let cached = false;
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.users, userId));
    cached = snap.exists() ? (snap.data().isPremium ?? false) : false;
  } catch (error) {
    console.error('[Entitlement] Could not read cached entitlement:', error);
  }
  return syncEntitlement(userId, cached);
}
