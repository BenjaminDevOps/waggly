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
 * Product image derived from an ASIN.
 *
 * Amazon serves product pictures from two separate namespaces:
 *   /images/P/{ASIN}...   resolves from the ASIN, but only exists for items
 *                         carrying an entry in this legacy namespace
 *   /images/I/{imageId}.. the current one, keyed by an opaque id that cannot
 *                         be derived from the ASIN — it has to be read off
 *                         the listing
 *
 * So this only covers the first group; measured on the current catalogue it
 * resolved 3 products out of 13. Everything else needs its `imageUrl` filled
 * in with the /images/I/ address from the listing, which takes priority over
 * this. ProductImage warns for each product that falls back to the icon.
 *
 * Amazon also answers an unknown ASIN with a 1x1 placeholder rather than a
 * 404, so callers can't trust the error event alone.
 */
export function amazonImageUrl(asin: string): string {
  return `https://m.media-amazon.com/images/P/${encodeURIComponent(asin)}.01._SCLZZZZZZZ_.jpg`;
}
