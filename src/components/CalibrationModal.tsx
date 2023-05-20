import { useEffect } from "react"
import { DeviceSerializable } from "../features/store/types"
import { useTypedDispatch, useTypedSelector } from "../features/store/storeHooks"
import { connectToDevice, scanForPeripherals, stopScanningForPeripherals } from "../features/ble/ble"
import { Button, FlatList, HStack, Heading, Input, Modal, Spinner, Text, VStack } from "native-base"
import { SafeAreaView } from "react-native"
import { setTryingToConnect } from "../features/store/bleSlice"


/** A modal which explain that if accepted is pressed a calibration from measurement will be created */
export default function NewCalibrationModal(props: { showModal: boolean, setShowModal: (value: boolean) => void , calibrationName:string} ) {





    useEffect(() => {


    }, [props.showModal])



    return (

        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="400px">


                {/*  For some reason this makes all Explode <Modal.CloseButton /> */}
                <Modal.Header flexDir='row' alignItems='center' justifyContent='space-between'>
                    <Heading>
                        Crear nueva calibracion
                    </Heading>
                    {/* <Modal.CloseButton /> */}

                </Modal.Header>
                <Modal.Body>
                    {/* It throws warning to Flatlist  */}
                    <Heading size='md' marginLeft={3} >{props.calibrationName}</Heading>
                    <Text>Se presiona continuar se creara una calibracion a partir de mediciones</Text>
                    <Text>Se presiona continuar se creara una calibracion a partir de mediciones</Text>

                    {/* <SafeAreaView> */}

                    {/* </SafeAreaView> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button _text={{ color: 'white' }} size='lg' colorScheme="primary" onPress={() => { props.setShowModal(false); }}>
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
