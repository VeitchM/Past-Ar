export enum TablesNames { USER='user',
MEASUREMENTS='measurements' ,
CALIBRATIONS= 'calibrations' , 
CALIBRATIONS_FROM_MEASUREMENTS= 'calibrationsFromMeasurements' , 
CALIBRATIONS_MEASUREMENTS='calibrationsMeasurements',
CALIBRATIONS_FROM_FUNCTIONS= 'calibrationsFromFunction',
CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER='calibrationsFromFunctionFromBackend'}
//Too much complexity it doesn't justify itself

import { ColumnDefinition, TableDefinition } from "./types";


const ID: ColumnDefinition = { name: 'ID', type: 'INTEGER PRIMARY KEY' }


export const measurementsTableDefinition: TableDefinition = {
    tableName: TablesNames.MEASUREMENTS,
    columns: [
        ID,
        { name: 'height', type: 'REAL' },
        { name: 'latitude', type: 'REAL' },
        { name: 'longitude', type: 'REAL' },
        { name: 'timestamp', type: 'REAL' },
        { name: 'sendStatus', type: 'INTEGER' },
    ]
}
export const calibrationsTableDefinition: TableDefinition = {
    tableName: TablesNames.MEASUREMENTS,
    columns: [
        ID,
        { name: 'name', type: 'TEXT' },
        { name: 'function', type: 'TEXT' },
    ]
}
export const calibrationsFromMeasurementsTableDefinition: TableDefinition = {
    tableName: TablesNames.CALIBRATIONS_FROM_MEASUREMENTS,
    columns: [
        ID,
        { name: 'sendStatus', type: 'INTEGER' },
    ]
}
export const calibrationsMeasurementsTableDefinition: TableDefinition = {
    tableName: TablesNames.CALIBRATIONS_MEASUREMENTS,
    columns: [
        ID,
        { name: 'calibrationID', type: 'INTEGER' },
        { name: 'weigh', type: 'REAL' },

    ]
}


const tablesDefinitions: TableDefinition[] = [
    measurementsTableDefinition,
    calibrationsTableDefinition,
    calibrationsFromMeasurementsTableDefinition,
    calibrationsMeasurementsTableDefinition,

]




/** Creates a createTable query based on the Table definition passed as parameter */
function createTableQuery(tableDefinition: TableDefinition) {
    let columnsString : string[] = []
    tableDefinition.columns.forEach((column) => {
        columnsString.push(`${column.name} ${column.type}`)
    })
    // })
    return (
        `CREATE TABLE IF NOT EXISTS ${tableDefinition.tableName} (
            ${columnsString.toString()}
       );`
    )
}
export const createTablesQueries = tablesDefinitions.map((table) => createTableQuery(table))

function createInsertQuery(table: TableDefinition) {
    const columnsNames = table.columns.map((column) => column.name!=ID.name && column.name).toString()
    let placeHolders = Array(table.columns.length-1).fill('?')
    return `insert into ${table} (${columnsNames}) values (${placeHolders.toString()})`
}

/** TODO not used, it could be deleted */
export const insertQueries
    = {
    measurement: createInsertQuery(measurementsTableDefinition),
    calibrations: createInsertQuery(calibrationsTableDefinition),
    calibrationsFromMeasurements: createInsertQuery(calibrationsFromMeasurementsTableDefinition),
    calibrationsMeasurements: createInsertQuery(calibrationsMeasurementsTableDefinition),
   
}

