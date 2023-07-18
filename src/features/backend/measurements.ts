import { setSending } from "../localDB/localDB";
import { getMeasurements, getMeasurementsForBack } from "../localDB/measurements";
import store from "../store/store";
import { pushNotification } from "../utils";
import { mobileAPI } from "./config";
import { MeasurementForBack } from "./types";
import { createPayload } from "./utils";

export async function synchronizeMeasurements() {
    try {

        const measurements = await getMeasurementsForBack()
        console.log('Unsent measurements',JSON.stringify(measurements));
        
        if (measurements.length > 0) {

            const res = await postMeasurements(measurements)
            console.log(res);

            if (res.code)
                setSending(false, 'measurements')

            else
                setSending(true, 'measurements')
                pushNotification('Mediciones cargadas a la nube','success')
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

            //logedIn(resObject)
        })
}