
import { useEffect, useState } from "react";

import { useTypedSelector } from "../../features/store/storeHooks";



import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

//==== Components ===========================================
import { View, Text, Heading, Flex, Button, Select, HStack, VStack, FlatList, IconButton, Divider } from "native-base";
import ConnectDeviceButton from "../../components/ConnectDevice";
import RoundedContainer from "../../components/RoundedContainer";


//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
import { getCalibrations } from "../../features/localDB/localDB";
import { ListRenderItem } from "react-native";
import NewCalibrationModal from "../../components/CalibrationModal";
type Props = NativeStackScreenProps<StackParamList, 'CalibrationsList'>;


// TODO set Type
export default function CalibrationsList({ navigation }: Props) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState(
        [{ label: 'Otoño', value: '14' },
        { label: 'Verano', value: '19' },])
    //change by redux later


    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        getCalibrations().then((calibrations) => {
            console.log('Calibrations from Screen', calibrations);
            //TODO add to setCalibrations

        })

    }, [])



    return (

        <VStack alignItems='center' backgroundColor='white' flex={1} >
            <FlatList maxHeight='85%' minHeight='10%' width='100%' data={calibrations} renderItem={Item} />
            {/* <IconButton rounded='full' width={10} height={10} size='lg' variant="solid" _icon={{
                as: Entypo,
                name: "plus"
            }}/> */}

            <IconButton 
            _icon={{
                as: Entypo,
                name: "plus",
                size: '4xl'
            }}
                rounded='full' variant='solid' style={{ width: 60, height: 60 }} onPress={() => { navigation.navigate('CreateCalibration') }}>
                {/* <Entypo name="plus" size={35} color='white' /> */}
            </IconButton>

        </VStack>
    )
}



function Item(props: { item: { value: string, label: string } }) {
    const { item } = props
    return (

        <>
            <HStack style={{ height: 60, flex: 1, paddingHorizontal: 30 }} backgroundColor='white' justifyContent='space-between' alignItems='center' >

                <Heading>{item.label}</Heading>
                <IconButton
                    colorScheme='red'
                    _icon={{
                        as: MaterialIcons,
                        name: "delete",
                        size: '2xl'

                    }} />
            </HStack>
            <Divider />
        </>
    )
}







