




import { useCallback, useEffect, useState } from "react";
import { ListRenderItem } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";


import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//==== Components ===========================================
import { Heading, HStack, VStack, FlatList, IconButton, Divider, Icon, Pressable, Spinner, Checkbox, Button } from "native-base";
import { DeleteCalibrationModal, InfoCalibrationModal } from "../../components/CalibrationsModals";


//==== LocalDB ==========================================
import { deleteCalibration, getCalibrations, getCalibrationsFromMeasurementExtended } from "../../features/localDB/localDB";
import { CalibrationLocalDBExtended, CalibrationsFromMeasurementsLocalDB, calibrationsMeasurementsLocalDB } from "../../features/localDB/types";

//==== Navigation ==============================================
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from "./ScreenStack";
import { SendStatus, setSendStatus } from "../../features/localDB/backend";
import { tablesNames } from "../../features/localDB/tablesDefinition";
import { addNotification } from "../../features/store/notificationSlice";
import { Notification } from "../../features/store/types";
type Props = NativeStackScreenProps<StackParamList, 'ForSendingCalibrations'>;




export default function ForSendingCalibrationsScreen({ navigation }: Props) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState<CalibrationsFromMeasurementsLocalDB[]>()

    const [selectedCalibration, setSelectedCalibration] = useState<CalibrationsFromMeasurementsLocalDB>()
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [groupValues, setGroupValues] = useState([]);

    const dispatch = useTypedDispatch()


    const refreshList = useCallback(() => {

        getCalibrationsFromMeasurementExtended().then((calibrations) => {
            setCalibrations(calibrations)


        })


    }, [])

    useFocusEffect(refreshList)



    const changeItemSendStatus = useCallback(
        (item: CalibrationsFromMeasurementsLocalDB, sendStatus: SendStatus) => {
            console.log('Change', calibrations);

            setCalibrations(calibrations => calibrations?.map((calibration) => {
                if (calibration.ID === item.ID) {
                    calibration.sendStatus = sendStatus
                }
                return calibration
            }))

        }
        , [calibrations])

    const onChangeSendStatus = useCallback((item: CalibrationsFromMeasurementsLocalDB) => {
        const sendStatus = item.sendStatus === SendStatus.NOT_SENT ? SendStatus.FOR_SENDING : SendStatus.NOT_SENT
        changeItemSendStatus(item, sendStatus)

        setSendStatus(sendStatus, tablesNames.CALIBRATIONS_FROM_MEASUREMENTS, item.ID)
            .catch(err => {
                dispatch(addNotification({ status: 'Error', title: 'No se ha podido agregar a la cola de envio la calibracion: ' + item.name }))
                changeItemSendStatus(item, item.sendStatus)
                console.error(err);


            })

    }, [])


    const Item = useCallback((props: { item: CalibrationsFromMeasurementsLocalDB }) => {
        const { item } = props
        return (

            < Pressable key={item.ID} onPress={() => {
                console.log('aaaya')
                setSelectedCalibration(item)
                setShowInfoModal(true)
            }
            }
            >
                <HStack style={{ height: 60, flex: 1, paddingHorizontal: 30 }} backgroundColor='white' justifyContent='space-between' alignItems='center' >




                    <Heading >{item.name}</Heading>


                    <Checkbox value={item.ID.toString()} accessibilityLabel="forUploading" colorScheme="blue" size='lg'
                        icon={<Icon size='xl' as={<MaterialCommunityIcons name="upload" />} />}
                        isChecked={item.sendStatus === SendStatus.FOR_SENDING}
                        onChange={() => onChangeSendStatus(item)}
                    />

                </HStack>
                <Divider />
            </Pressable >
        )
    }, [setSelectedCalibration, setShowDeleteModal])




    return (
        <>
            {/* Modal explaining what does it do */}
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
                <Button onPress={() => navigation.goBack()}>Volver</Button>

            </VStack>
        </>
    )
}
