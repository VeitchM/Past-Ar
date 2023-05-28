//TODO Make a place where i throw all the alerts in redux

import { Slide, View } from "native-base";
import AppAlert from "./AppNotification";
import { useTypedSelector } from "../features/store/storeHooks";




export default function NotificationManager() {
    const notifications = useTypedSelector(state => state.notification.notifications)


    return (

        <View position='absolute' width='100%' style={{flex:1}} bg='amber.300' justifyItems='flex-end'  bottom='62px' justifyContent='flex-end' >
            {notifications.map((notification,index) => 
                <AppAlert key={index} {...notification} />
            
            )}

        </View>
    )
}

