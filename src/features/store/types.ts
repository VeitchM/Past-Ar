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
    alias:string | null
    plateWidth: number | null

}

import { InterfaceAlertProps } from "native-base/lib/typescript/components/composites/Alert/types";


type Notification = {
    title: string,
    status: InterfaceAlertProps['status'],
}

type Paddock = {
    ID?: number, name: string, vertices: { latitude: number, longitude: number }[], 
    holes?:{ latitude: number, longitude: number }[][]
}

type Filter = {
    enabled: boolean,
    from: number,
    until: number,
    paddockId?:number
}

export { MainCharacteristic, ErrorBleState, DeviceSerializable, Measurement, Notification, Paddock, Filter }