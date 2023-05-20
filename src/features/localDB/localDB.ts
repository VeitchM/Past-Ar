
import * as SQLite from 'expo-sqlite';

import { Measurement } from '../store/types'
import { TablesNames, calibrationLocalDB } from './types';

const db = SQLite.openDatabase('pastar.db');


//DOCUMENTATION DEVELOPMENT NOTE
//We could declare foreigns key, for that, we should import a pragma module 
//with a query
db.transaction((tx) => {
    tx.executeSql(`PRAGMA foreign_keys = ON;`, [],
        () => { console.log('Foreign keys activated ') },
        (_, error) => {
            console.error('Error Activating foreign_keys', error)
            return false
        })
})





//Does it work?
db.exec([{ sql: 'SELECT load_extension("libspatialite.so")', args: [] }], false, (error) => {
    console.log(error);

});

function dropTables(tableName:TablesNames) {

    db.transaction((tx) => {


        tx.executeSql(`DROP TABLE ${tableName};`, [],
            () => { console.log('Dropped table ',tableName) },
            (_, error) => {
                console.error('Error Creating', error)
                return false
            })
    })
}

// dropTables('calibrationsFromMeasurements')
// dropTables('calibrations')



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




export function calibrationExists(name: string) {
    return new Promise<boolean>((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM calibrations WHERE name = ?`, [name],
                (_, { rows: {length, _array} }) => {
                    console.log('Exists', _array,length);
                    
                    resolve(length >0)
                },
                (_, error) => {
                    console.error('Error on query', error)
                    reject(error)
                    return false
                })
        }
        )
    })
}

/** Creates a calibration */
function insertCalibration(name: string) {
    return new Promise<number>((resolve, reject) => {

        db.transaction((tx) => {
            tx.executeSql(`INSERT INTO calibrations (name) values (?)`, [name],
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
export async function insertCalibrationFromMeasurements(name: string) {
    return new Promise<number>(async (resolve, reject) => {
        try {

            const calibrationID = await insertCalibration(name)
            if (calibrationID) {


                db.transaction((tx) => {
                    tx.executeSql(`INSERT INTO calibrationsFromMeasurements (ID,sendStatus) values (?,?)`, [calibrationID, 0],
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
            }

        }

        catch (error) {
            console.error('Insert Error', error);
            reject(error)
        }
    })
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


export function getCalibrations() {
    return new Promise<calibrationLocalDB[]>((resolve, reject) => {

        db.transaction((tx) => {


            tx.executeSql(`SELECT * FROM calibrations `, [],
                (_, { rows: { _array } }) => {
                    console.log('Get result', _array);
                    resolve(_array as calibrationLocalDB[])
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
        sendStatus INTEGER
      );`,
    `CREATE TABLE IF NOT EXISTS calibrations (
        ID INTEGER PRIMARY KEY,
        name TEXT,
        function TEXT
      );`,
    `CREATE TABLE IF NOT EXISTS calibrationsFromMeasurements (
        ID INTEGER PRIMARY KEY REFERENCES calibrations(ID) ON DELETE CASCADE,
        sendStatus INTEGER
      );`,
    `CREATE TABLE IF NOT EXISTS calibrationsMeasurements (
        ID INTEGER PRIMARY KEY REFERENCES calibrationsFromMeasurements(ID) ON DELETE CASCADE,
        calibrationID REFERENCES calibrations(ID) ON DELETE CASCADE,
        weight REAL
      );`,


]