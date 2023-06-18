import { SendStatus, getCalibrationsForBack, getMeasurements, setSending } from "../localDB/backend";
import { execQuery } from "../localDB/localDB";
import { tablesNames } from "../localDB/tablesDefinition";
import { Measurement } from "../store/types";
import { mobileAPI } from "./config";
import { CalibrationForBack, MeasurementForBack } from "./types";
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
            console.log('Refresh token from server', resObject);

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
            console.log('Refresh token from server', resObject);

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}


export async function synchronizeMeasurements() {
    try {

        const measurements = await getMeasurements()
        const res = await postMeasurements(measurements)
        console.log(res);

        //TODO verify response is okay
        if (res.code)
            setSending(false, 'measurements')

        else
            setSending(true, 'measurements')

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
        const res = new Array(calibrations.length)



        for (let index = 0; index < calibrations.length; index++) {

            //Al this would be okay to be a callback from for each
            const calibration = calibrations[index];
            try {

                res[index] = await postCalibration(calibration.forBackendData)
                if (res[index].code)
                    throw new Error(res[index])
                else
                    //Not the most performant code but the most simple being robust
                    await execQuery(`UPDATE ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS} SET sendStatus = ${SendStatus.SENT} WHERE ID = ${calibration.calibrationID}`)
            }
            catch (e) {
                console.log(e)
                await execQuery(`UPDATE ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS} SET sendStatus = ${SendStatus.NOT_SENT} WHERE ID = ${calibration.calibrationID}`)
            }

        }
        console.log(res);

        //TODO verify response is okay
        // setSending(false, 'calibrationsFromMeasurements')

    }
    catch (e) {
        setSending(false, 'calibrationsFromMeasurements')
        console.log(e)
    }
}

/** Post the given measurements and returns a promise with the parsed json response from the server */
async function postCalibration(calibration: CalibrationForBack) {
    return fetch(`${mobileAPI}/calibration`,
        createPayload('POST', { calibration }))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Response from Server on postMeasurement', resObject);
            return resObject

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}
