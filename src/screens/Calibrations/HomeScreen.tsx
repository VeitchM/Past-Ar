
import { useState } from "react";

import { useTypedSelector } from "../../features/store/storeHooks";


//==== Components ===========================================
import { View, Text, Heading, Flex, Button, Select, HStack, VStack } from "native-base";
import ConnectDeviceButton from "../../components/ConnectDevice";
import RoundedContainer from "../../components/RoundedContainer";


//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
type Props = NativeStackScreenProps<StackParamList, 'CalibrationHome'>;


// TODO set Type
export default function HomeCalibration({ navigation }: Props) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState(
        [{ label: 'Otoño', value: '14' },
        { label: 'Verano', value: '19' },])
    //change by redux later


    //======= Hooks ==================================
    const connectionState = useTypedSelector(state => state.ble.connectionState)

    const [selectedCalibration, setSelectedCalibration] = useState<string>()

    //======= Function ===========================================

    const toCalibrationMeasurementScreen = () => {
        if (selectedCalibration)
            navigation.navigate('CalibrationMeasurement',
                {
                    calibrationID: selectedCalibration,
                    calibrationLabel: calibrations.find(item => item.value == selectedCalibration)?.label || ''
                })
    }


    return (

        <VStack flex={1} alignItems='end' bg='white' _dark={{ bg: 'black' }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>

            <View style={{ paddingTop: 50 }}>




                <RoundedContainer size={329} height={264} borderRadius={33}>
                    <VStack flex={1} justifyContent='space-around' >
                        <Heading paddingTop={5} flex={0.5} size='md'>Cargar Medicion de Calibracion</Heading>

                        <HStack style={{ justifyContent: "space-between", }}>
                            <Text fontSize='lg' fontWeight='bold' style={{ alignSelf: 'center' }} >Calibracion</Text>

                            <Select selectedValue={selectedCalibration} onValueChange={itemValue => setSelectedCalibration(itemValue)} minWidth="150" placeholder="Elige" >
                                {calibrations.map((calibration) => {
                                    return <Select.Item key={calibration.value}
                                        label={calibration.label}
                                        value={calibration.value}
                                    />
                                })}
                            </Select>

                        </HStack>
                    </VStack>

                    <VStack flex={1} justifyContent='center'>

                        {connectionState == 'connected' ?
                            <Button isDisabled={!selectedCalibration} onPress={toCalibrationMeasurementScreen} >
                                {selectedCalibration ? 'Realizar Medicion' : 'Elija Calibracion'}
                            </Button>
                            :
                            <ConnectDeviceButton />
                        }
                    </VStack>
                </RoundedContainer >
            </View>

            <VStack bg='muted.50' flex={.6} alignSelf='flex-end' width='100%'>

                <CustomButton text='Calibraciones' onPress={() => { navigation.navigate('CalibrationsList') }} />
                {/* TODO IF finalizar calibracion, o cargar datos de calibracion */}
                <CustomButton text='Enviar calibracion'></CustomButton>
                <CustomButton text='Ayuda'></CustomButton>
            </VStack>

        </VStack >
    )
}




function CustomButton({ onPress = () => { }, text = '' }) {

    return (
        <Button onPress={onPress} style={{ shadowColor: 'transparent' }} borderRadius={0} variant='outline' borderWidth={0.25} colorScheme='muted' flex={1}>
            <Heading size='md'>{text}</Heading>
        </Button>
    )
}




