import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LatLng, Region } from "react-native-maps";
import React from "react";
import IMapView, { MapViewProps } from "./MapViewInterface";
import * as FileSystem from 'expo-file-system'
import { useFocusEffect } from "@react-navigation/native";
import { Measurement } from "../../../features/store/types";
import { getMeasurementsBetween } from "../../../features/localDB/measurements";
import { useTypedSelector } from "../../../features/store/storeHooks";
import MapLibreGL, { Logger } from "@maplibre/maplibre-react-native";
import { Heading, Icon, View } from "native-base";
import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { getSectorByID } from "../../../features/localDB/sectors";
import { getPaddockByID } from "../../../features/localDB/paddocks";
import PolyHelper from "../../../features/utils/GeometricHelper";
import ColorUtils from "../../../features/utils/ColorUtils";


const AppConstants = {
    TILE_FOLDER: `${FileSystem.documentDirectory}/tiles`,
    MAP_URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
    FLY_ANIMATION_DURATION: 1500,
    DEFAULT_MAP_ZOOM: 12
}

MapLibreGL.setAccessToken(null);

function MLibreView(props: MapViewProps, ref: React.Ref<IMapView>) {

    const [measurements, setMeasurements] = useState<Measurement[]>([]);
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
        Logger.setLogLevel('error');
    }, [props.markerList, props.paddockList])

    useEffect(() => { readDB() }, [filterState, terrainMode]);

    useFocusEffect(
        React.useCallback(() => {
            readDB();
            return () => { };
        }, [filterState])
    );

    async function readDB() {

        if (filterState.enabled) {
            let f = filterState.from;
            let u = filterState.until;
            if (!!filterState.filteredSector) {
                let tmpSector = await getSectorByID(filterState.filteredSector);
                if (tmpSector.start_date > f) f = tmpSector.start_date;
                if (tmpSector.finish_date < u) u = tmpSector.finish_date;
            }
            let mes: Measurement[] = (await getMeasurementsBetween(f, u)).rows._array;
            if (filterState.filteredPaddock != undefined) {
                let foundedPaddock = (await getPaddockByID(filterState.filteredPaddock));
                let vertices: LatLng[] = JSON.parse(foundedPaddock.vertices_list!)

                let points = mes.map((m) => { return { latitude: m.latitude, longitude: m.longitude } });
                let results = PolyHelper.getPointsInsidePoly(points, vertices);
                mes = mes.filter((m) => { return results.some((r) => { return m.latitude == r.latitude }) });
            }
            setMeasurements(mes);
        }
        else {
            setMeasurements([]);
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

    function TerrainButton() {
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
                        <MapLibreGL.FillLayer maxZoomLevel={100000} id={"POLYFILL_" + index} style={{ fillColor: (props.paddockList[index] && props.paddockList[index].color) ? props.paddockList[index].color + 'BB' : ColorUtils.getColor(index) + 'BB', fillOpacity: 0.8, fillOutlineColor: '#ffffff' }} />
                        <MapLibreGL.LineLayer maxZoomLevel={100000} id={"POLYLINE_" + index} style={{ lineColor: (props.paddockList[index] && props.paddockList[index].color) ? props.paddockList[index].color : ColorUtils.getColor(index) }} />
                        <MapLibreGL.SymbolLayer id={"POLYTEXT_" + index}
                            style={{ textColor: '#525252', textHaloColor: '#ffffff', textHaloWidth: 1, textField: props.paddockList[index] ? props.paddockList[index].name : '' }}
                        ></MapLibreGL.SymbolLayer>
                    </MapLibreGL.ShapeSource>
                )
            })
        }</>);
    }, [polygons, terrainMode])

    const MeasurementsLayer = useCallback(() => {
        return (<>{

            <MapLibreGL.ShapeSource id={"SHPLAY"}
                shape={BuildMPoint([...measurements])}
            >
                <MapLibreGL.SymbolLayer id={"SYMLAY"}

                    style={{ iconAllowOverlap: true, iconImage: require("../../../../assets/maps-and-flags.png"), iconSize: 0.3, iconAnchor: "bottom" }}
                />

            </MapLibreGL.ShapeSource>
        }</>);
    }, [measurements, terrainMode])

    return (
        <>
            <MapLibreGL.MapView
                key={"MAP_"} ref={mapRef}
                style={{ flex: 1, alignSelf: 'stretch' }}
                attributionPosition={{ right: 5, top: 20 }}
                logoEnabled={false}
                compassEnabled={false}
                onRegionDidChange={(s) => { props.onDragEnd() }}
                rotateEnabled={false}
                onDidFinishLoadingMap={props.onFinishLoad}
            >
                <MapLibreGL.Camera ref={camRef} key={'-' + camRef.current} />
                <OfflineLayer />
                <OnlineLayer />
                <PaddocksLayer />
                <MeasurementsLayer />
                <UserLocation />
            </MapLibreGL.MapView>
            <TerrainButton />
        </>
    )
}

export default forwardRef<IMapView, MapViewProps>(MLibreView);