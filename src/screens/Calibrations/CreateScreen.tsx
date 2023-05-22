
import { useEffect, useState } from "react";

import { useTypedSelector } from "../../features/store/storeHooks";


//==== Components ===========================================
import { View, Text, Heading, Flex, Button, Select, HStack, VStack, Input, Icon, Slide, Alert, IconButton, CloseIcon } from "native-base";
import ConnectDeviceButton from "../../components/ConnectDevice";
import RoundedContainer from "../../components/RoundedContainer";


//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
import BlockButton from "../../components/BlockButton";
type Props = NativeStackScreenProps<StackParamList, 'CreateCalibration'>;

//==== Icons ===============================
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NewCalibrationModal from "../../components/CalibrationModal";
import { InterfaceAlertProps } from "native-base/lib/typescript/components/composites/Alert/types";



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
    const [showModalCalibrationFromMeasurement, setShowModalCalibrationFromMeasurement] = useState(false)

    useEffect(() => {
        console.log('calibrationName', calibrationName);

    }, [calibrationName])




    return (

        <>
            {/* 
            
            TODO Make a place where i throw all the alerts in redux
            <Slide in={true}>
                <CustomAlert status='error' title='I dont know' />
                <CustomAlert status='warning' title='I dont know' />

                <CustomAlert status='success' title='I dont know' />
                <CustomAlert status='info' title='I dont know' />

            </Slide> */}
            <VStack flex={1} alignItems='end' bg='white' _dark={{ bg: 'black' }}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>
                <VStack style={{ marginTop: 80, alignItems: 'center' }}>
                    <Heading size='xl' fontWeight='light' marginBottom={4} >Nombre de Calibracion</Heading>
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


                <VStack style={{ width: '100%' }} bg='muted.50'>
                    <BlockButton height={100}
                        text="A partir de Funcion"
                        isDisabled={!calibrationName}
                        icon={<Icon alignSelf='center' as={MaterialCommunityIcons} name='function-variant' size={60}
                            color='muted.400'
                        />}
                    />
                    <BlockButton height={100}
                        isDisabled={!calibrationName}
                        text="A partir de Mediciones"
                        icon={<Icon alignSelf='center' as={MaterialCommunityIcons} name='ruler' size={60}
                            color='muted.400'
                        />}
                        onPress={() => { setShowModalCalibrationFromMeasurement(true) }}
                    />

                </VStack>
            </VStack >
            <NewCalibrationModal showModal={showModalCalibrationFromMeasurement}
                setShowModal={setShowModalCalibrationFromMeasurement}
                calibrationName={calibrationName}
                onCreateGoTo={() => { navigation.navigate('CalibrationsList') }}
            />

        </>
    )
}









function CustomAlert(props: { status: InterfaceAlertProps['status'], title: string }) {
    return (
        <>
            <Alert w="100%" status={props.status} variant='solid'>
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} justifyContent="space-between">
                        <HStack space={2} flexShrink={1}>
                            <Alert.Icon mt="1" />
                            <Text fontSize="md" color='white' >
                                {props.title}
                            </Text>
                        </HStack>
                        <IconButton variant="unstyled" _focus={{
                            borderWidth: 0
                        }} icon={<CloseIcon size="3" color='white' />}  />
                    </HStack>
                </VStack>
            </Alert>
        </>)
}