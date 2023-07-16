import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//========Types========================================
import { Filter } from './types';

//===== Could be moved to types.ts ========================
interface FilterState extends Filter {
    
}
//=========================================================

const initialState: FilterState = {
    enabled: false, from: (new Date()).getTime(), until: (new Date()).getTime()
}

//================Slice================================

interface PayloadType {
    enabled: boolean,
    from: number,
    until: number
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        updateFilter: (state, action: PayloadAction<PayloadType>) => {
            state.enabled = action.payload.enabled;
            state.from = action.payload.from;
            state.until = action.payload.until;
        }
    }
})

export const {
    updateFilter
} = filterSlice.actions

export default filterSlice.reducer
