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
  },
};

export default config;
