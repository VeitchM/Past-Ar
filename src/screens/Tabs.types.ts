import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootTabsParamList = {
    Home: undefined,
    Calibration: undefined,
    Data:  undefined,
    Paddocks: undefined;
    User:undefined;
    Statistics: undefined;
};


export type GenericTabsProps<Screen extends keyof RootTabsParamList> =
  NativeStackScreenProps<RootTabsParamList, Screen>;