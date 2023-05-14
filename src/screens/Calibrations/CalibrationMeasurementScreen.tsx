import { Box, Container, Flex, Heading, Text, View } from "native-base"
import { useEffect } from "react"

function CalibrationMeasurement() {
    const actualPaddock = 'Rio'
    const actualID = ''

    const SPACE_BETWEEN_TEXT = 8


    // useEffect(()=>{

    // },[measurement])

    return (
        <View bg='white' style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

            <View paddingTop={10} flex={1} >
                <Heading >Esperando Medicion</Heading>
                <Container>
                    <Heading size='2xl'>Potrero: {actualPaddock}</Heading>

                </Container>
            </View>

            {/* <Flex flex={1}  width='100%' bg='black'>
              <Text>lalalal</Text>
            </Flex> */}
            <View width='100%' bg='muted.50' flex={1} borderTopRadius='3xl' shadow={3} >
                <Box margin={10} justifyContent='space-between' >
                    <Text  marginY={SPACE_BETWEEN_TEXT} fontSize='xl' fontWeight='bold'>Presione el boton del pasturometro para realizar medicion</Text>
                    <Text marginY={SPACE_BETWEEN_TEXT} fontSize='xl' fontWeight='bold'>Anote el numero en pantalla para posteriormente asociarlo al peso de pasto seco de la medicion</Text>
                </Box>
            </View>

        </View>
    )


}

export default CalibrationMeasurement