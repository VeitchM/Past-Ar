import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Heading, Box, Container, ZStack, Flex, Button } from "native-base";
import CalibrationMeasurementScreen from "./CalibrationMeasurementScreen";
import SetCalibrationsScreen from "./SetCalibrationsScreen";

const Stack = createNativeStackNavigator();

function RootCalibration({navigation}) {
    const lastPaddock = 'Rio'
    const lastCalibration = 'Otoño'

    return (

        <View bg='white' _dark={{ bg: 'black' }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            
            <View bg='white' paddingTop={10} flex={1} >
                <Heading >Ultima Calibracion Utilizada</Heading>
                <Container>
                    <Heading size='xl'>Potrero: {lastPaddock} </Heading>
                    <Heading size='xl'>Calibracion: {lastCalibration}</Heading>

                </Container>
            </View>

            <Flex bg='muted.100' flex={1} >
                <Flex flex={1} width='100%' direction="row">
                    <CustomButton text='Seleccionar Calibracion' onPress={()=>{navigation.navigate('SetCalibrations')}}></CustomButton>
                    <CustomButton text='Crear Calibracion'></CustomButton>
                </Flex>
                <CustomButton text='Cargar Datos de Calibracion'></CustomButton>
                <CustomButton text='Realizar Medicion de Calibracion' onPress={()=>{navigation.navigate('CalibrationMeasurement')}}></CustomButton>
                <CustomButton text='Ayuda'></CustomButton>
            </Flex>

        </View>
    )
}

export default function CalibrationScreen({navigation}) {
    return(
        <Stack.Navigator>
            <Stack.Screen name='CalibrationHome' component={RootCalibration}/>
            <Stack.Screen name='CalibrationMeasurement' component={CalibrationMeasurementScreen}/>
            <Stack.Screen name='SetCalibrations' component={SetCalibrationsScreen}/>


        </Stack.Navigator>
    )


}



function CustomButton({ onPress = () => { }, text = '' }) {

    return (
        <Button onPress={onPress} borderRadius={0} variant='outline' borderWidth={0.25} colorScheme='muted' flex={1}>
            <Text>{text}</Text>
        </Button>
    )
}




