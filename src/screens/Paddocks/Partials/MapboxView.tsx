import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LatLng, Region } from "react-native-maps";
import React from "react";
import IMapView, { MapViewProps } from "./MapViewInterface";
import * as FileSystem from 'expo-file-system'
import { useFocusEffect } from "@react-navigation/native";
import { Measurement } from "../../../features/store/types";
import { getMeasurementsBetween } from "../../../features/localDB/measurements";
import { useTypedSelector } from "../../../features/store/storeHooks";
import MapBoxGL, { getAnnotationsLayerID } from "@rnmapbox/maps";


const AppConstants = {
    TILE_FOLDER: `${FileSystem.documentDirectory}/tiles`,
    MAP_URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
    FLY_ANIMATION_DURATION: 1500,
    DEFAULT_MAP_ZOOM: 12
}

MapBoxGL.setAccessToken('pk.eyJ1IjoibmVzY3VkZSIsImEiOiJjbGthYmNzYjUwNGliM3Jqc3Z6bmQ5YnAzIn0.StiNLsdSj9s60fO97zjcRw');


function MBoxView(props: MapViewProps, ref: React.Ref<IMapView>) {

    const [activeMeasurements, setActiveMeasurements] = useState<Measurement[]>([]);
    const filterState = useTypedSelector(state => state.filter);
    const [isOffline, setIsOffline] = useState(false);
    const [polygons, setPolygons] = useState<LatLng[][]>([]);
    const [currentMarkers, setCurrentMarkers] = useState<LatLng[]>([]);
    const mapRef = useRef<MapBoxGL.MapView>(null);
    const camRef = useRef<MapBoxGL.Camera>(null);


    const urlTemplate = useMemo(
        () =>
            isOffline
                ? `${AppConstants.TILE_FOLDER}/{z}/{x}/{y}.jpg`
                :
                `${AppConstants.MAP_URL}/{z}/{y}/{x}`,
        []
    )

    useEffect(() => {
        setPolygons(props.paddockList.map(e => { return e.vertices }));
        if (props.markerList) setCurrentMarkers(props.markerList);
    }, [props.markerList,props.paddockList])

    useEffect(() => { readDB() }, [filterState]);

    useFocusEffect(
        React.useCallback(() => {
            readDB();
            return () => { };
        }, [])
    );

    async function readDB() {
        let json;

        if (filterState.enabled) {
            // json = await getMeasurementsBetween(filterState.from, filterState.until);
            // let mets: Measurement[] = JSON.parse(JSON.stringify(json))['rows']['_array'];
            // setActiveMeasurements(mets);
        }
        else {
            setActiveMeasurements([]);
        }
    }

    const VerticesToPositions = (vertices: LatLng[]): GeoJSON.Position[] => {
        return (
            vertices.length > 0 ?
                vertices.map((vertex) => {
                    return ([vertex.longitude, vertex.latitude]);
                })
                :
                []
        )
    }

    const BuildPolygonShape = (vertices: LatLng[]): GeoJSON.Geometry => {
        return {
            type: 'Polygon', coordinates: [VerticesToPositions(vertices)]
        }
    }

    useImperativeHandle(ref, () =>
    ({
        changeRegion(region: Region) {
            if (camRef) {
                camRef.current?.setCamera({
                    zoomLevel: AppConstants.DEFAULT_MAP_ZOOM,
                    centerCoordinate: [region.longitude, region.latitude],
                    animationMode: 'flyTo',
                    animationDuration: AppConstants.FLY_ANIMATION_DURATION
                })
            }
        },
        getScreenRegion : async()=> {
            let center = await mapRef.current?.getCenter() || [1,1];
            let zoom = await mapRef.current?.getZoom() || 12;
            return { latitude: center[1], longitude: center[0], zoom:zoom};
        },
    }));

    return (
        <>
            <MapBoxGL.MapView
                key={"MAP_"} ref={mapRef}
                style={{ flex: 1, alignSelf: 'stretch' }}
                attributionPosition={{ right: 20, top: 110 }}
                logoEnabled={false}
                scaleBarPosition={{ top: 110, left: 20 }}
                onPress={(e) => { }}
                onMapIdle={(s) => { props.onDragEnd() }}
            >
                <MapBoxGL.Camera ref={camRef} key={'-' + camRef.current} />
                <MapBoxGL.UserLocation />

                {
                    polygons.map((paddock, index) => {
                        return (
                            <MapBoxGL.ShapeSource
                                key={"POLYSHAPE_" + index + polygons.length}
                                id={"POLYSHAPE_" + index}
                                shape={BuildPolygonShape([...paddock, paddock[0]])}
                            >
                                <MapBoxGL.FillLayer maxZoomLevel={100000} sourceID={"POLYSHAPE_" + index} id={"POLYFILL_" + index} style={{ fillColor: colors[index] + 'BB', fillOpacity: 0.8, fillOutlineColor: '#ffffff' }} />
                                <MapBoxGL.LineLayer maxZoomLevel={100000} sourceID={"POLYSHAPE_" + index} id={"POLYLINE_" + index} style={{ lineColor: colors[index] }} />
                            </MapBoxGL.ShapeSource>
                        )
                    })
                }
                {
                    currentMarkers.map((point, v_index) => {
                        return (
                            <MapBoxGL.PointAnnotation key={"POINT" + v_index + polygons.length} id={"POINT_0" + "_" + v_index}
                                coordinate={[point.longitude, point.latitude]}
                                draggable
                                onDragEnd={(e) => {
                                    let c = [...polygons];
                                    let a = c[0];
                                    a[v_index] = { latitude: e.geometry.coordinates[1], longitude: e.geometry.coordinates[0] }
                                    c[0] = a;
                                    setPolygons(c);
                                }}
                            ><></>
                            </MapBoxGL.PointAnnotation>
                        )
                    })
                }
                {
                    !filterState.enabled ? <></> :
                        activeMeasurements.map((point, i) => {
                            return (
                                <MapBoxGL.PointAnnotation key={"FILTER_MEASURES_" + i + polygons.length} id={"FILTER_MEASURES_" + i}
                                    coordinate={[point.longitude, point.latitude]}
                                ><></>
                                </MapBoxGL.PointAnnotation>
                            );
                        })
                }
            </MapBoxGL.MapView>
        </>
    )
}

export default forwardRef<IMapView, MapViewProps>(MBoxView);

const colors = [
    "#ffbe0b",
    "#fb5607",
    "#ff006e",
    "#3a86ff",
    "#7FFF00",
    "#FFFF00",
    "#FF6347",
    "#00FFFF",
    "#FF00FF",
    "#FF1493",
    "#FF69B4",
    "#FF8C00",
    "#FFD700",
    "#00FF00",
    "#00CED1",
    "#FF4500",
    "#FF00FF",
    "#FF7F50",
    "#00BFFF",
    "#1E90FF",
    "#ADFF2F",
    "#FF6347",
    "#FF69B4",
    "#FF8C00",
    "#FFD700",
    "#00FF7F",
    "#00CED1"
]
