import { getCalibrationsForBack, getCalibrationsFromBackInLocalDB, insertCalibrationFromFunctionFromServer, updateCalibrationFunction, updateToCalibrationFunctionFromServer } from "../localDB/calibrations";
import { SendStatus, setSendStatus, setSending } from "../localDB/localDB";
import { TablesNames } from "../localDB/tablesDefinition";
import { pushNotification } from "../utils";
import { mobileAPI } from "./config";
import { CalibrationForBack, CalibrationFromBack } from "./types";
import { createPayload } from "./utils";




/** Post the given measurements and returns a promise with the parsed json response from the server */
export async function postCalibration(calibration: CalibrationForBack) {
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
/** It gets calibrations from the backend */
export async function getCalibrationsFromBack(calibrationUID?: string) {

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



export async function updateLocalCalibrations(calibrationsFromBack: CalibrationFromBack[]) {
    try {
        const calibrationsFromBackInLocalDB = await getCalibrationsFromBackInLocalDB()

        calibrationsFromBack.forEach((calibration) => {
            const calibrationFound = calibrationsFromBackInLocalDB.find((item) => {

                console.log('Looking for calibration', { calibration, item });

                return calibration.uid === item.uid
            })
            console.log('Update local calibrations ', calibration);

            if (calibrationFound) {
                console.log('Update local calibration ', calibrationFound);
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


export async function synchronizeCalibrations(foreground?: boolean){
    try {

        const calibrations = await getCalibrationsForBack()
        console.log('Calibrations in localdb ', calibrations);
        calibrations.forEach(async (calibration) => {
            //Al this would be okay to be a callback from for each

            console.log('Calibrations synchronize', calibrations);

            try {


                const res = await postCalibration(calibration.forBackendData)
                console.log(res);
                if ('code' in res)
                    throw new Error('Error on Server Response: ' + res)
                else {

                    console.log('Sent without problems ', res);
                    // TODO Delete local measurement Calibration
                    // get new calibration from measurment from server
                    'data' in res && await updateToCalibrationFunctionFromServer(calibration.calibrationID, res.data)
                    // const response = await getCalibrationsFromBack(res.data)
                    console.log('Response from server after sending calibration', JSON.stringify(res));
                    // console.log('Response from server get calibration UID', response);
                    //Not the most performant code but the most simple being robust
                    // await execQuery(`UPDATE ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS} SET sendStatus = ${SendStatus.SENT} WHERE ID = ${calibration.calibrationID}`)
                }

            }
            catch (e) {
                console.error(e)
                await setSendStatus(SendStatus.FOR_SENDING, TablesNames.CALIBRATIONS_FROM_MEASUREMENTS, calibration.calibrationID)
            }
        })
        const responseAllCalibrations = await getCalibrationsFromBack()
        if ('data' in responseAllCalibrations){
            updateLocalCalibrations(responseAllCalibrations.data.content)
            pushNotification('Calibraciones sincronizadas','success')

        }
        console.log('Response from server get calibration all', JSON.stringify(responseAllCalibrations));
    }
    catch (e) {
        setSending(false, TablesNames.CALIBRATIONS_FROM_MEASUREMENTS)
        console.error(e)
    }
}
