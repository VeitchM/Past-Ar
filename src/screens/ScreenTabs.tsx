import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens ================================================================
import HomeScreen from './Home/HomeScreen';
import CalibrationStackScreen from './Calibrations/ScreenStack';

//TODO Change screen titles

import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar, Text } from 'native-base';
import HomeCalibration from './Calibrations/HomeScreen';


const Tab = createBottomTabNavigator();


export default function ScreenTabs() {

    return (
        <>
            <StatusBar translucent
                backgroundColor="transparent"
                barStyle='dark-content'
            />


            <Tab.Navigator
                initialRouteName='home'
                backBehavior='history'
                screenOptions={{
                    tabBarStyle: { height: 50 },
                    headerShown: false


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
                    component={CalibrationStackScreen}
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
        </>
    )
}