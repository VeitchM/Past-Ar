import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VStack, Heading, View, IconButton, Icon, ScrollView, useToast, Toast } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Polygon, Polyline, UrlTile } from 'react-native-maps';
import { useTypedDispatch, useTypedSelector } from '../../features/store/storeHooks';
import { updatePaddock } from '../../features/store/paddockSlice';
import { CommonActions } from '@react-navigation/native';
import { addNotification } from '../../features/store/notificationSlice';
import { StackParamList } from './ScreenStack';
import { Position } from 'geojson';
import * as turf from '@turf/turf'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getLocation } from '../../features/location/location';
import { Paddock } from '../../features/store/types';
import { modifyPaddock } from '../../features/localDB/localDB';

type Props = NativeStackScreenProps<StackParamList, 'FindInMapScreen'>;

export default function FindInMapScreen(props: Props) {
    //-------CONST & HOOKS---------//
    const { route, navigation } = props;
    const { coordinates, paddockId, pointId, onCoordsChanged } = route.params;
    const mapRef = useRef<MapView>(null);
    const dispatch = useTypedDispatch();
    const paddockList = useTypedSelector(state => state.paddock.paddocks);
    const [polygonVertices, setPolygonVertices] = useState<LatLng[]>([]);
    const [currentPointId, setCurretPointId] = useState(pointId);
    const [currentCoords, setCurrentCoords] = useState<{ latitude: number, longitude: number }>({ latitude: 0, longitude: 0 });
    const [minLength, setMinLength] = useState(0);
    const [actionStack, setActionStack] = useState<LatLng[]>([]);
    const [openInfo, setOpenInfo] = useState(false);
    const [addingMode, isAddingMode] = useState(false);
    //---------FUNCTIONS----------//
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true, headerTransparent: true, headerTintColor: 'white', headerStyle: {
                backgroundColor: '#5d6d7eAA'
            },
            headerRight: () => { return (<></>) }
        })

        changeRegion((coordinates.latitude), (coordinates.longitude));
        setCurrentCoords({ latitude: coordinates.latitude, longitude: coordinates.longitude });

        if (false && pointId > paddockList[paddockId].vertices.length - 1)
            setPolygonVertices([...paddockList[paddockId].vertices, coordinates]);
        else
            setPolygonVertices(paddockList[paddockId].vertices);
        setMinLength(paddockList[paddockId].vertices.length);
    }, [])

    function LocationButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 90, left: 0, alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 0, borderColor: '#ffffffB5', alignSelf: 'flex-start', margin: 10, marginRight: 5, padding: 10 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={fetchLocation} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={10} name={'compass'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }

    function InfoButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 20, left: 0, alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 0, borderColor: '#ffffffB5', alignSelf: 'flex-start', margin: 10, marginRight: 5, padding: 10 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => { setOpenInfo(!openInfo) }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={10} name={'info-circle'} color='coolGray.600' />
                    {!openInfo ? <></> :
                        <Heading size={'sm'} color={'#34495e'} marginLeft={1} marginRight={1}>
                            {addingMode ? 'Press map to add vertices' : `lat: ${currentCoords.latitude + '\n'}lng: ${currentCoords.longitude}`}
                        </Heading>
                    }
                </TouchableOpacity>
            </View>
        );
    }

    const fetchLocation = () => {
        getLocation().then((value) => { changeRegion(value.coords.latitude, value.coords.longitude) }).catch((error) => { fetchLocation() });
    }

    function changeRegion(lat: number, lng: number) {
        const latitude = lat;
        const longitude = lng;
        mapRef.current?.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        })
    }

    const polygonHasKinks = (polygon: LatLng[]) => {
        let _polygon = latLngToPoly(polygon)
        let _kinks = turf.kinks(_polygon).features;
        return _kinks.length > 0;
    };

    const polygonOverlaps = (polygon: LatLng[], selectedPaddockUid?: number) => {
        let _polygon = latLngToPoly(polygon)
        return paddockList
            .filter((paddock, index) => index !== selectedPaddockUid)
            .some(({ vertices }) => {
                const aux = turf.intersect(_polygon, latLngToPoly(vertices));
                return !!aux;
            });
    };

    const pointsIntersect = (points: LatLng[], selectedPaddockUid?: number) => {
        let _points = turf.lineString(points.map(e => { return [e.latitude, e.longitude] }));
        return paddockList
            .filter((paddock, index) => index !== selectedPaddockUid)
            .some(({ vertices }) => {
                const aux = turf.lineIntersect(_points, latLngToPoly(vertices));
                return aux.features.length > 0;
            });
    }

    const getPolygonWithPoint = (polygon: LatLng[], point: LatLng) => {
        let _point = turf.point([point.latitude, point.longitude]);
        let _points = turf.featureCollection(polygon.map((v) => { return turf.point([v.latitude, v.longitude]) }));
        // let nearest = turf.nearestPoint(_point, _points);

        let minPoint = 99999;
        let minIndex = -1;
        _points.features.forEach((p, i) => {
            let index = i == _points.features.length - 1 ? 0 : i + 1;
            let dis = turf.distance(_point, turf.midpoint(_points.features[i], _points.features[index]));
            // console.log('Con i:', i, ' i+1: ', index, ' se obtuvo d: ', dis);
            if (dis < minPoint) { minPoint = dis; minIndex = i }
        });
        // console.log('Los mas cercanos son: ', minIndex, ' ; ', minIndex + 1)
        let newPoly = ([...polygon.slice(0, minIndex + 1), { latitude: point.latitude, longitude: point.longitude }, ...polygon.slice(minIndex + 1)])
        if (minIndex == polygon.length - 1 || polygon.length <= 2) { newPoly = [...polygon, point]; minIndex = polygon.length }
        else minIndex++;

        if (!polygonHasKinks(newPoly)) {

            return { poly: newPoly, index: minIndex };
        }
        return undefined;
    }

    const pointsInsidePolygon = (points: LatLng[], polygons: Paddock[], excludeId: number) => {
        let _points = turf.points(points.map((v) => { return [v.latitude, v.longitude] }))
        return polygons
            .filter((paddock, index) => index !== excludeId)
            .some(({ vertices }) => {
                const aux = turf.pointsWithinPolygon(_points, latLngToPoly(vertices));
                return aux.features.length;
            });
    };

    const latLngToPoly = (polygon: LatLng[]) => {
        let pos: Position[] = polygon.map((value) => { return [value.latitude, value.longitude] });
        if (pos[0] != pos[pos.length - 1]) pos = [...pos, pos[0]]
        return turf.polygon([pos]);
    }

    function OtherPolygons() {
        return (<>{
            paddockList.filter((_, _i) => { return _i != paddockId }).map((paddock, index) => {
                return (
                    !!paddock ?
                        <View key={'P' + index}>
                            <Polygon key={'Pol' + index}
                                coordinates={paddock.vertices}
                                strokeColor={colors[index]}
                                fillColor={colors[index] + "75"}
                                strokeWidth={1}
                            ></Polygon>
                        </View>
                        : <></>
                )
            })
        }</>);
    }

    function PinList() {
        return (<>{
            polygonVertices.map((point, index) => {
                return (
                    <Marker
                        coordinate={point}
                        title={'' + index}
                        tracksViewChanges={false}
                        // description={`[${polygonVertices[index]?.latitude} ; ${polygonVertices[index]?.longitude}]`}
                        draggable={(addingMode && index >= minLength) || (!addingMode && index == currentPointId)}
                        onDragEnd={(event) => {
                            let newCoords = event.nativeEvent.coordinate;
                            newCoords = {
                                latitude: parseFloat(newCoords.latitude.toFixed(10)),
                                longitude: parseFloat(newCoords.longitude.toFixed(10))
                            }
                            let c = [...polygonVertices];
                            c[index] = newCoords;
                            setPolygonVertices(c);
                            setCurretPointId(index);
                            setCurrentCoords(newCoords);
                        }}
                        pinColor={
                            (addingMode ?
                                ('#2ecc71')
                                :
                                (index == currentPointId ? '#C0392B' : '#3498db')
                            )
                        }
                        key={'M' + index + '-' + (index == currentPointId) + '-' + addingMode}
                        onPress={() => {
                            if (!addingMode) {
                                setCurretPointId(index);
                                //setCurrentCoords(polygonVertices[index]);
                            }
                        }}

                    />

                )
            })
        }</>)
    }

    function CurrentPolygon() {
        return (<>{
            polygonVertices.length > 0 ?
                <View>
                    <Polygon
                        coordinates={polygonVertices}
                        strokeColor={'#a93226'}
                        fillColor={'#a93226' + "75"}
                        strokeWidth={1}
                    ></Polygon>
                </View> : <></>
        }</>)
    }

    function PolyLine() {
        return (<>{
            addingMode && polygonVertices.length > 1 ?
                <Polyline coordinates={[
                    polygonVertices[0],
                    polygonVertices[polygonVertices.length - 1]
                ]}
                    strokeColor={'#fd7e14'}
                    lineDashPattern={[20, 20]}
                    strokeWidth={5}
                />
                : <></>
        }</>)
    }

    function updatePin(newCoords: LatLng, pinId?: number) {
        let _vertices = [...polygonVertices];
        if (pinId !== undefined)
            _vertices[pinId] = newCoords;

        let error = undefined; let poly = undefined; let index = -1;
        if (pointsInsidePolygon([..._vertices, newCoords], paddockList, paddockId)) {
            error = 'Error, ya existe potrero en ese punto';
        }
        else {
            if (_vertices.length <= 1) {
                if (_vertices.length == 0)
                    poly = [newCoords];
                else {
                    if (pointsIntersect([..._vertices, newCoords], paddockId))
                        error = 'Error, colisión de potreros';
                    else {
                        index = _vertices.length;
                        poly = [..._vertices, newCoords];
                    }
                }
            }
            else {
                //Check if the new polygon will have crossed sides
                let res = getPolygonWithPoint(polygonVertices, newCoords);
                poly = res?.poly; index = res?.index || -1;
                if (!poly) {
                    error = 'Error, no se puede ubicar este punto.'
                }
                else {
                    //Check if the new polygon will overlap existing polygons
                    if (polygonOverlaps([..._vertices, newCoords], paddockId))
                        error = 'Error, colisión de potreros';
                }
            }
        }
        if (!error && !!poly) {
            setCurretPointId(_vertices.length);
            setCurrentCoords(newCoords);
            setActionStack([...actionStack, newCoords]);
            setPolygonVertices(poly);
        }
        else
            Toast.show({ 'description': error, bottom: 10 })
    }

    function ButtonDock() {
        return (
            <View key={'dock'} position={'absolute'} bottom={3} right={3}>
                <View key={'dock0'} style={{ backgroundColor: '#fff' }} padding={2.5} rounded={'full'} >
                    {!addingMode ? <></> :
                        <IconButton key={'dock1'} backgroundColor={addingMode && (actionStack.length > 0) ? '#b03a2e' : '#566573'}
                            borderColor={addingMode && (actionStack.length > 0) ? '#b03a2e88' : '#56657388'}
                            borderWidth={3}
                            _icon={{
                                as: FontAwesome5,
                                name: addingMode && (actionStack.length > 0) ? 'undo' : 'ban',
                                size: '3xl',
                                marginLeft: 0
                            }}
                            rounded='full' variant='solid' style={{ marginBottom: 10, width: 70, height: 70 }} onPress={() => {
                                if (addingMode && actionStack.length > 0) {
                                    let c = [...actionStack];
                                    let lastAction = c.pop();
                                    let vertices = polygonVertices.filter((v, i) => { return v.latitude != lastAction?.latitude && v.longitude != lastAction?.longitude })
                                    if (actionStack.length == 1) {
                                        setCurretPointId(0)
                                        setPolygonVertices([]);
                                        setActionStack([]);
                                    }
                                    else {
                                        setMinLength(polygonVertices.length);
                                        setCurretPointId(polygonVertices.length - 2);
                                        setCurrentCoords(vertices[vertices.length - 1]);
                                        setActionStack(c);
                                    }
                                    setPolygonVertices(vertices);
                                }
                                else isAddingMode(false);
                            }}>
                        </IconButton>
                    }
                    <IconButton key={'dock2'} backgroundColor={'#d86e5f'}
                        borderColor={'#d86e5f55'}
                        borderWidth={3}
                        icon={!addingMode ?
                            <>
                                <Icon key={'I1'} as={FontAwesome5} name="map-marker-alt" color={'#fff'} size={'2xl'} position={'absolute'} left={2}></Icon>
                                <Icon key={'I2'} as={FontAwesome5} name={"plus"} color={'#fff'} size={'lg'} position={'absolute'} right={1.5}></Icon>
                            </>
                            :
                            <Icon as={FontAwesome5} name={"check"} color={'#fff'} size={'2xl'}></Icon>
                        }
                        rounded='full' variant='solid' style={{ width: 70, height: 70 }} onPress={() => {

                            isAddingMode(!addingMode);
                            setCurretPointId(-999)
                            setMinLength(polygonVertices.length);
                            if (addingMode) {
                                setActionStack([]);
                            }
                        }}>
                    </IconButton>
                    {addingMode ? <></> :
                        <IconButton key={'dock3'} backgroundColor={'#f39c12'}
                            borderColor={'#f39c1255'}
                            borderWidth={3}
                            _icon={{ as: Entypo, name: "save", size: '4xl' }}
                            rounded='full' variant='solid' style={{marginTop: 10, width: 70, height: 70 }} onPress={() => {
                                if (polygonVertices.length >= 3) {
                                    let data = { ID: paddockList[paddockId].ID, name: paddockList[paddockId].name, vertices: polygonVertices };
                                    dispatch(updatePaddock({ data: data, paddockId: paddockId }))
                                    dispatch(addNotification({ status: 'info', title: 'Vertice guardado correctamente.' }))
                                    navigation.dispatch(
                                        CommonActions.navigate({
                                            name: 'CreatePaddock',
                                            params: {
                                                paddockId: paddockId,
                                                create: false
                                            }
                                        })
                                    )
                                }
                                else {
                                    Toast.show({ description: 'Error, debe agregar más vertices antes de guardar (PMS2)' })
                                }
                            }}>
                        </IconButton>
                    }
                </View>
            </View>)
    }

    function onMapPressHandler(event: { nativeEvent: { coordinate: any; }; }) {
        let newCoords = event.nativeEvent.coordinate;
        newCoords = {
            latitude: parseFloat(newCoords.latitude.toFixed(10)),
            longitude: parseFloat(newCoords.longitude.toFixed(10))
        }
        if (addingMode) updatePin(newCoords)
    }

    const saveVertices = async (name: string, vertices: LatLng[]) => {
        if (paddockId >= 0) {
            modifyPaddock(name, vertices, paddockId);
        }
        else
            Toast.show({ description: 'Error inesperado (PMS1)' })
    }

    //----------JSX-----------//
    return (

        <VStack bg='white' flex={1} alignItems='center' >

            <MapView
                mapPadding={{ top: 110, right: 10, bottom: 0, left: 0 }}
                mapType={'satellite'}
                showsMyLocationButton={false}
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                initialRegion={{
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
                onPress={onMapPressHandler}
            >
                <UrlTile
                    urlTemplate={'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
                    zIndex={-1}
                />
                <PolyLine />
                <OtherPolygons />
                <PinList />
                <CurrentPolygon />
                {/* {
                    holes.map((h,i)=>{return(
                        <CurrentHole i={i}/>
                    );})
                } */}
            </MapView>
            <LocationButton />
            <InfoButton />
            <ButtonDock />


        </VStack >
    );
};


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







