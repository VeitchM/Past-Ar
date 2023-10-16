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
    filteredPaddock?: number,
    filteredSector?: number,
    from_stats?: number,
    until_stats?: number,
    shortcutFilterId?: string,
    shortcutMapId?: string
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
            else if (action.payload.from_stats && action.payload.until_stats) {
                state.from_stats = action.payload.from_stats;
                state.until_stats = action.payload.until_stats;
            }
            state.filteredPaddock = action.payload.filteredPaddock;
            state.filteredSector = action.payload.filteredSector;
            if (action.payload.shortcutFilterId != undefined) state.shortcutFilterId = action.payload.shortcutFilterId;
            if (action.payload.shortcutMapId != undefined) state.shortcutMapId = action.payload.shortcutMapId;
        }
    }
})

export const {
    updateFilter
} = filterSlice.actions

export default filterSlice.reducer
