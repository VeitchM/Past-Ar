import MapView, { LatLng } from "react-native-maps";
import { Paddock } from "../../../features/store/types";

export default interface MapViewProps {
    markerList?: LatLng[], 
    paddockList: Paddock[],
    mapRef: React.RefObject<MapView>,
    onDrag: VoidFunction
}

export interface MapViewMethods {
    onDragEnd: void;
}