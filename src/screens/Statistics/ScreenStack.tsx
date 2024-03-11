import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LatLng } from "react-native-maps";
import HomeScreen from "./HomeScreen";
import FiltersScreen from "./FiltersScreen";
import TS from "../../../TS";
import { useTheme } from "native-base";

export type StackParamList = {
  StatisticsHome: undefined;
  FiltersScreen: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function StatisticsStackScreen() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
        headerTintColor: theme.colors.muted[400],
      }}
    >
      <Stack.Screen
        name="StatisticsHome"
        component={HomeScreen}
        options={{ headerTitle: TS.t("stats_screen_title") }}
      />
      <Stack.Screen
        name="FiltersScreen"
        component={FiltersScreen}
        options={{ headerTitle: TS.t("filter_screen_title") }}
      />
    </Stack.Navigator>
  );
}
