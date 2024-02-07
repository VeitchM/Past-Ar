import React, { useCallback, useMemo } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Divider, Heading, Icon, IconButton, Input, Modal, VStack, View } from 'native-base';
import { getLocation } from '../../features/location/location';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { addPaddock, updatePaddock } from '../../features/store/paddockSlice';
import { getCrossedPaddocks, getPaddocks } from "../../features/localDB/paddocks";
import { insertMeasurement } from "../../features/localDB/measurements";
import { Paddock } from '../../features/store/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { showAlert, showXmas } from '../../features/utils/Logger';
import { StackParamList } from './ScreenStack';
import BottomSheetItem from './Partials/BottomSheetItem';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import MapView, { LatLng, Region } from 'react-native-maps';
import DownloadTilesButton from "./Partials/DownloadTilesButton";
import IMapView from "./Partials/MapViewInterface";
import MapLibreView from "./Partials/MapLibreView";
import Async, { AsyncReturn } from "../../features/utils/Async";
import { LocationObject } from "expo-location";
import ColorUtils from "../../features/utils/ColorUtils";
import { themeNavigation } from "../../theme";
import { getPaddocksFromBack } from "../../features/backend/paddocks";
import TS from "../../../TS";
import { setUpdateMeasures } from "../../features/store/filterSlice";

type Props = NativeStackScreenProps<StackParamList, 'PaddockHome'>;

