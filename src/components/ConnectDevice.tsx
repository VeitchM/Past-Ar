import { useState } from "react";
import DevicesModal from "./DevicesModal";
import { Button, HStack, Heading, Spinner } from "native-base";
import { useTypedSelector } from "../storeHooks";


export default function ConnectDeviceButton() {

    const [showModal, setShowModal] = useState(false)
    const state = useTypedSelector(state => state.ble.connectionState)
    return (
        <>
            {state == 'disconnected' ?

                <Button size='lg'  onPress={() => setShowModal(true)}>Vincular Pasturometro</Button>
                :
                <Connecting />
            }
            <DevicesModal showModal={showModal} setShowModal={setShowModal} />
        </>
    )


}

function Connecting() {
    return (
        <Button>
            <HStack space={2} justifyContent="center" alignItems='center'>
                <Heading
                //color="primary.500" fontSize="md"
                >
                    Conectando
                </Heading>
                <Spinner size='lg' color='white.300' />
            </HStack>
        </Button>
    )
};