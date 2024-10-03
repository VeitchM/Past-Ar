import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CalibrationMeasurementScreen from "./MeasurementScreen";
import SetCalibrationsScreen from "./SetScreen";
import HomeCalibration from "./HomeScreen";
import { Text, useTheme } from "native-base";
import CreateCalibration from "./CreateScreen";
import CalibrationsList from "./ListScreen";
import CreateFunctionCalibration from "./CreateFunctionScreen";
import ForSendingCalibrationsScreen from "./ForSendingCalibrationsScreen";
import { StackParamList } from "./Stack.types";
import TS from "../../../TS";

const Stack = createNativeStackNavigator<StackParamList>();

export default function CalibrationStackScreen() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
        headerTintColor: theme.colors.muted[400],
      }}
    >
      <Stack.Screen
        name="CalibrationsList"
        options={{ title: TS.t("calibration_home_title") }}
        component={CalibrationsList}
      />
      <Stack.Screen
        options={{ title: TS.t("calibration_measure_received") }}
        name="CalibrationMeasurement"
        component={CalibrationMeasurementScreen}
      />
      <Stack.Screen
        options={{ title: TS.t("create_calibration") }}
        name="CreateCalibration"
        component={CreateCalibration}
      />
      {/* {/* <Stack.Screen options={{ title: TS.t('calibration_home_title') }} name='CalibrationHome' component={HomeCalibration} /> */}
      {/* <Stack.Screen options={{ title: TS.t('calibration_measure_received') }} name='CalibrationMeasurement' component={CalibrationMeasurementScreen} />
            <Stack.Screen name='SetCalibrations' component={SetCalibrationsScreen} />
            <Stack.Screen options={{ title: TS.t('calibration_list_title') }} name='CalibrationsList' component={CalibrationsList} />
            <Stack.Screen options={{ title: TS.t('calibration_function_create_title') }} name='CreateFunctionCalibration' component={CreateFunctionCalibration} />
            <Stack.Screen options={{ title: TS.t('calibration_send_title') }} name='ForSendingCalibrations' component={ForSendingCalibrationsScreen} /> */}
    </Stack.Navigator>
  );
}
