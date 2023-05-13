// Name could be changed

import base64 from "react-native-base64";


import { setMainCharacteristic } from "./bleSlice"

//==== Types ====================
import { BleError, BleErrorCode, Characteristic } from "react-native-ble-plx";
import { MainCharacteristic, Measurement } from "./types";


import store from "../../store";
import { disconnectFromDevice } from "./ble";
import { getMeasurements, insertMeasurement } from "../localDB/localDB";
// On updates ==============================================================================================





const onCharacteristicUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
    if ((!characteristicError(error, characteristic)) && characteristic?.value) {
        const rawData = base64.decode(characteristic.value);
      
        const {reduxCharacteristic,measurement} = rawDataToMainCharacteristic(rawData)
        console.log('Main Characteristic', reduxCharacteristic);
        
        
        store.dispatch(setMainCharacteristic(reduxCharacteristic));
        insertMeasurement(measurement)
        getMeasurements()
    }
}


// We received a string with values separated by ;
//With this format pasturometro-00e5;20221206123456;null;23;22.0000;68.0000;4;44.6500;46.0600;46.0600;47.4700
//the filds are: 
//ID, timeStamp, GPS(currently null), batery, humity, sensorsQuantity, and N measures(one by sensor)
const stringFields = { DEVICE_ID: 0, BATERY: 3, SENSORS_QUANTITY: 6, MEASUREMENTS: 7 }

const rawDataToMainCharacteristic = (value: string): {reduxCharacteristic:MainCharacteristic,measurement:Measurement}  => {
    

    const values = value.split(';')
    const measurementsQuantity = parseFloat(values[stringFields.SENSORS_QUANTITY])
    console.log('Recieved: ',value);
    
    const measurements = values.slice(
        stringFields.MEASUREMENTS,
        stringFields.MEASUREMENTS + measurementsQuantity
    ).map((measurement) => parseFloat(measurement))

    
    const measurementValue =  verifyMeasurements(measurements)

    const reduxCharacteristic: MainCharacteristic ={
        deviceID : values[stringFields.DEVICE_ID],
        height:measurementValue,
        timeStamp: new Date().toISOString(),
        battery: parseFloat(values[stringFields.BATERY])
    }

    const measurement:Measurement = {
        height:measurementValue,
        timestamp:reduxCharacteristic.timeStamp,
        coordinates: 'Placeholder TODO'
    }

    return {reduxCharacteristic: reduxCharacteristic, measurement:measurement}

}

const verifyMeasurements = (measurements: number[]) => {
    let sum = 0
    let validNumbers = 0
    measurements.forEach((number) => {
        //TODO verification if()
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