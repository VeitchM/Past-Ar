import React from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Heading, IconButton, VStack } from 'native-base';
import { getLocation } from '../../features/location/location';
import { View } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { Entypo } from '@expo/vector-icons';
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { updatePaddock } from '../../features/store/paddockSlice';
import { getPaddocks } from '../../features/localDB/localDB';
import { Paddock } from '../../features/store/types';
import { CommonActions } from '@react-navigation/native';
import { showAlert, showXmas } from '../../features/utils/Logger';
import { StackParamList } from './ScreenStack';
import BottomSheetItem from './BottomSheetItem';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker, LatLng } from 'react-native-maps';

type Props = NativeStackScreenProps<StackParamList>;

export default function PaddockScreen(props: Props) {

    //-------CONST & HOOKS---------//
    const mapRef = useRef<MapView>(null);
    const [markerList, setMarkerList] = useState<{ latitude: number, longitude: number }[]>([{ latitude: 0, longitude: 0 }])
    const paddockList = useTypedSelector(state => state.paddock.paddocks);
    const dispatch = useTypedDispatch();
    const snapPoints = ['12%', '60%'];
    const sheetRef = useRef<BottomSheet>(null);

    //---------FUNCTIONS----------//
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true, headerTransparent: true, headerTintColor: 'white', headerStyle: {
                backgroundColor: '#5d6d7eB5'
            },
            headerRight: () => { return (<></>) }
        })

        fetchLocation();
        setMarkerList([]);
        initializePaddockList();
        showPaddockList();
    }, [])

    function initializePaddockList() {
        getPaddocks().then((result) => {
            result.forEach((value) => {
                let vertices: LatLng[] = JSON.parse(value.vertices_list!)
                let paddockData: Paddock = { name: value.name, vertices: vertices }
                dispatch(updatePaddock({ data: paddockData, paddockId: value.ID - 1 }))
                //showXmas('INSIDE', p.vertices);
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
        getLocation().then((value) => { changeRegion(value.coords.latitude, value.coords.longitude) });
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
    }

    
    //----------JSX-----------//
    return (
        <VStack bg='black' flex={1} alignItems='center'>
            <MapView
                mapPadding={{ top: 115, right: 10, bottom: 0, left: 0 }}
                mapType={'satellite'}
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                initialRegion={{
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            >
                {
                    markerList ?
                        markerList.map((marker, index) => {
                            return (
                                <Marker
                                    coordinate={marker}
                                    title={"coordenadas"}
                                    description={marker.latitude + ' ' + marker.longitude}
                                    pinColor='#30A2FF'
                                    key={'M' + index}
                                />
                            );
                        })
                        : <></>
                }
                {
                    paddockList.map((paddock, index) => {
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

            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#5d6d7eCC' }}
                handleIndicatorStyle={{ backgroundColor: '#fff' }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', height: 50, marginBottom: 10 }}>
                    <Heading
                        size="lg"
                        color="coolGray.100"
                        style={{ textShadowColor: 'black', textShadowOffset: { width: -0.5, height: 0.5 }, textShadowRadius: 5 }}
                    >
                        Lista de Potreros
                    </Heading>
                    <IconButton backgroundColor={'#239b56'} borderColor={'#239b5655'} borderWidth={3}
                        _icon={{
                            as: Entypo,
                            name: "plus",
                            size: '4xl'
                        }}
                        rounded='full' variant='solid' style={{ width: 50, height: 50 }} onPress={() => {
                            props.navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'CreatePaddock',
                                    params: {
                                        paddockId: -1
                                    }
                                })
                            )
                        }}>
                    </IconButton>
                </View>
                <BottomSheetFlatList contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                    keyExtractor={(item, index) => 'FLIST' + index.toString()}
                    data={paddockList.map((value) => { return { name: value.name, vertices: value.vertices } })}
                    renderItem={({ item, index }) => (
                        < BottomSheetItem
                            title={item?.name}
                            index={index}
                            foreColor={'coolGray.500'}
                            color={colors[index]}
                            onLocatePress={() => {
                                setMarkerList(paddockList[index].vertices);
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
            <View style={{ position: 'absolute', top: 100, left: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 4, borderColor: '#ffffffB5', borderRadius: 8, alignSelf: 'flex-start', height: 80, margin: 10, paddingLeft: 15, paddingRight: 15, maxWidth: '100%' }}>
                <Heading size={'sm'} color={'#34495e'}>Vista de Potreros</Heading>
            </View>
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








