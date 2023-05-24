
import { useFocusEffect } from "@react-navigation/native";

//=========== Components ========================================
import { Box, Button, Container, Flex, FormControl, HStack, Heading, Input, Text, View } from "native-base"

//======= Navigation Prop
import { StackParamList } from "./ScreenStack";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { setCalibrationMeasurementID, setCalibrationModeOff, setCalibrationModeOn } from "../../features/store/measurementSlice";
import { Alert } from "native-base";
import { isValidElement, useCallback, useEffect, useMemo, useState } from "react";
import CreateCalibration from "./CreateScreen";
import { calibrationExists, insertCalibrationFromFunction } from "../../features/localDB/localDB";
type Props = NativeStackScreenProps<StackParamList, 'CreateFunctionCalibration'>;


function CreateFunctionCalibration({ navigation, route }: Props) {

    const SPACE_BETWEEN_TEXT = 5

    const dispatch = useTypedDispatch()

    const [functionDefinition, setFunctionDefinition] = useState<string>()
    const [valid, setValid] = useState(false)
    const [coeficients, setCoeficients] = useState<number[]>()
    const [isCreating, setIsCreating] = useState(false)


    useEffect(() => {
        const coeficients = functionDefinition?.split(',').map((number) => Number(number))
        setCoeficients(coeficients)
        setValid(!coeficients?.some(number => isNaN(number)))

    }, [functionDefinition])

    const validForCreatingCalibration = useMemo(() => {
        return valid && coeficients && coeficients.length > 1
    }, [coeficients, valid])


    //======== Function ===================================================
    async function createCalibration() {
        if (valid) {
            try {

                setIsCreating(true)

                const exists = await calibrationExists(route.params.name)
                if (!exists && coeficients) {
                    await insertCalibrationFromFunction(route.params.name, coeficients.toString())
                }
                else {
                    //TODO ya existe el nombre 
                    console.log('Name already exists');
                }
                setIsCreating(false);
                navigation.navigate('CalibrationsList')
            }
            catch (e) {
                console.log('Error creating calibration', e);
                //TODO mostrar error notificacion
                console.error(e);

                setIsCreating(false)
            }
        }
    }


    return (
        <View bg='white' style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

            <View paddingTop={0} flex={1} >

                <Text fontSize='lg' >Calibracion</Text>
                <Heading marginBottom={2}>{route.params.name}</Heading >
                <Heading size='md' fontWeight='regular' >Introduzca coeficiente de Polinomios</Heading>
                <FormControl
                    isInvalid={!valid}
                    maxWidth='350px'
                    width='350px' >

                    <Input
                        // keyboardType='numeric'
                        fontSize={functionDefinition ? 'xl' : 'lg'}
                        value={functionDefinition}
                        size='2xl'

                        _invalid={{ color: 'error.400' }}
                        onChangeText={setFunctionDefinition}
                        placeholder="Escriba Polinomio" />
                    <FormControl.ErrorMessage>
                        Introduzca un polinomio valido
                    </FormControl.ErrorMessage>
                </FormControl>

                {validForCreatingCalibration && coeficients?
                    <PolynomialFunction coeficients={coeficients} />
                    :
                    null
                }

                <Button
                    marginTop={3}
                    isDisabled={!validForCreatingCalibration}
                    onPress={createCalibration}
                >Crear Calibracion</Button>



            </View>

            {/* <Flex flex={1}  width='100%' bg='black'>
              <Text>lalalal</Text>
            </Flex> */}
            <View width='100%' bg='muted.50' flex={1} borderTopRadius='3xl' shadow={3} >
                <Box flexDirection='column' margin={10} justifyContent='space-between' >
                    <Text marginY={SPACE_BETWEEN_TEXT} fontSize='lg' fontWeight='bold'>Utilize "." para decimales y ";" para separar los coeficientes. </Text>
                    <View style={{ height: 5 }} />
                    <Heading textAlign='center'>Ejemplo</Heading>
                    <Text textAlign='center' fontSize='lg' fontWeight='bold'>Y=3+5.5X+6.1X^2-0.0043X^3</Text>
                    <Heading textAlign='center' marginTop={SPACE_BETWEEN_TEXT}>Sera</Heading>

                    <Text textAlign='center' fontSize='lg' fontWeight='bold'>3,5.5,6.1,-0.0043</Text>


                </Box>
            </View>

        </View>
    )


}


export default CreateFunctionCalibration


function PolynomialFunction(props: { coeficients: number[] }) {
    return (

        <HStack marginY={2}>
            
            {props.coeficients?.map((coeficient, index) => 
                { return coeficient != 0 ? 

                    <HStack  key={index}>
                    {index == 0 || 0 > coeficient ?
                        null
                        :
                        <Text fontSize='2xl'>+</Text>
                    }
                    <Text fontSize='2xl'>
                    {coeficient}
                    {index == 0 ? '' : 'X'}
                    </Text>
                    <Text fontSize='sm'>
                    {index <= 1 ? '' : index}
                    </Text >
                    </HStack>
                    :
                    null
                }
            )
            }
        </HStack >
    )

}