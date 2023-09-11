import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Box, Select, View, Input, Icon, ChevronDownIcon, Divider, Heading, Switch, Modal, HStack } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from 'react-native-date-picker'
import { StackParamList } from "./ScreenStack";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
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
import TS from "../../../TS";

type Props = NativeStackScreenProps<StackParamList, 'FiltersScreen'>;

export default function FiltersScreen(props: Props) {
    const [isFromVisible, setIsFromVisible] = useState(false);
    const [isUntilVisible, setIsUntilVisible] = useState(false);
    const [from, setFrom] = useState<Date>(new Date());
    const [until, setUntil] = useState<Date>(new Date());
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const dispatch = useTypedDispatch();
    const sheetRef = useRef<BottomSheet>(null);
    const [filteredPaddock, setFilteredPaddock] = useState<number>(-1);
    const filterState = useTypedSelector(state => state.filter);

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
        setFrom(new Date(filterState.from_stats));
        setUntil(new Date(filterState.until_stats));
        sheetRef.current?.close();
    }, [])

    useFocusEffect(useCallback(() => {
        setFrom(new Date(filterState.from_stats));
        setUntil(new Date(filterState.until_stats));
    }, []))

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

    const FilterButton = (props: any) => {
        let { label, onPress } = props;
        return (
            <Button margin={1} width={85} flexDirection={'row'} colorScheme={'coolGray'}
                onPress={onPress}
            >{label}</Button>
        );
    }

    function setFilterPeriod(timeAmmount: ('days' | 'months' | 'years'), value: number) {
        let _from = new Date;
        let _until = new Date;

        switch (timeAmmount) {
            case 'days': {
                _from.setDate(_from.getDate() - value);
            } break;
            case 'months': {
                _from.setMonth(_from.getMonth() - value);
            } break;
            case 'years': {
                _from.setFullYear(_from.getFullYear() - value);
            }
        }
        setFrom(_from);
        setUntil(_until);
    }

    return (
        <View backgroundColor={'white'} flex={1} padding={5}>
            <Box width={'100%'} height={'100%'} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" padding={5}>
                <DatePicker
                    mode="date"
                    title={TS.t('select_from_date')}
                    modal open={isFromVisible} date={from}
                    onConfirm={handleFromConfirm}
                    onCancel={() => { setIsFromVisible(false) }}
                    androidVariant="iosClone"
                />

                <DatePicker
                    mode="date"
                    title={TS.t('select_until_date')}
                    modal open={isUntilVisible} date={until}
                    onConfirm={handleUntilConfirm}
                    onCancel={() => { setIsUntilVisible(false) }}
                    androidVariant="iosClone"
                />
                <Heading size='lg'>{TS.t('measurements')}</Heading>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 25 }}>
                    <View flex={1} />
                </View>
                <Heading size='md' fontWeight='light' marginBottom={3}>{TS.t('from')}</Heading>
                <Button
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
                <Heading size='md' fontWeight='light' marginBottom={3}>{TS.t('to')}</Heading>
                <Button
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
                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                <Box flexWrap={'wrap'} flexDir={'row'} justifyContent={'space-evenly'}>
                    <FilterButton label="24 h" onPress={() => { setFilterPeriod('days', 1) }} />
                    <FilterButton label="48 h" onPress={() => { setFilterPeriod('days', 2) }} />
                    <FilterButton label="1 Sem" onPress={() => { setFilterPeriod('days', 7) }} />
                    <FilterButton label="1 Mes" onPress={() => { setFilterPeriod('months', 1) }} />
                    <FilterButton label="5 Mes" onPress={() => { setFilterPeriod('months', 5) }} />
                    <FilterButton label="1 Año" onPress={() => { setFilterPeriod('years', 1) }} />
                </Box>
                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                <Button
                    flexDirection={'row'}
                    colorScheme={'primary'}
                    endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
                    onPress={() => {
                        dispatch(updateFilter({ enabled: false, from_stats: from.getTime(), until_stats: until.getTime() }))
                        props.navigation.dispatch(
                            CommonActions.navigate({
                                name: 'StatisticsHome'
                            })
                        )
                    }}
                >
                    {TS.t('apply')}
                </Button>
            </Box>
        </View>
    )
}