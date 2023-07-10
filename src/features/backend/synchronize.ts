import { SendStatus, getMeasurements, setSendStatus, setSending } from "../localDB/backend";
import { getCalibrationsForBack, getCalibrationsFromBackInLocalDB, updateCalibrationFunction, updateToCalibrationFunctionFromServer } from "../localDB/calibrations";
import { execQuery, insertCalibrationFromFunction, insertCalibrationFromFunctionFromServer } from "../localDB/localDB";
import { tablesNames } from "../localDB/tablesDefinition";
import { Measurement } from "../store/types";
import { getCalibrationsFromBack, postCalibration, updateLocalCalibrations } from "./calibrations";
import { mobileAPI } from "./config";
import { CalibrationForBack, CalibrationFromBack, MeasurementForBack } from "./types";
import { createPayload } from "./utils";





export function getPadocks() {
    /** The api is made to do a paginated request 
     * 
     *	Example:
     *  http://localhost:4000/api/v1/calibrations/?pageNumber=0&pageSize=5 
     */
    fetch(`${mobileAPI}/paddocks`,
        createPayload('GET'))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Paddocks from server', resObject);

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}


/**
 * 
 * @param paddock 
 * @TODO set paddock type
 */
function postPadock(paddock: any) {
    fetch(`${mobileAPI}/paddocks`,
        createPayload('POST', paddock))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Res from server post paddock', resObject);

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}


export async function synchronizeMeasurements() {
    try {

        const measurements = await getMeasurements()
        console.log('Unsent measurements',JSON.stringify(measurements));
        
        if (measurements.length > 0) {

            const res = await postMeasurements(measurements)
            console.log(res);

            if (res.code)
                setSending(false, 'measurements')

            else
                setSending(true, 'measurements')
        }

    }
    catch (e) {
        setSending(false, 'measurements')
        console.log(e)
    }
}

/** Post the given measurements and returns a promise with the parsed json response from the server */
async function postMeasurements(measurements: MeasurementForBack[]) {
    return fetch(`${mobileAPI}/measurements`,
        createPayload('POST', { measurements }))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Response from Server on postMeasurement', resObject);
            return resObject

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}



export async function synchronizeCalibrations() {
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
                    const response = await getCalibrationsFromBack(res.data)
                    console.log('Response from server after sending calibration', JSON.stringify(res));
                    console.log('Response from server get calibration UID', response);





                    //Not the most performant code but the most simple being robust
                    // await execQuery(`UPDATE ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS} SET sendStatus = ${SendStatus.SENT} WHERE ID = ${calibration.calibrationID}`)
                }

            }
            catch (e) {
                console.error(e)
                await setSendStatus(SendStatus.FOR_SENDING, tablesNames.CALIBRATIONS_FROM_MEASUREMENTS, calibration.calibrationID)
            }
        })
        const responseAllCalibrations = await getCalibrationsFromBack()
        if ('data' in responseAllCalibrations)
            updateLocalCalibrations(responseAllCalibrations.data.content)
        console.log('Response from server get calibration all', JSON.stringify(responseAllCalibrations));
    }
    catch (e) {
        setSending(false, tablesNames.CALIBRATIONS_FROM_MEASUREMENTS)
        console.error(e)
    }
}