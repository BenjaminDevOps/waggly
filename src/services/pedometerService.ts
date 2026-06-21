import type { PluginListenerHandle } from '@capacitor/core';

let pedometerPlugin: any = null;

function isNativePlatform(): boolean {
  try {
    return (
      typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform()
    );
  } catch {
    return false;
  }
}

function getPlatform(): 'ios' | 'android' | 'web' {
  try {
    if (typeof (window as any).Capacitor === 'undefined') return 'web';
    return (window as any).Capacitor.getPlatform() ?? 'web';
  } catch {
    return 'web';
  }
}

async function getPedometer(): Promise<any> {
  if (pedometerPlugin) return pedometerPlugin;
  try {
    const mod = await import('@capgo/capacitor-pedometer');
    pedometerPlugin = mod.CapacitorPedometer;
    return pedometerPlugin;
  } catch (e) {
    console.error('[Pedometer] Plugin load failed:', e);
    return null;
  }
}

export interface PedometerState {
  steps: number;
  distanceMeters: number;
  available: boolean;
}

let listener: PluginListenerHandle | null = null;
let baselineSteps = 0;
let baselineDistance = 0;
let firstEvent = true;
let lastKnownSteps = 0;

export async function requestPedometerPermission(): Promise<boolean> {
  if (!isNativePlatform()) return false;
  const pedometer = await getPedometer();
  if (!pedometer) return false;

  try {
    const status = await pedometer.checkPermissions();
    if (status.activityRecognition === 'granted') return true;
    const result = await pedometer.requestPermissions();
    const granted = result.activityRecognition === 'granted';
    if (!granted) {
      console.warn('[Pedometer] ACTIVITY_RECOGNITION permission denied by user');
    }
    return granted;
  } catch (e) {
    console.error('[Pedometer] Permission request error:', e);
    return false;
  }
}

export async function isPedometerAvailable(): Promise<boolean> {
  if (!isNativePlatform()) return false;
  const pedometer = await getPedometer();
  if (!pedometer) return false;

  try {
    const result = await pedometer.isAvailable();
    return result.stepCounting === true;
  } catch (e) {
    console.warn('[Pedometer] isAvailable check failed:', e);
    return false;
  }
}

export async function startPedometer(
  onUpdate: (state: PedometerState) => void,
): Promise<boolean> {
  if (!isNativePlatform()) return false;

  const pedometer = await getPedometer();
  if (!pedometer) return false;

  // Request permission first — required on Android 10+ (API 29+)
  const hasPermission = await requestPedometerPermission();
  if (!hasPermission) {
    console.warn('[Pedometer] Cannot start — permission not granted');
    return false;
  }

  // Check hardware availability (some budget Android devices lack TYPE_STEP_COUNTER)
  const available = await isPedometerAvailable();
  if (!available) {
    console.warn('[Pedometer] Step counter hardware not available on this device');
    return false;
  }

  // Clean up any stale listener from a previous walk
  await stopPedometer();

  firstEvent = true;
  baselineSteps = 0;
  baselineDistance = 0;
  lastKnownSteps = 0;

  try {
    listener = await pedometer.addListener(
      'measurement',
      (event: { numberOfSteps?: number; distance?: number }) => {
        const rawSteps = event.numberOfSteps ?? 0;
        const rawDistance = event.distance ?? 0;

        if (firstEvent) {
          // Android TYPE_STEP_COUNTER: cumulative since last boot → baseline it.
          // iOS CMPedometer: starts from 0 after startMeasurementUpdates → baseline is 0.
          baselineSteps = rawSteps;
          baselineDistance = rawDistance;
          firstEvent = false;
          return; // Don't emit a "0 steps" event
        }

        const steps = Math.max(0, rawSteps - baselineSteps);
        const distanceMeters = Math.max(0, rawDistance - baselineDistance);

        // Guard against sensor counter reset (device reboot mid-walk)
        if (steps < lastKnownSteps) {
          baselineSteps = rawSteps - lastKnownSteps;
          return;
        }
        lastKnownSteps = steps;

        onUpdate({ steps, distanceMeters, available: true });
      },
    );

    await pedometer.startMeasurementUpdates();
    console.info(`[Pedometer] Started on ${getPlatform()}`);
    return true;
  } catch (e) {
    console.error('[Pedometer] Start failed:', e);
    if (listener) {
      await listener.remove().catch(() => {});
      listener = null;
    }
    return false;
  }
}

export async function stopPedometer(): Promise<void> {
  const pedometer = await getPedometer();

  if (listener) {
    await listener.remove().catch((e: any) =>
      console.warn('[Pedometer] Listener remove error:', e),
    );
    listener = null;
  }

  if (!pedometer) return;
  try {
    await pedometer.stopMeasurementUpdates();
  } catch (e) {
    console.warn('[Pedometer] stopMeasurementUpdates error:', e);
  }
}
