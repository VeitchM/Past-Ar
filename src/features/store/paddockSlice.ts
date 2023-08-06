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

interface PayloadUpdateType {
    paddockId: number
    data: Paddock,
    index?: number,
    error?: string
}
interface PayloadAddType {
    data: Paddock,
    index?: number,
    error?: string
}
interface PayloadDeleteType {
    paddockId: number
}

export const paddockSlice = createSlice({
    name: 'paddocks',
    initialState,
    reducers: {

        updatePaddock: (state, action: PayloadAction<PayloadUpdateType>) => {
            let pId = action.payload.paddockId;
            let temp = [...state.paddocks];
            if (pId >= 0 && temp[pId]) {
                temp[pId] = action.payload.data;
                state.paddocks = temp;
            }
            else {
                action.payload = { ...action.payload, error: 'PaddockId not found.' }
            }
        },
        addPaddock: (state, action: PayloadAction<PayloadAddType>) => {
            let temp = [...state.paddocks]; let id = (action.payload.data.ID || -1);
            if (!temp.some((_) => { return _.ID == action.payload.data.ID })) {
                temp = [...temp, action.payload.data];
                action.payload = { ...action.payload, index: state.paddocks.length }
                state.paddocks = temp;
            }
        },
        deletePaddock: (state, action: PayloadAction<PayloadDeleteType>) => {
            let temp = [...state.paddocks];
            state.paddocks = temp.filter((value, index) => { return index != action.payload.paddockId })
        },
        emptyPaddocks: (state) => {
            state.paddocks = []
        },
    }
})

export const {
    updatePaddock,
    addPaddock,
    deletePaddock,
    emptyPaddocks
} = paddockSlice.actions

export default paddockSlice.reducer
