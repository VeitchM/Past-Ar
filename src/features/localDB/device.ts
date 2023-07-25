import { DeviceSerializable } from "../store/types";
import { execQuery } from "./localDB";


export async function persistDevice(device: DeviceSerializable) {

    return execQuery(`
    INSERT OR REPLACE INTO devices (id, name, alias, placeWidth)
VALUES (?,?,?,?);    
    `, [device.id, device.name, device.alias, device])
}

export async function getPersistedDevice(id: string) : Promise<DeviceSerializable|undefined>{
    return execQuery(`
    SELECT * FROM devices 
    WHERE ?=devices.id);    
    `, [id]).then(result=>{
        const device :DeviceSerializable | undefined= result.rows._array[0]
        return device
    
    }
        )
}
