import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "./ScreenStack";
import { Box, Button, Divider, Heading, Icon, Modal, ScrollView, Select, View } from "native-base";
import { ActivityIndicator, Dimensions, Text, TouchableHighlight, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
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
    const [from, setFrom] = useState((d=>new Date(d.setDate(d.getDate()-1)))(new Date()));
    const [until, setUntil] = useState(new Date());
    const [selectedCalibration, setSelectedCalibration] = useState(-1);
    const [calibrations, setCalibrations] = useState<CalibrationLocalDB[]>([])

    useEffect(() => {
        readMeasurements();
        readCalibrations();
    }, [])

    const readMeasurements = async (_from?: number, _until?: number, calibration?: number) => {
        setLocation(await getLocation());
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
        return (sum / (_measurements.length * 1.0)).toFixed(3);
    }



    const FilterButton = () => {
        return (
            <View rounded={'full'} style={{ flex: 1, position: 'absolute', bottom: 15, right: 15, padding: 0 }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { setFilterModalVisible(!filterModalVisible) }}>
                    <View flexDirection={'row'} rounded={'full'} background={'#6c3483'} height={70} borderWidth={4} borderColor={'#6c348388'} padding={4}>
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
                            {from.toDateString()}
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
                            {until.toDateString()}
                        </Button>
                        <Divider marginTop={5} marginBottom={5} />
                        <Button
                            flexDirection={'row'}
                            colorScheme={'primary'}
                            endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
                            onPress={() => { setFilterModalVisible(false); readMeasurements(from.getTime(), until.getTime()); readMeasurements(from.getTime(), until.getTime()); }}
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
                <Select backgroundColor={'#fff'} width={screenWidth * 0.90} borderColor={'#27ae60'} borderWidth={1} marginTop={5} selectedValue={selectedCalibration + ''} onValueChange={itemValue => { setSelectedCalibration(Number.parseInt(itemValue)); readMeasurements(from.getTime(), until.getTime(), Number.parseInt(itemValue)) }}  placeholder="Elegir Calibración" >
                    {calibrations.map((calibration) => {
                        return <Select.Item
                            key={calibration.ID}
                            label={calibration.name}
                            value={calibration.ID.toString()} />
                    })}
                </Select>
                <Box justifyContent='space-evenly' marginTop={15} alignItems={'center'} backgroundColor={'#7a7b87'}
                    rounded={'lg'} height={250} width={'95%'} borderWidth={1} borderColor={'coolGray.200'}>
                    <Heading size='lg' marginTop={4} marginBottom={4} color={'#fff'}>Ultimas Mediciones</Heading>
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
                            <Heading size='lg' >{'Desde: '+FormatUtils.formatBasicDate(from)}</Heading>
                            <Divider />
                            <Heading size='lg' >{'Hasta: ' + FormatUtils.formatBasicDate(until)}</Heading>
                        </>
                </Box>
            </ScrollView>
        );
    }

    return <>
        <MainScreen />
        <FilterButton />
        {modalFrom || modalUntil ? <></> : <FilterModal />}
        <DatePicker
            androidVariant="iosClone"
            mode="date"
            title="Selecciona fecha desde"
            modal open={modalFrom} date={from}
            onConfirm={(v) => { setModalFrom(false); setFrom(v); }}
            onCancel={() => { setModalFrom(false); }}
        />
        <DatePicker
            androidVariant="iosClone"
            mode="date"
            title="Selecciona fecha hasta"
            modal open={modalUntil} date={until}
            onConfirm={(v) => { setModalUntil(false); setUntil(v); }}
            onCancel={() => { setModalUntil(false); }}
        />
    </>;

}