import { CalibrationForBack } from "../backend/types";
import { SendStatus, execQuery, execTransaction } from "./localDB";
import { measurementToBackendFormat } from "./measurements";
import { TablesNames } from "./tablesDefinition";
import { CalibrationLocalDBExtended, CalibrationsFromMeasurementsLocalDB, MeasurementLocalDB, calibrationsFromFunctionFromBackend } from "./types";

/**It gets a vector with all the calibrations and its measurements that are ready for being sent*/
export async function getCalibrationsForBack(): Promise<{ calibrationID: number, forBackendData: CalibrationForBack }[]> {


    const calibrationsIDs = (await execTransaction([`
    SELECT ${TablesNames.CALIBRATIONS}.* 
    FROM ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS}
    JOIN ${TablesNames.CALIBRATIONS} ON ${TablesNames.CALIBRATIONS}.ID = ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS}.ID
    WHERE sendStatus = ${SendStatus.FOR_SENDING}`,

    `UPDATE ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS} SET sendStatus = ${SendStatus.SENDING} WHERE sendStatus = ${SendStatus.FOR_SENDING}`
    ]))[0].rows._array

    console.log('CalibrationsIDs', calibrationsIDs);


    const queries = calibrationsIDs.map((row) => `
    SELECT ${TablesNames.MEASUREMENTS}.* 
    FROM ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS} 
    JOIN ${TablesNames.CALIBRATIONS_MEASUREMENTS} ON ${TablesNames.CALIBRATIONS_MEASUREMENTS}.calibrationID = ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS}.ID
    JOIN ${TablesNames.MEASUREMENTS} ON ${TablesNames.CALIBRATIONS_MEASUREMENTS}.ID = ${TablesNames.MEASUREMENTS}.ID
    WHERE ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS}.ID = ${row.ID}
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

/** It converts a calibration in the DB from one based on measurement to a one based on function that comes from the backend*/
export async function updateToCalibrationFunctionFromServer(calibrationID: number, backendCalibrationID: string) {
    const timestamp = new Date().valueOf()
    console.log({calibrationID,backendCalibrationID});
    
    return execTransaction([
        `DELETE FROM ${TablesNames.CALIBRATIONS_FROM_MEASUREMENTS} WHERE ID = ?`,
        `INSERT INTO ${TablesNames.CALIBRATIONS_FROM_FUNCTIONS} (ID) VALUES (?)`,
        `INSERT INTO ${TablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER} (ID,updateTimestamp,uid) VALUES (?,?,?)`
    ], [
        [calibrationID],
        [calibrationID],
        [calibrationID,timestamp,backendCalibrationID]])


}

/** It gets the rows from the local db which comes from the server */
export async function getCalibrationsFromBackInLocalDB(){
    return execTransaction([
        `SELECT * FROM ${TablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER}`
    ]).then((result)=>result[0].rows._array as calibrationsFromFunctionFromBackend[])

}


export async function updateCalibrationFunction(id: number, curve: string){
    return execTransaction([
        `UPDATE ${TablesNames.CALIBRATIONS} SET function = ?  WHERE ID = ?`
    ],[[curve,id]]).then((result)=>result[0].rows._array as calibrationsFromFunctionFromBackend[])
  
}



//============ INSERTS ==========================================================



/** Creates a calibration*/
async function insertCalibration(name: string, functionDefinition: string | null = null) {
    //TODO refactorize
    return execQuery(`INSERT INTO calibrations (name,function) values (?,?)`, [name, functionDefinition])
        .then((result) => result.insertId)

}

/** Creates a calibration from function*/
export async function insertCalibrationFromFunction(name: string, functionDefinition?: string) {
    const calibrationID = await insertCalibration(name, functionDefinition)
    if (calibrationID) {
        return await execQuery(`INSERT INTO calibrationsFromFunction (ID) values (?)`, [calibrationID])
            .then((result) => result.insertId as number) //It wont return undefined, in the case it doesnt insert an error will be thrown


    }
    else
        throw Error('Calibration ID ' + calibrationID)

}

export async function insertCalibrationFromFunctionFromServer(name: string, functionDefinition: string,uid:string){
  
        const id = await insertCalibrationFromFunction(name,functionDefinition)
        if (id) {
            return await execQuery(`INSERT INTO ${TablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER} (ID,UID) values (?,?)`, [id,uid])
                .then((result) => result.insertId as number) //It wont return undefined, in the case it doesnt insert an error will be thrown
        }
    
}


/** Creates the tables needed for a Calibration made from measurements */
export async function insertCalibrationFromMeasurements(name: string) {

    const calibrationID = await insertCalibration(name)
    if (calibrationID) {
        return await execQuery(`INSERT INTO calibrationsFromMeasurements (ID,sendStatus) values (?,?)`, [calibrationID, 0])
            .then((result) => result.insertId as number) //It wont return undefined, in the case it doesnt insert an error will be thrown


    }
    else
        throw Error('Calibration ID ' + calibrationID)

}


//=== GETTERS ======================================================


export async function calibrationExists(name: string) {
    return execQuery(`SELECT * FROM calibrations WHERE name = ?`, [name])
        .then((result) => result.rows.length > 0)
}



export async function getCalibrations() {
    return execQuery(
        `SELECT calibrations.*,
     (cfm.ID IS NOT NULL) AS fromMeasurement ,
     (cff.ID IS NOT NULL) AS fromFunction 
    FROM calibrations
    LEFT JOIN calibrationsFromMeasurements AS cfm ON cfm.ID = calibrations.ID
    LEFT JOIN calibrationsFromFunction AS cff ON cff.ID = calibrations.ID
     `
        , [])
        .then((result) => result.rows._array as CalibrationLocalDBExtended[])
}

/** Show the calibrations made from measurement with its name and function */
export async function getCalibrationsFromMeasurementExtended() {
    return execQuery(
        `SELECT t1.*,t2.sendStatus 
    FROM calibrations AS t1 
    INNER JOIN calibrationsFromMeasurements AS t2 
    ON t1.ID = t2.ID;`
        , [])
        .then((result) => result.rows._array as CalibrationsFromMeasurementsLocalDB[] )
}


//TODO make query with inner join that adds editable or not editable

//TODO IT is no an UID it's an id
/**  Returns the list of measurements taken for a Calibration made from measurments
 * 
*/
export async function getCalibrationsMeasurements(calibrationID: number) {
    return execQuery(`
    SELECT t2.* 
    FROM calibrationsMeasurements AS t1
    INNER JOIN measurements as t2 ON t1.ID = t2.ID
    WHERE  t1.calibrationID = ${calibrationID} `)
        .then(result => result.rows._array as Array<MeasurementLocalDB>)
}


//=== DELETE =================================================


export async function deleteCalibration(ID: number) {
    return execQuery(`DELETE FROM calibrations WHERE ID = ?`, [ID])

}
