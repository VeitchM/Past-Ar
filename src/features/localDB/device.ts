import { DeviceSerializable } from "../store/types";
import { execQuery } from "./localDB";


export async function persistDevice(device: DeviceSerializable) {
    console.log('Persist device');
    
    return execQuery(`
    INSERT OR REPLACE INTO devices (id, name, alias,model)
VALUES (?,?,?,?);    
    `, [device.id, device.name, device.alias, device.model])
}

export async function getPersistedDevice(id: string): Promise<DeviceSerializable | undefined> {
    return execQuery(`
    SELECT * FROM devices 
    WHERE ?=devices.id);    
    `, [id]).then(result => {
        const device: DeviceSerializable | undefined = result.rows._array[0]
        return device

    }
    )
}


export async function getPersistedDevices(): Promise<DeviceSerializable[]> {
    return execQuery(`
    SELECT * FROM devices;    
    `).then(result => {
        const devices: DeviceSerializable[] = result.rows._array
        console.log({devices});
        
        return devices
    })
}