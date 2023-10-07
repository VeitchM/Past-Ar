import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { customFonts, themeNative, themeNavigation } from './theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AlertsManager from './components/NotificationManager';
import ScreenTabs from './screens/ScreenTabs';
import { Provider } from 'react-redux';
import store from './features/store/store';

//ble is imported just to be executed
import ble from './features/ble/ble'
ble // Dont delete, it force the import

import { onInit } from './features/localDB/onInit';
onInit()

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

export default function App() {
  const [fontLoaded] = useFonts(customFonts)

  if (!fontLoaded)
    return <></>
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NativeBaseProvider theme={themeNative}>
          <NavigationContainer theme={themeNavigation} >
            <ScreenTabs />
          </NavigationContainer>
          <AlertsManager />
        </NativeBaseProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}
