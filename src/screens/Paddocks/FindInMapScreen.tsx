import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VStack, Text, Heading, View, IconButton, Icon, ScrollView, useToast, Toast } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { useTypedDispatch, useTypedSelector } from '../../features/store/storeHooks';
import { updatePaddock } from '../../features/store/paddockSlice';
import { CommonActions } from '@react-navigation/native';
import { addNotification } from '../../features/store/notificationSlice';
import { StackParamList } from './ScreenStack';

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
    const [addingMode, isAddingMode] = useState(false);
    const [minLength, setMinLength] = useState(0);

    //---------FUNCTIONS----------//
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true, headerTransparent: true, headerTintColor: 'white', headerStyle: {
                backgroundColor: '#5d6d7eB5'
            },
            headerRight: () => { return (<></>) }
        })
        changeRegion((coordinates.latitude), (coordinates.longitude));
        setCurrentCoords({ latitude: coordinates.latitude, longitude: coordinates.longitude });
        if (paddockId < 0) {
            setMinLength(0);
            setPolygonVertices([]);
        }
        else {
            if (pointId > paddockList[paddockId].vertices.length - 1)
                setPolygonVertices([...paddockList[paddockId].vertices, coordinates]);
            else
                setPolygonVertices(paddockList[paddockId].vertices);
            setMinLength(paddockList[paddockId].vertices.length);
        }
    }, [])

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

    //Does not have an use, this functionality is deprecated
    function midPoint(p1: LatLng, p2: LatLng): LatLng {
        let lat = (p1.latitude + p2.latitude) / 2;
        let lng = (p1.longitude + p2.longitude) / 2;
        return { latitude: lat, longitude: lng };
    }

    //----------JSX-----------//
    return (

        <VStack bg='white' flex={1} alignItems='center' >

            <MapView
                mapPadding={{ top: 125, right: 10, bottom: 0, left: 0 }}
                mapType={'satellite'}
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
                onPress={(event) => {
                    if (addingMode) {
                        setCurretPointId(polygonVertices.length);
                        let newCoords = event.nativeEvent.coordinate;
                        newCoords = {
                            latitude: parseFloat(newCoords.latitude.toFixed(10)),
                            longitude: parseFloat(newCoords.longitude.toFixed(10))
                        }
                        setCurrentCoords(newCoords);
                        setPolygonVertices([...polygonVertices, newCoords])
                    }
                }}
            >
                {
                    polygonVertices.map((point, index) => {
                        return (
                            <Marker
                                coordinate={polygonVertices[index]}
                                title={"coordenadas"}
                                tracksViewChanges={false}
                                description={`[${polygonVertices[index]?.latitude} ; ${polygonVertices[index]?.longitude}]`}
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
                                        (index >= minLength ? '#2ecc71' : '#3498db')
                                        :
                                        (index == currentPointId ? '#C0392B' : '#3498db')
                                    )
                                }
                                key={index + '-' + (index == currentPointId) + '-' + addingMode}
                                onPress={() => {
                                    if (!addingMode) {
                                        setCurretPointId(index);
                                        setCurrentCoords(polygonVertices[index]);
                                    }
                                }}
                            />

                        )
                    })
                }

                {polygonVertices.length > 0 ?
                    <View>
                        <Polygon
                            coordinates={polygonVertices}
                            strokeColor={'#a93226'}
                            fillColor={'#a93226' + "75"}
                            strokeWidth={1}
                        ></Polygon>
                    </View> : <></>}
            </MapView>

            {
                !addingMode ? <></> :
                    <View position={'absolute'} bottom={240} right={5}>
                        <IconButton backgroundColor={addingMode && (currentPointId >= minLength) ? 'red.500' : 'gray.500'}
                            borderColor={addingMode && (currentPointId >= minLength) ? 'red.600' : 'gray.600'}
                            borderWidth={3}
                            paddingRight={addingMode && (currentPointId >= minLength) ? 4 : 0}
                            _icon={{
                                as: Entypo,
                                name: addingMode && (currentPointId >= minLength) ? 'ccw' : 'block',
                                size: '4xl',
                            }}
                            rounded='full' variant='solid' style={{ width: 70, height: 70 }} onPress={() => {
                                if (addingMode && currentPointId >= minLength) {
                                    if (currentPointId == minLength) {
                                        setCurretPointId(-999)

                                    }
                                    else {
                                        setCurretPointId(polygonVertices.length - 2);
                                        setCurrentCoords(polygonVertices[currentPointId - 1])
                                    }
                                    let c = [...polygonVertices];
                                    c.pop();
                                    setPolygonVertices(c);
                                }
                                else
                                    //Toast.show({ description: 'Ya no se pueden deshacer más puntos', duration: 2000 })
                                    isAddingMode(false);
                            }}>
                        </IconButton>
                        <Text color={'white'} fontSize={'lg'} style={{ textShadowColor: 'black', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 5 }}>
                            {addingMode && currentPointId >= minLength ? 'Undo' : 'Cancel'}
                        </Text>
                    </View>
            }

            <View position={'absolute'} bottom={130} right={5}>
                <IconButton backgroundColor={'#2ecc71'}
                    borderColor={'#2ecc7155'}
                    borderWidth={3}
                    _icon={{
                        as: Entypo,
                        name: addingMode ? "check" : "plus",
                        size: '4xl'
                    }}
                    rounded='full' variant='solid' style={{ width: 70, height: 70 }} onPress={() => {

                        isAddingMode(!addingMode);
                        setCurretPointId(-999)
                        if (addingMode) {
                            setMinLength(polygonVertices.length);
                        }
                    }}>
                </IconButton>
                <Text color={'white'} fontSize={'lg'} style={{ textShadowColor: 'black', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 5 }}> {addingMode ? 'Apply' : 'Add'} </Text>
            </View>

            <View position={'absolute'} bottom={5} right={5}>
                <IconButton backgroundColor={'#f39c12'}
                    borderColor={'#f39c1255'}
                    borderWidth={3}
                    _icon={{
                        as: Entypo,
                        name: "save",
                        size: '4xl'
                    }}
                    rounded='full' variant='solid' style={{ width: 70, height: 70 }} onPress={() => {
                        let paddockAx;
                        if (paddockId > 0)
                            paddockAx = { name: paddockList[paddockId].name, vertices: polygonVertices };
                        else
                            paddockAx = { name: '', vertices: polygonVertices };

                        let pId = dispatch(updatePaddock({ data: paddockAx, paddockId: paddockId })).payload.paddockId

                        dispatch(addNotification({ status: 'info', title: 'Vertice guardado correctamente.' }))

                        navigation.dispatch(
                            CommonActions.navigate({
                                name: 'CreatePaddock',
                                params: {
                                    paddockId: pId
                                }
                            })
                        )
                    }}>
                </IconButton>
                <Text color={'white'} fontSize={'lg'} style={{ textShadowColor: 'black', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 5 }}>Save</Text>
            </View>

            <View flexDir={'row'} marginRight={10} style={{ position: 'absolute', top: 100, left: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5d6d7e', borderWidth: 4, borderColor: '#5d6d7eB5', borderRadius: 6, alignSelf: 'flex-start', margin: 10, padding: 15 }}>
                <Icon marginRight={3} as={Entypo} size={7} name={'info'} color='gray.100' />
                <Heading size={'md'} color={'coolGray.100'}>
                    {addingMode ? 'Toque el mapa para agregar vertices' : `lat: ${currentCoords.latitude + '\n'}lng: ${currentCoords.longitude}`}
                </Heading>
            </View>
        </VStack>
    );
};









