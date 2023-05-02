type MainCharacteristic={
    measurementValue: number,
    timeStamp: string,
    battery : number,
    deviceID: string
}


type ErrorBleState = {}

type DeviceSerializable = {
    id:string
    name: string | null
}
export {MainCharacteristic, ErrorBleState,DeviceSerializable}