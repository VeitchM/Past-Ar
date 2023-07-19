import { SendStatus, setSending } from "../localDB/localDB";
import { getMeasurements, getMeasurementsForBack } from "../localDB/measurements";
import store from "../store/store";
import { pushNotification } from "../utils";
import { mobileAPI } from "./config";
import { MeasurementForBack } from "./types";
import { createPayload } from "./utils";



/** 
 * 
 * @param foreground If it is true it will push a notification if it succed or fails
 */
export async function synchronizeMeasurements(foreground?: boolean): Promise<boolean> {
    try {

        const measurements = await getMeasurementsForBack()
        console.log('Unsent measurements', JSON.stringify(measurements));

        if (measurements.length > 0) {
            const res = await postMeasurements(measurements)
            console.log(res);
            if (res.code)
                throw new Error(res)
            else {
                setSending(SendStatus.SENT, 'measurements')
                foreground && pushNotification("Se han sincronizado las mediciones", "success")

            }
        }
        return true

    }
    catch (e) {
        setSending(SendStatus.NOT_SENT, 'measurements')
        console.log(e)
        foreground && pushNotification("No se ha podido sincronizar las mediciones", "error")
        return false
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

            //logedIn(resObject)
        })
}