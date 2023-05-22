//TODO calculate resolution, and make it responsive for shorter screens


import { useCallback, useState } from "react";

import { useTypedSelector } from "../../features/store/storeHooks";


//==== Components ===========================================
import { View, Text, Heading, Flex, Button, Select, HStack, VStack } from "native-base";
import ConnectDeviceButton from "../../components/ConnectDevice";
import RoundedContainer from "../../components/RoundedContainer";


//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
import BlockButton from "../../components/BlockButton";
type Props = NativeStackScreenProps<StackParamList, 'CalibrationHome'>;

//==== Icons ===============================
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { calibrationLocalDB } from "../../features/localDB/types";
import { getCalibrations, getCalibrationsFromMeasurement, getCalibrationsFromMeasurementExtended } from "../../features/localDB/localDB";
import { useFocusEffect } from "@react-navigation/native";


// TODO set Type
export default function HomeCalibration({ navigation }: Props) {
    //Value represents id in database

    //change by redux later


    //======= Hooks ==================================
    const connectionState = useTypedSelector(state => state.ble.connectionState)
    const [calibrations, setCalibrations] = useState<calibrationLocalDB[]>([])

    const [selectedCalibration, setSelectedCalibration] = useState<string>('')

    const refreshList = useCallback(() => {
        getCalibrations().then((calibrations) => {
            console.log('Calibrations from Measurement', calibrations);
        })
        getCalibrationsFromMeasurementExtended()
            .then((calibrations) => {
                console.log('Calibrations from Screen', calibrations);
                setCalibrations(calibrations)


            })




            .catch((error) => {
                console.log('Error ', error);
            })


        //TODO bug when i select a calibration, and then delete all and go back, i can still make a measurement

        //TODO add to setCalibrations

    }, [])

    useFocusEffect(refreshList)
    console.log('Value of wda', selectedCalibration);



    //======= Functions ===========================================

    const toCalibrationMeasurementScreen = () => {
        console.log('Selected calibration', selectedCalibration);
        const params = {
            calibrationID: Number(selectedCalibration),
            calibrationName: calibrations.find(item => item.ID.toString() == selectedCalibration)?.name || ''
        }
        if (params.calibrationName != '' && !isNaN(params.calibrationID))
            navigation.navigate('CalibrationMeasurement', params)
        else
            setSelectedCalibration('')
    }


    return (

        <VStack flex={1} alignItems='end' bg='white' _dark={{ bg: 'black' }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>

            <View flex={1} style={{
                // paddingTop: 50 ,
                alignItems: 'center'
            }}>




                <RoundedContainer size={329} height={264} borderRadius={33}>
                    <VStack flex={1} justifyContent='space-around' >
                        <Heading paddingTop={5} flex={0.5} size='md'>Cargar Medicion de Calibracion</Heading>

                        <HStack style={{ justifyContent: "space-between", }}>
                            <Text fontSize='lg' fontWeight='bold' style={{ alignSelf: 'center' }} >Calibracion</Text>

                            <Select selectedValue={selectedCalibration} onValueChange={itemValue => setSelectedCalibration(itemValue)} minWidth="150" placeholder="Elige" >
                                {calibrations.map((calibration) => {
                                    return <Select.Item key={calibration.ID}
                                        label={calibration.name}
                                        value={calibration.ID.toString()}
                                    />
                                })}
                            </Select>

                        </HStack>
                    </VStack>

                    <VStack flex={1} justifyContent='center'>

                        {connectionState == 'connected' ?
                            <Button isDisabled={selectedCalibration === ''} onPress={toCalibrationMeasurementScreen} >
                                {selectedCalibration != '' ? 'Realizar Medicion' : 'Elija Calibracion'}
                            </Button>
                            :
                            <ConnectDeviceButton />
                        }
                    </VStack>
                </RoundedContainer >
            </View>

            <VStack bg='muted.50' alignSelf='flex-end' width='100%'>

                <BlockButton text='Calibraciones' onPress={() => { navigation.navigate('CalibrationsList') }} />
                {/* TODO IF finalizar calibracion, o cargar datos de calibracion */}
                <BlockButton text='Enviar calibracion' />
                <BlockButton text='Ayuda' />
            </VStack>

        </VStack >
    )
}








