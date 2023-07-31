import { Flex, Text } from "native-base";
import RoundedContainer from "../../../components/RoundedContainer";

export default function Info() {

    const measurementsMediaValue = 24.5
    const mediaContextValue = "PlaceHolder"
    return (
        <>
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
        </>
    )
}