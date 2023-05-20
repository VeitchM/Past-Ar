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
import { useTypedSelector } from '../../features/store/storeHooks';
import DevicesModal from '../../components/DevicesModal';
import BatteryLevel from '../../components/Battery';
import { LastMeasurement } from '../../components/LastMeasurement';
import ConnectDeviceButton from '../../components/ConnectDevice';







export default function HomeScreen(props: Props) {


    const theme = useTheme()
    const color = theme.colors.muted[400]

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

            <LastMeasurement />

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



            {/* {bleConnectionState== 'disconnected' ?  */}

            {/* TODO it should say conectado and when pressed show a moldal for disconnecting */}
            <VStack margin={10}>
                {bleConnectionState == 'connected' ?
                    <Button
                        onPress={() => disconnectFromDevice()}
                        size="lg"
                        // colorScheme='amber'
                        >
                        Desvincular Pasturometro
                    </Button>
                    :
                    <ConnectDeviceButton />

                }
            </VStack>

        </View>

    );
};









