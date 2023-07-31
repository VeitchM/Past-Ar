import { getPersistedDevices } from "../localDB/device"
import { DeviceSerializable } from "../store/types"

import {hardware as PASTUROMETER_PROPERTIES} from '../../../config.json'

let persistedDevices : DeviceSerializable[] = []

export async function updatePersistedDevices(){
  persistedDevices= await getPersistedDevices()
  console.log({persistedDevices});
  
}

/** Gets the persisted device if it exists in the local db, if it doesn't it returns a device object with the given parameters and default properties */
export function getDeviceIfExists(id:string,name:string|null){
  return persistedDevices.find(device=>device.id==id) || { id, name,plateWidth:PASTUROMETER_PROPERTIES.DEFAULT_PLATE_WIDTH,alias:name }
  
}