import type { NativeStackScreenProps } from '@react-navigation/native-stack';


//Move to ScreenStack
type RootStackParamList = {
    Home: undefined,
    Profile: { userId: string },
    Feed: { sort: 'latest' | 'top' } | undefined,
    Details: undefined;

};
type Props = NativeStackScreenProps<RootStackParamList>;



import { View, Text, StatusBar, Button, Box, Badge, useTheme, Flex, IconButton, useColorMode, useColorModeValue, Heading, Divider, Center, Modal, FormControl, Input, FlatList, HStack, VStack, Spacer } from 'native-base';
import { ReactNode, useEffect, useState } from 'react';
import { ColorValue, TouchableOpacity } from 'react-native';
import RoundedContainer from '../../components/RoundedContainer';
import { disconnectFromDevice } from '../../features/ble/ble';
import { useTypedSelector } from '../../storeHooks';
import DevicesModal from '../../components/DevicesModal';
import BatteryLevel from '../../components/Battery';







export default function HomeScreen(props: Props) {


    const theme = useTheme()
    const color = theme.colors.muted[400]

    const { height, timeStamp, battery } = useTypedSelector(state => state.ble.mainCharacteristic)
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


           
            <View bg='white' style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LastMeasurement lastMeasurementValue={height} lastMeasurementTime={timeStamp} />

                <BatteryLevel />

                <Flex paddingTop={10}>
                    <Text fontSize='xl' fontWeight='extrabold' paddingLeft={10} style={{ color: color }} >MEDIA</Text>
                    <RoundedContainer size={300} height={120} borderRadius={33} >
                        <Flex direction='row'>
                            <Text fontSize='4xl' fontWeight='bold' style={{ color: color }}>
                                {measurementsMediaValue}</Text>
                            <Text fontSize='2xl' fontWeight='bold' style={{ color: color }}>
                                cm</Text>
                        </Flex>
                        <Text fontSize='xl' fontWeight='hairline' style={{ color: color }}>
                            {mediaContextValue}</Text>
                    </RoundedContainer>
                </Flex>



                <Button
                    onPress={bleConnectionState == 'disconnected' ? () => setShowModalDevices(true) : disconnectFromDevice}
                    margin={10} fontSize="sm" size="lg"
                   >

                    {bleConnectionState == 'disconnected' ? 'CONECTAR DISPOSITIVO' : 'DESCONECTAR DISPOSITIVO'}
                </Button>


                <DevicesModal showModal={showModalDevices} setShowModal={setShowModalDevices} />
            </View>

    );
};




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

        <RoundedContainer size={RINGSIZE} borderColor={ringColor[300]}>
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

        </RoundedContainer >
    )
}

// TODO change setShowModal to something more specific




