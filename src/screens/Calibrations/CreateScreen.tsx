
import { useEffect, useState } from "react";

import { useTypedSelector } from "../../features/store/storeHooks";


//==== Components ===========================================
import { View, Text, Heading, Flex, Button, Select, HStack, VStack, Input, Icon } from "native-base";
import ConnectDeviceButton from "../../components/ConnectDevice";
import RoundedContainer from "../../components/RoundedContainer";


//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
import BlockButton from "../../components/BlockButton";
type Props = NativeStackScreenProps<StackParamList, 'CreateCalibration'>;

//==== Icons ===============================
import { MaterialCommunityIcons } from '@expo/vector-icons'; 



// TODO set Type
export default function CreateCalibration({ navigation }: Props) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState(
        [{ label: 'Otoño', value: '14' },
        { label: 'Verano', value: '19' },])
    //change by redux later

    const [calibrationName, setCalibrationName] = useState<string>()

    const connectionState = useTypedSelector(state => state.ble.connectionState)

    const [selectedCalibration, setSelectedCalibration] = useState<string>()
    const [showModalCalibrationFromMeasurement,setShowModalCalibrationFromMeasurement] = useState(false)

    useEffect(() => {
        console.log('calibrationName', calibrationName);

    }, [calibrationName])

    return (

        <VStack flex={1} alignItems='end' bg='white' _dark={{ bg: 'black' }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>
            <VStack style={{ marginTop: 80, alignItems: 'center' }}>
                <Heading size='xl' fontWeight='bold' marginBottom={4} >Nombre de Calibracion</Heading>
                <Input

                    maxWidth={350}
                    fontSize={calibrationName ? 'xl' : 'lg'}
                    textAlign='center'
                    fontWeight='bold'
                    value={calibrationName}
                    size='2xl'
                    onChangeText={setCalibrationName}
                    placeholder="Escriba el nombre de la calibracion" />

            </VStack>


            <VStack style={{
                // backgroundColor: 'black' ,
                width: '100%'
            }} bg='muted.50'>
                <BlockButton height={100} 
                text="A partir de Funcion"
                icon={<Icon alignSelf='center'  as={MaterialCommunityIcons} name='function-variant' size={60}
            color='muted.400'
                />}
                // textStyle={{width:200, marginLeft:5,fontSize:25}}
                 />
                <BlockButton height={100} 
                text="A partir de Mediciones" 
                icon={<Icon  alignSelf='center' as={MaterialCommunityIcons} name='ruler' size={60}
                color='muted.400'
                    />}
                onPress={()=>{setShowModalCalibrationFromMeasurement(true)}}
                />

            </VStack>
        </VStack >
    )
}









