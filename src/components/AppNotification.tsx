import { Alert, HStack, IconButton, VStack,Text, CloseIcon, Slide } from "native-base";
import { InterfaceAlertProps } from "native-base/lib/typescript/components/composites/Alert/types";
import {Notification} from "../features/store/types";
import { useTypedDispatch } from "../features/store/storeHooks";
import { deleteNotification } from "../features/store/notificationSlice";


export default function AppNotification(props: Notification ) {

    const dispatch = useTypedDispatch()
    return (
        <>

            <Alert w="100%" status={props.status} variant='solid'>
                <VStack space={2} flexShrink={1} w="100%" >
                    <HStack flexShrink={1} space={2} justifyContent="space-between">
                        <HStack space={3} maxWidth='80' alignItems='center'>
                            <Alert.Icon mt="1" size={5} />
                            <Text fontSize="md" maxWidth='full' color='white'   >
                                {props.title}
                            </Text>
                        </HStack>
                        <IconButton variant="unstyled"
                        onPress={()=>{
                            console.log('Closed ',props);
                            
                            dispatch(deleteNotification(props))}}
                            _focus={{
                                borderWidth: 0
                                
                            }} icon={<CloseIcon size="3" color='white' />}  />
                    </HStack>
                </VStack>
            </Alert>
        </>)
}