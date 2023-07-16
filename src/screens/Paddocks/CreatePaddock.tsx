import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './ScreenStack';
import { VStack, Text, Heading, Input, View, IconButton, Icon, ScrollView, FlatList, HStack, Button, Toast } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useTypedDispatch, useTypedSelector } from '../../features/store/storeHooks';
import { LatLng } from 'react-native-maps';
import { addPaddock, deletePaddock, updatePaddock } from '../../features/store/paddockSlice';
import { addNotification } from '../../features/store/notificationSlice';
import { getLocation } from '../../features/location/location';
import { insertPaddock, modifyPaddock, removePaddock } from '../../features/localDB/localDB';

type Props = NativeStackScreenProps<StackParamList, 'CreatePaddock'>;


export default function CreatePaddock(props: Props) {

    //-------CONST & HOOKS---------//
    const dispatch = useTypedDispatch();
    const paddockList = useTypedSelector(state => state.paddock.paddocks);
    const { route, navigation } = props;
    const { paddockId, create } = route.params;
    const [paddockName, setPaddockName] = useState('name');
    const [currentLocation, setCurrentLocation] = useState<LatLng>({ longitude: 0, latitude: 0 });
    const [vertices, setVertices] = useState<LatLng[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity style={{ marginRight: 16 }} onPress={() => { }}>
                        <Text>Details</Text>
                    </TouchableOpacity>
                )
            }
        })
        setVertices(!create && paddockId >= 0 ? paddockList[paddockId].vertices : []);
        setPaddockName(!create && paddockId >= 0 ? paddockList[paddockId].name : '');
        getLocation().then((value) => { setCurrentLocation(value.coords) })
        console.log('PADDOCK_ID', paddockList[paddockId]);
    }, [paddockList])

    const saveVertices = async (name: string, vertices: LatLng[], Id:number) => {
        let newID;
        if (Id >= 0)
            modifyPaddock(name, vertices, Id);
        else{
            newID = await insertPaddock(name, vertices);
        }
        let _data = { ID: newID, name: name, vertices:vertices };
        dispatch(updatePaddock({ data: _data, paddockId: paddockId }))
    }

    const changeTextHandler = (v: string, index: number) => {
        let c = [...vertices];
        let s = v.trim().split(';');
        c[index] = { latitude: parseFloat(s[0]), longitude: parseFloat(s[1]) };
        setVertices(c);
    }

    //----------JSX-----------//
    return (
        <VStack bg='white' flex={1} alignItems='center' paddingTop={5}>

            <View paddingBottom={5}>
                <Heading size='xl' fontWeight='light' marginBottom={4} >Nombre de Potrero</Heading>
                <Input
                    fontSize={'lg'}
                    defaultValue={paddockName}
                    size='2xl'
                    onChangeText={(text) => {
                        setPaddockName(text);
                    }}
                    placeholder="Ingrese nombre de potrero" />
            </View>
            <Heading size='xl' fontWeight='light' marginBottom={4} >Vertices </Heading>
            <FlatList
                width={'100%'}
                keyExtractor={(item, index) => index.toString()}
                data={vertices || []}
                renderItem={({ item, index }) => (

                    <View flexDir={'row'} paddingTop={2} justifyContent={'space-around'} width={'100%'}>
                        <Input
                            flex={1}
                            fontSize={'lg'}
                            defaultValue={item.latitude + ' ; ' + item.longitude}
                            marginLeft={3}
                            placeholder="Coordenadas"
                            keyboardType='numeric'
                            multiline={true}
                            numberOfLines={2}
                            onChangeText={(v) => { changeTextHandler(v, index) }}
                        />

                        <IconButton
                            marginRight={3}
                            marginLeft={3}
                            onPress={() => {
                                navigation.dispatch(
                                    CommonActions.navigate({
                                        name: 'FindInMapScreen',
                                        params: {
                                            coordinates: item,
                                            paddockId: paddockId,
                                            pointId: index
                                        }
                                    })
                                )
                            }}
                            colorScheme='green'
                            _icon={{
                                as: Entypo,
                                name: "location",
                                size: '2xl'
                            }} />

                    </View>
                )}
            >

            </FlatList>

            <HStack bottom={5} width={'100%'} justifyContent={'space-evenly'} paddingLeft={10} paddingRight={10} >
                <View justifyContent={'center'}>
                    <IconButton backgroundColor={'#2ecc71'} borderColor={'#2ecc7155'} borderWidth={3}
                        _icon={{
                            as: Entypo,
                            name: "plus",
                            size: '4xl'
                        }}
                        rounded='full' variant='solid' style={{ width: 65, height: 65 }} onPress={() => {
                            if (paddockName == '') { Toast.show({ description: 'Error: Agregue un nombre antes de\nagregar vertices (PCP1)' }); return; }
                            if (paddockId >= 0) {
                                navigation.dispatch(
                                    CommonActions.navigate({
                                        name: 'FindInMapScreen',
                                        params: {
                                            coordinates: paddockList[paddockId]?.vertices[0],
                                            paddockId: paddockId,
                                            pointId: 0
                                        }
                                    })
                                )
                            }
                            else {
                                let newIndex = dispatch(addPaddock({ data: { name: paddockName, vertices: [] } })).payload.index
                                navigation.dispatch(
                                    CommonActions.navigate({
                                        name: 'FindInMapScreen',
                                        params: {
                                            coordinates: currentLocation,
                                            paddockId: newIndex,
                                            pointId: 0
                                        }
                                    })
                                )
                            }
                        }}>
                    </IconButton>
                    <Heading size='md' fontWeight='light'>Agregar</Heading>
                </View>

                <View>
                    <IconButton backgroundColor={'#f39c12'}
                        borderColor={'#f39c1255'}
                        borderWidth={3}
                        _icon={{
                            as: Entypo,
                            name: "save",
                            size: '3xl'
                        }}
                        rounded='full' variant='solid' style={{ width: 65, height: 65 }} onPress={() => {
                            if (vertices.length == 0) { Toast.show({ description: ' Ingrese vertices antes de guardar.' }); return; }
                            if (paddockName == '') { Toast.show({ description: 'Ingrese un nombre antes de guardar.' }); return; }
                            let _data = { ID: paddockList[paddockId].ID, name: paddockName, vertices: vertices };
                            saveVertices(paddockName, vertices, _data.ID!=undefined ? _data.ID : -1);
                            dispatch(addNotification({ status: 'info', title: 'Potrero guardado correctamente.' }))
                            navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'PaddockHome'
                                })
                            )
                        }}>
                    </IconButton>
                    <Heading size='md' fontWeight='light'>Guardar</Heading>
                </View>
                {
                    create ? <></> :
                        <View>
                            <IconButton backgroundColor={'#b03a2e'}
                                borderColor={'#b03a2e55'}
                                borderWidth={3}
                                _icon={{
                                    as: FontAwesome5,
                                    name: "trash",
                                    size: 'xl',
                                    marginLeft: 1
                                }}
                                rounded='full' variant='solid' style={{ width: 65, height: 65 }} onPress={() => {
                                    let idToRemove = paddockList[paddockId].ID;;
                                    dispatch(deletePaddock({ paddockId: paddockId }))
                                    dispatch(addNotification({ status: 'info', title: 'Potrero guardado correctamente.' }))
                                    if (!create && idToRemove) {
                                        removePaddock(idToRemove)
                                    }
                                    navigation.dispatch(
                                        CommonActions.navigate({
                                            name: 'PaddockHome'
                                        })
                                    )
                                }}>
                            </IconButton>
                            <Heading size='md' fontWeight='light'>Borrar</Heading>
                        </View>
                }
            </HStack>
        </VStack>
    );
};









