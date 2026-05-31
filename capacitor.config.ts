import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matchmonster.memorygame',
  appName: 'Match Monster',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
