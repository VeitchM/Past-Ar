import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Box, Select, View, Input, Icon, ChevronDownIcon, Divider, Heading, Switch, Modal, HStack } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from 'react-native-date-picker'
import { StackParamList } from "./ScreenStack";
import { CommonActions } from "@react-navigation/native";
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { event } from "react-native-reanimated";
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { updateFilter } from "../../features/store/filterSlice";
import CalendarPicker from "react-native-calendar-picker";
import { Dimensions, Text } from "react-native";
import moment from "moment";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { TouchableHighlight } from "react-native-gesture-handler";
import Formatter from '../../features/utils/FormatUtils';

type Props = NativeStackScreenProps<StackParamList, 'FiltersScreen'>;

export default function FiltersScreen(props: Props) {
    const { paddockList } = props.route.params;
    const [isFromVisible, setIsFromVisible] = useState(false);
    const [isUntilVisible, setIsUntilVisible] = useState(false);
    const [from, setFrom] = useState<Date>(new Date());
    const [until, setUntil] = useState<Date>(new Date());
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [showMeasurements, setShowMeasurements] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const filterState = useTypedSelector(state => state.filter);
    const dispatch = useTypedDispatch();
    const sheetRef = useRef<BottomSheet>(null);
    const [filteredPaddock, setFilteredPaddock] = useState<number>(-1);

    const handleFromConfirm = (datetime: any) => {
        setIsFromVisible(false);
        setFrom(datetime);
        console.log("A date has been picked: ", datetime)
        //setChosenDate(moment(datetime).format('dddd Do MMMM YYYY à HH:mm'))
    }

    const handleUntilConfirm = (datetime: any) => {
        setIsUntilVisible(false);
        setUntil(datetime);
        console.log("A date has been picked: ", datetime)
        //setChosenDate(moment(datetime).format('dddd Do MMMM YYYY à HH:mm'))
    }

    const handleDateChange = (source: ('until' | 'from'), data: any) => {
        console.log('Changed Date to -> ', from ? from : '', until ? until : '');
        if (source == 'until') setUntil(data);
        else setFrom(data);
    }

    useEffect(() => {
        setIsFromVisible(false);
        setIsUntilVisible(false);
        setShowMeasurements(filterState.enabled);
        setFrom(new Date(filterState.from));
        setUntil(new Date(filterState.until));
        if (filterState.paddockId) setFilteredPaddock(filterState.paddockId);
        sheetRef.current?.close();
    }, [])

    const CalendarModal = useCallback((props: { source: ('until' | 'from'), isOpen: boolean, onConfirm: VoidFunction }) => {
        let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        let weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
        return (
            <Modal isOpen={props.isOpen} alignItems={'center'} justifyContent={'center'}>
                <Box rounded={'lg'} paddingTop={5} paddingBottom={5} padding={2} backgroundColor={'#fff'}>
                    <CalendarPicker selectYearTitle="Seleccionar Año" nextTitle="Siguiente" previousTitle="Anterior" weekdays={weekDays} months={months} selectedDayColor="#27ae60" selectedDayTextColor="#fff" onDateChange={(d) => { handleDateChange(props.source, d.toDate()) }} width={Dimensions.get('screen').width * 0.90} />
                    <Divider marginTop={3} marginBottom={3} />
                    <View flexDir={'row'}>
                        <Button flexDirection={'row'} colorScheme={'coolGray'}
                            endIcon={<Icon as={FontAwesome5} name="times" size="md" />}
                            marginRight={5} onPress={props.onConfirm}>
                            {'Cancelar'}
                        </Button>
                        <Button flexDirection={'row'} colorScheme={'primary'}
                            endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
                            onPress={props.onConfirm}>
                            {'Confirmar'}
                        </Button>
                    </View>
                </Box>
            </Modal>
        );
    }, [])

    return (
        <View backgroundColor={'white'} flex={1} padding={5}>
            <Box width={'100%'} height={'100%'} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" padding={5}>
                <DatePicker
                    mode="date"
                    title="Selecciona fecha desde"
                    modal open={isFromVisible} date={from}
                    onConfirm={handleFromConfirm}
                    onCancel={() => { setIsFromVisible(false) }}
                    androidVariant="iosClone"
                />

                <DatePicker
                    mode="date"
                    title="Selecciona fecha hasta"
                    modal open={isUntilVisible} date={until}
                    onConfirm={handleUntilConfirm}
                    onCancel={() => { setIsUntilVisible(false) }}
                    androidVariant="iosClone"
                />
                <Heading size='lg'>Mediciones</Heading>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 25 }}>
                    <Heading size='md' marginBottom={1} fontWeight='light'>Mostrar mediciones</Heading>
                    <View flex={1} />
                    <Switch size="lg" value={showMeasurements} onToggle={(state) => { setShowMeasurements(state) }} />
                </View>
                <Heading size='md' fontWeight='light' marginBottom={3}>Desde</Heading>
                <Button
                    isDisabled={!showMeasurements}
                    flexDirection={'row'}
                    variant={'outline'}
                    colorScheme={'trueGray'}
                    bgColor={'trueGray.100'}
                    _pressed={{ bgColor: 'trueGray.200' }}
                    endIcon={<Icon as={FontAwesome5} marginLeft={5} name="chevron-down" size="md" />}
                    marginBottom={25}
                    onPress={() => { setIsFromVisible(true) }}>
                    {from ? Formatter.formatBasicDate(from) : 'Fecha desde'}
                </Button>
                <Heading size='md' fontWeight='light' marginBottom={3}>Hasta</Heading>
                <Button
                    isDisabled={!showMeasurements}
                    flexDirection={'row'}
                    variant={'outline'}
                    colorScheme={'trueGray'}
                    bgColor={'trueGray.100'}
                    _pressed={{ bgColor: 'trueGray.200' }}
                    endIcon={<Icon as={FontAwesome5} marginLeft={5} name="chevron-down" size="md" />}
                    marginBottom={5}
                    onPress={() => { setIsUntilVisible(true) }}>
                    {until ? Formatter.formatBasicDate(until) : 'Fecha hasta'}
                </Button>
                <View flex={1} />
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Button
                    flexDirection={'row'}
                    colorScheme={'primary'}
                    endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
                    onPress={() => {
                        dispatch(updateFilter({ enabled: showMeasurements, from: from.getTime(), until: until.getTime(), paddockId:filteredPaddock>=0 ? filteredPaddock:undefined }))
                        props.navigation.dispatch(
                            CommonActions.navigate({
                                name: 'PaddockHome'
                            })
                        )
                    }}
                >
                    {'Aplicar'}
                </Button>
            </Box>
            <BottomSheet index={-1} ref={sheetRef} snapPoints={['60%']} enablePanDownToClose backgroundStyle={{ backgroundColor: '#DDDDDD' }}>
                <Heading marginLeft={5} marginBottom={5} fontSize={'2xl'} color={'trueGray.500'}>FILTRAR POR POTRERO</Heading>
                <Divider/>
                <BottomSheetFlatList
                    style={{paddingTop:15,position:'relative'}}
                    data={paddockList}
                    renderItem={({ item, index }) => (
                        <Box marginBottom={index >= paddockList.length-1 ? 8 : 3} marginLeft={3} marginRight={3}>
                            <TouchableHighlight style={{ borderRadius: 8 }} underlayColor={'#'} onPress={() => { setFilteredPaddock(item.id); sheetRef.current?.close() }}>
                                <Box flexDir={'row'} borderWidth={1} borderColor={'#27ae60'} rounded={'lg'} backgroundColor={filteredPaddock == item.id ? '#27ae60' : 'trueGray.100'} padding={3}>
                                    <Heading color={filteredPaddock == item.id ? '#fff' : '#27ae60'}> {item.name} </Heading>
                                    <View flex={1}></View>
                                    {filteredPaddock != item.id ? <></> :
                                        <Icon as={FontAwesome5} name="check-circle" color={'#fff'} size={'2xl'} />
                                    }
                                </Box>
                            </TouchableHighlight>
                        </Box>
                    )}
                />
                <Box padding={4} backgroundColor={'trueGray.600'}>
                    <TouchableHighlight style={{ borderRadius: 8 }} underlayColor={'#'} onPress={() => { setFilteredPaddock(-1); sheetRef.current?.close();}}>
                        <Box flexDir={'row'} borderWidth={1} borderColor={'#428c97'} rounded={'lg'} backgroundColor={'#57a9b5'} padding={3}>
                            <Heading color={'#fff'}> Todos los potreros </Heading>
                            <View flex={1}></View>
                            {filteredPaddock != -1 ? <></> :
                                <Icon as={FontAwesome5} name="check-circle" color={'#fff'} size={'2xl'} />
                            }
                        </Box>
                    </TouchableHighlight>
                </Box>
            </BottomSheet>
        </View>
    )
}