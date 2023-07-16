import React from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Heading, Icon, IconButton, VStack, View } from 'native-base';
import { getLocation } from '../../features/location/location';
import { TouchableOpacity } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { addPaddock, updatePaddock } from '../../features/store/paddockSlice';
import { getPaddocks } from '../../features/localDB/localDB';
import { Paddock } from '../../features/store/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { showAlert, showXmas } from '../../features/utils/Logger';
import { StackParamList } from './ScreenStack';
import BottomSheetItem from './Partials/BottomSheetItem';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import MapView, { LatLng, Region } from 'react-native-maps';
import GoogleMapsView from "./Partials/GoogleMapsView";
import fontColorContrast from 'font-color-contrast'
import DownloadTilesButton from "./Partials/DownloadTilesButton";

type Props = NativeStackScreenProps<StackParamList, 'PaddockHome'>;

export default function PaddockScreen(props: Props) {

    //-------CONST & HOOKS---------//
    const mapRef = useRef<MapView>(null);
    const paddockList = useTypedSelector(state => state.paddock.paddocks);
    const snapPoints = ['12%', '60%'];
    const sheetRef = useRef<BottomSheet>(null);
    const filterState = useTypedSelector(state => state.filter);
    const [region, setRegion] = useState<Region & { zoom?: number }>({ latitude: 0, longitude: 0, latitudeDelta: 0.02, longitudeDelta: 0.02 });
    const dispatch = useTypedDispatch();
    const [zoom, setZoom] = useState(1);
    const [update, setUpdate] = useState(true);
    const [close, setClose] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [currentCoords, setCurrentCoords] = useState<LatLng>({ latitude: 0, longitude: 0 });

    //---------FUNCTIONS----------//
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true, headerTransparent: true, headerTintColor: 'white', headerStyle: {
                backgroundColor: '#5d6d7eB5'
            },
            headerRight: () => { return (<></>) }
        })
        initializePaddockList();
        fetchLocation();
        updateRegion();
        //deletePaddock(1);
        // insertMeasurement({height:10,timestamp:1000,latitude:5,longitude:5})
        showPaddockList();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            initializePaddockList();
            fetchLocation();
            return () => { };
        }, [])
    );

    const updateRegion = () => {
        mapRef.current?.getCamera().then((cam) => {
            setRegion({ latitude: cam.center.latitude, longitude: cam.center.longitude, zoom: cam.zoom, latitudeDelta: 0.02, longitudeDelta: 0.02 })
            if (cam.zoom) setZoom(cam.zoom);
        })
        setUpdate(true);
    }

    function initializePaddockList() {
        getPaddocks().then((result) => {
            let i = 1
            result.forEach((value) => {
                //console.log('VALOR',i++);
                let vertices: LatLng[] = JSON.parse(value.vertices_list!)
                let paddockData: Paddock = { ID: value.ID, name: value.name, vertices: vertices }
                if (vertices.length > 0) dispatch(addPaddock({ data: paddockData }));
            });
        })
    }

    function showPaddockList() {
        getPaddocks().then((result) => {
            let concat = "";
            result.forEach((value) => {
                concat += (`ID: ${value.ID} - name: ${value.name} - data: ${value.vertices_list}`)
            });
            showAlert('Paddock List', concat);
        })

    }

    const fetchLocation = () => {
        getLocation().then((value) => { changeRegion(value.coords.latitude, value.coords.longitude) }).catch((error) => { fetchLocation() });
    }

    function changeRegion(lat: Float, lng: Float) {
        const latitude = lat;
        const longitude = lng;
        mapRef.current?.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        })
        setCurrentCoords({ latitude: latitude, longitude: longitude });
    }

    function LocationButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 170, left: 0, alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 0, borderColor: '#ffffffB5', alignSelf: 'flex-start', margin: 10, marginRight: 5, padding: 10 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={fetchLocation} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={10} name={'compass'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }
    function InfoButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 100, left: 0, alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 0, borderColor: '#ffffffB5', alignSelf: 'flex-start', margin: 10, marginRight: 5, padding: 10 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => { setInfoOpen(!infoOpen) }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={10} name={'info-circle'} color='coolGray.600' />
                    {!infoOpen ? <></> :
                        <Heading size={'sm'} color={'#34495e'} marginLeft={1} marginRight={1}>
                            {`lat: ${currentCoords.latitude + '\n'}lng: ${currentCoords.longitude}`}
                        </Heading>
                    }
                </TouchableOpacity>
            </View>
        );
    }

    //----------JSX-----------//
    return (
        <VStack bg='white' flex={1} alignItems='center'>

            <GoogleMapsView key={'A' + filterState.enabled + filterState.from + filterState.until + update} mapRef={mapRef} paddockList={paddockList} onDrag={updateRegion} />

            <View style={{ position: 'absolute', right: 10, bottom: 110, backgroundColor: '#ffffffDD' }} rounded={'full'} padding={3}>
                <View style={{ alignItems: 'center', marginBottom: 5 }}>
                    <IconButton backgroundColor={'#27ae60'} borderColor={'#27ae6088'} borderWidth={3}
                        _icon={{
                            as: Entypo,
                            name: "plus",
                            size: '5xl'
                        }}
                        rounded='full' variant='solid' style={{ width: 70, height: 70 }} onPress={() => {
                            props.navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'CreatePaddock',
                                    params: {
                                        paddockId: -1,
                                        create: true
                                    }
                                })
                            )
                        }}>
                    </IconButton>
                    {/* {!close ? <Heading style={{ position: 'absolute', fontSize: 16, color: '#fff', bottom: -25 }}>Crear</Heading> : <></>} */}
                </View>
                <View style={{ alignItems: 'center', marginBottom: 5 }}>
                    {filterState.enabled ? <View style={{ height: 5, backgroundColor: '#f1c40f', width: 25, borderRadius: 6, zIndex: 999, top: 58 }} /> : <></>}
                    <IconButton backgroundColor={'#6c3483'} borderColor={'#6c348388'} borderWidth={3}
                        _icon={{
                            as: FontAwesome5,
                            name: "filter",
                            size: 'xl'
                        }}
                        rounded='full' variant='solid' style={{ width: 70, height: 70 }} onPress={() => {
                            props.navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'FiltersScreen',
                                    params: {
                                        paddockId: 1
                                    }
                                })
                            )
                        }}>
                    </IconButton>
                    {/* {!close ? <Heading style={{ position: 'absolute', fontSize: 16, color: '#fff', bottom: -25 }}>Filtrar</Heading> : <></>} */}
                </View>
                <View style={{ alignItems: 'center' }}>
                    <DownloadTilesButton mapRegion={region} onFinish={() => { }} onLongPress={updateRegion} />
                    {/* {!close ? <Heading style={{ position: 'absolute', fontSize: 16, color: '#fff', bottom: -25 }}>Mapa</Heading> : <></>} */}
                </View>
            </View>
            <LocationButton />
            <InfoButton />
            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#27ae60EE' }}
                handleIndicatorStyle={{ backgroundColor: '#fff' }}
                onChange={(index) => { setClose(index == 0) }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 50, marginBottom: 25 }}>
                    <Heading
                        size="xl"
                        color="coolGray.100"
                        style={{ marginLeft: 20, marginRight: 5, bottom: 2, textShadowOffset: { width: -0.5, height: 0.5 }, textShadowRadius: 5 }}
                    >
                        Potreros
                    </Heading>
                </View>
                <BottomSheetFlatList contentContainerStyle={{ alignItems: 'center', paddingBottom: 25 }}
                    keyExtractor={(item, index) => 'FLIST' + index.toString()}
                    data={paddockList}
                    renderItem={({ item, index }) => (
                        <BottomSheetItem
                            title={item?.name}
                            index={index}
                            foreColor={'coolGray.800'}
                            color={colors.filter((value) => { return fontColorContrast(value) != '#ffffff' })[index]}
                            onLocatePress={() => {
                                //setMarkerList(paddockList[index].vertices);
                                changeRegion(paddockList[index].vertices[0].latitude, paddockList[index].vertices[0].longitude)
                                sheetRef.current?.snapToIndex(0);
                            }}
                            onEditPress={() => {
                                showXmas('MOSTRANDO VERTICES DE ' + item.name.toUpperCase(), '>' + item.vertices?.map((ver) => { return 'lat: ' + ver.latitude + ' lng: ' + ver.longitude }) + '<')
                                props.navigation.dispatch(
                                    CommonActions.navigate({
                                        name: 'CreatePaddock',
                                        params: {
                                            paddockId: index
                                        }
                                    })
                                )
                            }}
                        />
                    )}
                >
                </BottomSheetFlatList>

            </BottomSheet>

        </VStack>
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








