type MainCharacteristic = {
    height: number,
    timeStamp: number,
    battery: number,
    deviceID: string
}

type Measurement = {
    height: number,
    timestamp: number,
    latitude: number,
    longitude: number,

}

type ErrorBleState = {}

type DeviceSerializable = {
    id: string
    name: string | null
}

import { InterfaceAlertProps } from "native-base/lib/typescript/components/composites/Alert/types";


type Notification = {
    title: string,
    status: InterfaceAlertProps['status'],
    id:number
}


export { MainCharacteristic, ErrorBleState, DeviceSerializable, Measurement, Notification }