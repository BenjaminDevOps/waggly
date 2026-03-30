import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.waggly.app',
  appName: 'Waggly',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
