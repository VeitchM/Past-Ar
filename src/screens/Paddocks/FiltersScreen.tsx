import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Box, Select, View, Input, Icon, ChevronDownIcon, Divider, Heading, Switch } from "native-base";
import React, { useEffect, useState } from "react";
import DatePicker from 'react-native-date-picker'
import { StackParamList } from "./ScreenStack";
import { CommonActions } from "@react-navigation/native";
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { event } from "react-native-reanimated";
import { useTypedDispatch, useTypedSelector } from "../../features/store/storeHooks";
import { updateFilter } from "../../features/store/filterSlice";

type Props = NativeStackScreenProps<StackParamList, 'FiltersScreen'>;

export default function FiltersScreen(props: Props) {

    const [isFromVisible, setIsFromVisible] = useState(false);
    const [isUntilVisible, setIsUntilVisible] = useState(false);
    const [from, setFrom] = useState<Date>(new Date());
    const [until, setUntil] = useState<Date>(new Date());
    const [showMeasurements, setShowMeasurements] = useState(false);
    const filterState = useTypedSelector(state => state.filter);
    const dispatch = useTypedDispatch();

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

    useEffect(() => {
        setIsFromVisible(false);
        setIsUntilVisible(false);
        setShowMeasurements(filterState.enabled);
        setFrom(new Date(filterState.from));
        setUntil(new Date(filterState.until));
    }, [])

    return (
        <View backgroundColor={'white'} flex={1} padding={5}>
            <Box width={'100%'} height={'100%'} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" padding={5}>
                <Box>
                    <DatePicker
                        mode="date"
                        title="Selecciona fecha desde"
                        modal open={isFromVisible} date={from}
                        onConfirm={handleFromConfirm}
                        onCancel={() => { setIsFromVisible(false) }}
                    />
                </Box>
                <DatePicker
                    mode="date"
                    title="Selecciona fecha hasta"
                    modal open={isUntilVisible} date={until}
                    onConfirm={handleUntilConfirm}
                    onCancel={() => { setIsUntilVisible(false) }}
                />
                <Heading size='lg'>Mediciones</Heading>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                    <Heading size='md' marginBottom={1} fontWeight='light'>Mostrar mediciones</Heading>
                    <View flex={1} />
                    <Switch size="lg" value={showMeasurements} onToggle={(state) => { setShowMeasurements(state) }} />
                </View>
                <Heading size='md' fontWeight='light'>Desde</Heading>
                <Button
                    isDisabled={!showMeasurements}
                    flexDirection={'row'}
                    variant={'subtle'}
                    colorScheme={'trueGray'}
                    endIcon={<Icon as={FontAwesome5} name="chevron-down" size="md" />}
                    marginBottom={5}
                    onPress={() => { setIsFromVisible(true) }}>
                    {from ? from.toDateString() : 'Fecha desde'}
                </Button>
                <Heading size='md' fontWeight='light'>Hasta</Heading>
                <Button
                    isDisabled={!showMeasurements}
                    flexDirection={'row'}
                    variant={'subtle'}
                    colorScheme={'trueGray'}
                    endIcon={<Icon as={FontAwesome5} name="chevron-down" size="md" />}
                    marginBottom={5}
                    onPress={() => { setIsUntilVisible(true) }}>
                    {until ? until.toDateString() : 'Fecha hasta'}
                </Button>
                <View flex={1} />
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Button
                    flexDirection={'row'}
                    colorScheme={'primary'}
                    endIcon={<Icon as={FontAwesome5} name="check" size="md" />}
                    onPress={() => {
                        dispatch(updateFilter({ enabled: showMeasurements, from: from.getTime(), until: until.getTime() }))
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
        </View>
    )
}