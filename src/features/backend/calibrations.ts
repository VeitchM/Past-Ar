import { getCalibrationsFromBackInLocalDB, updateCalibrationFunction } from "../localDB/calibrations";
import { insertCalibrationFromFunctionFromServer } from "../localDB/localDB";
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
                
                console.log('Looking for calibration',{calibration,item});
                
                return calibration.uid === item.uid})
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


