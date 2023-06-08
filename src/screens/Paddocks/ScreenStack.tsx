import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './HomeScreen';
import CreatePaddock from "./CreatePaddock";
import FindInMapScreen from "./FindInMapScreen";
import { LatLng } from "react-native-maps";

export type StackParamList = {
    PaddockHome: undefined;
    CreatePaddock: {paddockId:number};
    FindInMapScreen: {coordinates: LatLng, paddockId: number, pointId: number, onCoordsChanged: Function};
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function PaddockStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='PaddockHome' component={HomeScreen} options={{headerTitle: 'Potreros'}}/>
            <Stack.Screen name='CreatePaddock' component={CreatePaddock} options={{headerTitle: 'Modificar Potrero'}}/>
            <Stack.Screen name='FindInMapScreen' component={FindInMapScreen} options={{headerTitle: 'Mapa'}}/>
        </Stack.Navigator>
    )
}