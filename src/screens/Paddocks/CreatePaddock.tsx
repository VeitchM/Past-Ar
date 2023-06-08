import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './ScreenStack';
import { VStack, Text, Heading, Input, View, IconButton, Icon, ScrollView, FlatList, HStack, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useTypedDispatch, useTypedSelector } from '../../features/store/storeHooks';
import { LatLng } from 'react-native-maps';
import { updatePaddock } from '../../features/store/paddockSlice';
import { addNotification } from '../../features/store/notificationSlice';
import { getLocation } from '../../features/location/location';

type Props = NativeStackScreenProps<StackParamList, 'CreatePaddock'>;


export default function CreatePaddock(props: Props) {

    //-------CONST & HOOKS---------//
    const dispatch      = useTypedDispatch();
    const paddockList   = useTypedSelector(state => state.paddock.paddocks);
    const { route, navigation   } = props;
    const { paddockId           } = route.params;
    const [paddockName, setPaddockName          ] = useState('name');
    const [currentLocation, setCurrentLocation  ] = useState<LatLng>({ longitude: 0, latitude: 0 });
    
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity style={{ marginRight: 16 }} onPress={() => {}}>
                        <Text>Details</Text>
                    </TouchableOpacity>
                )
            },
        })
        setPaddockName(paddockList[paddockId]?.name);
        getLocation().then((value) => { setCurrentLocation(value.coords) })
    }, [])

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
                data={paddockList[paddockId]?.vertices}
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

            <HStack bottom={5} alignItems={'center'}>
                <Heading size='md' fontWeight='light' marginRight={5} marginTop={8}>Agregar</Heading>
                <IconButton backgroundColor={'#2ecc71'} borderColor={'#2ecc7155'} borderWidth={3} marginRight={5}
                    _icon={{
                        as: Entypo,
                        name: "plus",
                        size: '4xl'
                    }}
                    rounded='full' variant='solid' style={{ width: 65, height: 65 }} onPress={() => {
                        
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
                            navigation.dispatch(
                                CommonActions.navigate({
                                    name: 'FindInMapScreen',
                                    params: {
                                        coordinates: currentLocation,
                                        paddockId: -1,
                                        pointId: -1
                                    }
                                })
                            )
                        }
                    }}>
                </IconButton>

                <IconButton backgroundColor={'#f39c12'}
                    borderColor={'#f39c1255'}
                    borderWidth={3}
                    _icon={{
                        as: Entypo,
                        name: "save",
                        size: '4xl'
                    }}
                    rounded='full' variant='solid' style={{ width: 65, height: 65 }} onPress={() => {
                        let c = [...paddockList];
                        c[paddockId] = { name: paddockName, vertices: paddockList[paddockId]?.vertices };
                        dispatch(updatePaddock({ data: c[paddockId], paddockId: paddockId }))
                        dispatch(addNotification({ status: 'info', title: 'Potrero guardado correctamente.' }))

                        navigation.dispatch(
                            CommonActions.navigate({
                                name: 'PaddockHome'
                            })
                        )
                    }}>
                </IconButton>
                <Heading size='md' fontWeight='light' marginLeft={5} marginTop={8}>Guardar</Heading>
            </HStack>
        </VStack>
    );
};









