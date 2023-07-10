// Name could be changed

import base64 from "react-native-base64";
import { getLocation } from "../location/location";

//==== Types ====================
import { Measurement } from "../store/types";
import { BleError, BleErrorCode, Characteristic } from "react-native-ble-plx";

//==== Store =============================
import store from "../store/store";
import { setBattery } from "../store/bleSlice"
import { setCalibrationMeasurementID, setLastMeasurement } from "../store/measurementSlice"
import { insertCalibrationMeasurement, insertMeasurement } from "../localDB/measurements";


//==== LocalDB =================================================





// On updates ==============================================================================================


const onCharacteristicUpdate = async (error: BleError | null, characteristic: Characteristic | null) => {
    try {

        if ((!characteristicError(error, characteristic)) && characteristic?.value) {
            const rawData = base64.decode(characteristic.value);

            const { battery, measurement } = await rawDataToMeasurement(rawData)
            console.log('Main Characteristic', measurement);

            store.dispatch(setLastMeasurement(measurement))
            store.dispatch(setBattery(battery));

            const measurementID = await insertMeasurement(measurement) //TODO call bleSlice and measurementSlice
            // getMeasurements()

            if (store.getState().measurement.calibrationMode) {

                const calibrationID = store.getState().measurement.calibrationID
                console.log({ calibrationID, measurementID });

                const id = await insertCalibrationMeasurement(calibrationID, measurementID)
                console.log('Id obteined',id);
                
                store.dispatch(setCalibrationMeasurementID(id))
                
                // TODO verify code
            }


        }
    }
    catch (error) {
        console.log(error);

    }
}


// We received a string with values separated by ;
//With this format pasturometro-00e5;20221206123456;null;23;22.0000;68.0000;4;44.6500;46.0600;46.0600;47.4700
//the filds are: 
//ID, timeStamp, GPS(currently null), batery,temperature, humity, sensorsQuantity, and N measures(one by sensor)
const stringFields = { DEVICE_ID: 0, BATERY: 3, SENSORS_QUANTITY: 7, MEASUREMENTS: 8 }

async function rawDataToMeasurement(value: string): Promise<{ battery: number, measurement: Measurement }> {
    //TODO catch if i received empty
    const values = value.split(';')
    console.log('Received values',values);
    
    const measurementsQuantity = parseFloat(values[stringFields.SENSORS_QUANTITY])
    console.log('Recieved: ', value);

    const measurements = values.slice(
        stringFields.MEASUREMENTS-1,
        stringFields.MEASUREMENTS + measurementsQuantity
    ).map((measurement) => parseFloat(measurement))


    const measurementValue = verifyMeasurements(measurements)


    const battery = parseFloat(values[stringFields.BATERY])

    const location = await getLocation()
    const measurement: Measurement = {
        height: measurementValue,
        timestamp: Date.now(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    }

    return { battery: battery, measurement: measurement }

}

const verifyMeasurements = (measurements: number[]) => {
    let sum = 0
    let validNumbers = 0
    console.log('Measurements: ',measurements);
    //TODO sensor
    measurements.forEach((number) => {
        //TODO validation of each sensor if()
        sum += number
        validNumbers++
    })
    return validNumbers != 0 ? sum / validNumbers : 0
}


//===================== Utils =============================================================
const characteristicError = (error: BleError | null, characteristic: any) => {
    error && console.error("Characteristic", error, error.errorCode);
    if (error?.errorCode == BleErrorCode.DeviceDisconnected) {
        console.log('It was disconnected');
        // I think that this is enough, the real disconnection is already handled by ble
        //store.dispatch(setConnectedDevice(null))
        // https://github.com/dotintent/react-native-ble-plx/blob/master/src/BleError.js
    }

    return error || !characteristic?.value
}


export { onCharacteristicUpdate }