// =================================== BATTERY ================================================================

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HStack, Icon, Text, View } from 'native-base';
import { useTypedSelector } from '../features/store/storeHooks';
import TS from '../../TS';

type BatteryIcons = 'battery' | 'battery-10' | 'battery-20' | 'battery-30' | 'battery-40' | 'battery-50' |
    'battery-60' | 'battery-70' | 'battery-80' | 'battery-90' | 'battery-alert'



export default function BatteryLevel() {

    const battery = useTypedSelector(state => state.ble.battery)
    const batteryIcon = setBatteryIcon(battery);

    return <>
        {
            battery > 0 ?
                <View position={'absolute'} right={15} top={33}>
                    {/* <Text fontWeight={400} fontSize='2xl'>{TS.t('pasturometer')}</Text> */}
                    <HStack alignItems='center'>
                        <Icon as={MaterialCommunityIcons} size={'xl'} name={batteryIcon} color='muted.400' />
                        <Text fontSize='2xl' fontWeight={800} >{battery}%</Text>
                    </HStack>
                </View >
                : null
        }
    </>





    function setBatteryIcon(battery: number): BatteryIcons {
        let batteryLevel: string | number = Math.round(battery / 10) * 10;
        if (batteryLevel == 0)
            batteryLevel = 'alert';
        if (batteryLevel == 100)
            batteryLevel = '';

        else
            batteryLevel = '-' + batteryLevel;
        const batteryIcon = `battery${batteryLevel}`;
        return batteryIcon as BatteryIcons;
    }
}
