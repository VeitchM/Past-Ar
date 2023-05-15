
import * as SQLite from 'expo-sqlite';

import { Measurement } from '../store/types'

const db = SQLite.openDatabase('pastar.db');

db.exec([{ sql: 'SELECT load_extension("libspatialite.so")', args: [] }], false, (error) => {
    console.log(error);

});

db.transaction((tx) => {


    tx.executeSql('DROP TABLE measurements;', [],
        () => { },
        (_, error) => {
            console.error('Error Creating', error)
            return false
        })
})


db.transaction((tx) => {
    createTableQueries.forEach((query) => {

        tx.executeSql(query, [],
            () => { },
            (_, error) => {
                console.error('Error Creating', error)
                return false
            })
    })
})

/** Insert a measurement in de localDB with the column sent set to false(0) 
 *  @param measurement A measurement struct which will be inserted into measurements table
 *  @returns Promise<string> A promise which solves to the measurementID within the measurments table
*/
export function insertMeasurement(measurement: Measurement) {

    return new Promise<number>((resolve, reject) => {

        db.transaction((tx) => {
            // TODO improve
            let keys = ''
            let placeHolder = ''
            Object.keys(measurement).forEach((key) => {
                keys = keys + key + ','
                placeHolder = placeHolder + '?,'
            })
            const values = [...Object.values(measurement), 0]

            tx.executeSql(`INSERT INTO measurements (${keys}sent) values (${placeHolder}?)`, [...values],
                (_, { insertId }) => {
                    console.log('Execute', insertId);
                    if (insertId)
                        resolve(insertId)
                },
                (_, error) => {
                    console.error('Error Inserting', error)
                    reject(error)
                    return false
                })
        }
        )
    })
}

/** Insert a measurement in de localDB with the column sent set to false(0) 
 * 
 *  @param calibrationID The calibration's row ID
 *  @param measurementID The measurement's row ID
 *  @returns Promise<string> with the calibrationMeasurementID within the measurments table
*/
export function insertCalibrationMeasurement(calibrationID: number, measurementID: number) {
    return new Promise<number>((resolve, reject) => {

        db.transaction((tx) => {
            tx.executeSql(`INSERT INTO calibrationsMeasurements (ID,calibrationID,weight) values (?,?,?)`, [measurementID, calibrationID, 0],
                (_, { insertId }) => {
                    console.log('Execute must match', insertId, measurementID);
                    if (insertId)
                        resolve(insertId)
                },
                (_, error) => {
                    console.error('Error Inserting', error)
                    reject(error)
                    return false
                })
        }
        )
    })

}

/** Creates the tables needed for a Calibration made from measurements */
function insertCalibration(name: string) {
    return new Promise<number>((resolve, reject) => {

        db.transaction((tx) => {
            tx.executeSql(`INSERT INTO calibrationsFromMeasurements (name) values (?)`, [name],
                (_, { insertId }) => {
                    console.log('Insert calibration', insertId, name);
                    if (insertId)
                        resolve(insertId)
                },
                (_, error) => {
                    console.error('Error Inserting', error)
                    reject(error)
                    return false
                })
        }
        )
    })

}

/** Creates the tables needed for a Calibration made from measurements */
export async function insertCalibrationFromMeasurement(name: string) {

    const calibrationID = await insertCalibration(name)
    if (calibrationID) {

        return new Promise<number>((resolve, reject) => {

            db.transaction((tx) => {
                tx.executeSql(`INSERT INTO calibrationsFromMeasurements (ID,sent) values (?,?)`, [calibrationID, 0],
                    (_, { insertId }) => {
                        console.log('Execute must match', insertId, calibrationID);
                        if (insertId)
                            resolve(insertId)
                    },
                    (_, error) => {
                        console.error('Error Inserting', error)
                        reject(error)
                        return false
                    })
            }
            )
        })

    }
    // TODO Error handle
}

export function getMeasurements() {
    db.transaction((tx) => {


        tx.executeSql(`SELECT * FROM measurements `, [],
            (_, { rows: { _array } }) => {
                console.log('Get result', _array);
            },
            (_, error) => {
                console.error('Error Getting', error)
                return false
            })
    })
}


export function getCalibrations(){
    return new Promise((resolve,reject)=>{

        db.transaction((tx) => {
            
            
            tx.executeSql(`SELECT * FROM calibrations `, [],
            (_, { rows: { _array } }) => {
                console.log('Get result', _array);
                resolve(_array)
            },
            (_, error) => {
                console.error('Error Getting Calibrations', error)
                reject(error)
                return false
            })
        })
    })
    }
    

//TODO IT is no an UID it's an id
const createTableQueries = [
    `CREATE TABLE IF NOT EXISTS measurements (
        ID INTEGER PRIMARY KEY,
        height REAL,
        latitude REAL,
        longitude REAL,
        timestamp INTEGER,
        sent INTEGER
      );`,
    `CREATE TABLE IF NOT EXISTS calibrations (
        ID INTEGER PRIMARY KEY,
        name TEXT,
        function TEXT
      );`,
    `CREATE TABLE IF NOT EXISTS calibrationsFromMeasurements (
        ID INTEGER PRIMARY KEY,
        sent INTEGER
      );`,
    `CREATE TABLE IF NOT EXISTS calibrationsMeasurements (
        ID INTEGER PRIMARY KEY,
        calibrationID,
        weight REAL
      );`,


]