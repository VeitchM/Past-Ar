import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined,
    Profile: { userId: string },
    Feed: { sort: 'latest' | 'top' } | undefined,
    Details: undefined;

};
type Props = NativeStackScreenProps<RootStackParamList>;



import { View, Text, Button, Box, Badge, useTheme, Flex, IconButton, useColorMode, useColorModeValue, Heading, Divider, Center, Modal, FormControl, Input, FlatList, HStack, VStack, Spacer } from 'native-base';
import { ReactNode, useEffect, useState } from 'react';
import { ColorValue, TouchableOpacity } from 'react-native';
import { RingCircle } from '../../components/RoundedContainer';
import { DeviceSerializable, MainCharacteristic } from '../../features/ble/types';
import { connectToDevice, disconnectFromDevice, scanForPeripherals, stopScanningForPeripherals } from '../../features/ble/ble';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTypedSelector } from '../../storeHooks';







export default function HomeScreen(props: Props) {


    const theme = useTheme()
    const color = theme.colors.muted[400]

    const mainCharacteristic = useTypedSelector(state => state.ble.mainCharacteristic)
    const bleConnectionState = useTypedSelector(state => state.ble.connectionState)


    const measurementsMediaValue = 13.2
    const mediaContextValue = 'Algun lugar'


    const [showModalDevices, setShowModalDevices] = useState(false);



    //Cant remember
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity style={{ marginRight: 16 }} onPress={() => props.navigation.navigate('Details')}>
                        <Text>Details</Text>
                    </TouchableOpacity>
                )
            }
        })
    }, [])



    return (
        <>




            <View bg='white' style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LastMeasurement lastMeasurementValue={mainCharacteristic.measurementValue} lastMeasurementTime={mainCharacteristic.timeStamp} />

                <BatteryLevel />

                <Flex paddingTop={10}>
                    <Text fontSize='xl' fontWeight='extrabold' paddingLeft={10} style={{ color: color }} >MEDIA</Text>
                    <RingCircle size={300} height={120} >
                        <Flex direction='row'>
                            <Text fontSize='4xl' fontWeight='bold' style={{ color: color }}>
                                {measurementsMediaValue}</Text>
                            <Text fontSize='2xl' fontWeight='bold' style={{ color: color }}>
                                cm</Text>
                        </Flex>
                        <Text fontSize='xl' fontWeight='hairline' style={{ color: color }}>
                            {mediaContextValue}</Text>
                    </RingCircle>
                </Flex>



                <Button
                    onPress={bleConnectionState == 'disconnected' ? () => setShowModalDevices(true) : disconnectFromDevice}
                    margin={10} fontSize="sm" size="lg" 
                     colorScheme='buttonColorScheme' 
                    borderRadius='2xl' >

                    {bleConnectionState == 'disconnected' ? 'CONECTAR DISPOSITIVO' : 'DESCONECTAR DISPOSITIVO'}
                </Button>


                <DevicesModal showModal={showModalDevices} setShowModal={setShowModalDevices} />
            </View>
        </>

    );
};


// =================================== BATTERY ================================================================

import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';


function BatteryLevel() {

    const { battery } = useTypedSelector(state => state.ble.mainCharacteristic)

    const batteryIcon = setBatteryIcon(battery);

    return (
        <View>
            <Text fontWeight={900} fontSize={27}>Pasturometro</Text>
            <HStack alignItems='center'>
                <MaterialCommunityIcons size={36} name={batteryIcon} />
                <Text fontSize={26}> {battery}%</Text>

            </HStack>
        </View>

    )



    function setBatteryIcon(battery:number) : 'battery' {
        let batteryLevel: string | number = Math.round(battery / 10) * 10;
        if (batteryLevel == 0)
            batteryLevel = 'alert';
        if (batteryLevel == 100)
            batteryLevel = '';

        else
            batteryLevel = '-' + batteryLevel;
        const batteryIcon = `battery${batteryLevel}`;
        return batteryIcon;
    }
}


//==================================== LAST MEASUREMENT COMPONENT ========================================================


