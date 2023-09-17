import { Flex, Text, VStack, useTheme } from "native-base"
import { useEffect, useState } from "react"
import { useTypedSelector } from "../../../features/store/storeHooks"
import RoundedContainer from "../../../components/RoundedContainer"
import { timePassedString } from "../../../utils/time"





/**
 * 
 * @returns a component which displays the last measurement and the time elapsed since the measurement was made
 */
export const LastMeasurement = () => {

    const RINGSIZE = 250
    const UPDATE_TIME = 10000

    const [timePassed, setTimePassed] = useState('')

 const {height,timestamp} = useTypedSelector(state=>state.measurement.lastMeasurement)




    //Refresh minutes when a certain amount of time passed
    useEffect(() => {
        setTimePassed(timePassedString(timestamp))
        const interval = setInterval(() => {
            setTimePassed(timePassedString(timestamp))
        }, UPDATE_TIME);
        return () => {
            clearInterval(interval);
        };
    }, [timestamp])

    return (

        <RoundedContainer size={RINGSIZE}>
            <VStack  style={{ width: RINGSIZE,
                // justifyContent: 's', 
                alignItems: 'center' 
                }} >

                <Text fontSize='xl' fontWeight='extrabold' >
                    ULTIMA MEDICION</Text>
                {timestamp <0 || height == -1 ? (
                    <Text fontSize='xl' fontWeight='bold'>No hubo mediciones</Text>)
                    : (<>

                        < Flex direction='row'>
                            <Text fontSize='7xl' lineHeight='xs' fontWeight='bold' >
                                {height.toFixed(1)}</Text>
                            <Text fontSize='4xl' fontWeight='bold'>cm</Text>
                        </Flex>
                        <Text fontSize='2xl' lineHeight='2xs'>
                            {timePassed}</Text>
                    </>
                    )}
            </VStack>

        </RoundedContainer >
    )
}
