import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, StatusBar } from "native-base";
import { customFonts, themeNative, themeNavigation } from "./theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import AlertsManager from "./components/NotificationManager";
import ScreenTabs from "./screens/ScreenTabs";
import { Provider } from "react-redux";
import store from "./features/store/store";

//ble is imported just to be executed
import ble from "./features/ble/ble";
ble; // Dont delete, it force the import

import { onInit } from "./features/localDB/onInit";
import { useEffect } from "react";
import LocationPermissionManager from "./features/location/LocationPermissionManager";
import {
  RequestDisableOptimization,
  BatteryOptEnabled,
  //@ts-ignore
} from "react-native-battery-optimization-check";
onInit();

LogBox.ignoreLogs(["new NativeEventEmitter"]); // Ignore log notification by message

export default function App() {
  const [fontLoaded] = useFonts(customFonts);

  useEffect(() => {
    BatteryOptEnabled().then((isEnabled: boolean) => {
      // returns promise<boolean>
      if (isEnabled) {
        // if battery optimization is enabled, request to disable it.
        RequestDisableOptimization();
        // ...
      }
    });
  }, []);

  if (!fontLoaded) return <></>;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />

        <NativeBaseProvider theme={themeNative}>
          <NavigationContainer theme={themeNavigation}>
            <LocationPermissionManager />
            <ScreenTabs />
          </NavigationContainer>
          <AlertsManager />
        </NativeBaseProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
