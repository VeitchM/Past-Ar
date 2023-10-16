import { TablesNames } from "./tablesDefinition"

type BaseLocalDB = {
    ID: number,


}

type SendStatusLocalDB = BaseLocalDB & {
    sendStatus: 1 | 2 | 0 | 3,
}

export type MeasurementLocalDB = SendStatusLocalDB & {
    height: number,
    latitude: number,
    longitude: number,
    timestamp: number,
}


export type CalibrationLocalDB = BaseLocalDB & {
    name:string,
    function:string | null,
}


export type CalibrationLocalDBExtended = CalibrationLocalDB & {
    fromFunction:number,
    fromMeasurement:number,
}

export type CalibrationsFromMeasurementsLocalDB = SendStatusLocalDB & {
    name:string,
    function:string,
}

export type calibrationsMeasurementsLocalDB = SendStatusLocalDB & {
    calibrationID: number,
    weight: number,
}

export type calibrationsFromFunctionFromBackend = BaseLocalDB & {uid: string}

export type paddocksFromBackend = BaseLocalDB & {uid: string}

export type PaddockLocalDB = BaseLocalDB & {
    ID: number,
    name:string,
    vertices_list: string | null,
    color: string | undefined
}

export type ColumnDefinition = { name: string, type: SQLTypes }

/** columns doesn't include id which is an autoincremental in all cases */
export type TableDefinition = {
    tableName: TablesNames
    columns: ColumnDefinition[] //TODO i could especify which columns exists

    //columns: Array<keyof HeartRateLocalDB> //TODO i could especify which columns exists
}




// export type TablesNames = 'user'|'measurements' | 'calibrations' | 'calibrationsFromMeasurements' | 'calibrationsMeasurements' | TablesNames.CALIBRATIONS_FROM_FUNCTIONS_FROM_SERVER
//export type TablesNames = 'measurements' | 'calibrations' | 'calibrationsFromMeasurements' | 'calibrationsMeasurements' | 'paddocks'

type SQLTypes = 'REAL' | 'TEXT' | 'INTEGER' | 'INTEGER PRIMARY KEY'

export type SendableTables = 'measurements' | 'calibrationsFromMeasurements'

