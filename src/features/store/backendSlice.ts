import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from 'react-native-ble-plx'



//========Types========================================

//===== Could be moved to types.ts ========================

type Tokens = {
  refreshToken?: string
  accessToken?: string,
  expiresIn?: number,
  refreshExpiresIn?: number
}

type User = {
  uid: string,
  name: string,
  email: string,
  roles: string[]
  groupUid: string
}

interface BackendState {
  tokens?: Tokens,
  user?: User


  //TODO Separate in measurment slice, and ble slice, manage database from redux
  //Create redux folder and put all the slices there, add to measurement a receiving calibration variable that change on focus, and if true insert CalibrationMeasure

}
//=========================================================

const initialState: BackendState = {}


//================Slice================================

export const backedSlice = createSlice({
  name: 'backend',
  initialState,
  reducers: {

    // ======================== Just setters ===================================

    /** Sets the user */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },

    /** Sets the tokens */
    setTokens: (state, action: PayloadAction<Tokens>) => {
      state.tokens = action.payload
    },


  }
})

export const { setTokens, setUser } = backedSlice.actions

export default backedSlice.reducer
