import { Flex, Text, VStack, useTheme } from "native-base"
import { useEffect, useState } from "react"
import { useTypedSelector } from "../features/store/storeHooks"
import RoundedContainer from "./RoundedContainer"





/**
 * 
 * @returns a component which displays the last measurement and the time elapsed since the measurement was made
 */
export const LastMeasurement = () => {

    const RINGSIZE = 300
    const UPDATE_TIME = 10000

    const [timePassed, setTimePassed] = useState('')

 const {height,timestamp} = useTypedSelector(state=>state.measurement.lastMeasurement)




    //Refresh minutes when a certain amount of time passed
    useEffect(() => {

        const calculateTime = () => {
            let timePassed = 'No hubo mediciones '

            if (timestamp >0) {
                timePassed = 'hace '

                const milisecondsPassed = Date.now() - new Date(timestamp).valueOf()
                if (milisecondsPassed < 60000)
                    timePassed += Math.floor(milisecondsPassed / 1000) + ' segundos'
                else if (milisecondsPassed < 1000 * 60 * 60) {
                    const minutes = Math.floor(milisecondsPassed / 60000)
                    timePassed += `${minutes} minuto${minutes > 1 ? 's' : ''}`
                }
                else if (milisecondsPassed < 1000 * 60 * 60 * 24) {
                    const hours = Math.floor(milisecondsPassed / 1000 * 60 * 60)
                    timePassed += `${hours} hora${hours > 1 ? 's' : ''}`
                }
                else {
                    const days = Math.floor(milisecondsPassed / 1000 * 60 * 60 * 24)
                    timePassed += `${days} día${days > 1 ? 's' : ''}`
                }
            }
            return timePassed
        }


        setTimePassed(calculateTime())
        const interval = setInterval(() => {

            const milisecondsPassed = Date.now() - new Date(timestamp).valueOf()

            console.log('Mili', milisecondsPassed, new Date(timestamp));
            setTimePassed(calculateTime)

            console.log('Time Passed', timePassed);
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
                    <Text fontSize='2xl' fontWeight='bold'>No hubo mediciones</Text>)
                    : (<>

                        < Flex direction='row'>
                            <Text fontSize='8xl' lineHeight='xs' fontWeight='bold' >
                                {height.toFixed(1)}</Text>
                            <Text fontSize='4xl' fontWeight='bold'>cm</Text>
                        </Flex>
                        <Text fontSize='3xl' lineHeight='2xs'>
                            {timePassed}</Text>
                    </>
                    )}
            </VStack>

        </RoundedContainer >
    )
}
