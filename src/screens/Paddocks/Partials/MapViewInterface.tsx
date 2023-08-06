import MapView, { LatLng, Region } from "react-native-maps";
import { Paddock } from "../../../features/store/types";

export interface MapViewProps{
    markerList?: LatLng[], 
    paddockList: Paddock[],
    currentCoords?: LatLng,
    onDragEnd(): void,
    onFinishLoad(): void
}

export default interface MapViewMethods {
    changeRegion(region: Region): void,
    getScreenRegion(): Promise<LatLng & {zoom: number}>
}