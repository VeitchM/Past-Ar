import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined,
    Profile: { userId: string },
    Feed: { sort: 'latest' | 'top' } | undefined,
    Details: undefined;

};
type Props = NativeStackScreenProps<RootStackParamList>;



import { View, Text, Button, Box, Badge, useTheme, Flex, IconButton, useColorMode, useColorModeValue, Heading, Divider } from 'native-base';
import { ReactNode, useEffect } from 'react';
import { ColorValue, TouchableOpacity } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';


type RingProps = {
    size?: number;
    height?: number;
    borderWidth?: number;
    borderColor?: ColorValue;
    children?: any
}

export const RingCircle = ({ size = 200, height, borderWidth = 4, borderColor, children = {} }: RingProps) => {
    const theme = useTheme();
    //borderColor = borderColor || theme.colors.primary 
    borderColor = borderColor || theme.colors.muted[300]
    console.log(borderColor);

    return (
        <View style={{
            width: size,
            height: height || size,
            borderRadius: size / 2,
            borderWidth: borderWidth,
            borderColor: borderColor,


        }}>
            {children}
        </View>
    )
}

export const Ring = () => {


    const theme = useTheme()
    const ringColor = theme.colors.muted


    const RINGSIZE = 280


    const lastMeasurementValue = 14
    const lastMeasurementTime = '24min'

    return (

        <RingCircle size={RINGSIZE} borderColor={ringColor[300]}>
            <Flex direction='column' style={{ width: RINGSIZE, justifyContent: 'center', alignItems: 'center' }} >

                <Text fontSize='xl' fontWeight='extrabold' >
                    ULTIMA MEDICION</Text>
                <Flex direction='row'>
                    <Text fontSize='8xl' lineHeight='xs' fontWeight='bold' style={{ color: ringColor[500] }}>
                        {lastMeasurementValue}</Text>
                    <Text fontSize='4xl' fontWeight='bold'>
                        cm</Text>
                </Flex>
                <Text fontSize='3xl' lineHeight='2xs'>
                    hace {lastMeasurementTime}</Text>
            </Flex>

        </RingCircle>
    )
}



export default function HomeScreen(props: Props) {


    const theme = useTheme()
    const color = theme.colors.muted[400]

    const measurementsMediaValue = 13.2
    const mediaContextValue = 'Algun lugar'



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
                <Ring />
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

                <Button margin={10} fontSize="sm" size="lg" colorScheme='muted' borderRadius='2xl' >

                    CONECTAR DISPOSITIVO
                </Button>




            </View>
        </>

    );
};



//----------------------------------------------------------------------------------------------
