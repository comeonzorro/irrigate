/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: "Irrigate",
  slug: "irrigate",
  owner: "leo_theoffnote",
  version: "1.3",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  scheme: "irrigate",
  backgroundColor: "#14532d",
  plugins: [
    "expo-router",
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
    bundleIdentifier: "com.irrigate-garden.app",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.irrigate-garden.app",
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
    eas: {
      projectId: "aa3c889b-15ab-4412-bcfe-5b4bd709de10",
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://irrigate.fr",
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    ascAppId: "6802997672",
    router: {},
  },
};
