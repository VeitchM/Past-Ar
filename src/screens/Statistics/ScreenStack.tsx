import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LatLng } from "react-native-maps";
import HomeScreen from "./HomeScreen";
import FiltersScreen from "./FiltersScreen";


export type StackParamList = {
    StatisticsHome: {  };
    FiltersScreen: {  };
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function PaddockStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='StatisticsHome' component={HomeScreen} options={{headerTitle: 'Estadisticas'}}/>
            <Stack.Screen name="FiltersScreen" component={FiltersScreen}/>
        </Stack.Navigator>
    )
}