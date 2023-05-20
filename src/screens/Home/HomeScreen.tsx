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



        <VStack bg='white' flex={1} alignItems='center'>
            <View height='60px' />
            
            <LastMeasurement />
            <View height='20px' />
            <BatteryLevel />

            <Flex paddingTop={'20px'}>
                <Text fontSize='2xl' fontWeight='medium' paddingLeft={5}  >MEDIA</Text>
                <RoundedContainer size={300} height={120} borderRadius={33} >
                    <Flex direction='row'>
                        <Text fontSize='4xl' fontWeight='bold' >
                            {measurementsMediaValue}</Text>
                        <Text fontSize='2xl' fontWeight='bold' >
                            cm</Text>
                    </Flex>
                    <Text fontSize='xl' fontWeight='regular' >
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

        </VStack>

    );
};









