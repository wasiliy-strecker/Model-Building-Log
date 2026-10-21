import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'ModellbauLog Dev',
  slug: 'modellbaulog',
  version: '1.0.0',
  scheme: 'modellbaulog',
  orientation: 'default',
  userInterfaceStyle: 'dark',
  backgroundColor: '#141517',
  primaryColor: '#FFD600',
  platforms: ['android'],
  icon: './assets/icon.png',
  android: {
    package: 'com.appfactory.modellbaulog',
    versionCode: 1,
    allowBackup: false,
    adaptiveIcon: {
      foregroundImage: './assets/icon-foreground.png',
      backgroundColor: '#141517',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.SCHEDULE_EXACT_ALARM',
      'android.permission.VIBRATE',
    ],
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_MEDIA_AUDIO',
      'android.permission.READ_MEDIA_VIDEO',
    ],
  },
  plugins: [
    'expo-router',
    'expo-sqlite',
    'expo-dev-client',
    // Android mods unwind in reverse order. Our final theme overrides must
    // run after expo-splash-screen has generated Theme.App.SplashScreen.
    './plugins/with-modellbaulog-android',
    [
      'expo-splash-screen',
      {
        image: './assets/icon-foreground.png',
        imageWidth: 256,
        resizeMode: 'contain',
        backgroundColor: '#141517',
        dark: { backgroundColor: '#141517' },
      },
    ],
    'expo-font',
    'expo-asset',
    'expo-sharing',
    ['expo-image-picker', { microphonePermission: false }],
  ],
};
export default config;
