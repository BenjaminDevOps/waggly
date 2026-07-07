/**
 * Location Service
 *
 * Uses @capacitor/geolocation to center the "find nearby vet" map link
 * on the user's current position when available.
 */
import { Geolocation } from '@capacitor/geolocation';

/**
 * Open Google Maps with nearby veterinarians based on current location.
 */
export async function openVetMap(): Promise<void> {
  let url = 'https://www.google.com/maps/search/veterinaire+near+me';
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    const { latitude, longitude } = position.coords;
    url = `https://www.google.com/maps/search/veterinaire/@${latitude},${longitude},14z`;
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
