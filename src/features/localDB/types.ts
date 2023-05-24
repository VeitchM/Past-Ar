type BaseLocalDB = {
    ID: number,


}

type SendStatusLocalDB = BaseLocalDB & {
    sendStatus: 1 | 2 | 0,
}

export type MeasurmentLocalDB = SendStatusLocalDB & {
    height: number,
    latitude: number,
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

export type calibrationsFromMeasurementsLocalDB = SendStatusLocalDB & {
    name:string,
    function:string,
}

export type calibrationsMeasurementsLocalDB = SendStatusLocalDB & {
    calibrationID: number,
    weight: number,
}



export type ColumnDefinition = { name: string, type: SQLTypes }
/** columns doesn't include id which is an autoincremental in all cases */
export type TableDefinition = {
    tableName: TablesNames
    columns: ColumnDefinition[] //TODO i could especify which columns exists

    //columns: Array<keyof HeartRateLocalDB> //TODO i could especify which columns exists
}



export type TablesNames = 'measurements' | 'calibrations' | 'calibrationsFromMeasurements' | 'calibrationsMeasurements'

type SQLTypes = 'REAL' | 'TEXT' | 'INTEGER' | 'INTEGER PRIMARY KEY'
