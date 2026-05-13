/**
 * In-App Purchase Service for Waggly Premium
 *
 * Uses @revenuecat/purchases-capacitor (successor to @capgo/capacitor-purchases).
 * Same RevenueCat API, compatible with Capacitor 8 + SPM, targets iOS 15+.
 *
 * Setup:
 * 1. npm install @revenuecat/purchases-capacitor
 * 2. npx cap sync ios
 * 3. Configure products in App Store Connect
 * 4. Set your RevenueCat API key in .env (VITE_REVENUECAT_API_KEY)
 */
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

let purchasesPlugin: any = null;

async function getPurchases() {
  if (purchasesPlugin) return purchasesPlugin;
  try {
    const mod = await withTimeout(
      import('@revenuecat/purchases-capacitor'),
      10000,
      'import purchases plugin',
    );
    purchasesPlugin = mod.Purchases;
    return purchasesPlugin;
  } catch (e) {
    console.warn('[Purchases] Could not load plugin:', e);
    return null;
  }
}

export async function initializePurchases(userId?: string): Promise<void> {
  if (!isNativePlatform()) {
    console.log('[Purchases] Not on native platform, skipping init');
    return;
  }

  const Purchases = await getPurchases();
  if (!Purchases) {
    console.log('[Purchases] @revenuecat/purchases-capacitor not available');
    return;
  }

  try {
    const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY || '';
    if (!apiKey || apiKey === 'appl_YOUR_REVENUECAT_API_KEY') {
      console.warn('[Purchases] No valid API key set in VITE_REVENUECAT_API_KEY');
      return;
    }
    await Purchases.configure({
      apiKey,
      appUserID: userId || undefined,
    });
    console.log('[Purchases] Configured with key:', apiKey.slice(0, 10) + '...');
  } catch (error) {
    console.error('[Purchases] Init error:', error);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms),
    ),
  ]);
}

export async function purchasePremium(
  productId: string,
  userId: string,
  log?: (msg: string) => void,
): Promise<{ success: boolean; message: string }> {
  const l = log || ((msg: string) => console.log('[Purchases]', msg));

  if (!isNativePlatform()) {
    l('Not native platform');
    return {
      success: false,
      message: 'In-app purchases are only available on iOS. Please use the app on your iPhone.',
    };
  }

  l('Loading plugin...');
  const Purchases = await getPurchases();
  if (!Purchases) {
    l('Plugin load FAILED');
    return { success: false, message: 'Purchase service not available. Please try again later.' };
  }
  l('Plugin loaded OK');

  try {
    l('Fetching offerings (15s timeout)...');
    const offerings: any = await withTimeout(Purchases.getOfferings(), 15000, 'getOfferings');
    l(`Offering: ${offerings?.current?.identifier || 'NONE'}`);
    const packages = offerings.current?.availablePackages ?? [];
    l(`Packages (${packages.length}): ${packages.map((p: any) => `${p.packageType}:${p.product?.identifier}`).join(', ') || 'empty'}`);

    let pkg = packages.find((p: any) => p.product?.identifier === productId);

    if (!pkg) {
      const isYearly = productId.includes('yearly');
      const fallbackType = isYearly ? 'ANNUAL' : 'MONTHLY';
      l(`No exact match, trying packageType: ${fallbackType}`);
      pkg = packages.find((p: any) =>
        p.packageType === fallbackType ||
        p.packageType === fallbackType.toLowerCase(),
      );
      if (pkg) {
        l(`Matched by packageType: ${fallbackType}`);
      }
    }

    if (!pkg && packages.length > 0) {
      pkg = packages[0];
      l('Using first available package as fallback');
    }

    if (!pkg) {
      l('NO packages found at all');
      return { success: false, message: 'No products available. Check RevenueCat Offerings configuration.' };
    }

    l(`Purchasing: ${pkg.product?.identifier} (${pkg.packageType})...`);
    const purchaseStart = Date.now();
    const result = await Purchases.purchasePackage({ aPackage: pkg });
    l(`purchasePackage completed in ${Date.now() - purchaseStart}ms`);
    l('Purchase completed, checking entitlements...');

    if (result?.customerInfo?.entitlements?.active?.premium) {
      l('Entitlement "premium" active');
      await setPremiumStatus(userId, true);
      return { success: true, message: 'Welcome to Waggly Premium!' };
    }

    l('No "premium" entitlement found but purchase succeeded, granting anyway');
    await setPremiumStatus(userId, true);
    return { success: true, message: 'Welcome to Waggly Premium!' };
  } catch (error: any) {
    if (error?.code === 1 || error?.message?.includes('cancelled')) {
      l('User cancelled');
      return { success: false, message: 'Purchase cancelled.' };
    }
    l(`ERROR: ${error?.code || 'no code'} - ${error?.message || String(error)}`);
    return { success: false, message: error?.message || 'Purchase failed. Please try again.' };
  }
}

