import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from 'react-native-ble-plx'



//========Types========================================
import { Measurement } from './types';

//===== Could be moved to types.ts ========================
interface MeasurementState {


  lastMeasurement: Measurement,
  /** boolean which is true if the app is in calibration mode */
  calibrationMode: boolean,
  /** ID of the used calibration */
  calibrationID: number,
  /** ID of the last calibrationMeasurement */
  calibrationMeasurementID:number|null,

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
  calibrationID:-1,
  calibrationMeasurementID:null
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

    /** Set calibration mode to true, and the calibration ID with its parameter, 
     * all the measurement received in this mode will be added as calibration measurements
     */
    setCalibrationModeOn: (state,action: PayloadAction<number>) => {
      state.calibrationMode = true
      state.calibrationID=action.payload
      console.log('setCalibration Mode on',action.payload);
      
    },

    setCalibrationModeOff: (state) => {
      state.calibrationMode = false
      state.calibrationMeasurementID = null
    },

    setCalibrationMeasurementID: (state,action: PayloadAction<number|null>)=>{
      state.calibrationMeasurementID = action.payload
    }

  }
})
// Action creators are generated for each case reducer function, IDK what I tryed to say
export const {
  setLastMeasurement,
  setCalibrationModeOn, setCalibrationModeOff,
setCalibrationMeasurementID } = measurementSlice.actions

export default measurementSlice.reducer

