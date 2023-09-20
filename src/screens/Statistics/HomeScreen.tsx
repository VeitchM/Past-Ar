import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "./ScreenStack";
import { Box, Button, Divider, Heading, Icon, Modal, ScrollView, Select, View } from "native-base";
import { ActivityIndicator, Dimensions, Text, TouchableHighlight, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useCallback, useEffect, useState } from "react";
import { getLocation } from "../../features/location/location";
import { LocationObject } from "expo-location";
import { Measurement } from "../../features/store/types";
import { calculateByHeight } from "../../features/statistics/WeightCalculus";
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DatePicker from "react-native-date-picker";
import { CalibrationLocalDB } from "../../features/localDB/types";
import FormatUtils from "../../features/utils/FormatUtils";

import { getCalibrations, getCalibrationsFromMeasurementExtended } from "../../features/localDB/calibrations";
import { getMeasurements, getMeasurementsBetween, insertMeasurement } from "../../features/localDB/measurements";
import { themeNavigation } from "../../theme";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { useTypedSelector } from "../../features/store/storeHooks";

const screenWidth = Dimensions.get("window").width;
const Tab = createMaterialTopTabNavigator();

type Props = NativeStackScreenProps<StackParamList, 'StatisticsHome'>;

export default function PaddockScreen(props: Props) {
    const [location, setLocation] = useState<LocationObject>();
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [weight, setWeight] = useState(0);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [modalFrom, setModalFrom] = useState(false);
    const [modalUntil, setModalUntil] = useState(false);
    const [selectedCalibration, setSelectedCalibration] = useState(-1);
    const [calibrations, setCalibrations] = useState<CalibrationLocalDB[]>([])
    const filterState = useTypedSelector(state => state.filter);

    useEffect(() => {
        // setFrom(new Date(filterState.from_stats));
        // setUntil(new Date(filterState.until_stats));
        readMeasurements(filterState.from_stats, filterState.until_stats);
        readCalibrations();
    }, [filterState])

    // useFocusEffect(
    //     useCallback(() => {
    //         console.log('Focused');
    //         // setFrom(new Date(filterState.from_stats));
    //         // setUntil(new Date(filterState.until_stats));
    //         readMeasurements(filterState.from_stats, filterState.until_stats)
    //         return () => {

    //         }
    //     }, []))

    const readMeasurements = async (_from?: number, _until?: number, calibration?: number) => {
        let date = new Date(); date.setDate(date.getDate() - 2);
        let f, u;
        if (_from == undefined || _until == undefined) {
            f = date.getTime(); u = (new Date).getTime();
        }
        else {
            f = _from; u = _until;
        }
        let mes = await getMeasurementsBetween(f, u);
        setMeasurements(mes.rows._array);
        if (calibration) setWeight(await calculateByHeight(parseFloat(meanHeight(mes.rows._array)), calibration));
        else if (selectedCalibration) setWeight(await calculateByHeight(parseFloat(meanHeight(mes.rows._array)), selectedCalibration));
    }

    const readCalibrations = () => {
        getCalibrations()
            .then((calibrations) => {
                if (calibrations) setCalibrations(calibrations)
            })
    }

    const meanHeight = (_measurements: Measurement[]) => {
        let sum = 0;
        _measurements.forEach(e => { sum += e.height });
        return (sum != 0) ? (sum / (_measurements.length * 1.0)).toFixed(3) : '0.0';
    }



    const FilterButton = () => {
        return (
            <View rounded={'full'} style={{ flex: 1, position: 'absolute', bottom: 15, right: 15, padding: 0 }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    props.navigation.dispatch(CommonActions.navigate({ name: 'FiltersScreen' }))
                }}>
                    <View flexDirection={'row'} rounded={'full'} background={themeNavigation.colors.primary} height={70} width={70} borderWidth={4} borderColor={themeNavigation.colors.primary + '88'} padding={4}>
                        <Icon color={'#fff'} as={FontAwesome5} name={'filter'} size={'2xl'} marginTop={1}></Icon>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    function FilterModal() {
        return (
            <Modal isOpen={filterModalVisible} backdropVisible padding={10} onClose={() => { setFilterModalVisible(false) }}>
                <Modal.Content width={'100%'}>
                    <Modal.Header>Filtrar Estadisticas</Modal.Header>
                    <TouchableHighlight underlayColor={'#00000055'} style={{ position: 'absolute', top: 10, right: 10, borderRadius: 6 }} onPress={() => { setFilterModalVisible(false) }}>
                        <View rounded={'md'} style={{ backgroundColor: 'red', height: 35, width: 35, paddingLeft: 7, elevation: 4 }}>
                            <Icon as={FontAwesome5} name="times" size={'lg'} color={'#fff'} />
                        </View>
                    </TouchableHighlight>
                    <Modal.Body>
                        <Heading size='md' fontWeight='light'>Desde</Heading>
                        <Button
                            isDisabled={false}
                            flexDirection={'row'}
                            variant={'subtle'}
                            colorScheme={'trueGray'}
                            endIcon={<Icon as={FontAwesome5} name="chevron-down" size="md" />}
                            marginBottom={5}
                            onPress={() => { setModalFrom(!modalFrom); }}
                        >
                            {(new Date(filterState.from_stats)).toDateString()}
                        </Button>
                        <Heading size='md' fontWeight='light'>Hasta</Heading>
                        <Button
                            isDisabled={false}
                            flexDirection={'row'}
                            variant={'subtle'}
                            colorScheme={'trueGray'}
                            endIcon={<Icon as={FontAwesome5} name="chevron-down" size="md" />}
                            onPress={() => { setModalUntil(!modalUntil); }}
                        >
                            {(new Date(filterState.until_stats)).toDateString()}
                        </Button>
                        <Divider marginTop={5} marginBottom={5} />
                        <Button
                            flexDirection={'row'}
                            colorScheme={'primary'}
                            endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
                            onPress={() => { setFilterModalVisible(false); readMeasurements(filterState.from_stats, filterState.until_stats); readMeasurements(filterState.from_stats, filterState.until_stats); }}
                        >
                            {'Aplicar'}
                        </Button>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

        );
    }

    function MainScreen() {
        return (
            <ScrollView flex={1} contentContainerStyle={{ alignItems: 'center' }}>

                <Box justifyContent='space-evenly' marginTop={15} alignItems={'center'} backgroundColor={'#7a7b87'}
                    rounded={'lg'} height={250} width={'95%'} borderWidth={1} borderColor={'coolGray.200'}>
                    <Heading size='lg' marginTop={4} marginBottom={4} color={'#fff'}>Mediciones</Heading>
                    {measurements.length == 0 || selectedCalibration == -1 ?
                        <>
                            <Heading size='lg' marginBottom={2}>No registra en periodo</Heading>
                        </>
                        :
                        <LineChart
                            data={{
                                labels: measurements.map((e, i) => { return (i + 1) + '' }),
                                datasets: [
                                    {
                                        data: measurements.map(e => { return e.height })
                                    }
                                ]
                            }}
                            width={screenWidth * 0.90} // from react-native
                            height={180}
                            yAxisSuffix=" cm"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: "#e26a00",
                                backgroundGradientFrom: "#7a7b87",
                                backgroundGradientTo: "#7a7b87",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    }
                </Box>
                <Divider marginBottom={3} marginTop={3} />
                <Select width={screenWidth} placeholderTextColor={'#fff'} borderColor={themeNavigation.colors.primary} color={'#fff'} backgroundColor={themeNavigation.colors.primary} borderWidth={0} selectedValue={selectedCalibration + ''} onValueChange={itemValue => { setSelectedCalibration(Number.parseInt(itemValue)); readMeasurements(filterState.from_stats, filterState.until_stats, Number.parseInt(itemValue)) }} placeholder="Elegir Calibración" >
                    {calibrations.map((calibration) => {
                        return <Select.Item
                            key={calibration.ID}
                            label={calibration.name}
                            value={calibration.ID.toString()} />
                    })}
                </Select>
                <Box justifyContent='space-evenly' marginTop={2} alignItems={'center'} backgroundColor={'#fff'}
                    rounded={'lg'} height={90} width={'95%'} borderWidth={1} borderColor={'coolGray.200'}>

                    {measurements.length > 0 && selectedCalibration != -1 ?
                        <>
                            <Heading size='lg' marginTop={3}>Altura Media  (cm)</Heading>
                            <Divider marginTop={3} />
                            <Heading size='3xl' marginBottom={2}>{meanHeight(measurements)}</Heading>
                        </>
                        :
                        <>
                            <Heading size='lg' marginTop={3}>Altura Media  (cm)</Heading>
                            <Divider marginTop={3} />
                            <Heading size='lg' marginBottom={2}>No registra en periodo</Heading>
                        </>
                    }
                </Box>

                <Box justifyContent='space-evenly' marginTop={2} alignItems={'center'} backgroundColor={'#fff'}
                    rounded={'lg'} height={90} width={'95%'} borderWidth={1} borderColor={'coolGray.200'}>
                    {measurements.length > 0 && selectedCalibration >= 0 ?
                        <>
                            <Heading size='lg' marginTop={3}>Peso Medio  (kgMS/ha)</Heading>
                            <Divider marginTop={3} />
                            <Heading size='3xl' marginBottom={2} marginRight={5}>{weight.toFixed(1)}</Heading>
                        </>
                        :
                        <>
                            <Heading size='lg' marginTop={3}>Peso Medio  (kgMS/ha)</Heading>
                            <Divider marginTop={3} />
                            <Heading size='lg' marginBottom={2}>No registra en periodo</Heading>
                        </>
                    }
                </Box>

                <Box justifyContent='space-evenly' marginTop={2} alignItems={'center'} backgroundColor={'#fff'}
                    rounded={'lg'} height={90} width={'95%'} borderWidth={1} borderColor={'coolGray.200'}>
                    {measurements.length > 0 && selectedCalibration != -1 ?
                        <>
                            <Heading size='lg' marginTop={3}>Mediciones</Heading>
                            <Divider marginTop={3} />
                            <Heading size='3xl' marginBottom={2}>{measurements.length}</Heading>
                        </>
                        :
                        <>
                            <Heading size='lg' marginTop={3}>Mediciones</Heading>
                            <Divider marginTop={3} />
                            <Heading size='lg' marginBottom={2}>No registra en periodo</Heading>
                        </>
                    }
                </Box>
                <Box marginBottom={15} justifyContent='space-evenly' marginTop={2} alignItems={'center'} backgroundColor={'#fff'}
                    rounded={'lg'} height={90} width={'95%'} borderWidth={1} borderColor={'coolGray.200'}>
                    <>
                        <Heading size='lg' >{'Desde: ' + FormatUtils.formatBasicDate(new Date(filterState.from_stats))}</Heading>
                        <Divider />
                        <Heading size='lg' >{'Hasta: ' + FormatUtils.formatBasicDate(new Date(filterState.until_stats))}</Heading>
                    </>
                </Box>
            </ScrollView>
        );
    }

    return <>
        <MainScreen />
        <FilterButton />
        {/* {modalFrom || modalUntil ? <></> : <FilterModal />} */}
        {/* <DatePicker
            androidVariant="iosClone"
            mode="date"
            title="Selecciona fecha desde"
            modal open={modalFrom} date={from}
            onConfirm={(v) => { setModalFrom(false); setFrom(v); }}
            onCancel={() => { setModalFrom(false); }}
        /> */}
        {/* <DatePicker
            androidVariant="iosClone"
            mode="date"
            title="Selecciona fecha hasta"
            modal open={modalUntil} date={until}
            onConfirm={(v) => { setModalUntil(false); setUntil(v); }}
            onCancel={() => { setModalUntil(false); }}
        /> */}
    </>;

}