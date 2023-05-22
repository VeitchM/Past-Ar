import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from 'react-native-ble-plx'



//========Types========================================
import { Notification } from './types';

//===== Could be moved to types.ts ========================
interface NotificationState {


    notifications: Notification[],

}
//=========================================================

const initialState: NotificationState = {

    notifications: [],
    //maybe is not needed the counter and ID

}


function areEqual(a: Notification, b: Notification) {
    return a.status === b.status && a.title === b.title
}


//================Slice================================

export const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {

        // ======================== Just setters ===================================

        addNotification: (state, action: PayloadAction<Notification>) => {
            //todo if it is not already there
            if (!state.notifications.some((notification) =>
                areEqual(action.payload, notification)))
                state.notifications = [...state.notifications, action.payload]
        },

        /** Set calibration mode to true, and the calibration ID with its parameter, 
         * all the measurement received in this mode will be added as calibration measurements
         */
        deleteNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications = state.notifications.filter((notification) =>
                areEqual(action.payload, notification)
            )

        },

   
    }
})
// Action creators are generated for each case reducer function, IDK what I tryed to say
export const {
    deleteNotification,
    addNotification
} = notificationSlice.actions

export default notificationSlice.reducer

