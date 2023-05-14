import { useEffect } from "react"
import { DeviceSerializable } from "../features/store/types"
import { useTypedDispatch, useTypedSelector } from "../features/store/storeHooks"
import { connectToDevice, scanForPeripherals, stopScanningForPeripherals } from "../features/ble/ble"
import { Button, FlatList, HStack, Heading, Modal, Spinner, Text, VStack } from "native-base"
import { SafeAreaView } from "react-native"
import { setTryingToConnect } from "../features/store/bleSlice"

/** It starts the device scanning when its shown, and stops when it is not */
export default function DevicesModal(props: { showModal: boolean, setShowModal: (value:boolean)=>void }) {


    const dispatch = useTypedDispatch()

    const devices: DeviceSerializable[] = useTypedSelector(state => state.ble.allDevices)


    useEffect(() => {
        if (props.showModal) {
            scanForPeripherals()
        }
        else {
            stopScanningForPeripherals()
        }


    }, [props.showModal])

    const connectDevice = (device: DeviceSerializable) => {
        console.log('Connecting to device');

        connectToDevice(device)
        dispatch(setTryingToConnect())
        props.setShowModal(false)
    }

    const deviceRenderer = (props: { item: DeviceSerializable, onSelected: any }) => (


        <Button variant='unstyled' style={{ shadowColor: 'transparent' }} onPress={() => { props.onSelected(props.item) }}>


            <VStack width={200}>
                {props.item.name ?
                    <>
                        <Heading size='md'  >{props.item.name}</Heading>
                        <HStack justifyContent="space-between">
                            <Text>ID</Text>
                            <Text>{props.item.id}</Text>
                        </HStack>

                    </>
                    : <Heading size='md'  >{props.item.id}</Heading>
                }
            </VStack>
        </Button>

        // </Box>
    )

    return (

        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="400px">


                {/*  For some reason this makes all Explode <Modal.CloseButton /> */}
                <Modal.Header flexDir='row' alignItems='center' justifyContent='space-between'>Buscando Dispositivos
                    <Spinner size='lg'/>
                </Modal.Header>
                {/* <Modal.Body> */}
                {/* It throws warning to Flatlist  */}
                {/* <SafeAreaView> */}

                    <FlatList data={devices} renderItem={({ item }) => deviceRenderer({ item: item, onSelected: connectDevice })} keyExtractor={item => item.id} />
                {/* </SafeAreaView> */}
                {/* </Modal.Body> */}
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button _text={{ color: 'white' }} size='lg' colorScheme="danger" onPress={() => { props.setShowModal(false); }}>
                            Salir
                        </Button>

                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

    )

}

//----------------------------------------------------------------------------------------------
