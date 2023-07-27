import { getPersistedDevices } from "../localDB/device"
import { DeviceSerializable } from "../store/types"

const DEFAULT_PLATE_WIDTH = 1.8


let persistedDevices : DeviceSerializable[] = []

export async function updatePersistedDevices(){
  persistedDevices= await getPersistedDevices()
  console.log({persistedDevices});
  
}

export function getDeviceIfExists(id:string,name:string|null){
  return persistedDevices.find(device=>device.id==id) || { id, name,plateWidth:DEFAULT_PLATE_WIDTH,alias:name }
  
}