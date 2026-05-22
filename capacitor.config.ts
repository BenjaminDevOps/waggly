import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ministeredesapp.waggly',
  appName: 'Waggly',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'default',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
