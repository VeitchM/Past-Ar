import { useEffect, useState } from "react"
import { DeviceSerializable } from "../features/store/types"
import { useTypedDispatch, useTypedSelector } from "../features/store/storeHooks"
import { connectToDevice, scanForPeripherals, stopScanningForPeripherals } from "../features/ble/ble"
import { Button, FlatList, HStack, Heading, Icon, Input, Modal, Spinner, Text, VStack } from "native-base"
import { SafeAreaView } from "react-native"
import { setTryingToConnect } from "../features/store/bleSlice"
import { calibrationExists, getCalibrations, insertCalibrationFromMeasurements } from "../features/localDB/localDB"

import { MaterialIcons } from '@expo/vector-icons';


/** A modal which explain that if accepted a calibration from measurement will be created */
export function NewCalibrationModal(props: { showModal: boolean, setShowModal: (value: boolean) => void, calibrationName?: string, onCreateGoTo?: () => void }) {



    // ====== Hooks =======================================================

    const [isCreating, setIsCreating] = useState(false)


    //======= Functions ====================================================




    async function createCalibration() {
        if (props.calibrationName) {
            try {

                setIsCreating(true)

                const exists = await calibrationExists(props.calibrationName)
                if (!exists) {
                    await insertCalibrationFromMeasurements(props.calibrationName)
                }
                else {
                    //TODO ya existe el nombre 
                    console.log('Name already exists');
                }
                props.setShowModal(false);
                setIsCreating(false);
                props.onCreateGoTo && props.onCreateGoTo()

            }
            catch (e) {
                console.log('Error creating calibration', e);
                props.setShowModal(false);
                setIsCreating(false)
            }
        }
    }








    return (

        <BaseModal title='Crear calibracion' showModal={props.showModal} calibrationName={props.calibrationName}
            setShowModal={props.setShowModal}
            lines={
                ['Si presiona continuar se creara una calibracion calculada desde mediciones',
                    'Una vez creada usted podra seleccionarla para realizar las mediciones para su calculo'
                ]}>
            <>
                <Button _text={{ color: 'white' }} size='lg' colorScheme="danger" onPress={() => { props.setShowModal(false); }}>
                    Cancelar
                </Button>
                <Button isLoading={isCreating} _text={{ color: 'white' }} size='lg' colorScheme="primary"
                    onPress={createCalibration}>
                    Crear
                </Button>
            </>
        </BaseModal >

    )
}


export function DeleteCalibrationModal(props: { onDelete:(id:number)=>void,id: number, name: string, showModal: boolean, setShowModal: (value: boolean) => void }) {
        
    return <BaseModal title='Borrar Calibracion' calibrationName={props.name} showModal={props.showModal} setShowModal={props.setShowModal}
        lines={[
            `Si presiona Borrar se borraran de manera local e irreversible la calibracion: ${props.name}`,
            `Hagalo si esta seguro que asi lo quiere`
        ]}>
        <>
            <Button  _text={{ color: 'white' }} size='lg' colorScheme='info'
                onPress={() => { props.setShowModal(false) }}>
                Cancelar
            </Button>
            <Button leftIcon={<Icon as={MaterialIcons} name='delete' />} _text={{ color: 'white' }} size='lg'
             colorScheme="danger"
              onPress={() => { props.setShowModal(false); props.onDelete(props.id)}}>
                Borrar
            </Button>

        </>
    </BaseModal>
}


//----------------------------------------------------------------------------------------------


function BaseModal(props: { title: string, showModal: boolean, setShowModal: (value: boolean) => void, calibrationName?: string, lines: string[], children: JSX.Element }) {


    return (
        <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
            <Modal.Content maxWidth="400px">


                {/*  For some reason this makes all Explode <Modal.CloseButton /> */}
                <Modal.Header flexDir='row' alignItems='center' justifyContent='space-between'>
                    <Heading>
                        {props.title}
                    </Heading>
                    {/* <Modal.CloseButton /> */}

                </Modal.Header>
                <Modal.Body style={{ marginLeft: 10 }}>
                    {/* It throws warning to Flatlist  */}

                    <Heading fontWeight='light' size='md' >Nombre</Heading>
                    <Heading size='2xl'>{props.calibrationName}</Heading>
                    {props.lines.map((line) => {

                        return <Text key={line} marginTop='20px' fontSize='lg'>{line}</Text>
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        {props.children}
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

    )
}