import type { PluginListenerHandle } from '@capacitor/core';

let pedometerPlugin: any = null;

function isNativePlatform(): boolean {
  try {
    return typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

async function getPedometer() {
  if (pedometerPlugin) return pedometerPlugin;
  try {
    const mod = await import('@capgo/capacitor-pedometer');
    pedometerPlugin = mod.CapacitorPedometer;
    return pedometerPlugin;
  } catch {
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

export async function requestPedometerPermission(): Promise<boolean> {
  if (!isNativePlatform()) return false;
  const pedometer = await getPedometer();
  if (!pedometer) return false;

  try {
    const status = await pedometer.checkPermissions();
    if (status.activityRecognition === 'granted') return true;
    const result = await pedometer.requestPermissions();
    return result.activityRecognition === 'granted';
  } catch {
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
  } catch {
    return false;
  }
}

export async function startPedometer(
  onUpdate: (state: PedometerState) => void,
): Promise<boolean> {
  if (!isNativePlatform()) return false;
  const pedometer = await getPedometer();
  if (!pedometer) return false;

  const hasPermission = await requestPedometerPermission();
  if (!hasPermission) return false;

  try {
    firstEvent = true;
    baselineSteps = 0;
    baselineDistance = 0;

    listener = await pedometer.addListener(
      'measurement',
      (event: { numberOfSteps?: number; distance?: number }) => {
        const rawSteps = event.numberOfSteps ?? 0;
        const rawDistance = event.distance ?? 0;

        if (firstEvent) {
          baselineSteps = rawSteps;
          baselineDistance = rawDistance;
          firstEvent = false;
        }

        onUpdate({
          steps: Math.max(0, rawSteps - baselineSteps),
          distanceMeters: Math.max(0, rawDistance - baselineDistance),
          available: true,
        });
      },
    );

    await pedometer.startMeasurementUpdates();
    return true;
  } catch (e) {
    console.error('[Pedometer] Start error:', e);
    return false;
  }
}

export async function stopPedometer(): Promise<void> {
  const pedometer = await getPedometer();
  if (!pedometer) return;

  try {
    await pedometer.stopMeasurementUpdates();
    if (listener) {
      await listener.remove();
      listener = null;
    }
  } catch (e) {
    console.error('[Pedometer] Stop error:', e);
  }
}
