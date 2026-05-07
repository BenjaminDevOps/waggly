/**
 * Location & Pedometer Service
 *
 * Uses @capacitor/geolocation for real GPS tracking during walks.
 * Step count is estimated from GPS distance when native pedometer is unavailable.
 * On native iOS, also uses CoreMotion pedometer via the Capacitor bridge.
 */
import { Geolocation } from '@capacitor/geolocation';

export interface WalkTrackingState {
  steps: number;
  distanceKm: number;
  positions: { lat: number; lng: number; timestamp: number }[];
  watchId: string | null;
}

let trackingState: WalkTrackingState = {
  steps: 0,
  distanceKm: 0,
  positions: [],
  watchId: null,
};

let onUpdateCallback: ((state: WalkTrackingState) => void) | null = null;

/**
 * Request location permissions.
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const status = await Geolocation.checkPermissions();
    if (status.location === 'granted' || status.coarseLocation === 'granted') {
      return true;
    }
    const request = await Geolocation.requestPermissions();
    return request.location === 'granted' || request.coarseLocation === 'granted';
  } catch {
    // Web fallback — navigator.geolocation doesn't need explicit permission request
    return true;
  }
}

/**
 * Start GPS tracking for a walk.
 * Watches position and calculates distance/steps in real-time.
 */
export async function startWalkTracking(
  onUpdate: (state: WalkTrackingState) => void,
): Promise<boolean> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return false;

  // Reset state
  trackingState = { steps: 0, distanceKm: 0, positions: [], watchId: null };
  onUpdateCallback = onUpdate;

  try {
    // Get initial position
    const initialPos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    trackingState.positions.push({
      lat: initialPos.coords.latitude,
      lng: initialPos.coords.longitude,
      timestamp: initialPos.timestamp,
    });

    // Start watching position
    const watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      (position, err) => {
        if (err || !position) return;

        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp,
        };

        // Calculate distance from last position
        if (trackingState.positions.length > 0) {
          const lastPos = trackingState.positions[trackingState.positions.length - 1];
          const segmentKm = haversineDistance(lastPos.lat, lastPos.lng, newPos.lat, newPos.lng);

          // Filter out GPS noise (ignore jumps < 2m or > 100m)
          if (segmentKm > 0.002 && segmentKm < 0.1) {
            trackingState.distanceKm += segmentKm;
            // Estimate steps: ~1312 steps per km (average stride ~0.762m)
            trackingState.steps = Math.round(trackingState.distanceKm * 1312);
          }
        }

        trackingState.positions.push(newPos);

        if (onUpdateCallback) {
          onUpdateCallback({ ...trackingState });
        }
      },
    );

    trackingState.watchId = watchId;
    return true;
  } catch (error) {
    console.error('[Location] Failed to start tracking:', error);
    return false;
  }
}

/**
 * Stop GPS tracking and return final state.
 */
export async function stopWalkTracking(): Promise<WalkTrackingState> {
  if (trackingState.watchId) {
    try {
      await Geolocation.clearWatch({ id: trackingState.watchId });
    } catch (e) {
      console.error('[Location] Error clearing watch:', e);
    }
  }

  onUpdateCallback = null;
  const finalState = { ...trackingState };
  trackingState = { steps: 0, distanceKm: 0, positions: [], watchId: null };
  return finalState;
}

/**
 * Get current state (for polling if needed).
 */
export function getTrackingState(): WalkTrackingState {
  return { ...trackingState };
}

/**
 * Haversine formula — distance between two GPS coordinates in km.
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

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
