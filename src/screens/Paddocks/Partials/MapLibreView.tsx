import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LatLng, Region } from "react-native-maps";
import React from "react";
import IMapView, { MapViewProps } from "./MapViewInterface";
import * as FileSystem from 'expo-file-system'
import { useFocusEffect } from "@react-navigation/native";
import { Measurement } from "../../../features/store/types";
import { getMeasurementsBetween } from "../../../features/localDB/measurements";
import { useTypedSelector } from "../../../features/store/storeHooks";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { Heading, Icon, View } from "native-base";
import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';


const AppConstants = {
    TILE_FOLDER: `${FileSystem.documentDirectory}/tiles`,
    MAP_URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
    FLY_ANIMATION_DURATION: 1500,
    DEFAULT_MAP_ZOOM: 12
}

MapLibreGL.setAccessToken(null);

function MLibreView(props: MapViewProps, ref: React.Ref<IMapView>) {

    const [activeMeasurements, setActiveMeasurements] = useState<Measurement[]>([]);
    const filterState = useTypedSelector(state => state.filter);
    const [isOffline, setIsOffline] = useState(false);
    const [polygons, setPolygons] = useState<LatLng[][]>([]);
    const [currentMarkers, setCurrentMarkers] = useState<LatLng[]>([]);
    const mapRef = useRef<MapLibreGL.MapView>(null);
    const camRef = useRef<MapLibreGL.Camera>(null);
    const [terrainMode, setTerrainMode] = useState(true);


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
    }, [props.markerList, props.paddockList])

    useEffect(() => { readDB() }, [filterState, terrainMode]);

    useFocusEffect(
        React.useCallback(() => {
            readDB();
            return () => { };
        }, [filterState])
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

    const BuildMPoint = (vertices: LatLng[]): GeoJSON.Geometry => {
        return {
            type: 'MultiPoint', coordinates: VerticesToPositions(vertices)
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
        getScreenRegion: async () => {
            let center = await mapRef.current?.getCenter() || [1, 1];
            let zoom = await mapRef.current?.getZoom() || 12;
            return { latitude: center[1], longitude: center[0], zoom: zoom };
        },
    }));

    function InfoButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 310, left: 0, position: 'absolute', backgroundColor: '#ffffff', margin: 10, height: 60, width: 60 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => { setTerrainMode(!terrainMode) }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={8} name={'sync'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }

    const OnlineLayer = useCallback(() => {
        return (
            <MapLibreGL.RasterSource id="RAS" tileUrlTemplates={[
                terrainMode ?
                    `${AppConstants.MAP_URL}/{z}/{y}/{x}.jpg`
                    :
                    'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ]} tileSize={256}>
                <MapLibreGL.RasterLayer sourceID="RAS" id="RASLAY" ></MapLibreGL.RasterLayer>
            </MapLibreGL.RasterSource>
        );
    }, [terrainMode])

    const OfflineLayer = useCallback(() => {
        return (
            <MapLibreGL.RasterSource id="RASOFF" tileUrlTemplates={[
                `${AppConstants.TILE_FOLDER}/{z}/{x}/{y}.jpg`
            ]} tileSize={256}>
                <MapLibreGL.RasterLayer sourceID="RASOFF" id="RASLAYOFF" ></MapLibreGL.RasterLayer>
            </MapLibreGL.RasterSource>
        );
    }, [terrainMode])

    const UserLocation = useCallback(() => {
        return (<MapLibreGL.UserLocation />);
    }, [terrainMode])

    const PaddocksLayer = useCallback(() => {
        return (<>{
            polygons.map((paddock, index) => {
                return (
                    <MapLibreGL.ShapeSource
                        key={"POLYSHAPE_" + index + polygons.length}
                        id={"POLYSHAPE_" + index}
                        shape={BuildPolygonShape([...paddock, paddock[0]])}
                    >
                        <MapLibreGL.FillLayer maxZoomLevel={100000} id={"POLYFILL_" + index} style={{ fillColor: props.paddockList[index] ? props.paddockList[index].color+'BB' : colors[index]+'BB', fillOpacity: 0.8, fillOutlineColor: '#ffffff' }} />
                        <MapLibreGL.LineLayer maxZoomLevel={100000} id={"POLYLINE_" + index} style={{ lineColor: props.paddockList[index] ? props.paddockList[index].color : colors[index] }} />
                        <MapLibreGL.SymbolLayer id={"POLYTEXT_" + index}
                            style={{ textColor:'#525252',textHaloColor:'#ffffff',textHaloWidth:1, textField: props.paddockList[index] ? props.paddockList[index].name : '' }}
                        ></MapLibreGL.SymbolLayer>
                    </MapLibreGL.ShapeSource>
                )
            })
        }</>);
    }, [polygons, terrainMode])

    const MeasurementsLayer = useCallback(() => {
        return (<>{
            (!activeMeasurements || activeMeasurements.length < 2) ? <></> :
                <MapLibreGL.ShapeSource id="SHPLAY"
                    shape={BuildMPoint([...activeMeasurements, activeMeasurements[0]])}
                >
                    <MapLibreGL.SymbolLayer id="SYMLAY"

                        style={{ iconAllowOverlap: true, iconImage: require("../../../../assets/maps-and-flags.png"), iconSize: 0.3, iconAnchor: "bottom" }}
                    />
                </MapLibreGL.ShapeSource>
        }</>);
    }, [activeMeasurements, terrainMode])

    return (
        <>
            <MapLibreGL.MapView
                key={"MAP_"} ref={mapRef}
                style={{ flex: 1, alignSelf: 'stretch' }}
                attributionPosition={{ right: 20, top: 150 }}
                logoEnabled={false}
                onPress={(e) => { }}
                compassEnabled={false}
                onRegionDidChange={(s) => { props.onDragEnd() }}
                rotateEnabled={false}
                onDidFinishLoadingMap={props.onFinishLoad}
            >
                <MapLibreGL.Camera ref={camRef} key={'-' + camRef.current} />

                <OfflineLayer />
                {terrainMode?<></>:<OnlineLayer />}
                

                <PaddocksLayer />
                <MeasurementsLayer />
                <UserLocation />
                {/* {
                    currentMarkers.map((point, v_index) => {
                        return (
                            <MapLibreGL.PointAnnotation
                                key={"POINT" + v_index + polygons.length}
                                id={"POINT_0" + "_" + v_index}
                                coordinate={[point.longitude, point.latitude]}
                            ></MapLibreGL.PointAnnotation>
                        )
                    })
                } */}
            </MapLibreGL.MapView>
            <InfoButton />
        </>
    )
}

export default forwardRef<IMapView, MapViewProps>(MLibreView);

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
