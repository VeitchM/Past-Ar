
import { useFocusEffect } from "@react-navigation/native";

//=========== Components ========================================
import { Box, Container, Flex, Heading, Text, View } from "native-base"

//======= Navigation Prop
import { StackParamList } from "./ScreenStack";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { setCalibrationMeasurementID, setCalibrationModeOff, setCalibrationModeOn } from "../../features/store/measurementSlice";
import { Alert } from "native-base";
import { useCallback } from "react";
type Props = NativeStackScreenProps<StackParamList, 'CalibrationMeasurement'>;


function CalibrationMeasurement({ navigation, route }: Props) {

    const SPACE_BETWEEN_TEXT = 5

    const dispatch = useTypedDispatch()
    const calibrationMeasurmentID = useTypedSelector(state => state.measurement.calibrationMeasurementID)
    const lastMeasurementHeight = useTypedSelector(state => state.measurement.lastMeasurement.height)

    console.log('Lalallal', calibrationMeasurmentID);

    useFocusEffect(
        useCallback(() => {
            console.log('Focused');
            dispatch(setCalibrationModeOn(route.params.calibrationID))

            return () => {
                console.log('Not focused anymore');
                dispatch(setCalibrationModeOff());
                // dispatch(setCalibrationMeasurementID(null))

            }//Unsubscribe
        }, []))

    return (
        <View bg='white' style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

            <View paddingTop={0} flex={1} >

               { !calibrationMeasurmentID ? <Heading >Esperando Medicion</Heading> : null}
                <Container bg='muted.100' minWidth={250} alignItems='center'>
                    <Text fontSize='lg' fontWeight='thin'>Calibracion</Text>
                    <Heading size='2xl' fontWeight='regular' >{route.params.calibrationName}</Heading>
                    {calibrationMeasurmentID ?
                    <>
                        <Text fontSize='lg' marginTop={5} marginBottom={-2} >Identificador</Text>
                        <Heading size='3xl'>{calibrationMeasurmentID}</Heading>
                        {/* TODO make it not ugly*/}

                        <Text fontSize='md'  fontWeight='thin' marginTop={1} marginBottom={0} >Medicion</Text>
                        <Heading size='xl' fontWeight='regular'>{lastMeasurementHeight.toFixed(1)}cm</Heading>
                    </>
                        :
                        <Heading size='md' fontWeight={400}>Esperando medicion</Heading>



                    }
                </Container>
            </View>

            {/* <Flex flex={1}  width='100%' bg='black'>
              <Text>lalalal</Text>
            </Flex> */}
            <View width='100%' bg='muted.50' flex={1} borderTopRadius='3xl' shadow={3} >
                <Box flexDirection='column' margin={10} justifyContent='space-between' >
                    <Text marginY={SPACE_BETWEEN_TEXT} fontSize='lg' fontWeight='bold'>Presione el boton del pasturometro para realizar medicion</Text>
                    <View style={{height:5}}/>
                    <Text marginY={SPACE_BETWEEN_TEXT} fontSize='lg' fontWeight='bold'>Anote el numero en pantalla para posteriormente asociarlo al peso de pasto seco de la medicion</Text>
                </Box>
            </View>

        </View>
    )


}

export default CalibrationMeasurement