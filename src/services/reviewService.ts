import { getPlatform } from './purchaseService';

/**
 * Request an App Store / Google Play review.
 * - iOS  → SKStoreReviewController.requestReview()
 * - Android → Google Play In-App Review API
 * - Web  → no-op (silently ignored)
 *
 * Apple/Google may decide not to show the dialog even when requested
 * (rate-limiting, already reviewed, etc.) — this is expected behaviour.
 */
export async function requestAppReview(): Promise<void> {
  const platform = getPlatform();
  if (platform === 'web') return;

  try {
    const { RateApp } = await import('capacitor-rate-app');
    await RateApp.requestReview();
  } catch (e) {
    // Silently ignore — review prompt is non-critical
    console.warn('[Review] requestReview failed:', e);
  }
}
