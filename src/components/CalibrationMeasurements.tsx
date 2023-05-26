import { Divider, FlatList, HStack, Heading, Spinner, Text, VStack, View } from "native-base";
import { useEffect, useState } from "react";
import { getCalibrationsMeasurements } from "../features/localDB/localDB";
import { CalibrationLocalDB, MeasurementLocalDB } from "../features/localDB/types";

export default function CalibrationsMeasurements(props: { calibrationID: number }) {

    const [measurements, setMeasurements] = useState<MeasurementLocalDB[]>()

    useEffect(() => {
        console.log('Effect ');

        getCalibrationsMeasurements(props.calibrationID)
            .then(array => {
                console.log('Array ', array)//
                // const array2 = new Array(20).fill(0)
                // console.log(array2);

                //setMeasurements(array)
                setMeasurements(array)
            })
            .catch((e) => console.error(e))
    }, [])

    return (
        <VStack marginTop={3}>
            <Heading size='md'>Mediciones Realizadas</Heading>
            {measurements?.map((measurement) => <Item
                // key={measurement.ID} 
                item={measurement} />) || 
                <Spinner margin={10} color='info.500' size={100} />
                }
        </VStack>
    )
}

function Item(props: { item: MeasurementLocalDB }) {
    return (<>
        <HStack margin={2} justifyContent='space-between'>
            <VStack>

                <Text marginBottom={-1}>ID</Text>
                <Text fontSize='xl' fontWeight='bold'>{props.item.ID}   </Text>

            </VStack>
            <VStack>
                <Text marginBottom={-1}>Altura</Text>
                <Text fontSize='xl' fontWeight='bold' textAlign='right'>{props.item.height.toFixed(1)}</Text>
            </VStack>

        </HStack>
        <Divider />
    </>
    )
}