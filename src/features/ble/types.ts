type MainCharacteristic={
    height: number,
    timeStamp: string,
    battery : number,
    deviceID: string
}

type Measurement = {
    height: number,
    timestamp:string,
    coordinates: string,

}

type ErrorBleState = {}

type DeviceSerializable = {
    id:string
    name: string | null
}
export {MainCharacteristic, ErrorBleState,DeviceSerializable,Measurement}