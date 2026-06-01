import { AppReview } from '@capawesome/capacitor-app-review';

const REVIEW_KEY = 'waggly_review_requested';

export async function requestAppReview(): Promise<void> {
  if (localStorage.getItem(REVIEW_KEY)) return;
  try {
    await AppReview.requestReview();
    localStorage.setItem(REVIEW_KEY, '1');
  } catch {
    // Silently fail — SKStoreReviewController is rate-limited by iOS (3×/year max)
  }
}
