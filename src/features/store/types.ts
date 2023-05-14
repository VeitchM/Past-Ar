type MainCharacteristic={
    height: number,
    timeStamp: number,
    battery : number,
    deviceID: string
}

type Measurement = {
    height: number,
    timestamp:number,
    latitude: number,
    longitude:number,

}

type ErrorBleState = {}

type DeviceSerializable = {
    id:string
    name: string | null
}
export {MainCharacteristic, ErrorBleState,DeviceSerializable,Measurement}