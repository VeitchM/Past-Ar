import { Alert, HStack, IconButton, VStack,Text, CloseIcon } from "native-base";
import { InterfaceAlertProps } from "native-base/lib/typescript/components/composites/Alert/types";
import {Notification} from "../features/store/types";


//TODO WHich id i use to kill itself
export default function AppAlert(props: Notification ) {
    return (
        <>
            <Alert w="100%" status={props.status} variant='solid'>
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} justifyContent="space-between">
                        <HStack space={2} flexShrink={1}>
                            <Alert.Icon mt="1" />
                            <Text fontSize="md" color='white' >
                                {props.title}
                            </Text>
                        </HStack>
                        <IconButton variant="unstyled" _focus={{
                            borderWidth: 0
                        }} icon={<CloseIcon size="3" color='white' />}  />
                    </HStack>
                </VStack>
            </Alert>
        </>)
}