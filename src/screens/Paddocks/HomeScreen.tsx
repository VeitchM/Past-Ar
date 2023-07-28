import React from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Heading, Icon, IconButton, VStack, View } from 'native-base';
import { getLocation } from '../../features/location/location';
import { TouchableOpacity } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { addPaddock, updatePaddock } from '../../features/store/paddockSlice';
import { getPaddocks, insertMeasurement } from '../../features/localDB/localDB';
import { Paddock } from '../../features/store/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { showAlert, showXmas } from '../../features/utils/Logger';
import { StackParamList } from './ScreenStack';
import BottomSheetItem from './Partials/BottomSheetItem';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import MapView, { LatLng, Region } from 'react-native-maps';
import fontColorContrast from 'font-color-contrast'
import DownloadTilesButton from "./Partials/DownloadTilesButton";
import IMapView from "./Partials/MapViewInterface";
import MapboxView from "./Partials/MapboxView";
import GoogleMapsView from "./Partials/GoogleMapsView";

type Props = NativeStackScreenProps<StackParamList, 'PaddockHome'>;

export default function PaddockScreen(props: Props) {

    //-------CONST & HOOKS---------//
    const [currentCoords, setCurrentCoords] = useState<LatLng>({ latitude: 0, longitude: 0 });
    const [paddockList, setPaddockList] = useState<Paddock[]>([]);
    const [infoOpen, setInfoOpen] = useState(false);
    const [region, setRegion] = useState<LatLng & { zoom: number }>({ latitude: 0, longitude: 0, zoom:12});
    const filterState = useTypedSelector(state => state.filter);
    const sheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<IMapView>(null);
    const snapPoints = ['12%', '60%'];
    const dispatch = useTypedDispatch();


    //---------FUNCTIONS----------//
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true, headerTransparent: true, headerTintColor: 'white', headerStyle: {
                backgroundColor: '#3498db77'
            }
        })
        initializePaddockList();
        fetchLocation();
        updateRegion();
        showPaddockList();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            initializePaddockList();
            fetchLocation();
            return () => { };
        }, [])
    );

    const updateRegion = async () => {
        let r = await mapRef.current?.getScreenRegion();
        if (r) setRegion(r);
    }

    /**
     * Loads every paddock from the Database into the state array
     */
    function initializePaddockList() {
        getPaddocks().then((result) => {
            let paddocks = [...paddockList];
            result.forEach((value) => {
                let vertices: LatLng[] = JSON.parse(value.vertices_list!)
                let paddockData: Paddock = { ID: value.ID, name: value.name, vertices: vertices }
                if (vertices.length > 0 && !paddockList.some(p => { return p.ID == value.ID })) paddocks = ([...paddocks, paddockData]);;
            });
            setPaddockList(paddocks);
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
        getLocation().then((value) => { changeRegion(value.coords.latitude, value.coords.longitude) })
        .catch((error) => { console.log(error); fetchLocation() });
    }

    function changeRegion(lat: Float, lng: Float) {
        const latitude = lat;
        const longitude = lng;
        mapRef.current?.changeRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        })
        setCurrentCoords({ latitude: latitude, longitude: longitude });
    }

    //--------JSX-XTRA-COMPONENTS---------//

    /**
     * On press changes the region to the user's location.
     * @returns Render button
     */
    function LocationButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 170, left: 0, alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 0, borderColor: '#ffffffB5', alignSelf: 'flex-start', margin: 10, marginRight: 5, padding: 10 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={fetchLocation} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={10} name={'compass'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }
    /**
     * On press opens the info bubble, showing hints or coordinates according to context.
     * @returns Render button
     */
    function InfoButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 100, left: 0, position: 'absolute', backgroundColor: '#ffffff', margin: 10, padding: 10 }}>
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

    function InsertMeasureTestButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 310, left: 0, position: 'absolute', backgroundColor: '#ffffff', margin: 10, padding: 15 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                    insertMeasurement({
                        height: Math.random()*100,
                        timestamp: Date.now(),
                        latitude: currentCoords.latitude,
                        longitude: currentCoords.longitude
                    })
                }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={8} name={'weight-hanging'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * Contains the Add and Filter buttons. Add button creates a new paddock.
     * Filter button lets specify a period and see the measurements taken during that time interval. 
     * @returns Render Dock
     */
    function ButtonDock() {
        return (
            <View style={{ position: 'absolute', right: 10, bottom: 110, backgroundColor: '#ffffff' }} rounded={'full'} padding={2}>
                <View style={{ alignItems: 'center', marginBottom: 5 }}>
                    <View rounded="full" backgroundColor={'#27ae60'} style={{ width: 70, height: 70 }} borderColor={'#27ae6088'} borderWidth={3}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.dispatch(CommonActions.navigate({ name: 'CreatePaddock', params: { paddockId: -1, create: true } }))
                        }}>
                            <Icon marginLeft={1} as={FontAwesome5} variant={"solid"} name="plus" size="2xl" color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    {filterState.enabled ? <View style={{ height: 5, backgroundColor: '#f1c40f', width: 25, borderRadius: 6, zIndex: 999, top: 58 }} /> : <></>}
                    <View rounded="full" backgroundColor={'#6c3483'} style={{ width: 70, height: 70 }} borderColor={'#6c348388'} borderWidth={3}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.dispatch(CommonActions.navigate({ name: 'FiltersScreen', params: { paddockId: 1 } }))
                        }}>
                            <Icon as={FontAwesome5} name="filter" size="xl" color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    /**
     * List of saved paddocks.
     * Each item represents a paddock and has an edit and locate button related to that paddock.
     */
    function BottomSheetList() {
        return (
            <BottomSheet
                ref={sheetRef} snapPoints={snapPoints} backgroundStyle={{ backgroundColor: '#27ae60EE' }}
                handleIndicatorStyle={{ backgroundColor: '#fff' }} animateOnMount={false}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 50, marginBottom: 25 }}>
                    <Heading size="xl" color="coolGray.100"
                        style={{ marginLeft: 20, marginRight: 5, bottom: 2, textShadowOffset: { width: -0.5, height: 0.5 }, textShadowRadius: 5 }}
                    >Potreros</Heading>
                </View>
                <BottomSheetFlatList contentContainerStyle={{ alignItems: 'center', paddingBottom: 25 }}
                    keyExtractor={(item, index) => 'FLIST' + index.toString()}
                    data={paddockList}
                    renderItem={({ item, index }) => (
                        <BottomSheetItem title={item?.name} index={index} foreColor={'coolGray.800'}
                            color={colors.filter((value) => { return fontColorContrast(value) != '#ffffff' })[index]}
                            onLocatePress={() => {
                                changeRegion(paddockList[index].vertices[0].latitude, paddockList[index].vertices[0].longitude)
                                sheetRef.current?.snapToIndex(0);
                            }}
                            onEditPress={() => {
                                let paddockData: Paddock = { ID: item.ID, name: item.name, vertices: item.vertices }
                                let newIndex = dispatch(addPaddock({ data: paddockData })).payload.index;
                                props.navigation.dispatch(
                                    CommonActions.navigate({
                                        name: 'CreatePaddock',
                                        params: {
                                            paddockId: newIndex
                                        }
                                    }))
                            }} />)}>
                </BottomSheetFlatList>
            </BottomSheet>
        );
    }


    //----------JSX-----------//
    return (
        <VStack bg='white' flex={1} alignItems='center'>
            {/* <GoogleMapsView key={'A' + filterState.enabled + filterState.from + filterState.until} ref={mapRef} paddockList={paddockList} onDragEnd={updateRegion} /> */}
            <MapboxView ref={mapRef} paddockList={paddockList} onDragEnd={updateRegion} />
            <ButtonDock />
            <LocationButton />
            <InfoButton />
            <DownloadTilesButton mapRegion={region} zoomLevel={region.zoom} onLongPress={updateRegion} />
            <BottomSheetList />
        </VStack>
    );
};



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








