import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//========Types========================================
import { Filter } from './types';

//===== Could be moved to types.ts ========================
interface FilterState extends Filter {

}
//=========================================================

const initialState: FilterState = {
    enabled: false, from: getYesterdayDate().getTime(), until: getTomorrowDate().getTime(),
    from_stats: getYesterdayDate().getTime(), until_stats: getTomorrowDate().getTime(),
    updateCalibrations: false, updateMeasures: false
}

function getYesterdayDate(){
    let date = new Date();
    date.setDate(date.getDate()-1);
    return date;
}

function getTomorrowDate(){
    let date = new Date();
    date.setDate(date.getDate()+1);
    return date;
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
    shortcutMapId?: string,
    updateCalibrations?: boolean,
    updateMeasures?: boolean
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
        },
        setUpdateCalibration: (state, action: PayloadAction<{update:boolean}>)=>{
            if (action.payload.update != undefined) state.updateCalibrations = action.payload.update;
        },
        setUpdateMeasures: (state, action: PayloadAction<{update:boolean}>)=>{
            if (action.payload.update != undefined) state.updateMeasures = action.payload.update;
        }
    }
})

export const {
    updateFilter,setUpdateCalibration,setUpdateMeasures
} = filterSlice.actions

export default filterSlice.reducer
