import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from 'react-native-ble-plx'



//========Types========================================
import { MainCharacteristic, ErrorBleState, DeviceSerializable } from "./types";
import { RootState } from '../../store';


//===== Could be moved to types.ts ========================
interface BLEState {

  //Connection state
  bleState: string
  allDevices: DeviceSerializable[]
  connectedDevice: DeviceSerializable | null,
  connectionState: 'disconnected' | 'reconnecting' | 'connected'
  permissionsGranted: boolean,





  mainCharacteristic: MainCharacteristic,


  error: ErrorBleState,
}
//=========================================================

const initialState: BLEState = {
  bleState: 'unknown', //TODO verify
  allDevices: [],
  connectedDevice: null,
  connectionState: 'disconnected',
  permissionsGranted: false,

  mainCharacteristic: {
    measurementValue: -1,
    timeStamp: '',
    battery: -1,
    deviceID: ''

  },

  error: {}
}


//================Slice================================

export const bleSlice = createSlice({
  name: 'ble',
  initialState,
  reducers: {

    // ======================== Just setters ===================================
    setMainCharacteristic: (state: RootState, action: PayloadAction<MainCharacteristic>) => {
      state.mainCharacteristic = action.payload
    },


    setError: (state: RootState, action: PayloadAction<ErrorBleState>) => {
      state.error = action.payload
    },
    /** set a device id and name as the connected device, if it is set to null it will set connectionState to disconnected otherwise to connected */
    setConnectedDevice: (state: RootState, action: PayloadAction<Device>) => {
      state.connectedDevice = action.payload
      if (action.payload)
        state.connectionState = 'connected'
      else
        state.connectionState = 'disconnected'
    },

    //============================ Others===========================================

    /** Used when the connection is lost and the phone still is retrying to reconnect */
    setTryingToConnect: (state: RootState) => {
      state.connectionState = 'connecting'
    },


    addDevice: (state: RootState, action: PayloadAction<Device>) => {
      if (!isDuplicteDevice(state.allDevices, action.payload)) {
        console.log(action.payload.id, action.payload.name);

        state.allDevices = [...state.allDevices, action.payload] // Not sure if this is the way
      }
      //TODO we should have code for deleting devices from the list
      // when they havent been seen for a log time, we could implement 
      // kind of 'time to leave' for each device.
      // In this section we should set the time to leave
      // Or just think that the user will no stay long enough looking for devices
      // I found the devices in less than 4 seconds in my phone
    },
    resetDevices: (state: RootState) => { //TODO Improve name
      state.allDevices = []
    },
  }
})

// Action creators are generated for each case reducer function, IDK what I tryed to say
export const { setMainCharacteristic,
  setError, addDevice, resetDevices, setConnectedDevice, setTryingToConnect } = bleSlice.actions

export default bleSlice.reducer

//================ Utils =============================
const isDuplicteDevice = (devices: Device[], nextDevice: Device) => devices.findIndex((device) => nextDevice.id === device.id) > -1;
