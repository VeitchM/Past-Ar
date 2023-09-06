import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//========Types========================================
import { Filter } from './types';

//===== Could be moved to types.ts ========================
interface FilterState extends Filter {

}
//=========================================================

const initialState: FilterState = {
    enabled: false, from: (new Date()).getTime(), until: (new Date()).getTime(),
    from_stats: (new Date()).getTime(), until_stats: (new Date()).getTime()
}

//================Slice================================

interface PayloadType {
    enabled: boolean,
    from?: number,
    until?: number,
    paddockId?: number,
    from_stats?: number,
    until_stats?: number,
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        updateFilter: (state, action: PayloadAction<PayloadType>) => {
            state.enabled = action.payload.enabled;
            if (action.payload.from && action.payload.until) {
                state.from = action.payload.from;
                state.until = action.payload.until;
            }
            else if (action.payload.from_stats && action.payload.until_stats){
                state.from_stats = action.payload.from_stats;
                state.until_stats = action.payload.until_stats;
            }
            if (action.payload.paddockId) state.paddockId = action.payload.paddockId;
        }
    }
})

export const {
    updateFilter
} = filterSlice.actions

export default filterSlice.reducer
