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