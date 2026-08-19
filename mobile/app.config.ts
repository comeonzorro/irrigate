import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Irrigate",
  slug: "irrigate",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  scheme: "irrigate",
  backgroundColor: "#14532d",
  plugins: [
    [
      "expo-splash-screen",
      {
        backgroundColor: "#14532d",
        image: "./assets/splash-icon.png",
        imageWidth: 180,
        resizeMode: "contain",
      },
    ],
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "fr.irrigate.app",
    buildNumber: "1",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "fr.irrigate.app",
    adaptiveIcon: {
      backgroundColor: "#14532d",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    webAppUrl: process.env.EXPO_PUBLIC_WEB_APP_URL ?? "https://irrigate.fr",
  },
});
