import { LegacyRef, RefObject, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Callout, Marker, Polygon, Region, UrlTile, WMSTile } from "react-native-maps";
import React from "react";
import IMapView, { MapViewProps } from "./MapViewInterface";
import * as FileSystem from 'expo-file-system'
import { useFocusEffect } from "@react-navigation/native";
import { Measurement } from "../../../features/store/types";
import { getMeasurementsBetween } from "../../../features/localDB/localDB";
import { useTypedSelector } from "../../../features/store/storeHooks";
import Formatter from '../../../features/utils/FormatUtils';
import ColorUtils from "../../../features/utils/ColorUtils";

const AppConstants = {
    TILE_FOLDER: `${FileSystem.documentDirectory}/tiles`,
    MAP_URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
}
function GoogleMapsView(props: MapViewProps, ref: React.Ref<IMapView>) {

    const [activeMeasurements, setActiveMeasurements] = useState<Measurement[]>([]);
    const filterState = useTypedSelector(state => state.filter);
    const [isOffline, setIsOffline] = useState(false);
    const mapRef = useRef<MapView>(null)
    const urlTemplate = useMemo(
        () =>
            isOffline
                ? `${AppConstants.TILE_FOLDER}/{z}/{x}/{y}.jpg`
                :
                `${AppConstants.MAP_URL}/{z}/{y}/{x}`,
        []
    )


    useFocusEffect(
        React.useCallback(() => {
            readDB();
            return () => { };
        }, [])
    );

    async function readDB() {
        let json;

        if (filterState.enabled) {
            
            json = await getMeasurementsBetween(filterState.from, filterState.until);
            let mets: Measurement[] = JSON.parse(JSON.stringify(json))['rows']['_array'];
            setActiveMeasurements(mets);
        }
        else {
            setActiveMeasurements([]);
        }
    }

    useImperativeHandle(ref, () =>
    ({
        changeRegion(region: Region) {
            mapRef.current?.animateToRegion(region, 1000);
        },
        getScreenRegion : async()=> {
            let cam = await mapRef.current?.getCamera();
            let lat = cam?.center.latitude || 1;
            let lng = cam?.center.longitude || 1;
            let zoom = cam?.zoom || 12;
            return { latitude: lat, longitude: lng, zoom: zoom};
        },
    }));

    return (
        <>
            <MapView
                mapPadding={{ top: 100, right: 10, bottom: 0, left: 0 }}
                mapType={'satellite'}
                ref={mapRef}
                style={{ width: '100%', height: '103%' }}
                provider={'google'}
                showsUserLocation
                initialRegion={{
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 1,
                    longitudeDelta: 1
                }}
                onMapReady={props.onFinishLoad}
                showsMyLocationButton={false}
                onRegionChangeComplete={() => { props.onDragEnd() }}
                
            >
                <UrlTile
                    urlTemplate={urlTemplate}
                    zIndex={-1}
                />
                {
                    activeMeasurements.length > 0 ?
                        activeMeasurements.map((marker, index) => {
                            return (
                                <Marker
                                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                    title={'[' + marker.latitude + ' ; ' + marker.longitude+']'}
                                    description={'Fecha: '+Formatter.formatExtendedDate(new Date(marker.timestamp),'/')}
                                    pinColor='#30A2FF'
                                    key={'M' + index}
                                    
                                />
                            );
                        })
                        : <></>
                }
                {
                    props.paddockList.filter(_ => { return _.vertices.length > 0 }).map((paddock, index) => {
                        return (
                            <View key={index}>
                                <Polygon
                                    coordinates={paddock.vertices}
                                    strokeColor={ColorUtils.getColor(index)}
                                    fillColor={ColorUtils.getColor(index) + "75"}
                                    strokeWidth={1}
                                >
                                </Polygon>
                            </View>
                        )
                    })
                }
            </MapView>
        </>
    )
}

export default forwardRef<IMapView, MapViewProps>(GoogleMapsView);