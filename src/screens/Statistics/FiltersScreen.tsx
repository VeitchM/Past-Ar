import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Box,
  Select,
  View,
  Input,
  Icon,
  ChevronDownIcon,
  Divider,
  Heading,
  Switch,
  Modal,
  HStack,
} from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "react-native-date-picker";
import { StackParamList } from "./ScreenStack";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { event } from "react-native-reanimated";
import {
  useTypedDispatch,
  useTypedSelector,
} from "../../features/store/storeHooks";
import { updateFilter } from "../../features/store/filterSlice";
import CalendarPicker from "react-native-calendar-picker";
import { Dimensions, Text } from "react-native";
import moment from "moment";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { TouchableHighlight } from "react-native-gesture-handler";
import Formatter from "../../features/utils/FormatUtils";
import TS from "../../../TS";
import { PaddockLocalDB, SectorLocalDB } from "../../features/localDB/types";
import FormatUtils from "../../features/utils/FormatUtils";
import { getSectors, getSectorsBetween } from "../../features/localDB/sectors";
import { Paddock } from "../../features/store/types";
import { getPaddocks } from "../../features/localDB/paddocks";

type Props = NativeStackScreenProps<StackParamList, "FiltersScreen">;

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
  const filterState = useTypedSelector((state) => state.filter);
  const [currentButton, setCurrentButton] = useState('');
  const paddockSheet = useRef<BottomSheet>(null);
  const sectorSheet = useRef<BottomSheet>(null);
  const [filteredSector, setFilteredSector] = useState<number>(-1);
  const [sectors, setSectors] = useState<SectorLocalDB[]>([]);
  const [paddockList, setPaddockList] = useState<PaddockLocalDB[]>([]);

  const handleFromConfirm = (datetime: any) => {
    setIsFromVisible(false);
    setFrom(datetime);
    readSectors(datetime, until.getTime());
    console.log("A date has been picked: ", datetime)
  }

  const handleUntilConfirm = (datetime: any) => {
    setIsUntilVisible(false);
    setUntil(datetime);
    readSectors(from.getTime(), datetime);
    console.log("A date has been picked: ", datetime)
  }

  const handleDateChange = (source: "until" | "from", data: any) => {
    console.log("Changed Date to -> ", from ? from : "", until ? until : "");
    if (source == "until") setUntil(data);
    else setFrom(data);
  };

  useEffect(() => {
    setIsFromVisible(false);
    setIsUntilVisible(false);
    setFrom(new Date(filterState.from_stats));
    setUntil(new Date(filterState.until_stats));
    readSectors(filterState.from_stats, filterState.until_stats);
    readPaddocks();
    if (filterState.shortcutFilterId) setCurrentButton(filterState.shortcutFilterId);
    if (filterState.filteredPaddock) setFilteredPaddock(filterState.filteredPaddock);
    if (filterState.filteredSector) setFilteredSector(filterState.filteredSector);
    sheetRef.current?.close();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setFrom(new Date(filterState.from_stats));
      setUntil(new Date(filterState.until_stats));
    }, [])
  );

  const readSectors = (_from?: number, _until?: number) => {
    if (_from == undefined || _until == undefined) {
      getSectors().then((s) => {
        if (s) setSectors(s.filter((ss) => { return !!ss.finish_date && !!ss.start_date }))
        else setSectors([])
      })
    }
    else {
      getSectorsBetween(_from, _until).then((s) => {
        if (s) setSectors(s)
        else setSectors([])
      })
    }
    setFilteredSector(-1);
  }

  const readPaddocks = () => {
    getPaddocks().then((p) => { setPaddockList(p) });
  }

  const FilterButton = (props: any) => {
    let { label, onPress } = props;
    return (
      <View padding={0.5} borderRadius={20} margin={1} borderWidth={currentButton == label ? 2 : 0}
        width={95}
        height={65}
      >
        <Button
          width={85}
          height={55}
          flexDirection={"row"}
          colorScheme={"coolGray"}
          onPress={() => { setCurrentButton(label); onPress(); }}
        >
          {label}
        </Button>
      </View>
    );
  };

  function setFilterPeriod(
    timeAmmount: "days" | "months" | "years",
    value: number
  ) {
    let _from = new Date();
    let _until = new Date();
    _until.setDate(_until.getDate()+1);
    switch (timeAmmount) {
      case "days":
        {
          _from.setDate(_from.getDate() - value);
        }
        break;
      case "months":
        {
          _from.setMonth(_from.getMonth() - value);
        }
        break;
      case "years": {
        _from.setFullYear(_from.getFullYear() - value);
      }
    }
    setFrom(_from);
    setUntil(_until);
    readSectors(_from.getTime(), _until.getTime());
  }

  return (
    <View backgroundColor={"white"} flex={1} padding={5}>
      <Box
        width={"100%"}
        height={"100%"}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        padding={5}
      >
        <DatePicker
          mode="date"
          title={TS.t("select_from_date")}
          modal
          open={isFromVisible}
          date={from}
          onConfirm={handleFromConfirm}
          onCancel={() => {
            setIsFromVisible(false);
          }}
          androidVariant="iosClone"
        />

        <DatePicker
          mode="date"
          title={TS.t("select_until_date")}
          modal
          open={isUntilVisible}
          date={until}
          onConfirm={handleUntilConfirm}
          onCancel={() => {
            setIsUntilVisible(false);
          }}
          androidVariant="iosClone"
        />
        <View height={30} flexDirection={'row'} justifyContent={'flex-start'}>
          <Heading size='lg'>{TS.t('measurements')}</Heading>
          <View flex={1} />
        </View>
        <Divider style={{ marginTop: 20, marginBottom: 20 }} />
        <View flex={1} />
        <View justifyContent={'flex-start'} flexDirection={'row'}>
          <Heading size='md' marginBottom={5} marginRight={3} fontWeight='light'>{TS.t('from')}</Heading>
          <View flex={1} />
          <Button
            width={230}
            flexDirection={'row'}
            variant={'outline'}
            colorScheme={'trueGray'}
            bgColor={'trueGray.100'}
            _pressed={{ bgColor: 'trueGray.200' }}
            endIcon={<Icon as={FontAwesome5} marginLeft={5} name="chevron-down" size="md" />}
            marginBottom={5}
            onPress={() => { setIsFromVisible(true) }}>
            {from ? Formatter.formatBasicDate(from) : '<-'}
          </Button>
        </View>
        <View justifyContent={'flex-start'} flexDirection={'row'}>
          <Heading size='md' fontWeight='light' marginBottom={5} marginRight={3}>{TS.t('to')}</Heading>
          <View flex={1} />
          <Button
            width={230}
            flexDirection={'row'}
            variant={'outline'}
            colorScheme={'trueGray'}
            bgColor={'trueGray.100'}
            _pressed={{ bgColor: 'trueGray.200' }}
            endIcon={<Icon as={FontAwesome5} marginLeft={5} name="chevron-down" size="md" />}
            marginBottom={5}
            onPress={() => { setIsUntilVisible(true) }}>
            {until ? Formatter.formatBasicDate(until) : '->'}
          </Button>
        </View>
        <View flex={1} />
        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
        <Box flexWrap={"wrap"} flexDir={"row"} justifyContent={"space-evenly"}>
          <FilterButton label={"24 " + TS.t("hour_short")} onPress={() => { setFilterPeriod('days', 1) }} />
          <FilterButton label={"48 " + TS.t("hour_short")} onPress={() => { setFilterPeriod('days', 2) }} />
          <FilterButton label={"1 " + TS.t("week_short")} onPress={() => { setFilterPeriod('days', 7) }} />
          <FilterButton label={"1 " + TS.t("month_short")} onPress={() => { setFilterPeriod('months', 1) }} />
          <FilterButton label={"5 " + TS.t("month_short")} onPress={() => { setFilterPeriod('months', 5) }} />
          <FilterButton label={"1 " + TS.t("year_short")} onPress={() => { setFilterPeriod('years', 1) }} />
        </Box>
        <Divider marginBottom={5} marginTop={3} />
        <View flexDirection={'row'}>
          <Button flex={1} height={55} flexDirection={"row"} backgroundColor={"#2563EB"}
            onPress={() => { paddockSheet.current?.snapToIndex(0) }}
            endIcon={filteredPaddock >= 0 ? <Icon as={FontAwesome5} name="check-circle" size="md" /> : <></>}
          >
            {TS.t("filters_paddock")}
          </Button>
          <View width={3} />
          <Button flex={1} height={55} flexDirection={"row"} backgroundColor={"#D97706"}
            onPress={() => { sectorSheet.current?.snapToIndex(0) }}
            endIcon={filteredSector >= 0 ? <Icon as={FontAwesome5} name="check-circle" size="md" /> : <></>}
          >
            {TS.t("filters_sector")}
          </Button>
        </View>
        <Divider marginBottom={5} marginTop={5} />
        <Button
          flexDirection={"row"}
          colorScheme={"primary"}
          endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
          onPress={() => {
            dispatch(
              updateFilter({
                enabled: false,
                from_stats: from.getTime(),
                until_stats: until.getTime(),
                shortcutFilterId: currentButton,
                filteredPaddock: filteredPaddock >= 0 ? filteredPaddock : undefined,
                filteredSector: filteredSector >= 0 ? filteredSector : undefined
              })
            );
            props.navigation.dispatch(
              CommonActions.navigate({
                name: "StatisticsHome",
              })
            );
          }}
        >
          {TS.t("apply")}
        </Button>
        <BottomSheet index={-1} ref={paddockSheet} snapPoints={['75%']} enablePanDownToClose backgroundStyle={{ backgroundColor: '#DDDDDD' }}>
          <Heading marginLeft={5} marginBottom={5} fontSize={'2xl'} color={'trueGray.500'}>{TS.t("filters_by_paddock").toUpperCase()}</Heading>
          <Divider />
          <BottomSheetFlatList
            style={{ paddingTop: 15, position: 'relative' }}
            data={paddockList}
            renderItem={({ item, index }) => (
              <Box marginBottom={index >= paddockList.length - 1 ? 8 : 3} marginLeft={3} marginRight={3}>
                <TouchableHighlight style={{ borderRadius: 8 }} underlayColor={'#'} onPress={() => { setFilteredPaddock(item.ID!); paddockSheet.current?.close() }}>
                  <Box flexDir={'row'} borderWidth={1} borderColor={'#525252'} rounded={'lg'} backgroundColor={filteredPaddock == item.ID ? '#525252' : 'trueGray.100'} padding={3}>
                    <Heading color={filteredPaddock == item.ID ? '#fff' : '#525252'}> {item.name} </Heading>
                    <View flex={1}></View>
                    {filteredPaddock != item.ID ? <></> :
                      <Icon as={FontAwesome5} name="check-circle" color={'#fff'} size={'2xl'} />
                    }
                  </Box>
                </TouchableHighlight>
              </Box>
            )}
          />
          <Box padding={4} backgroundColor={'trueGray.600'}>
            <TouchableHighlight style={{ borderRadius: 8 }} underlayColor={'#'} onPress={() => { setFilteredPaddock(-1); paddockSheet.current?.close(); }}>
              <Box flexDir={'row'} borderWidth={1} borderColor={'#2563EB'} rounded={'lg'} backgroundColor={'#3B82F6'} padding={3}>
                <Heading color={'#fff'}> {TS.t("filters_all_paddocks")} </Heading>
                <View flex={1}></View>
                {filteredPaddock != -1 ? <></> :
                  <Icon as={FontAwesome5} name="check-circle" color={'#fff'} size={'2xl'} />
                }
              </Box>
            </TouchableHighlight>
          </Box>
        </BottomSheet>

        {/* //------------ */}

        <BottomSheet index={-1} ref={sectorSheet} snapPoints={['75%']} enablePanDownToClose backgroundStyle={{ backgroundColor: '#DDDDDD' }}>
          <Heading marginLeft={5} marginBottom={5} fontSize={'2xl'} color={'trueGray.500'}>{TS.t("filters_by_sector").toUpperCase()}</Heading>
          <Divider />
          <BottomSheetFlatList
            style={{ paddingTop: 15, position: 'relative' }}
            data={sectors}
            renderItem={({ item, index }) => (
              <Box marginBottom={index >= sectors.length - 1 ? 8 : 3} marginLeft={3} marginRight={3}>
                <TouchableHighlight style={{ borderRadius: 8 }} underlayColor={'#'} onPress={() => { setFilteredSector(item.ID); sectorSheet.current?.close() }}>
                  <Box alignItems={'center'} flexDir={'row'} borderWidth={1} borderColor={'#525252'} rounded={'lg'} backgroundColor={filteredSector == item.ID ? '#525252' : 'trueGray.100'} padding={3}>
                    <Heading color={filteredSector == item.ID ? '#fff' : '#525252'}> {FormatUtils.formatExtendedDate(new Date(item.start_date)) + '\n ' + FormatUtils.formatExtendedDate(new Date(item.finish_date))} </Heading>
                    <View flex={1} />
                    {filteredSector != item.ID ? <></> :
                      <Icon as={FontAwesome5} name="check-circle" color={'#fff'} size={'2xl'} />
                    }
                  </Box>
                </TouchableHighlight>
              </Box>
            )}
          />
          <Box padding={4} backgroundColor={'trueGray.600'}>
            <TouchableHighlight style={{ borderRadius: 8 }} underlayColor={'#'} onPress={() => { setFilteredSector(-1); sectorSheet.current?.close(); }}>
              <Box flexDir={'row'} borderWidth={1} borderColor={'#D97706'} rounded={'lg'} backgroundColor={'#F59E0B'} padding={3}>
                <Heading color={'#fff'}> {TS.t("filters_all_sectors")} </Heading>
                <View flex={1}></View>
                {filteredSector != -1 ? <></> :
                  <Icon as={FontAwesome5} name="check-circle" color={'#fff'} size={'2xl'} />
                }
              </Box>
            </TouchableHighlight>
          </Box>
        </BottomSheet>
      </Box>
    </View>
  );
}
