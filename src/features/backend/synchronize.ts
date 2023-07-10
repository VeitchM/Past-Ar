import { synchronizeCalibrations } from "./calibrations";
import { synchronizeMeasurements } from "./measurements";




export function synchronize(){
    synchronizeMeasurements();
    synchronizeCalibrations();
}