/**
 * Location Service
 *
 * Uses @capacitor/geolocation to center Google Maps search links (nearby
 * vet, groomer, pet sitter...) on the user's current position when available.
 */
import { Geolocation } from '@capacitor/geolocation';

/**
 * Open Google Maps search for the given query, centered on the user's
 * current location when it can be obtained.
 */
export async function openMapsSearch(query: string): Promise<void> {
  const encoded = encodeURIComponent(query);
  let url = `https://www.google.com/maps/search/${encoded}+near+me`;
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    const { latitude, longitude } = position.coords;
    url = `https://www.google.com/maps/search/${encoded}/@${latitude},${longitude},14z`;
  } catch {
    // Use default URL without coordinates
  }
  try {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url });
  } catch {
    window.open(url, '_blank');
  }
}

/**
 * Open Google Maps with nearby veterinarians based on current location.
 */
export async function openVetMap(): Promise<void> {
  return openMapsSearch('veterinaire');
}
