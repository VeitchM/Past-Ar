// =================================== BATTERY ================================================================

import {  MaterialCommunityIcons } from '@expo/vector-icons';
import { HStack, Text, View } from 'native-base';
import { useTypedSelector } from '../storeHooks';

type BatteryIcons = 'battery'|'battery-10'|'battery-20'|'battery-30'|'battery-40'|'battery-50'|
'battery-60'|'battery-70'|'battery-80'|'battery-90'| 'battery-alert'



export default function BatteryLevel() {

    const { battery } = useTypedSelector(state => state.ble.mainCharacteristic)
    const batteryIcon = setBatteryIcon(battery);

    return <>
        {
            battery > 0 ?
                <View>
                    <Text fontWeight={900} fontSize={27}>Pasturometro</Text>
                    <HStack alignItems='center'>
                        <MaterialCommunityIcons size={36} name={batteryIcon} />
                        <Text fontSize={26}> {battery}%</Text>
                    </HStack>
                </View >
                : null
        }
    </>





    function setBatteryIcon(battery: number) : BatteryIcons {
        let batteryLevel: string | number = Math.round(battery / 10) * 10;
        if (batteryLevel == 0)
            batteryLevel = 'alert';
        if (batteryLevel == 100)
            batteryLevel = '';

        else
            batteryLevel = '-' + batteryLevel;
        const batteryIcon = `battery${batteryLevel}`;
        return batteryIcon;
    }
}
