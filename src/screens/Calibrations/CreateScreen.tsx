
import { useEffect, useState } from "react";

import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";


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
import { NewCalibrationModal } from "../../components/CalibrationsModals";
import { InterfaceAlertProps } from "native-base/lib/typescript/components/composites/Alert/types";
import { calibrationExists } from "../../features/localDB/localDB";
import { addNotification } from "../../features/store/notificationSlice";



// TODO set Type
export default function CreateCalibration({ navigation }: Props) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState(
        [{ label: 'Otoño', value: '14' },
        { label: 'Verano', value: '19' },])
    //change by redux later

    const [calibrationName, setCalibrationName] = useState<string>()

    const dispatch = useTypedDispatch()

    const [showModalCalibrationFromMeasurement, setShowModalCalibrationFromMeasurement] = useState(false)

    useEffect(() => {
        console.log('calibrationName', calibrationName);

    }, [calibrationName])


    /**Function used by onPressCreateFromFunction and onPressCreateFrom */
    function onPressCreate(callback: () => void) {
        if (calibrationName) {
            calibrationExists(calibrationName)
                .then((exists) => {
                    if (!exists)
                        callback()
                    else
                        dispatch(addNotification({ title: 'Ya existe Calibracion con el mismo nombre', status: 'error' }))
                })
                .catch((e) => console.error(e)
                )


        }
        else
            console.error('Shouldnt happen, calibration name empty');
    }

    function onPressCreateFromFunction() {
        onPressCreate(() => { navigation.navigate('CreateFunctionCalibration', { name: calibrationName as string }) })

    }

    function onPressCreateFromMeasurement() {
        onPressCreate(() => setShowModalCalibrationFromMeasurement(true))

    }




    return (

        <>



            <VStack flex={1} alignItems='end' bg='white' _dark={{ bg: 'black' }}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>
                <VStack style={{ marginTop: 80, alignItems: 'center' }}>
                    <Heading size='xl' fontWeight='light' marginBottom={4} >Nombre de Calibracion</Heading>
                    <Input

                        fontSize={calibrationName ? 'xl' : 'lg'}
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
                        onPress={onPressCreateFromFunction}

                    />
                    <BlockButton height={100}
                        isDisabled={!calibrationName}
                        text="A partir de Mediciones"
                        icon={<Icon alignSelf='center' as={MaterialCommunityIcons} name='ruler' size={60}
                            color='muted.400'
                        />}
                        onPress={onPressCreateFromMeasurement}
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









