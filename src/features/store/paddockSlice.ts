import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//========Types========================================
import { Paddock } from './types';

//===== Could be moved to types.ts ========================
interface PaddockState {

    paddocks: Paddock[],

}
//=========================================================

const initialState: PaddockState = {
    paddocks: []
}


//================Slice================================

interface PayloadType {
    paddockId: number
    data: Paddock,
    extra?: Object
}

export const paddockSlice = createSlice({
    name: 'paddocks',
    initialState,
    reducers: {

        updatePaddock: (state, action: PayloadAction<PayloadType>) => {
            let pId = action.payload.paddockId;
            let temp = [...state.paddocks];
            if (pId < 0){
                pId = state.paddocks.length; 
            }
            temp[pId] = action.payload.data;
            state.paddocks = temp;
            action.payload.paddockId = pId;
            action.payload = { ...action.payload }
        },
        addPaddock: (state, action: PayloadAction<PayloadType>) => {
            let temp = [...state.paddocks];
            temp[0] = action.payload.data;

            state.paddocks = [...state.paddocks, action.payload.data]
            action.payload = { ...action.payload, extra: { index: state.paddocks.length - 1 } }
        },
        deletePaddock: (state, action: PayloadAction<Paddock>) => {

            console.log('---------------')
            console.log(action.payload)
            let temp = [...state.paddocks];
            temp[0] = action.payload;
            state.paddocks = temp;
            console.log('---------------')

        },
    }
})

export const {
    updatePaddock,
    addPaddock,
    deletePaddock
} = paddockSlice.actions

export default paddockSlice.reducer
