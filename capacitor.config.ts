import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicontentgenerator.app',
  appName: 'AI Content Generator',
  webDir: 'dist',

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#3b82f6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#3b82f6"
    },
    Keyboard: {
      resize: "body",
      style: "DARK"
    }
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false, // Disable in production
    appendUserAgent: "AIContentGenerator/1.0"
  }
};

export default config;