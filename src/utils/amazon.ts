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
