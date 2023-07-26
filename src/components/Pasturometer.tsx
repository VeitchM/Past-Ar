import { Button, HStack, Heading, Icon, Input, Modal, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { disconnectFromDevice } from "../features/ble/ble";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTypedSelector } from "../features/store/storeHooks";
import { StyleSheet } from "react-native";

import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { persistDevice } from "../features/localDB/device";

export default function Pasturometer() {
    const [showModal, setShowModal] = useState(false)


    return (
        <>
            <ModalPasturometer setShow={setShowModal} show={showModal} />
            <Button
                onPress={() => setShowModal(true)}
                size="lg"
                w='280'
                rightIcon={<Icon alignSelf='center' as={MaterialCommunityIcons} name='ruler' size={30} />}

            // colorScheme='amber'
            >
                {/* TODO ver cuando cambia */}
                Pasturometro
            </Button>
        </>
    )
}

//TODO verify error

function ModalPasturometer(props: { show: boolean, setShow: (show: boolean) => void }) {
    const store = useTypedSelector(state => state.ble)
    const [alias, setAlias] = useState(store.connectedDevice?.alias || '')
    const [plateWidth, setPlateWidth] = useState(store.connectedDevice?.plateWidth?.toString() || '')
    const [errorPlateWidth, setErrorPlateWidth] = useState(false)
    console.log({ devices: store.connectedDevice });


    useEffect(() => {

        setErrorPlateWidth(
            isNaN(Number(plateWidth))
        )

    }, [plateWidth])


    function save() {

    }

    return (

        <Modal isOpen={props.show} onClose={() => props.setShow(false)}>
            <Modal.Content maxWidth="400px">


                {/*  For some reason this makes all Explode <Modal.CloseButton /> */}


                <Modal.Header flexDir='row' alignItems='center' justifyContent='space-between'>
                    <Heading size='md'>
                        Pasturometro
                    </Heading>
                </Modal.Header>
                <VStack m='5' >
                    <HStack style={{ justifyContent: 'space-between', }}>

                        <Heading size='md'>Alias</Heading>
                        <Icon as={Feather} name="edit-2" size={5} />
                    </HStack>
                    <Input
                        variant="unstyled"
                        bg='transparent'
                        // onPress={() => console.log('Pressed')}
                        // textAlign='start'
                        value={alias}
                        onChangeText={setAlias}
                        textAlign='left'
                        fontWeight='normal'
                        marginTop={-4}
                        color='muted.400'
                        borderRadius={0}
                        style={styles.input} />


                    <Heading size='md'>Nombre</Heading>
                    <Text style={styles.text}>{store.connectedDevice?.name}</Text>
                    <Heading size='md'>MAC</Heading>
                    <Text style={styles.text}>{store.connectedDevice?.id}</Text>


                    <HStack style={{ justifyContent: 'space-between', }}>
                        <Heading
                            color={errorPlateWidth? 'error.400' : undefined } 
                            size='md'>Grosor del Plato</Heading>
                        <Icon as={Feather} name="edit-2" size={5} />
                    </HStack>
                    <Input
                        variant="unstyled"
                        bg='transparent'
                        // onPress={() => console.log('Pressed')}
                        value={plateWidth}
                        onChangeText={setPlateWidth}
                        // textAlign='start'
                        textAlign='left'
                        fontWeight='normal'
                        marginTop={-4}
                        color='muted.400'
                        keyboardType='decimal-pad'
                        borderRadius={0}
                         isInvalid={errorPlateWidth}
                        style={styles.input} />

                    <Button
                        onPress={() => disconnectFromDevice()}
                        size="lg"
                        my='5'
                        colorScheme='amber'
                        leftIcon={<Icon as={MaterialCommunityIcons} name='connection' size='2xl' />}

                    >
                        {/* TODO ver cuando cambia */}
                        Desconectar
                    </Button>
                </VStack>


                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button _text={{ color: 'white' }} size='lg' colorScheme="danger" onPress={() => { props.setShow(false); }}
                            rightIcon={<Icon as={MaterialCommunityIcons} name='exit-to-app' size='xl' />}
                        >
                            Salir
                        </Button>
                        <Button _text={{ color: 'white' }} size='lg' colorScheme="info"
                            isDisabled={!!store.connectedDevice && errorPlateWidth}
                            onPress={() => {
                                props.setShow(false);
                                const device = store.connectedDevice
                                device && !errorPlateWidth && persistDevice({ id: device.id, name: device.name, alias: alias, plateWidth: Number(plateWidth) })
                            }}
                            rightIcon={<Icon as={Entypo} name='save' size='xl' />}>
                            Guardar
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

    )

}

const styles = StyleSheet.create({
    text: { marginTop: -5, marginBottom: 10, fontSize: 18 },
    input: { marginLeft: -13, fontSize: 18 },
})

const inputProps = { bg: 'transparent', textAlign: 'flex-start' }