import { createNativeStackNavigator } from "@react-navigation/native-stack";


import CalibrationMeasurementScreen from "./MeasurementScreen";
import SetCalibrationsScreen from "./SetScreen";
import HomeCalibration from "./HomeScreen";
import { Text } from "native-base";
import CreateCalibration from "./CreateScreen";
import CalibrationsList from "./ListScreen";


export type StackParamList = {
    CalibrationHome: undefined;
    CalibrationMeasurement: { calibrationID: string, calibrationLabel: string };
    SetCalibrations: { sort: 'latest' | 'top' } | undefined;
    CreateCalibration : undefined;
    CalibrationsList : undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function CalibrationStackScreen() {
    return (
        // {/* <Text> Lallalala</Text> */}
            <Stack.Navigator>
                <Stack.Screen name='CalibrationHome' component={HomeCalibration} />
                <Stack.Screen name='CalibrationMeasurement' component={CalibrationMeasurementScreen} />
                <Stack.Screen name='SetCalibrations' component={SetCalibrationsScreen} />
                <Stack.Screen name='CreateCalibration' component={CreateCalibration} />
                <Stack.Screen name='CalibrationsList' component={CalibrationsList} />



            </Stack.Navigator>
    )


}