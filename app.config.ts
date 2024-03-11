import { ExpoConfig, ConfigContext } from 'expo/config';


//This variable is set on the packages.json scripts
const IS_DEV = process.env.APP_VARIANT === "development";
// console.log("App Variant value:",process.env.APP_VARIANT, IS_DEV )


//This let you havinhg installed a development and preview(almost production) in your phone at the same time.
//It is not applied yet, we must add new googleServices.json files
const bundlePackage = IS_DEV ? "com.pastech.dev" : "com.pastech.app";

export default {
  name: "Pastech" + (IS_DEV ? " (DEV)" : ""),
  slug: "pastech",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
    [
      "expo-notifications",
      {
        sounds: ["./assets/sound.wav"],
      },
    ],
    [
      "@config-plugins/react-native-ble-plx",
      {
        isBackgroundEnabled: true,
        modes: ["peripheral", "central"],
        bluetoothAlwaysPermission:
          "Allow $(PRODUCT_NAME) to connect to bluetooth devices",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
    ["@maplibre/maplibre-react-native"],
    "expo-build-properties",
  ],
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#f8f8f8",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.pastech.app",
    buildNumber: "3",
    infoPlist: {
      UIBackgroundModes: ["location", "fetch"],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    permissions: [
      "android.permission.BLUETOOTH",
      "android.permission.BLUETOOTH_ADMIN",
      "android.permission.BLUETOOTH_CONNECT",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.FOREGROUND_SERVICE",
    ],
    package: bundlePackage,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "c006d87b-b6dd-4d36-be11-1461dbad3568",
    },
  },
};
