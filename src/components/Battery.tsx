// =================================== BATTERY ================================================================

import { HStack, Text, View } from "native-base";
import { useTypedSelector } from "../features/store/storeHooks";

export default function BatteryLevel() {
  const battery = useTypedSelector((state) => state.ble.battery);

  return battery > 0 ? (
    <View>
      <HStack alignItems="center">
        <Text fontSize="2xl" fontWeight={800}>
          {Math.round(battery / 100)}%
        </Text>
      </HStack>
    </View>
  ) : null;
}
