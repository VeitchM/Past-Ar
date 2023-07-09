
import * as SQLite from 'expo-sqlite';

import { Measurement } from '../store/types'
import { TablesNames, CalibrationLocalDB, CalibrationLocalDBExtended, CalibrationsFromMeasurementsLocalDB, MeasurementLocalDB } from './types';
import { tablesNames } from './tablesDefinition';

const db = SQLite.openDatabase('pastar.db');



//We declare foreigns key, for that, we should import a pragma module 
//with a query
db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {
    createTables()
})


//Does it work?
db.exec([{ sql: 'SELECT load_extension("libspatialite.so")', args: [] }], false, (error) => {
    console.log(error);

});


// dropTables('calibrations')

//========= Create and Delete tables =============================================

function dropTables(tableName: TablesNames): void {
    execQuery(`DROP TABLE ${tableName};`, [])
}

function createTables() {
    execTransaction(createTableQueries)
}




//======== Query Wrapper ==========================================================

export async function execQuery(query: string, values: Array<any> = []) {
    return execTransaction([query], [values]).then((result) => result[0])
}

/** Executes a transaction with the given queries. Return an array */
export async function execTransaction(queries: string[], values: Array<any>[] = [[]]) {
    return new Promise<SQLite.SQLResultSet[]>((resolve, reject) => {
        let result: SQLite.SQLResultSet[] = Array<SQLite.SQLResultSet>(queries.length)
        db.transaction((tx) => {
            queries.map((query, index) => {

                tx.executeSql(query, values[index],
                    (_, _result) => {
                        console.log('Executed', query);
                        result[index] = _result
                    },
                )
            })
        },
            (error) => {
                console.error('SQLite Error', error);
                reject(error)
            },
            () => {

                console.log('Query succed result:', result);
                resolve(result)
            }
        )
    })
}









//============ INSERTS ==========================================================


/** Insert a measurement in de localDB with the column sent set to false(0) 
 *  @param measurement A measurement struct which will be inserted into measurements table
 *  @returns Promise<number> A promise which solves to the measurementID within the measurments table
*/
export async function insertMeasurement(measurement: Measurement) {

    // TODO improve
    let keys = ''
    let placeHolder = ''
    Object.keys(measurement).forEach((key) => {
        keys = keys + key + ','
        placeHolder = placeHolder + '?,'
    })
    const values = [...Object.values(measurement), 0]

    return execQuery(`INSERT INTO measurements (${keys}sendStatus) values (${placeHolder}?)`, values)
        .then((result) => result.insertId as number)

}

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
            return await execQuery(`INSERT INTO ${tablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER} (ID,UID) values (?,?)`, [id,uid])
                .then((result) => result.insertId as number) //It wont return undefined, in the case it doesnt insert an error will be thrown
        }
    
}





/** Insert a measurement in de localDB with the column sent set to false(0) 
 * 
 *  @param calibrationID The calibration's row ID
 *  @param measurementID The measurement's row ID
 *  @precondition A measurement with the given ID and a calibration with the given ID must be created
 *  @returns Promise<string> with the calibrationMeasurementID within the measurments table
*/
export async function insertCalibrationMeasurement(calibrationID: number, measurementID: number) {
    return execQuery(`INSERT INTO calibrationsMeasurements (ID,calibrationID,weight) values (?,?,?)`, [measurementID, calibrationID, 0])
        .then((result) => result.insertId as number)

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


//============ Getters ==========================================================


export async function getMeasurements() {
    return execQuery(`SELECT * FROM measurements `, [])

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




export async function deleteCalibration(ID: number) {
    return execQuery(`DELETE FROM calibrations WHERE ID = ?`, [ID])

}

export async function calibrationExists(name: string) {
    return execQuery(`SELECT * FROM calibrations WHERE name = ?`, [name])
        .then((result) => result.rows.length > 0)
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



const createTableQueries = [
    `CREATE TABLE IF NOT EXISTS measurements (
        ID INTEGER PRIMARY KEY,
        height REAL,
        latitude REAL,
        longitude REAL,
        timestamp INTEGER,
        sendStatus INTEGER
      );`,
    `CREATE TABLE IF NOT EXISTS calibrations (
        ID INTEGER PRIMARY KEY,
        name TEXT,
        function TEXT
      );`,
    `CREATE TABLE IF NOT EXISTS calibrationsFromMeasurements (
        ID INTEGER PRIMARY KEY,
        sendStatus INTEGER,
        FOREIGN KEY (ID) REFERENCES calibrations(ID) ON DELETE CASCADE

      );`,
    `CREATE TABLE IF NOT EXISTS calibrationsFromFunction (
        ID INTEGER PRIMARY KEY,
        FOREIGN KEY (ID) REFERENCES calibrations(ID) ON DELETE CASCADE

      );`,
    `CREATE TABLE IF NOT EXISTS calibrationsMeasurements (
        ID INTEGER PRIMARY KEY ,
        calibrationID INTEGER,
        weight REAL,
        FOREIGN KEY (calibrationID) REFERENCES calibrationsFromMeasurements(ID) ON DELETE CASCADE,
        FOREIGN KEY (ID) REFERENCES measurements(ID) ON DELETE CASCADE
      );`,
    `CREATE TABLE IF NOT EXISTS user (
        localId INTEGER PRIMARY KEY ,
        id TEXT,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        groupUid TEXT,
        roles TEXT,
        accessToken TEXT,
        refreshToken TEXT,
        expirationTimestamp INTEGER,
        refreshExpirationTimestamp INTEGER,
        signedIn INTEGER
      );`,
      `CREATE TABLE IF NOT EXISTS calibrationsFromFunctionFromBackend (
        ID INTEGER PRIMARY KEY,
        updateTimestamp INTEGER,
        uid TEXT,
        FOREIGN KEY (ID) REFERENCES calibrationsFromFunction(ID) ON DELETE CASCADE
      );`,


]