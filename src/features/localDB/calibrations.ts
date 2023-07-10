import { CalibrationForBack } from "../backend/types";
import { SendStatus, measurementToBackendFormat } from "./backend";
import { execTransaction } from "./localDB";
import { tablesNames } from "./tablesDefinition";
import { calibrationsFromFunctionFromBackend } from "./types";

/**It gets a vector with all the calibrations and its measurements that are ready for being sent*/
export async function getCalibrationsForBack(): Promise<{ calibrationID: number, forBackendData: CalibrationForBack }[]> {


    const calibrationsIDs = (await execTransaction([`
    SELECT ${tablesNames.CALIBRATIONS}.* 
    FROM ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS}
    JOIN ${tablesNames.CALIBRATIONS} ON ${tablesNames.CALIBRATIONS}.ID = ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS}.ID
    WHERE sendStatus = ${SendStatus.FOR_SENDING}`,

    `UPDATE ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS} SET sendStatus = ${SendStatus.SENDING} WHERE sendStatus = ${SendStatus.FOR_SENDING}`
    ]))[0].rows._array

    console.log('CalibrationsIDs', calibrationsIDs);


    const queries = calibrationsIDs.map((row) => `
    SELECT ${tablesNames.MEASUREMENTS}.* 
    FROM ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS} 
    JOIN ${tablesNames.CALIBRATIONS_MEASUREMENTS} ON ${tablesNames.CALIBRATIONS_MEASUREMENTS}.calibrationID = ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS}.ID
    JOIN ${tablesNames.MEASUREMENTS} ON ${tablesNames.CALIBRATIONS_MEASUREMENTS}.ID = ${tablesNames.MEASUREMENTS}.ID
    WHERE ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS}.ID = ${row.ID}
    `)




    return execTransaction(queries).then((results) => {
        return results.map((result, index) => {
            return {
                calibrationID: calibrationsIDs[index].ID as number,
                forBackendData: {

                    name: calibrationsIDs[index].name as string,
                    measurements: result.rows._array.map(row => {
                        return {
                            id: row.ID.toString() as string,
                            measurement: measurementToBackendFormat(row)
                        }
                    })
                }
            }
        }
        )
    }
    )




}

/** It convert a calibration from measurement to a a from function from server */
export async function updateToCalibrationFunctionFromServer(calibrationID: number, backendCalibrationID: string) {
    const timestamp = new Date().valueOf()
    console.log({calibrationID,backendCalibrationID});
    
    return execTransaction([
        `DELETE FROM ${tablesNames.CALIBRATIONS_FROM_MEASUREMENTS} WHERE ID = ?`,
        `INSERT INTO ${tablesNames.CALIBRATIONS_FROM_FUNCTIONS} (ID) VALUES (?)`,
        `INSERT INTO ${tablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER} (ID,updateTimestamp,uid) VALUES (?,?,?)`
    ], [
        [calibrationID],
        [calibrationID],
        [calibrationID,timestamp,backendCalibrationID]])


}

/** It gets the rows from the local db which comes from the server */
export async function getCalibrationsFromBackInLocalDB(){
    return execTransaction([
        `SELECT * FROM ${tablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER}`
    ]).then((result)=>result[0].rows._array as calibrationsFromFunctionFromBackend[])

}


export async function updateCalibrationFunction(id: number, curve: string){
    return execTransaction([
        `UPDATE ${tablesNames.CALIBRATIONS} SET function = ?  WHERE ID = ?`
    ],[[curve,id]]).then((result)=>result[0].rows._array as calibrationsFromFunctionFromBackend[])
  
}