
import { useEffect, useState } from "react";

//==== Redux ======================================================
import { useTypedDispatch} from "../../features/store/storeHooks";
import { addNotification } from "../../features/store/notificationSlice";


//==== Components ===========================================
import {  Heading, VStack, Input, Icon} from "native-base";
import { NewCalibrationModal } from "../../components/CalibrationsModals";


//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
import BlockButton from "../../components/BlockButton";
type Props = NativeStackScreenProps<StackParamList, 'CreateCalibration'>;

//==== Icons ===============================
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { calibrationExists } from "../../features/localDB/localDB";


// TODO set Type
export default function CreateCalibration({ navigation }: Props) {
    //Value represents id in database


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
                        dispatch(addNotification({ title: 'Ya existe Calibración con el mismo nombre', status: 'error' }))
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
                    <Heading size='xl' fontWeight='light' marginBottom={4} >Nombre de Calibración</Heading>
                    <Input

                        fontSize={calibrationName ? 'xl' : 'lg'}
                        value={calibrationName}
                        size='2xl'
                        onChangeText={setCalibrationName}
                        placeholder="Escriba el nombre de la calibracion" />

                </VStack>


                <VStack style={{ width: '100%' }} bg='muted.50'>
                    <BlockButton height={100}

                        text="A partir de Función"
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









