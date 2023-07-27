import { getCalibrationsForBack, getCalibrationsFromBackInLocalDB, insertCalibrationFromFunctionFromServer, updateCalibrationFunction, updateToCalibrationFunctionFromServer } from "../localDB/calibrations";
import { SendStatus, setSendStatus, setSending } from "../localDB/localDB";
import { TablesNames } from "../localDB/tablesDefinition";
import { pushNotification } from "../utils";
import { mobileAPI } from "./config";
import Permission from "./permission";
import { CalibrationForBack, CalibrationFromBack } from "./types";
import { createPayload } from "./utils";

/**
 * @params foreground, if it is true it push a notification when succed
 * @returns true if it success false if it fails
 */
export async function synchronizeCalibrations(foreground?: boolean): Promise<boolean> {
    try {

        if (Permission.postCalibrations())
            await updateCalibrations(foreground)
        if (Permission.getCalibrations())
            await downloadCalibrations(foreground)
        return true
    }
    catch (e) {

        //It should not be necessary to setSending on error case
        //setSending(SendStatus.NOT_SENT, TablesNames.CALIBRATIONS_FROM_MEASUREMENTS)
        foreground && pushNotification('No se han podido sincronizar las calibraciones', 'error')
        console.error(e)
        return false
    }
}

async function updateCalibrations(foreground?: boolean) {
    const calibrations = await getCalibrationsForBack()
    const promises = calibrations.map(async (calibration) => {
        try {
            const res = await postCalibration(calibration.forBackendData)
            if ('code' in res)
                throw new Error('Error on Server Response: ' + res)
            else {

                //Maybe i should delete the row if it
                'data' in res && await updateToCalibrationFunctionFromServer(calibration.calibrationID, res.data)
            }
        }
        catch (e) {
            await setSendStatus(SendStatus.FOR_SENDING, TablesNames.CALIBRATIONS_FROM_MEASUREMENTS, calibration.calibrationID)
            throw new Error(`Error getting calibrations`)
        }
    })
    return Promise.all(promises)
}

async function downloadCalibrations(foreground?: boolean) {
    const responseAllCalibrations = await getCalibrationsFromBack()
    if ('data' in responseAllCalibrations) {
        updateLocalCalibrations(responseAllCalibrations.data.content)
        foreground && pushNotification('Calibraciones sincronizadas', 'success')
        return true
    }
    else {
        throw new Error(`Error sending calibration`)
    }
}


/** Post the given measurements and returns a promise with the parsed json response from the server */
async function postCalibration(calibration: CalibrationForBack) {
    return fetch(`${mobileAPI}/calibrations`,
        createPayload('POST', calibration))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Response from Server on postMeasurement', resObject);
            return resObject as { data: string, message: string } | { code: string }

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}



export async function updateLocalCalibrations(calibrationsFromBack: CalibrationFromBack[]) {
    try {
        const calibrationsFromBackInLocalDB = await getCalibrationsFromBackInLocalDB()
        calibrationsFromBack.forEach((calibration) => {
            const calibrationFound = calibrationsFromBackInLocalDB.find((item) => {
                // console.log('Looking for calibration', { calibration, item });
                return calibration.uid === item.uid
            })
            //console.log('Update local calibrations ', calibration);

            if (calibrationFound) {
                // console.log('Update local calibration ', calibrationFound);
                updateCalibrationFunction(calibrationFound.ID, calibration.curve?.toString())
            }
            else {
                insertCalibrationFromFunctionFromServer(calibration.name, calibration.curve?.toString(), calibration.uid)
            }
        })
    }
    catch (err) {
        console.error('Error on updateLocalCalibrations', err);
    }
}

/** It gets calibrations from the backend */
async function getCalibrationsFromBack(calibrationUID?: string) {

    //TODO make it paginated 
    //TODO  Verify what happens if i ask for an ID
    // const url = `${mobileAPI}/calibrations/${calibrationUID}`
    const url = `${mobileAPI}/calibrations${calibrationUID ? '/' + calibrationUID : ''}`

    console.log('URL donde se hizo el get', url);

    return fetch(url,
        createPayload('GET'))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Response from Server on get Calibration', resObject.toString());
            return resObject

        })
}