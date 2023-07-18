import { addNotification } from "./store/notificationSlice";
import store from "./store/store";
import { Notification } from "./store/types";


export function pushNotification(title: Notification['title'],status:Notification['status']){
    store.dispatch(addNotification({title,status}))
}