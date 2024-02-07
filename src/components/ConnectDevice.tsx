import { useState } from "react";
import DevicesModal from "./DevicesModal";
import { Button, HStack, Heading, Icon, Spinner } from "native-base";
import { useTypedSelector } from "../features/store/storeHooks";



import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import TS from "../../TS";


export default function ConnectDevice() {

    const [showModal, setShowModal] = useState(false)
    const state = useTypedSelector(state => state.ble.connectionState)
    return (
        <>
            <Button size='lg' isLoading={state == 'connecting'} isLoadingText="Conectando"
                _spinner={{ size: 30 }}
                onPress={() => setShowModal(true)}
                leftIcon={<Icon as={MaterialCommunityIcons} name='connection' size='2xl' />}
                
                >
                {TS.t('ble_link_device')}
            </Button>
            <DevicesModal showModal={showModal} setShowModal={setShowModal} />
        </>
    )


}