/**
 * @param props lastMeasurementTime must be a valid date string, accepted by Date constructor or an empty string to show no measurement was made
 * @returns a component which displays the last measurement and the time elapsed since the measurement was made
 */
export const LastMeasurement = (props: { lastMeasurementValue: number, lastMeasurementTime: string }) => {

    const RINGSIZE = 300

    const theme = useTheme()
    const ringColor = theme.colors.muted

    const [timePassed, setTimePassed] = useState('')

    const UPDATE_TIME = 10000



    //Refresh minutes when a certain amount of time passed
    useEffect(() => {

        const calculateTime = () => {
            let timePassed = 'No hubo mediciones '

            if (props.lastMeasurementTime != '') {
                timePassed = 'hace '

                const milisecondsPassed = Date.now() - new Date(props.lastMeasurementTime).valueOf()
                if (milisecondsPassed < 60000)
                    timePassed += Math.floor(milisecondsPassed / 1000) + ' segundos'
                else if (milisecondsPassed < 1000 * 60 * 60) {
                    const minutes = Math.floor(milisecondsPassed / 60000)
                    timePassed += `${minutes} minuto${minutes > 1 ? 's' : ''}`
                }
                else if (milisecondsPassed < 1000 * 60 * 60 * 24) {
                    const hours = Math.floor(milisecondsPassed / 1000 * 60 * 60)
                    timePassed += `${hours} hora${hours > 1 ? 's' : ''}`
                }
                else {
                    const days = Math.floor(milisecondsPassed / 1000 * 60 * 60 * 24)
                    timePassed += `${days} día${days > 1 ? 's' : ''}`
                }
            }
            return timePassed
        }


        setTimePassed(calculateTime())
        const interval = setInterval(() => {

            const milisecondsPassed = Date.now() - new Date(props.lastMeasurementTime).valueOf()

            console.log('Mili', milisecondsPassed, new Date(props.lastMeasurementTime));
            setTimePassed(calculateTime)

            console.log('Time Passed', timePassed);
        }, UPDATE_TIME);
        return () => {
            clearInterval(interval);
        };
    }, [props.lastMeasurementTime])

    return (

        <RingCircle size={RINGSIZE} borderColor={ringColor[300]}>
            <Flex direction='column' style={{ width: RINGSIZE, justifyContent: 'center', alignItems: 'center' }} >

                <Text fontSize='xl' fontWeight='extrabold' >
                    ULTIMA MEDICION</Text>
                {props.lastMeasurementTime == '' || props.lastMeasurementValue == -1 ? (
                    <Text fontSize='2xl' fontWeight='bold'>No hubo mediciones</Text>)
                    : (<>

                        < Flex direction='row'>
                            <Text fontSize='8xl' lineHeight='xs' fontWeight='bold' style={{ color: 'muted.500' }}>
                                {props.lastMeasurementValue.toFixed(1)}</Text>
                            <Text fontSize='4xl' fontWeight='bold'>cm</Text>
                        </Flex>
                        <Text fontSize='3xl' lineHeight='2xs'>
                            {timePassed}</Text>
                    </>
                    )}
            </Flex>

        </RingCircle >
    )
}

// TODO change setShowModal to something more specific



// =================================== DEVICE MODAL==============================================================

/** It starts the device scanning when its shown, and stops when it is not */
function DevicesModal(props: { showModal: boolean, setShowModal: any }) {



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
        props.setShowModal(false)
    }

    const deviceRenderer = (props: { item: DeviceSerializable, onSelected: any }) => (

        // <Box borderBottomWidth="1" _dark={{
        //     borderColor: "muted.200"
        // }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
        <Button variant='unstyled' onPress={() => { props.onSelected(props.item) }}>


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
                <Modal.Header>Dispositivos</Modal.Header>
                {/* <Modal.Body> It throws warning to Flatlist  */}

                <SafeAreaView >
                    <FlatList data={devices} renderItem={({ item }) => deviceRenderer({ item: item, onSelected: connectDevice })} keyExtractor={item => item.id} />
                </SafeAreaView>

                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button size='lg' colorScheme="red" onPress={() => { props.setShowModal(false); }}>
                            Salir
                        </Button>

                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>

    )

}

//----------------------------------------------------------------------------------------------
