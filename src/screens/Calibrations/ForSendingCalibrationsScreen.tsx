




import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";

//==== Icons ===================================================
import { MaterialCommunityIcons } from '@expo/vector-icons';

//==== Components ===========================================
import { Heading, HStack, VStack, FlatList, Divider, Icon, Pressable, Spinner, Checkbox, Button } from "native-base";
import { InfoCalibrationModal } from "../../components/CalibrationsModals";


//==== LocalDB ==========================================
import { CalibrationsFromMeasurementsLocalDB } from "../../features/localDB/types";
import { TablesNames } from "../../features/localDB/tablesDefinition";
import { getCalibrationsFromMeasurementExtended } from "../../features/localDB/calibrations";
import { SendStatus, setSendStatus } from "../../features/localDB/localDB";

//==== Navigation ==============================================
import { PropsCalibrationForSending } from "./Stack.types";

import { addNotification } from "../../features/store/notificationSlice";
import { pushNotification } from "../../features/pushNotification";
import TS from "../../../TS";




export default function ForSendingCalibrationsScreen({ navigation }: PropsCalibrationForSending) {
    //Value represents id in database
    const [calibrations, setCalibrations] = useState<CalibrationsFromMeasurementsLocalDB[]>()

    const [selectedCalibration, setSelectedCalibration] = useState<CalibrationsFromMeasurementsLocalDB>()
    const [showInfoModal, setShowInfoModal] = useState(false)

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

        setSendStatus(sendStatus, TablesNames.CALIBRATIONS_FROM_MEASUREMENTS, item.ID)
            .catch(err => {
                pushNotification( 'No se ha podido agregar a la cola de envio la calibracion: ' + item.name ,'error')
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
            }}
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
    }, [setSelectedCalibration])

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
                <Button onPress={() => navigation.goBack()}>{TS.t("back")}</Button>
            </VStack>
        </>
    )
}
