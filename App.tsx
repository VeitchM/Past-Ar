import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, Text } from 'native-base';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();


import HomeScreen from './Screens/Home/HomeScreen';
import CalibrationScreen from './Screens/Calibrations/CalibrationScreen';


import theme from './theme';


export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>

        <Tab.Navigator
          initialRouteName='home'
          backBehavior='history'
          screenOptions={{
            tabBarStyle: { height: 50 },
            headerShown:false
            

          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Home</Text>,
              tabBarIcon: ({ focused, color, size }) => <FontAwesome size={30} name='home' color={color} focused={focused} style={{ marginBottom: -3 }} />,

            }}
          />
          <Tab.Screen
            name="Calibration"
            component={CalibrationScreen}
            options={{
              tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Calibracion</Text>,
              tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons size={30} name='ruler-square-compass' color={color} focused={focused} style={{ marginBottom: -3 }} />,
            }}
          />
          <Tab.Screen
            name="Statistics"
            component={HomeScreen}
            options={{
              tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Estadisticas</Text>,
              tabBarIcon: ({ focused, color, size }) => <Ionicons size={30} name='stats-chart' color={color} focused={focused} style={{ marginBottom: -3 }} />,
            }}
          />
          <Tab.Screen
            name="Paddocks"
            component={HomeScreen}
            options={{
              tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Potreros</Text>,
              tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons size={30} name='fence' color={color} focused={focused} style={{ marginBottom: -3 }} />,
            }}
          />
          <Tab.Screen
            name="User"
            component={HomeScreen}
            options={{
              tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Usuario</Text>,
              tabBarIcon: ({ focused, color, size }) => <FontAwesome size={30} name='user' color={color} focused={focused} style={{ marginBottom: -3 }} />,
            }}
          />

        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>


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
