import { customFonts, themeNative, themeNavigation } from './theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import { LogBox } from 'react-native';
import AlertsManager from './components/NotificationManager';
import ScreenTabs from './screens/ScreenTabs';
import store from './features/store/store';
import ble from './features/ble/ble'; //ble is imported just to be executed
import { onInit } from './features/localDB/onInit';
  
ble; // Do not delete this, it forces the import
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