import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, Polygon, Region, UrlTile, WMSTile } from "react-native-maps";
import React from "react";
import MapViewProps from "./MapViewInterface";
import * as FileSystem from 'expo-file-system'
import DownloadTilesButton from "./DownloadTilesButton";
import { useFocusEffect } from "@react-navigation/native";
import { Measurement } from "../../../features/store/types";
import { getMeasurementsBetween } from "../../../features/localDB/localDB";
import { useTypedSelector } from "../../../features/store/storeHooks";


const AppConstants = {
    TILE_FOLDER: `${FileSystem.documentDirectory}/tiles`,
    MAP_URL: 'https://www.openstreetmap.org',
}
export default function GoogleMapsView(props: MapViewProps) {

    const [isOffline, setIsOffline] = useState(true);

    const [activeMeasurements, setActiveMeasurements] = useState<Measurement[]>([]);
    const filterState = useTypedSelector(state => state.filter);

    const urlTemplate = useMemo(
        () =>
            isOffline
                ? `${AppConstants.TILE_FOLDER}/{z}/{x}/{y}.jpg`
                :
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        //`${AppConstants.MAP_URL}/#map={z}/{x}/{y}.png`,
        []
    )

    useEffect(() => {
        //getLocation().then((value) => { setLoc(value) });
        updateRegion();

    }, [])

    useFocusEffect(
        React.useCallback(() => {
            readDB();
            return () => { };
        }, [])
    );

    async function readDB(){
        let json;

        if (filterState.enabled){
            json = await getMeasurementsBetween(filterState.from,filterState.until);
            let mets : Measurement[] = JSON.parse(JSON.stringify(json))['rows']['_array'];
            setActiveMeasurements(mets);
        }
        else{
            setActiveMeasurements([]);
        }
        console.log(filterState.enabled);
    }

    function updateRegion() {
        props.mapRef.current?.getCamera().then((cam) => {
            setRegion({ latitude: cam.center.latitude, longitude: cam.center.longitude, zoom: cam.zoom, latitudeDelta: 0.02, longitudeDelta: 0.02 })
        })
    }

    const [region, setRegion] = useState<Region & { zoom?: number }>({ latitude: 0, longitude: 0, latitudeDelta: 0.02, longitudeDelta: 0.02 });

    return (
        <>
            <MapView
                mapPadding={{ top: 100, right: 10, bottom: 0, left: 0 }}
                mapType={'standard'}
                ref={props.mapRef}
                style={{ width: '100%', height: '100%' }}
                provider={'google'}
                showsUserLocation
                initialRegion={{
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
                showsMyLocationButton={false}
                onRegionChangeComplete={()=>{props.onDrag()}}
                onPress={() => { props.mapRef.current?.getCamera().then((cam) => { console.log(cam.zoom) }) }}
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
                                    title={'Lt: '+marker.latitude+ ' ; Lg: '+marker.longitude}
                                    description={(new Date(marker.timestamp).toUTCString())}
                                    pinColor='#30A2FF'
                                    key={'M' + index}
                                />
                            );
                        })
                        : <></>
                }
                {
                    props.paddockList.filter(_=>{return _.vertices.length>0}).map((paddock, index) => {
                        return (
                            <View key={index}>
                                <Polygon
                                    coordinates={paddock.vertices}
                                    strokeColor={colors[index]}
                                    fillColor={colors[index] + "75"}
                                    strokeWidth={1}
                                ></Polygon>
                            </View>
                        )
                    })
                }
            </MapView>
        </>
    )
}

const colors = [
    "#ffbe0b",
    "#fb5607",
    "#ff006e",
    "#8338ec",
    "#3a86ff",
    "#7FFF00",
    "#FFFF00",
    "#FF6347",
    "#DC143C",
    "#00FFFF",
    "#FF00FF",
    "#0000FF",
    "#FF1493",
    "#FF69B4",
    "#FF8C00",
    "#FFD700",
    "#00FF00",
    "#00CED1",
    "#9400D3",
    "#FF4500",
    "#FF00FF",
    "#FF7F50",
    "#00BFFF",
    "#1E90FF",
    "#8B008B",
    "#ADFF2F",
    "#FF6347",
    "#FF69B4",
    "#FF8C00",
    "#FFD700",
    "#00FF7F",
    "#00CED1",
    "#9400D3"
]
