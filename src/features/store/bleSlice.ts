import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from 'react-native-ble-plx'



//========Types========================================
import {  ErrorBleState, DeviceSerializable } from "./types";

//===== Could be moved to types.ts ========================
interface BLEState {

  //Connection state
  bleState: string
  allDevices: DeviceSerializable[]
  connectedDevice: DeviceSerializable | null,
  connectionState: 'disconnected' | 'connecting' | 'connected'
  permissionsGranted: boolean,

  battery: number

  //TODO Separate in measurment slice, and ble slice, manage database from redux
  //Create redux folder and put all the slices there, add to measurement a receiving calibration variable that change on focus, and if true insert CalibrationMeasure


  error: ErrorBleState,
}
//=========================================================

const initialState: BLEState = {
  bleState: 'unknown', //TODO verify
  allDevices: [],
  connectedDevice: null,
  connectionState: 'disconnected',
  permissionsGranted: false,

  battery: -1,

  error: {}
}


//================Slice================================

export const bleSlice = createSlice({
  name: 'ble',
  initialState,
  reducers: {

    // ======================== Just setters ===================================

    /** Set a device id and name as the connected device, set connection state to connected */
    setConnectedDevice: (state, action: PayloadAction<DeviceSerializable>) => {
      state.connectedDevice = action.payload
      state.connectionState = 'connected'
    },

    /** set connection state to connecting */
    setTryingToConnect: (state) => {
      state.connectionState = 'connecting'
    },

    /** set connection state to disconnected */
    setDisconnected: (state) => {
      state.connectionState = 'disconnected'
    },

    /** set battery */
    setBattery: (state, action: PayloadAction<number>) => {
      if (action.payload)
        state.battery = action.payload
    },


    setError: (state, action: PayloadAction<ErrorBleState>) => {
      state.error = action.payload
    },

    //============================ Others===========================================

    /** Add device to all devices if it isn't repeated, if it is, does nothing */
    addDevice: (state, action: PayloadAction<DeviceSerializable>) => {
      if (!isDuplicteDevice(state.allDevices, action.payload)) {
        console.log('Added device to list', action.payload.id, action.payload.name);

        state.allDevices = [...state.allDevices, action.payload] // Not sure if this is the way
      }
    },

    /** Reset all devices to an empty list */
    resetDevices: (state) => { //TODO Improve name
      state.allDevices = []
    },
  }
})

// Action creators are generated for each case reducer function, IDK what I tryed to say
export const { setBattery,
  setError, addDevice, resetDevices, setDisconnected, setConnectedDevice, setTryingToConnect } = bleSlice.actions

export default bleSlice.reducer

//================ Utils =============================
const isDuplicteDevice = (devices: DeviceSerializable[], nextDevice: DeviceSerializable) => devices.findIndex((device) => nextDevice.id === device.id) > -1;
