
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

//=========== Components ========================================
import { Box, Container, Flex, Heading, Text, View } from "native-base"

import { setCalibrationModeOff, setCalibrationModeOn } from "../../features/store/measurementSlice";

//======= Navigation Props =========================
import { PropsCalibrationMeasurement } from "./Stack.types";

import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";


function CalibrationMeasurement({ navigation, route }: PropsCalibrationMeasurement) {

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

            }//Unsubscribe
        }, []))

    return (
        <View bg='white' style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

            <View paddingTop={0} flex={1} >

                {!calibrationMeasurmentID ? <Heading >Esperando Medicion</Heading> : null}
                <Container bg='muted.100' minWidth={250} alignItems='center'>
                    <Text fontSize='lg' fontWeight='thin'>Calibración</Text>
                    <Heading size='2xl' fontWeight='regular' >{route.params.calibrationName}</Heading>
                    {calibrationMeasurmentID ?
                        <>
                            <Text fontSize='lg' marginTop={5} marginBottom={-2} >Identificador</Text>
                            <Heading size='3xl'>{calibrationMeasurmentID}</Heading>
                            {/* TODO make it not ugly*/}

                            <Text fontSize='md' fontWeight='thin' marginTop={1} marginBottom={0} >Medicion</Text>
                            <Heading size='xl' fontWeight='regular'>{lastMeasurementHeight.toFixed(1)}cm</Heading>
                        </>
                        :
                        <Heading size='md' fontWeight={400}>Esperando medicion</Heading>
                    }
                </Container>
            </View>

            <View width='100%' bg='muted.50' flex={1} borderTopRadius='3xl' shadow={3} >
                <Box flexDirection='column' margin={10} justifyContent='space-between' >
                    <Text marginY={SPACE_BETWEEN_TEXT} fontSize='lg' fontWeight='bold'>Presione el boton del pasturometro para realizar medicion</Text>
                    <View style={{ height: 5 }} />
                    <Text marginY={SPACE_BETWEEN_TEXT} fontSize='lg' fontWeight='bold'>Anote el numero en pantalla para posteriormente asociarlo al peso de pasto seco de la medicion</Text>
                </Box>
            </View>

        </View>
    )


}

export default CalibrationMeasurement