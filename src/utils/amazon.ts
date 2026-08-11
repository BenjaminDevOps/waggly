import { AFFILIATE } from '../constants/app';

/**
 * Amazon Associates links, built from an ASIN so the tracking tag lives in
 * exactly one place (AFFILIATE.amazonId) instead of being pasted into every
 * product row.
 */

// The storefront products link to. Associates tags are marketplace-specific:
// an amazon.fr link must carry a tag ending in -21, a .com link one ending
// in -20. Changing this host means changing the tag to match.
export const AMAZON_HOST = 'www.amazon.fr';
const AMAZON_MARKETPLACE = 'FR';
// Associates image/widget host — ws-eu for European marketplaces.
const ADSYSTEM_HOST = 'ws-eu.amazon-adsystem.com';

// Associates tags are per-marketplace: amazon.fr only credits a tag ending in
// -21, amazon.com one ending in -20. A mismatched tag still opens the product
// perfectly well, it just earns nothing — which is silent and easy to ship, so
// say it out loud once at startup.
const EXPECTED_TAG_SUFFIX = '-21';
if (!AFFILIATE.amazonId.endsWith(EXPECTED_TAG_SUFFIX)) {
  console.warn(
    `[amazon] Affiliate tag "${AFFILIATE.amazonId}" does not end in ` +
    `"${EXPECTED_TAG_SUFFIX}", which ${AMAZON_HOST} requires. Links will work ` +
    `but will not be credited to your Associates account.`,
  );
}

/**
 * An ASIN is exactly 10 upper-case alphanumerics, as it appears in the
 * product URL (amazon.fr/…/dp/B004S7U6U0). Anything else is a typo, and
 * would otherwise produce a link to a 404 and an image that never loads —
 * both of which fail silently, so check before building either.
 */
const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

export function isValidAsin(asin: string | undefined): asin is string {
  return !!asin && ASIN_PATTERN.test(asin);
}

/** Product page URL carrying the affiliate tag. */
export function amazonProductUrl(asin: string): string {
  return `https://${AMAZON_HOST}/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(AFFILIATE.amazonId)}`;
}

/**
 * Product image served by Amazon for an ASIN.
 *
 * Uses the Associates AsinImage widget rather than a hard-coded
 * m.media-amazon.com path: that path embeds an opaque image id you can only
 * get by opening the listing, and it breaks whenever the seller swaps the
 * picture. This endpoint resolves the current image from the ASIN alone.
 */
/**
 * Image URLs to try for an ASIN, best-first.
 *
 * The Associates widget needs a tag that is registered for this marketplace,
 * so it is the fallback rather than the first choice: the /images/P/ path is
 * served straight off the CDN from the ASIN and needs no tag at all.
 *
 * Amazon answers an unknown ASIN with a 1x1 placeholder rather than a 404, so
 * a caller can't rely on the error event alone — see ProductImage, which also
 * treats a 1px result as a miss and moves to the next candidate.
 */
export function amazonImageCandidates(asin: string): string[] {
  return [
    `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`,
    amazonImageUrl(asin),
  ];
}

export function amazonImageUrl(asin: string, size = 'SL500'): string {
  const q = new URLSearchParams({
    _encoding: 'UTF8',
    ASIN: asin,
    Format: `_${size}_`,
    ID: 'AsinImage',
    MarketPlace: AMAZON_MARKETPLACE,
    ServiceVersion: '20070822',
    WS: '1',
    tag: AFFILIATE.amazonId,
  });
  return `https://${ADSYSTEM_HOST}/widgets/q?${q.toString()}`;
}
