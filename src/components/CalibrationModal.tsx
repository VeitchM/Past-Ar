import { useEffect, useState } from "react"
import { DeviceSerializable } from "../features/store/types"
import { useTypedDispatch, useTypedSelector } from "../features/store/storeHooks"
import { connectToDevice, scanForPeripherals, stopScanningForPeripherals } from "../features/ble/ble"
import { Button, FlatList, HStack, Heading, Input, Modal, Spinner, Text, VStack } from "native-base"
import { SafeAreaView } from "react-native"
import { setTryingToConnect } from "../features/store/bleSlice"
import { calibrationExists, getCalibrations, insertCalibrationFromMeasurements } from "../features/localDB/localDB"


/** A modal which explain that if accepted a calibration from measurement will be created */
export default function NewCalibrationModal(props: { showModal: boolean, setShowModal: (value: boolean) => void, calibrationName?: string }) {




    //TODO verify if calibration name already exists


    useEffect(() => {


    }, [props.showModal])



    // ====== Hooks =======================================================

    const [isCreating, setIsCreating] = useState(false)


    //======= Functions ====================================================




    async function createCalibration() {
        if (props.calibrationName) {
            try {

                setIsCreating(true)
                const calibrations = await getCalibrations()
                console.log('Calibraciones ',calibrations);
                
                const exists = await calibrationExists(props.calibrationName)
                if (!exists) {
                    await insertCalibrationFromMeasurements(props.calibrationName)
                }
                else {
                    //TODO ya existe el nombre 
                    console.log('Name already exists');
                }
                props.setShowModal(false);
                setIsCreating(false)
            }
            catch (e) {
                console.log('Error creating calibration', e);
                props.setShowModal(false);
                setIsCreating(false)
            }
        }
    }








    return (

        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="400px">


                {/*  For some reason this makes all Explode <Modal.CloseButton /> */}
                <Modal.Header flexDir='row' alignItems='center' justifyContent='space-between'>
                    <Heading>
                        Crear calibracion
                    </Heading>
                    {/* <Modal.CloseButton /> */}

                </Modal.Header>
                <Modal.Body style={{ marginLeft: 10 }}>
                    {/* It throws warning to Flatlist  */}

                    <Heading fontWeight='light' size='md' >Nombre</Heading>
                    <Heading size='2xl'>{props.calibrationName}</Heading>
                    <Text marginTop='20px' fontSize='lg'>
                        Si presiona continuar se creara una calibracion calculada desde mediciones</Text>
                    <Text marginTop='20px' fontSize='lg'>
                        Una vez creada usted podra seleccionarla para realizar las mediciones para su calculo</Text>
                    {/* <SafeAreaView> */}

                    {/* </SafeAreaView> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button isLoading={isCreating} _text={{ color: 'white' }} size='lg' colorScheme="primary"
                            onPress={createCalibration}>
                            Crear
                        </Button>
                        <Button _text={{ color: 'white' }} size='lg' colorScheme="danger" onPress={() => { props.setShowModal(false); }}>
                            Cancelar
                        </Button>

                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

    )

}

//----------------------------------------------------------------------------------------------
