import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from 'react-native-ble-plx'



//========Types========================================

//===== Could be moved to types.ts ========================


export type TokensResponse = {
  access_token: string,
  expires_in: number,
  /** Seconds */
  refresh_expires_in: number,
  /** Seconds */
  refresh_token: string
}

export type Tokens = {
  refreshToken?: string
  accessToken?: string,
  /** JS date timestamp */
  expirationTimestamp?: number,
  /** JS date timestamp */
  refreshExpirationTimestamp?: number
}

export type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  roles: string[]
  groupUid: string
}

interface BackendState {
  tokens?: Tokens,
  user?: User
  signIn:boolean


  //TODO Separate in measurment slice, and ble slice, manage database from redux
  //Create redux folder and put all the slices there, add to measurement a receiving calibration variable that change on focus, and if true insert CalibrationMeasure

}


//=========================================================

const initialState: BackendState = {
  signIn:false


}


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

    setSignIn: (state, action: PayloadAction<boolean>) => {
      state.signIn = action.payload
    },

    /** Sets the tokens */
    setTokens: (state, action: PayloadAction<Tokens>) => {
      state.tokens= action.payload
     
    },


  }
})

export const { setTokens, setUser,setSignIn } = backedSlice.actions

export default backedSlice.reducer