export default function PaddockScreen(props: Props) {

    //-------CONST & HOOKS---------//
    const [currentCoords, setCurrentCoords] = useState<LatLng>({ latitude: 0, longitude: 0 });
    const [paddockList, setPaddockList] = useState<Paddock[]>([]);
    const [paddocksFromBack, setPaddocksFromBack] = useState<number[]>([]);
    const [infoOpen, setInfoOpen] = useState(false);
    const [region, setRegion] = useState<LatLng & { zoom: number }>({ latitude: 0, longitude: 0, zoom: 12 });
    const [isLocationUpdating, setIsLocationUpdating] = useState(false);
    const filterState = useTypedSelector(state => state.filter);
    const sheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef<IMapView>(null);
    const snapPoints = useMemo(() => ['12%', '60%'], []);
    const dispatch = useTypedDispatch();
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    //---------FUNCTIONS----------//
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true, headerTransparent: true, headerTintColor: 'white', headerStyle: {
                backgroundColor: themeNavigation.colors.primary + 'AA'
            }
        })
        initializePaddockList();
        showPaddockList();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            initializePaddockList();
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
    async function initializePaddockList() {
        let resultPaddocks = await getPaddocks();
        let paddocks: Paddock[] = [];
        resultPaddocks.forEach((value) => {
            let vertices: LatLng[] = JSON.parse(value.vertices_list!)
            let paddockData: Paddock = { ID: value.ID, name: value.name, vertices: vertices, color: value.color }
            if (vertices.length > 0 && !paddockList.some(p => { return p.ID == value.ID })) paddocks = ([...paddocks, paddockData]);
        });
        const crossedPaddocks = await getCrossedPaddocks();
        setPaddocksFromBack(crossedPaddocks.map(r => { return r.ID }));
        setPaddockList(paddocks);
    }

    function showPaddockList() {
        getPaddocks().then((result) => {
            let concat = "";
            result.forEach((value) => {
                concat += (`ID: ${value.ID} - name: ${value.name} - data: ${value.vertices_list} - color: ${value.color} ${paddocksFromBack}`)
            });
            showAlert('Paddock List', concat);
        })

    }

    const fetchLocation = async (change: boolean = true) => {
        if (change) setIsLocationUpdating(true);
        let loc = await Promise.race<LocationObject | AsyncReturn>([getLocation(), Async.resolveAfter(Async.MID)]);
        if (loc instanceof AsyncReturn || !loc) {
            console.log('Error, cannot fetch location!')
            fetchLocation(change);
        }
        else {
            if (change) {
                console.log('Location received, changing region!')
                changeRegion(loc.coords.latitude, loc.coords.longitude)
            }
            return loc;
        }
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
        updateRegion();
        setIsLocationUpdating(false);
    }
    /**
     * Handler is called after the map has finished loading.
     * updateRegion is called initially as a fallback for a possible error in fetchLocation()
     * , then is called again inside fetchLocation.
     */
    const onMapReady = () => {
        updateRegion();
        fetchLocation(true);
    }

    //--------JSX-XTRA-COMPONENTS---------//

    /**
     * On press changes the region to the user's location.
     * @returns Render button
     */
    const LocationButton = useCallback(() => {
        return (
            <View flexDir={'row'} rounded={'full'} height={60} width={60} style={{ bottom: 170, left: 0, alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 0, borderColor: '#ffffffB5', alignSelf: 'flex-start', margin: 10, marginRight: 5, padding: 10 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => { fetchLocation() }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={10} name={isLocationUpdating ? undefined : 'compass'} color='coolGray.600' />
                    <ActivityIndicator style={{ position: 'absolute' }} animating={isLocationUpdating} size={'large'} color={'#4b5563'} />
                </TouchableOpacity>
            </View>
        );
    }, [isLocationUpdating])
    /**
     * On press opens the info bubble, showing hints or coordinates according to context.
     * @returns Render button
     */
    function InfoButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 100, left: 0, position: 'absolute', backgroundColor: '#ffffff', margin: 10, padding: 10 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => { setInfoOpen(!infoOpen); console.log(region.zoom) }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={10} name={'info-circle'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }

    const InfoModal = useCallback(() => {
        return (
            <Modal isOpen={infoOpen} alignItems={'center'} justifyContent={'center'} closeOnOverlayClick onClose={() => { setInfoOpen(false) }}>
                <Box rounded={'lg'} paddingTop={5} paddingBottom={5} padding={5} backgroundColor={'#fff'}>
                    <View justifyContent={'space-evenly'} backgroundColor={'#fff'} width={300} height={430}>
                        <Box justifyContent={'flex-end'} width={'100%'} flexDir={'row'} marginBottom={3}>
                            <Heading size={'lg'}>{TS.t('paddocks_info_title')}</Heading>
                            <View flex={1} />
                            <TouchableOpacity onPress={() => { setInfoOpen(false) }}>
                                <Icon as={FontAwesome5} size={8} name={'times'} color='trueGray.500' />
                            </TouchableOpacity>
                        </Box>
                        <Box alignItems={'center'} width={'100%'} flexDir={'row'} borderColor={'gray.300'} borderWidth={1} rounded={'lg'} padding={3} backgroundColor={'#fff'}>
                            <Icon as={FontAwesome5} size={8} name={'search'} color='trueGray.500' />
                            <View width={3} />
                            <Heading size={'md'}>{TS.t('paddocks_search_info')}</Heading>
                        </Box>
                        <Box alignItems={'center'} width={'100%'} flexDir={'row'} borderColor={'gray.300'} borderWidth={1} rounded={'lg'} padding={3} backgroundColor={'#fff'}>
                            <Icon as={FontAwesome5} size={8} name={'sync'} color='trueGray.500' />
                            <View width={3} />
                            <Heading size={'md'}>{TS.t('paddocks_terrain_info')}</Heading>
                        </Box>
                        <Box alignItems={'center'} width={'100%'} flexDir={'row'} borderColor={'gray.300'} borderWidth={1} rounded={'lg'} padding={3} backgroundColor={'#fff'}>
                            <Icon as={FontAwesome5} size={8} name={'download'} color='trueGray.500' />
                            <View width={3} />
                            <Heading size={'md'}>{TS.t('paddocks_download_info')}</Heading>
                        </Box>
                        <Box alignItems={'center'} width={'100%'} flexDir={'row'} borderColor={'gray.300'} borderWidth={1} rounded={'lg'} padding={3} backgroundColor={'#fff'}>
                            <Icon as={FontAwesome5} size={8} name={'compass'} color='trueGray.500' />
                            <View width={3} />
                            <Heading size={'md'}>{TS.t('paddocks_location_info')}</Heading>
                        </Box>
                        <Divider margin={4} />
                        <Heading size={'md'} textAlign={'left'}>
                            {`${TS.t('paddocks_info_latitude')}:     ${currentCoords.latitude + '\n' + TS.t('paddocks_info_longitude')}:  ${currentCoords.longitude}`}
                        </Heading>
                    </View>
                </Box>
            </Modal>
        );
    }, [infoOpen])

    function SearchButton() {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 380, left: 0, position: 'absolute', backgroundColor: '#ffffff', margin: 10, padding: 15 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => { setIsSearchModalOpen(true); }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={8} name={'search'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }

    function InsertMeasureTestButton() {

        async function insertMesHandler() {
            let loc = await fetchLocation(false);
            if (!!loc) {
                await insertMeasurement({
                    height: Math.random() * 100,
                    timestamp: Date.now(),
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude
                })
                Alert.alert("Inserted measure")
                dispatch(setUpdateMeasures({ update: true }))
            }
        }

        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 480, left: 0, position: 'absolute', backgroundColor: '#ffffff', margin: 10, padding: 15 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={insertMesHandler} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon as={FontAwesome5} size={8} name={'weight-hanging'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        );
    }

    const SearchModal = useCallback(() => {
        const [searchText, setSearchText] = useState('');
        return (
            <Modal isOpen={isSearchModalOpen} closeOnOverlayClick onClose={() => { setIsSearchModalOpen(false) }} alignItems={'center'} justifyContent={'center'}>
                <Box rounded={'lg'} paddingTop={5} paddingBottom={5} padding={5} backgroundColor={'#fff'}>
                    <View flexDir={'column'} width={250}>
                        <Heading>{TS.t("paddocks_insert_coords")}</Heading>
                        <Heading size={'md'}>{TS.t("paddocks_insert_explain")}</Heading>
                        <Input keyboardType="decimal-pad" onChangeText={setSearchText} marginTop={5} marginBottom={2}></Input>
                        <Heading size={'md'} marginBottom={3}>ex. 1.5646 , -20.1547</Heading>
                        <Button width={'100%'} flexDirection={'row'} colorScheme={'primary'}
                            endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
                            onPress={() => {
                                if (searchText != "" && searchText.includes(",")) {
                                    let splitted = searchText.split(',');
                                    let x = parseFloat(splitted[0].trim()) || 1;
                                    let y = parseFloat(splitted[1].trim()) || 1;
                                    console.log(splitted);
                                    changeRegion(x, y);
                                    setIsSearchModalOpen(false);
                                }
                                else{
                                    Alert.alert('Error, ingrese coordenadas validas.');
                                }
                            }}>
                            {TS.t("paddocks_search")}
                        </Button>
                    </View>
                </Box>
            </Modal>)
    }, [isSearchModalOpen]);

    /**
     * Contains the Add and Filter buttons. Add button creates a new paddock.
     * Filter button lets specify a period and see the measurements taken during that time interval. 
     * @returns Render Dock
     */
    function ButtonDock() {
        return (
            <View style={{ position: 'absolute', right: 10, bottom: 110, backgroundColor: '#ffffff' }} rounded={'full'} padding={1}>
                {/* <View style={{ alignItems: 'center', marginBottom: 5 }}>
                    <View rounded="full" backgroundColor={themeNavigation.colors.primary} style={{ width: 70, height: 70 }} borderColor={themeNavigation.colors.primary + '88'} borderWidth={3}>
                        <TouchableOpacity onPress={() => {
                            sheetRef.current?.snapToIndex(0);
                            props.navigation.dispatch(CommonActions.navigate({ name: 'CreatePaddock', params: { paddockId: -1, create: true } }))
                        }}>
                            <Icon marginLeft={1} as={FontAwesome5} variant={"solid"} name="plus" size="2xl" color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => {
                        props.navigation.dispatch(CommonActions.navigate({ name: 'FiltersScreen', params: { paddockId: 1, paddockList: paddockList.map(p => { return { name: p.name, id: p.ID } }) } }))
                    }}>
                        <View rounded="full" backgroundColor={'#e26a00'} style={{ width: 70, height: 70 }} borderColor={'#ffa72688'} borderWidth={0}>
                            <Icon as={FontAwesome5} name="filter" size="xl" color="#fff" />
                            {filterState.enabled ? <Icon as={FontAwesome5} position={'absolute'} name="check" size="lg" left={3} top={8} color={themeNavigation.colors.primary} /> : <></>}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    /**
     * List of saved paddocks.
     * Each item represents a paddock and has an edit and locate button related to that paddock.
     */
    const PaddockBottomSheetList = useCallback(() => {

        return (
            <BottomSheet
                ref={sheetRef} snapPoints={snapPoints} backgroundStyle={{ backgroundColor: themeNavigation.colors.primary + 'EE' }}
                handleIndicatorStyle={{ backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 50, marginBottom: 25 }}>
                    <Heading size="xl" color="coolGray.100"
                        style={{ marginLeft: 20, marginRight: 5, bottom: 2, textShadowOffset: { width: -0.5, height: 0.5 }, textShadowRadius: 5 }}
                    >{TS.t('paddocks')}</Heading>
                </View>
                <BottomSheetFlatList contentContainerStyle={{ alignItems: 'center', paddingBottom: 25 }}
                    keyExtractor={(item, index) => 'FLIST' + index.toString()}
                    data={paddockList} refreshing={true}
                    renderItem={({ item, index }) => (
                        <BottomSheetItem title={item?.name} index={index} foreColor={'coolGray.800'}
                            color={item.color ? item.color : ColorUtils.getColor(3)}
                            canBeEdited={item.ID ? !paddocksFromBack.includes(item.ID) : false}
                            onLocatePress={() => {
                                changeRegion(paddockList[index].vertices[0].latitude, paddockList[index].vertices[0].longitude)
                                sheetRef.current?.snapToIndex(0);
                            }}
                            onEditPress={() => {
                                let paddockData: Paddock = { ID: item.ID, name: item.name, vertices: item.vertices }
                                let newIndex = dispatch(addPaddock({ data: paddockData })).payload.index;
                                sheetRef.current?.snapToIndex(0);
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
    }, [paddockList])

    const FilterButton = () => {
        return (
            <View rounded={'full'} style={{ flex: 1, position: 'absolute', bottom: 110, right: 15, padding: 0 }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    props.navigation.dispatch(CommonActions.navigate({ name: 'FiltersScreen', params: { paddockId: 1, paddockList: paddockList.map(p => { return { name: p.name, id: p.ID } }) } }))
                }}>
                    <View flexDirection={'row'} rounded={'full'} background={'#ffa726'} height={70} width={70} borderWidth={4} borderColor={'#fff'} padding={4}>
                        <Icon color={'#fff'} as={FontAwesome5} name={'filter'} size={'2xl'} marginTop={1}></Icon>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    //----------JSX-----------//
    return (
        <VStack bg='white' flex={1} alignItems='center'>
            {/* <GoogleMapsView key={'A' + filterState.enabled + filterState.from + filterState.until} ref={mapRef} paddockList={paddockList} onDragEnd={updateRegion} onFinishLoad={onMapReady} /> */}
            {/* <MapboxView ref={mapRef} paddockList={paddockList} onDragEnd={updateRegion} onFinishLoad={onMapReady}/> */}
            <MapLibreView ref={mapRef} paddockList={paddockList} onDragEnd={updateRegion} onFinishLoad={onMapReady} />
            {/* <InsertMeasureTestButton /> */}
            <SearchButton />
            {/* <ButtonDock /> */}
            <LocationButton />
            <InfoButton />
            <DownloadTilesButton mapRegion={region} zoomLevel={region.zoom} onLongPress={updateRegion} />
            <SearchModal />
            <InfoModal />
            <FilterButton />
            <PaddockBottomSheetList />
        </VStack>
    );
};








