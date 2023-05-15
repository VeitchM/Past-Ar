import { createNativeStackNavigator } from "@react-navigation/native-stack";


import CalibrationMeasurementScreen from "./CalibrationMeasurementScreen";
import SetCalibrationsScreen from "./SetCalibrationsScreen";
import HomeCalibration from "./HomeScreen";
import { Text } from "native-base";
import CreateCalibration from "./CreateCalibrationScreen";
import CalibrationsList from "./CalibrationsListScreen";


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