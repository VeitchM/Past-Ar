
import { useState } from "react";

import { useTypedSelector } from "../../features/store/storeHooks";


//==== Components ===========================================
import { View, Text, Heading, Flex, Button, Select, HStack, VStack } from "native-base";
import ConnectDeviceButton from "../../components/ConnectDevice";
import RoundedContainer from "../../components/RoundedContainer";


//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
type Props = NativeStackScreenProps<StackParamList, 'CreateCalibration'>;


// TODO set Type
export default function CreateCalibration({ navigation }: Props) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState(
        [{ label: 'Otoño', value: '14' },
        { label: 'Verano', value: '19' },])
    //change by redux later

    const connectionState = useTypedSelector(state => state.ble.connectionState)

    const [selectedCalibration, setSelectedCalibration] = useState<string>()

    return (

        <VStack flex={1} alignItems='end' bg='white' _dark={{ bg: 'black' }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>

          

        </VStack >
    )
}




function CustomButton({ onPress = () => { }, text = '' }) {

    return (
        <Button onPress={onPress} style={{ shadowColor: 'transparent' }} borderRadius={0} variant='outline' borderWidth={0.25} colorScheme='muted' flex={0.5}>
            <Text>{text}</Text>
        </Button>
    )
}




