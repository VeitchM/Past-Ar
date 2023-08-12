
import * as SQLite from 'expo-sqlite';

import { SendableTables } from './types';
import { TablesNames } from './tablesDefinition';
import { onInit } from '../backend/onInit';

//---------TODO TRANSFORM PADDOCKS REQUESTS TO THE NEW DB SYSTEM------//
import { Measurement } from '../store/types'
//import { TablesNames, CalibrationLocalDB, CalibrationLocalDBExtended, calibrationsFromMeasurementsLocalDB, MeasurementLocalDB, PaddockLocalDB } from './types';
import { LatLng } from 'react-native-maps';

//--------------------------//

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
// dropTables(TablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER)

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


export enum SendStatus { NOT_SENT, SENT, SENDING, FOR_SENDING }



/** Set all rows which are marked as sending to SENT if success is true, and to NOT_SENT if it is false,   */
export async function setSending(sendStatus: SendStatus, table: SendableTables) {
    // const measurements = new Array<MeasurementForFront>()
    const query = `UPDATE ${table} SET sendStatus = ${sendStatus} WHERE sendStatus = ${SendStatus.SENDING}`
    return execQuery(query)

}

export async function setSendStatus(sendStatus: SendStatus, table: SendableTables, rowID: number) {
    const query = `UPDATE ${table} SET sendStatus = ${sendStatus} WHERE ID = ${rowID}`
    return execQuery(query)

}

export async function insertPaddock( paddockName: string,vertices_list: LatLng[]) {
    let json = JSON.stringify(vertices_list)
    return execQuery(`INSERT INTO paddocks (name,vertices_list) values (?,?)`, [paddockName, json])
        .then((result) => result.insertId as number)

}

export async function modifyPaddock( paddockName: string,vertices_list: LatLng[], paddockId: number) {
    let json = JSON.stringify(vertices_list)
    return execQuery(`UPDATE paddocks SET vertices_list = (?), name = (?) WHERE ID = (?)`, [json, paddockName, paddockId])
        .then((result) => result.insertId as number)

}

//============ Getters ==========================================================


export async function getMeasurements() {   //>>TO DELETE AFTER DB CHANGE
    return execQuery(`SELECT * FROM measurements `, [])
}


export async function getMeasurementsBetween(from: number,until:number=(new Date()).getTime()) { //>>TO DELETE AFTER DB CHANGE
    return execQuery(`SELECT * FROM measurements WHERE timestamp BETWEEN (?) AND (?)`, [
        from, until
    ])
}

export async function getPaddocks() { //>>TO DELETE AFTER DB CHANGE
    return execQuery(
    `SELECT ID, name, vertices_list FROM paddocks`
    , [])
        .then((result) => result.rows._array as PaddockLocalDB[])
}

//============ Deletes ==========================================================

export async function deleteCalibration(ID: number) { //>>TO DELETE AFTER DB CHANGE
    return execQuery(`DELETE FROM calibrations WHERE ID = ?`, [ID])

}

export async function removePaddock(ID: number) { //>>TO DELETE AFTER DB CHANGE
    return execQuery(`DELETE FROM paddocks WHERE ID = (?)`, [ID])
}

export async function removeAllPaddocks() { //>>TO DELETE AFTER DB CHANGE
    return execQuery(`DELETE FROM paddocks`)

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
        timestamp INTEGER,
        refreshExpiresIn INTEGER,
        expiresIn INTEGER,
        signedIn INTEGER
      );`,
      `CREATE TABLE IF NOT EXISTS calibrationsFromFunctionFromBackend (
        ID INTEGER PRIMARY KEY,
        updateTimestamp INTEGER,
        uid TEXT,
        FOREIGN KEY (ID) REFERENCES calibrationsFromFunction(ID) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT,
        alias TEXT,
        plateWidth REAL
      );`,
      `CREATE TABLE IF NOT EXISTS paddocks (
          ID INTEGER PRIMARY KEY,
          name TEXT,
          vertices_list TEXT
      );`,
]