import { useCallback } from "react";
import { getCalibrations, getCalibrationsFromMeasurement } from "../features/localDB/localDB";
import { CalibrationLocalDB } from "../features/localDB/types";


// TODO I dont think it is okay from the conceptual part of being a hook, for now it's not used,
// should be used on list screens and home
export const useSetCalibrations = (setCalibrations : ( x : CalibrationLocalDB[]) =>void)=>{
    return useCallback(() => {
    getCalibrationsFromMeasurement().then((calibrations) => {
        console.log('Calibrations from Measurement', calibrations);
    })
    getCalibrations().then((calibrations) => {
        console.log('Calibrations from Screen', calibrations);
        setCalibrations(calibrations)

    })

    //TODO add to setCalibrations

}, [])
}