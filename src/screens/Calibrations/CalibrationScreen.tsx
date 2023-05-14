import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Heading, Box, Container, ZStack, Flex, Button, Select, CheckIcon, HStack, VStack } from "native-base";
import CalibrationMeasurementScreen from "./CalibrationMeasurementScreen";
import SetCalibrationsScreen from "./SetCalibrationsScreen";
import RoundedContainer from "../../components/RoundedContainer";
import { useState } from "react";
import { useTypedSelector } from "../../storeHooks";
import DevicesModal from "../../components/DevicesModal";
import ConnectDeviceButton from "../../components/ConnectDevice";

const Stack = createNativeStackNavigator();


// TODO set Type
function HomeCalibration({ navigation }: any) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState(
        [{ label: 'Otoño', value: '14' },
        { label: 'Verano', value: '19' },])
    //change by redux later

    const connectionState = useTypedSelector(state => state.ble.connectionState)

    const [show,setShow] = useState(false)

    return (

        <VStack flex={1} alignItems='end' bg='white' _dark={{ bg: 'black' }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>

            <View style={{ paddingTop: 50 }}>




                <RoundedContainer size={329} height={264} borderRadius={33}>
                    <VStack flex={1} justifyContent='space-around'                    >
                        <Heading paddingTop={5} flex={0.5} size='md'>Cargar Medicion de Calibracion</Heading>
                        <HStack style={{ justifyContent: "space-between", }}>
                            <Text fontSize='lg' style={{ alignSelf: 'center' }} >Calibracion</Text>
                            <Select
                                // colorScheme='yellow'

                                minWidth="150"
                                placeholder="Elige la calibracion"
                                mt="1"
                                _item={{ color: 'green.400' }}
                                // style={{backgroundColor:'green'}}
                                // bg='green.100'
                                // bgColor='gray.600'
                                _text={{ color: 'amber.500' }}
                            >
                                {calibrations.map((calibration) => {
                                    return <Select.Item key={calibration.value}
                                        label={calibration.label}
                                        value={calibration.value}
                                    />
                                })}
                            </Select>
                        </HStack>
                    </VStack>
                    <VStack flex={1} justifyContent='center'>

                        {connectionState == 'connected' ?
                            <Button>Realizar Medicion</Button>
                            :
                            <>
                                <ConnectDeviceButton/>
                            </>

                        }
                    </VStack>
                </RoundedContainer >
            </View>

            <Flex bg='muted.100' flex={.6} alignSelf='flex-end'>
                <Flex flex={1} width='100%' direction="row">
                    <CustomButton text='Seleccionar Calibracion' onPress={() => { navigation.navigate('SetCalibrations') }}></CustomButton>
                    <CustomButton text='Crear Calibracion'></CustomButton>
                </Flex>
                <CustomButton text='Finalizar Calibracion'></CustomButton>
                <CustomButton text='Ayuda'></CustomButton>
            </Flex>

        </VStack >
    )
}

export default function CalibrationStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='CalibrationHome' component={HomeCalibration} />
            <Stack.Screen name='CalibrationMeasurement' component={CalibrationMeasurementScreen} />
            <Stack.Screen name='SetCalibrations' component={SetCalibrationsScreen} />


        </Stack.Navigator>
    )


}



function CustomButton({ onPress = () => { }, text = '' }) {

    return (
        <Button onPress={onPress} style={{ shadowColor: 'transparent' }} borderRadius={0} variant='outline' borderWidth={0.25} colorScheme='muted' flex={1}>
            <Text>{text}</Text>
        </Button>
    )
}




