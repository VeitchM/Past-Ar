import { useEffect } from "react"
import { DeviceSerializable } from "../features/store/types"
import { useTypedDispatch, useTypedSelector } from "../features/store/storeHooks"
import { connectToDevice, scanForPeripherals, stopScanningForPeripherals } from "../features/ble/ble"
import { Button, FlatList, HStack, Heading, Input, Modal, Spinner, Text, VStack } from "native-base"
import { SafeAreaView } from "react-native"
import { setTryingToConnect } from "../features/store/bleSlice"


/** A modal which explain that if accepted a calibration from measurement will be created */
export default function NewCalibrationModal(props: { showModal: boolean, setShowModal: (value: boolean) => void , calibrationName?:string} ) {




//TODO verify if calibration name already exists


    useEffect(() => {


    }, [props.showModal])



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
                <Modal.Body style={{marginLeft:10}}>
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
                        <Button _text={{ color: 'white' }} size='lg' colorScheme="primary" onPress={() => { 
                            props.setShowModal(false); 

                            }}>
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