export async function restorePurchases(
  userId: string,
): Promise<{ success: boolean; message: string }> {
  if (!isNativePlatform()) {
    return { success: false, message: 'Restore is only available on iOS.' };
  }

  const Purchases = await getPurchases();
  if (!Purchases) {
    return { success: false, message: 'Purchase service not available.' };
  }

  try {
    const result = await Purchases.restorePurchases();
    const hasActive = result?.customerInfo?.entitlements?.active?.premium;

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

export interface DiagnosticStep {
  label: string;
  status: 'ok' | 'warn' | 'error' | 'pending';
  detail: string;
}

export async function diagnoseRevenueCat(): Promise<DiagnosticStep[]> {
  const steps: DiagnosticStep[] = [];

  // 1. Platform
  const native = isNativePlatform();
  steps.push({
    label: 'RC-01 Platform',
    status: native ? 'ok' : 'error',
    detail: native ? 'Native iOS detected' : 'NOT native — purchases disabled in browser/simulator web view',
  });
  if (!native) return steps;

  // 2. API Key
  const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY || '';
  const keyValid = !!apiKey && apiKey !== 'appl_YOUR_REVENUECAT_API_KEY';
  steps.push({
    label: 'RC-02 API Key',
    status: keyValid ? 'ok' : 'error',
    detail: keyValid
      ? `Key: ${apiKey.slice(0, 12)}...`
      : 'MISSING — set VITE_REVENUECAT_API_KEY in .env',
  });
  if (!keyValid) return steps;

  // 3. Plugin import
  let Purchases: any = null;
  try {
    const mod = await withTimeout(
      import('@revenuecat/purchases-capacitor'),
      10000,
      'import plugin',
    );
    Purchases = mod.Purchases;
    steps.push({ label: 'RC-03 Plugin Import', status: 'ok', detail: 'Plugin loaded' });
  } catch (e: any) {
    steps.push({ label: 'RC-03 Plugin Import', status: 'error', detail: `FAILED: ${e?.message || String(e)}` });
    return steps;
  }

  // 4. Configure
  try {
    await Purchases.configure({ apiKey });
    steps.push({ label: 'RC-04 Configure', status: 'ok', detail: 'RevenueCat configured' });
  } catch (e: any) {
    steps.push({ label: 'RC-04 Configure', status: 'error', detail: `FAILED: ${e?.code || ''} ${e?.message || String(e)}` });
    return steps;
  }

  // 5. Get offerings
  let offerings: any = null;
  try {
    offerings = await withTimeout(Purchases.getOfferings(), 15000, 'getOfferings');
    const current = offerings?.current;
    if (!current) {
      steps.push({
        label: 'RC-05 Offerings',
        status: 'error',
        detail: 'No current offering — create one in RevenueCat dashboard → Offerings → set as Current',
      });
      return steps;
    }
    steps.push({
      label: 'RC-05 Offerings',
      status: 'ok',
      detail: `Current: "${current.identifier}"`,
    });
  } catch (e: any) {
    steps.push({ label: 'RC-05 Offerings', status: 'error', detail: `FAILED: ${e?.code || ''} ${e?.message || String(e)}` });
    return steps;
  }

  // 6. Packages
  const packages = offerings.current?.availablePackages ?? [];
  if (packages.length === 0) {
    steps.push({
      label: 'RC-06 Packages',
      status: 'error',
      detail: 'No packages in offering — add products in RevenueCat dashboard → Offerings → Packages',
    });
    return steps;
  }
  const pkgList = packages.map((p: any) =>
    `${p.packageType}: ${p.product?.identifier} (${p.product?.priceString ?? '?'})`,
  ).join(' | ');
  steps.push({ label: 'RC-06 Packages', status: 'ok', detail: pkgList });

  // 7. Product IDs match
  const productIds = packages.map((p: any) => p.product?.identifier);
  const monthlyMatch = productIds.includes(PRODUCTS.premiumMonthly);
  const yearlyMatch = productIds.includes(PRODUCTS.premiumYearly);
  if (!monthlyMatch && !yearlyMatch) {
    steps.push({
      label: 'RC-07 Product Match',
      status: 'warn',
      detail: `No exact match. Expected: ${PRODUCTS.premiumMonthly} or ${PRODUCTS.premiumYearly}. Got: ${productIds.join(', ')}. Will fallback to packageType.`,
    });
  } else {
    steps.push({
      label: 'RC-07 Product Match',
      status: 'ok',
      detail: `Monthly: ${monthlyMatch ? 'YES' : 'NO'}, Yearly: ${yearlyMatch ? 'YES' : 'NO'}`,
    });
  }

  // 8. Customer info
  try {
    const info: any = await withTimeout(Purchases.getCustomerInfo(), 10000, 'getCustomerInfo');
    const active = info?.customerInfo?.entitlements?.active;
    const activeKeys = active ? Object.keys(active) : [];
    steps.push({
      label: 'RC-08 Customer Info',
      status: 'ok',
      detail: activeKeys.length > 0
        ? `Active entitlements: ${activeKeys.join(', ')}`
        : 'No active entitlements (user is not premium)',
    });
  } catch (e: any) {
    steps.push({ label: 'RC-08 Customer Info', status: 'warn', detail: `Could not fetch: ${e?.message || String(e)}` });
  }

  return steps;
}
