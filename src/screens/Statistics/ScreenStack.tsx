import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LatLng } from "react-native-maps";
import HomeScreen from "./HomeScreen";
import FiltersScreen from "./FiltersScreen";
import TS from "../../../TS";


export type StackParamList = {
    StatisticsHome: {  };
    FiltersScreen: {  };
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function PaddockStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='StatisticsHome' component={HomeScreen} options={{headerTitle: TS.t('stats_screen_title')}}/>
            <Stack.Screen name='FiltersScreen' component={FiltersScreen} options={{headerTitle: TS.t('filter_screen_title')}}/>
        </Stack.Navigator>
    )
}