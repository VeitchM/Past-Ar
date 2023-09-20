import { setLastSync } from "../store/backendSlice";
import store from "../store/store";
import { pushNotification } from "../pushNotification";
import { synchronizeCalibrations } from "./calibrations";
import { synchronizeMeasurements } from "./measurements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { synchronizePaddocks } from "./paddocks";


export const SYNCHRONIZE_INTERVAL = 1000 * 60 * 10

export async function synchronize(foreground?: boolean) {

    const [measurementResult,calibrationsResult,paddockResult] = await Promise.all([
        // measurementResult, calibrationsResult
        synchronizeMeasurements(foreground),
        synchronizeCalibrations(foreground),
        synchronizePaddocks(foreground)
    ])

    if (calibrationsResult || paddockResult || measurementResult) {
        updateLastSyncronization()
    }
    //TODO persist last syncronization timestamp
}


function updateLastSyncronization() {
    const now = Date.now();
    store.dispatch(setLastSync(now))
    AsyncStorage.setItem('lastSync', now.toString())
        .catch((e) => console.error('Set item lastSync', e))
}
