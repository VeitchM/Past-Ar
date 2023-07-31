import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type StackParamList = {
    CalibrationHome: undefined;
    CalibrationMeasurement: { calibrationID: number, calibrationName: string };
    SetCalibrations: { sort: 'latest' | 'top' } | undefined;
    CreateCalibration: undefined;
    CalibrationsList: undefined;
    CreateFunctionCalibration: { name: string };
    ForSendingCalibrations: undefined
};

export type PropsCalibrationHome = NativeStackScreenProps<StackParamList, 'CalibrationHome'>;
export type PropsCalibrationList = NativeStackScreenProps<StackParamList, 'CalibrationsList'>;
export type PropsCalibrationMeasurement = NativeStackScreenProps<StackParamList, 'CalibrationMeasurement'>;
export type PropsCalibrationForSending= NativeStackScreenProps<StackParamList, 'ForSendingCalibrations'>;
