import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, Text } from 'native-base';

import { Provider } from 'react-redux';
import store from './store';


//ble is imported just to be executed
import ble from './features/ble/ble'
ble // Dont delete, it force the import





import theme from './theme';
import ScreenTabs from './screens/ScreenTabs';



export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <ScreenTabs/>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>


  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
