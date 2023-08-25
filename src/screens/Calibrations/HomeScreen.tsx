import { useCallback, useState } from "react";

import { useTypedSelector } from "../../features/store/storeHooks";


//==== Components ===========================================
import { View, Text, Heading, Flex, Button, Select, HStack, VStack, Divider } from "native-base";
import ConnectDeviceButton from "../../components/ConnectDevice";
import RoundedContainer from "../../components/RoundedContainer";


//==== Navigation ==============================================
import { PropsCalibrationHome } from "./Stack.types";

//==== Icons ===============================
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CalibrationLocalDB } from "../../features/localDB/types";
import { useFocusEffect } from "@react-navigation/native";
import { getCalibrations, getCalibrationsFromMeasurementExtended } from "../../features/localDB/calibrations";
import BlockButton from "../../components/BlockButton";


export default function HomeCalibration({ navigation }: PropsCalibrationHome) {



    //======= Hooks ==================================
    const connectionState = useTypedSelector(state => state.ble.connectionState)
    const [calibrations, setCalibrations] = useState<CalibrationLocalDB[]>([])

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




    }, [])

    useFocusEffect(refreshList)



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
                        <Heading paddingTop={5}  size='md'>Cargar Medicion de Calibración</Heading>
                        <View><Divider/></View>
                        <HStack style={{ justifyContent: "space-between", marginTop:3 }}>
                            <Text fontSize='lg' fontWeight='bold' style={{ alignSelf: 'center' }} >Calibración</Text>

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
                    <VStack flex={0.7} justifyContent='space-evenly'>

                        {connectionState == 'connected' ?
                            <Button isDisabled={selectedCalibration === ''} onPress={toCalibrationMeasurementScreen} >
                                {selectedCalibration != '' ? 'Realizar Medicion' : 'Elija Calibración'}
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
                <BlockButton onPress={() => { navigation.navigate('ForSendingCalibrations') }} text='Enviar calibración' />
                {/* <BlockButton text='Ayuda' /> */}
            </VStack>

        </VStack >
    )
}








