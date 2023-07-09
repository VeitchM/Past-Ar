import { createNativeStackNavigator } from "@react-navigation/native-stack";


import CalibrationMeasurementScreen from "./MeasurementScreen";
import SetCalibrationsScreen from "./SetScreen";
import HomeCalibration from "./HomeScreen";
import { Text, useTheme } from "native-base";
import CreateCalibration from "./CreateScreen";
import CalibrationsList from "./ListScreen";
import CreateFunctionCalibration from "./CreateFunctionScreen";
import ForSendingCalibrationsScreen from "./ForSendingCalibrationsScreen";


export type StackParamList = {
    CalibrationHome: undefined;
CalibrationMeasurement: { calibrationID: number, calibrationName: string };
    SetCalibrations: { sort: 'latest' | 'top' } | undefined;
    CreateCalibration : undefined;
    CalibrationsList : undefined;
    CreateFunctionCalibration: {name:string};
    ForSendingCalibrations: undefined
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function CalibrationStackScreen() {
    const theme = useTheme()
    return (
        // {/* <Text> Lallalala</Text> */}
            <Stack.Navigator screenOptions={
                {headerTitleStyle:{fontWeight:'bold', fontSize:24},
             headerTintColor:theme.colors.muted[400]}}>
                <Stack.Screen options={{title:'Calibraciónes'}} name='CalibrationHome' component={HomeCalibration} />
                <Stack.Screen options={{title:'Medicion para calibración'}} name='CalibrationMeasurement' component={CalibrationMeasurementScreen} />
                <Stack.Screen name='SetCalibrations' component={SetCalibrationsScreen} />
                <Stack.Screen options={{title:'Crear calibración'}} name='CreateCalibration' component={CreateCalibration} />
                <Stack.Screen options={{title:'Lista de calibraciones'}}name='CalibrationsList' component={CalibrationsList} />
                <Stack.Screen options={{title:'Crear función de calibración'}} name='CreateFunctionCalibration' component={CreateFunctionCalibration} />
                <Stack.Screen options={{title:'Calibraciónes a enviar'}} name='ForSendingCalibrations' component={ForSendingCalibrationsScreen} />




            </Stack.Navigator>
    )


}