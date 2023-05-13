
import * as SQLite from 'expo-sqlite';

import { Measurement } from '../ble/types'

const db = SQLite.openDatabase('pastar.db');

db.exec([{ sql: 'SELECT load_extension("libspatialite.so")', args: [] }], false, (error) => {
    console.log(error);

});

// db.transaction((tx) => {


//     tx.executeSql('DROP TABLE measurements;', [],
//         () => { },
//         (_, error) => {
//             console.error('Error Creating', error)
//             return false
//         })
// })


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

/** Insert a measurement in de localDB with the parameter sent set to false(0) */
export function insertMeasurement(measurement: Measurement) {
    db.transaction((tx) => {
        let keys = ''
        let placeHolder = ''
        Object.keys(measurement).forEach((key) => {
            keys = keys + key + ','
            placeHolder = placeHolder + '?,'
        })
        const values = [...Object.values(measurement), 0]

        tx.executeSql(`INSERT INTO measurements (${keys}sent) values (${placeHolder}?)`, [...values],
            () => { },
            (_, error) => {
                console.error('Error Inserting', error)
                return false
            })
    })
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

const createTableQueries = [
    `CREATE TABLE IF NOT EXISTS measurements (
        UID INTEGER PRIMARY KEY,
        height REAL,
        coordinates TEXT,
        timestamp TIMESTAMP,
        sent INTEGER
      );`
]