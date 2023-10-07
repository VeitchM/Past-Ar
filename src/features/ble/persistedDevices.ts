import { getPersistedDevices } from "../localDB/device"
import { DeviceSerializable } from "../store/types"

import { hardware as PASTUROMETER_PROPERTIES  } from '../../../config.json' 

let persistedDevices: DeviceSerializable[] = []

export async function updatePersistedDevices() {
  persistedDevices = await getPersistedDevices()
  console.log({ persistedDevices });

}

/** Gets the persisted device if it exists in the local db, if it doesn't it returns a device object with the given parameters and default properties */
export function getDeviceIfExists(id: string, name: string | null): DeviceSerializable {



  //EACH DEVICE MOST HAVE THE NAME FORMAT [BRAND]-[MODEL]-[ID]

  const model = name?.split('-')[1] || 'PROTOTYPE'
  const baseHeight: number = PASTUROMETER_PROPERTIES.MODELS[model]?.BASE_HEIGHT || PASTUROMETER_PROPERTIES.MODELS.PROTOTYPE?.BASE_HEIGHT

  return persistedDevices.find(device => device.id == id) || { id, name, baseHeight, alias: name, model }

}