import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from 'react-native-ble-plx'



//========Types========================================
import { Measurement } from './types';

//===== Could be moved to types.ts ========================
interface MeasurementState {


  lastMeasurement: Measurement,
  calibrationMode: boolean,
  calibrationID: string,

}
//=========================================================

const initialState: MeasurementState = {

  lastMeasurement: {
    height: -1,
    timestamp: -1,
    latitude: 0,
    longitude: 0,

  },

  calibrationMode: false,
  calibrationID:''
}


//================Slice================================

export const measurementSlice = createSlice({
  name: 'ble',
  initialState,
  reducers: {

    // ======================== Just setters ===================================
    setLastMeasurement: (state, action: PayloadAction<Measurement>) => {
      state.lastMeasurement = action.payload
    },

    /** Set calibration mode to true, and the calibration ID with its parameter */
    setCalibrationModeOn: (state,action: PayloadAction<string>) => {
      state.calibrationMode = true
      state.calibrationID=action.payload
      console.log('setCalibration Mode on',action.payload);
      
    },

    setCalibrationModeOff: (state) => {
      state.calibrationMode = false
    },

  }
})
// Action creators are generated for each case reducer function, IDK what I tryed to say
export const {
  setLastMeasurement,
  setCalibrationModeOn, setCalibrationModeOff } = measurementSlice.actions

export default measurementSlice.reducer

