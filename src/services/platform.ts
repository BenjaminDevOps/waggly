/**
 * Which shell the web app is running inside.
 *
 * Lives on its own rather than inside a feature service because both the
 * billing layer and the entitlement layer need it, and importing one from the
 * other only to reach this would make the two depend on each other.
 *
 * Every access is defensive: `window.Capacitor` is absent in the browser, in
 * tests, and during SSR-style prerendering, and reading it must never be the
 * reason a screen fails to render.
 */

export type Platform = 'ios' | 'android' | 'web';

export function getPlatform(): Platform {
  try {
    if (typeof (window as any).Capacitor === 'undefined') return 'web';
    const p: string = (window as any).Capacitor.getPlatform();
    if (p === 'ios') return 'ios';
    if (p === 'android') return 'android';
    return 'web';
  } catch {
    return 'web';
  }
}

export function isNativePlatform(): boolean {
  try {
    return (
      typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform()
    );
  } catch {
    return false;
  }
}
