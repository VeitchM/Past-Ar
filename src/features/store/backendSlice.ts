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
  timestamp?: number,
  /** JS date timestamp */
  expiresIn?: number,
  
  /** JS date timestamp */
  refreshExpiresIn?: number
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
  lastSync?: number



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

    /** Sets a timestamp with the last sync */
    setLastSync: (state, action: PayloadAction<number>) => {
      state.lastSync= action.payload
     
    },


  }
})

export const { setTokens, setUser,setSignIn, setLastSync } = backedSlice.actions

export default backedSlice.reducer
