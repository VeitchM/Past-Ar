import { Measurement } from "../store/types";

export type MeasurementForBack =
    {
        timestamp: string,
        location: [number, number],
        height: number
    }

export type CalibrationForBack = {
    name: string,
    measurements: { id: string, measurement: MeasurementForBack }[]
}


export type CalibrationFromBack = CalibrationForBack & {
    uid: string,
    curve: number[]
}

export type PaddockFromBack = {
    uid: string,
    area: string,
    calibrationUid: string,
    createdAt: Date,
    displayColor: string,
    geofence: {
        coordinates: String[][],
        type: string
    },
    groupUid: string,
    name: string,
    speciesUid: string,
    stock: number
}