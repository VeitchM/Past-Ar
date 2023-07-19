import { setLastSync } from "../store/backendSlice";
import store from "../store/store";
import { pushNotification } from "../utils";
import { synchronizeCalibrations } from "./calibrations";
import { synchronizeMeasurements } from "./measurements";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const SYNCRHOIZE_INTERVAL = 1000 * 60 * 10

export async function synchronize(foreground?: boolean) {

    const [measurementResult, calibrationsResult] = await Promise.all([
        synchronizeMeasurements(foreground),
        synchronizeCalibrations(foreground),
    ])

    if (measurementResult && calibrationsResult) {
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
