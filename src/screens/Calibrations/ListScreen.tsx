
import { useCallback, useEffect, useState } from "react";
import { ListRenderItem } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useTypedSelector } from "../../features/store/storeHooks";


import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//==== Components ===========================================
import { Heading, HStack, VStack, FlatList, IconButton, Divider, Icon, Pressable, Spinner } from "native-base";
import { DeleteCalibrationModal, InfoCalibrationModal } from "../../components/CalibrationsModals";


//==== LocalDB ==========================================
import { deleteCalibration, getCalibrations } from "../../features/localDB/localDB";
import { CalibrationLocalDBExtended } from "../../features/localDB/types";

//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
type Props = NativeStackScreenProps<StackParamList, 'CalibrationsList'>;


export default function CalibrationsList({ navigation }: Props) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState<CalibrationLocalDBExtended[]>()

    const [selectedCalibration, setSelectedCalibration] = useState<CalibrationLocalDBExtended>()
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)


    const refreshList = useCallback(() => {

        getCalibrations().then((calibrations) => {
            console.log('Calibrations from Screen', calibrations);
            setCalibrations(calibrations)

        })


    }, [])

    useFocusEffect(refreshList)

    function onDelete(ID: number) {
        deleteCalibration(ID).then(() => {
            refreshList()
        })

    }


    const Item = useCallback((props: { item: CalibrationLocalDBExtended }) => {
        const { item } = props
        return (

            <Pressable onPress={() => {
                console.log('aaaya')
                setSelectedCalibration(item)
                setShowInfoModal(true)
            }}
            >
                <HStack style={{ height: 60, flex: 1, paddingHorizontal: 30 }} backgroundColor='white' justifyContent='space-between' alignItems='center' >

                    <HStack>
                        {/* I Could use a condition in just the icon name, but with cloud it will be a ternary */}
                        {item.fromFunction != 1 &&
                            <Icon marginRight={2} alignSelf='center' size='xl' as={MaterialCommunityIcons} name='ruler' />}
                        {item.fromMeasurement != 1 &&
                            <Icon marginRight={2} alignSelf='center' size='xl' as={MaterialCommunityIcons} name='function-variant' />}

                        <Heading >{item.name}</Heading>
                    </HStack>
                    <IconButton
                        onPress={() => {
                            setSelectedCalibration(item)
                            setShowDeleteModal(true)
                        }}
                        colorScheme='red'
                        _icon={{
                            as: MaterialIcons,
                            name: "delete",
                            size: '2xl'

                        }} />
                </HStack>
                <Divider />
            </Pressable>
        )
    },[setSelectedCalibration,setShowDeleteModal])




    return (
        <>
            <DeleteCalibrationModal
                setShowModal={setShowDeleteModal}
                info={selectedCalibration}
                showModal={showDeleteModal}
                onDelete={onDelete} />
            <InfoCalibrationModal
                setShowModal={setShowInfoModal}
                info={selectedCalibration}
                showModal={showInfoModal}
            />

            <VStack alignItems='center' backgroundColor='white' flex={1} >
                {calibrations ?

                    <FlatList maxHeight='85%' minHeight='10%' width='100%' data={calibrations} renderItem={Item} />
                    :
                    <VStack height={500} justifyContent='center' >
                        <Spinner size={90} />
                    </VStack>

                }
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
        </>
    )
}
