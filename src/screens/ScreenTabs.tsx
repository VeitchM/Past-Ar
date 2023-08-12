import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar, Text } from 'native-base';

// Screens ================================================================
import HomeScreen from './Home/HomeScreen';
import UserScreen from './User/User';
import PaddockScreenStack from './Paddocks/ScreenStack';
import CalibrationStackScreen from './Calibrations/ScreenStack';
import StatisticsStackScreen from './Statistics/ScreenStack';

//TODO Change screen titles

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
                    tabBarStyle: { height: 60 },
                    headerShown: false
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Inicio</Text>,
                        tabBarIcon: ({ focused, color, size }) => <FontAwesome size={45} m name='home' color={color} focused={focused} style={{ marginBottom: -10 }} />,
                    }}
                />
                <Tab.Screen
                    name="Calibration"
                    component={CalibrationStackScreen}
                    options={{
                        tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color} noOfLines={1}>Calibración</Text>,

                        tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons size={45} name='ruler-square-compass' color={color} focused={focused} style={{ marginBottom: -3 }} />,
                    }}
                />
                <Tab.Screen
                    name="Statistics"
                    component={StatisticsStackScreen}
                    options={{
                        tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Datos</Text>,
                        tabBarIcon: ({ focused, color, size }) => <FontAwesome size={40} name='pie-chart' color={color} focused={focused} style={{ marginBottom: -9 }} />,
                    }}
                />
                <Tab.Screen
                    name="Paddocks"
                    component={PaddockScreenStack}
                    options={{
                        tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Potreros</Text>,
                        tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons size={45} name='map' color={color} focused={focused} style={{ marginBottom: -5 }} />,
                    }}
                />
                <Tab.Screen
                    name="User"
                    component={UserScreen}
                    options={{
                        tabBarLabel: ({ focused, color }) => <Text fontSize='sm' color={color}>Usuario</Text>,
                        tabBarIcon: ({ focused, color, size }) => <FontAwesome5 size={37} name='user-alt' color={color} focused={focused} style={{ marginBottom: -5 }} />,
                    }}
                />

            </Tab.Navigator>
        </>
    )
}