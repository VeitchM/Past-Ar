import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "./ScreenStack";
import {
  VStack,
  Text,
  Heading,
  Input,
  View,
  IconButton,
  Icon,
  ScrollView,
  FlatList,
  HStack,
  Button,
  Toast,
} from "native-base";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableHighlight } from "react-native";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import {
  useTypedDispatch,
  useTypedSelector,
} from "../../features/store/storeHooks";
import { LatLng } from "react-native-maps";
import {
  addPaddock,
  deletePaddock,
  emptyPaddocks,
  updatePaddock,
} from "../../features/store/paddockSlice";
import { addNotification } from "../../features/store/notificationSlice";
import { getLocation } from "../../features/location/location";
import {
  insertPaddock,
  modifyPaddock,
  removePaddock,
} from "../../features/localDB/paddocks";
import { pushNotification } from "../../features/pushNotification";

type Props = NativeStackScreenProps<StackParamList, "CreatePaddock">;

export default function CreatePaddock(props: Props) {
  //-------CONST & HOOKS---------//
  const dispatch = useTypedDispatch();
  const paddockList = useTypedSelector((state) => state.paddock.paddocks);
  const { route, navigation } = props;
  const { paddockId, create } = route.params;
  const [paddockName, setPaddockName] = useState("name");
  const [currentLocation, setCurrentLocation] = useState<LatLng>({
    longitude: 0,
    latitude: 0,
  });
  const [vertices, setVertices] = useState<LatLng[]>([]);
  const [currentPaddockId, setCurrentPaddockId] = useState(-1);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: backButton,
    });
    setCurrentPaddockId(paddockId);
    setVertices(
      !create && paddockId >= 0 ? paddockList[paddockId].vertices : []
    );
    setPaddockName(
      !create && paddockId >= 0 ? paddockList[paddockId].name : ""
    );
    getLocation().then((value) => {
      if (value) setCurrentLocation(value.coords);
    });
  }, [paddockList, paddockId]);

  const backButton = () => {
    return (
      <TouchableHighlight
        style={{ borderRadius: 120, marginRight: 5 }}
        underlayColor={"#99a3a455"}
        onPress={() => {
          dispatch(emptyPaddocks());
          navigation.goBack();
        }}
      >
        <View
          borderRadius={120}
          height={50}
          width={50}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Icon as={FontAwesome5} color={"#000"} name="arrow-left" size="sm" />
        </View>
      </TouchableHighlight>
    );
  };

  const saveVertices = async (name: string, vertices: LatLng[], Id: number) => {
    let newID = Id;
    if (Id >= 0) modifyPaddock(name, vertices, Id);
    else {
      newID = await insertPaddock(name, vertices);
    }
    let _data = { ID: newID, name: name, vertices: vertices };
    dispatch(updatePaddock({ data: _data, paddockId: paddockId }));
  };

  const changeTextHandler = (v: string, index: number) => {
    let c = [...vertices];
    let s = v.trim().split(";");
    c[index] = { latitude: parseFloat(s[0]), longitude: parseFloat(s[1]) };
    setVertices(c);
  };

  function VerticesList() {
    return (
      <FlatList
        width={"100%"}
        keyExtractor={(item, index) => index.toString()}
        data={vertices || []}
        renderItem={({ item, index }) => (
          <View
            flexDir={"row"}
            paddingTop={2}
            justifyContent={"space-around"}
            width={"100%"}
          >
            <Heading marginLeft={5}>{"Lat:\nLng:"}</Heading>
            <TouchableHighlight
              style={{ flex: 1, borderRadius: 16, marginLeft: 5 }}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <Input
                flex={1}
                fontSize={"lg"}
                defaultValue={item.latitude + "\n" + item.longitude}
                placeholder="Coordenadas"
                multiline={true}
                numberOfLines={2}
                editable={false}
              />
            </TouchableHighlight>
            <IconButton
              marginRight={3}
              marginLeft={3}
              onPress={() => {
                navigation.dispatch(
                  CommonActions.navigate({
                    name: "EditScreen",
                    params: {
                      coordinates: item,
                      paddockId: paddockId,
                      pointId: index,
                    },
                  })
                );
              }}
              colorScheme="green"
              _icon={{ as: Entypo, name: "location", size: "2xl" }}
            />
          </View>
        )}
      />
    );
  }

  function AddVerticesButton() {
    return (
      <View justifyContent={"center"}>
        <IconButton
          backgroundColor={"#2ecc71"}
          borderColor={"#2ecc7155"}
          borderWidth={3}
          _icon={{
            as: Entypo,
            name: "plus",
            size: "4xl",
          }}
          rounded="full"
          variant="solid"
          style={{ width: 65, height: 65 }}
          onPress={() => {
            if (paddockName == "") {
              Toast.show({
                description:
                  "Error: Agregue un nombre antes de\nagregar vertices (PCP1)",
              });
              return;
            }
            if (paddockId != undefined && paddockId >= 0) {
              navigation.dispatch(
                CommonActions.navigate({
                  name: "EditScreen",
                  params: {
                    coordinates:
                      paddockList[paddockId].vertices.length > 0
                        ? paddockList[paddockId]?.vertices[0]
                        : currentLocation,
                    paddockId: paddockId,
                    pointId: 0,
                  },
                })
              );
            } else {
              let newIndex = dispatch(
                addPaddock({ data: { name: paddockName, vertices: [] } })
              ).payload.index;
              navigation.dispatch(
                CommonActions.navigate({
                  name: "EditScreen",
                  params: {
                    coordinates: currentLocation,
                    paddockId: newIndex,
                    pointId: 0,
                  },
                })
              );
            }
          }}
        ></IconButton>
        <Heading size="md" fontWeight="light">
          Agregar
        </Heading>
      </View>
    );
  }

  function SavePaddockButton() {
    return (
      <View>
        <IconButton
          backgroundColor={"#f39c12"}
          borderColor={"#f39c1255"}
          borderWidth={3}
          _icon={{
            as: Entypo,
            name: "save",
            size: "3xl",
          }}
          rounded="full"
          variant="solid"
          style={{ width: 65, height: 65 }}
          onPress={() => {
            if (vertices.length == 0) {
              Toast.show({
                description: " Ingrese vertices antes de guardar.",
              });
              return;
            }
            if (paddockName == "") {
              Toast.show({
                description: "Ingrese un nombre antes de guardar.",
              });
              return;
            }
            let _data = {
              ID: paddockList[paddockId].ID,
              name: paddockName,
              vertices: vertices,
            };
            saveVertices(
              paddockName,
              vertices,
              _data.ID != undefined ? _data.ID : -1
            );
            dispatch(emptyPaddocks());
            pushNotification("Potrero guardado correctamente.", "info");
            navigation.dispatch(
              CommonActions.navigate({
                name: "PaddockHome",
              })
            );
          }}
        ></IconButton>
        <Heading size="md" fontWeight="light">
          Guardar
        </Heading>
      </View>
    );
  }

  function DeletePaddockButton() {
    return (
      <View>
        <IconButton
          backgroundColor={"#b03a2e"}
          borderColor={"#b03a2e55"}
          borderWidth={3}
          _icon={{
            as: FontAwesome5,
            name: "trash",
            size: "xl",
            marginLeft: 1,
          }}
          rounded="full"
          variant="solid"
          style={{ width: 65, height: 65 }}
          onPress={() => {
            let idToRemove = paddockList[paddockId].ID;
            dispatch(deletePaddock({ paddockId: paddockId }));
            pushNotification("Potrero guardado correctamente.", "info");
            if (!create && idToRemove) {
              removePaddock(idToRemove);
            }
            navigation.dispatch(
              CommonActions.navigate({
                name: "PaddockHome",
              })
            );
          }}
        ></IconButton>
        <Heading size="md" fontWeight="light">
          Borrar
        </Heading>
      </View>
    );
  }

  //----------JSX-----------//
  return (
    <VStack bg="white" flex={1} alignItems="center" paddingTop={5}>
      <View paddingBottom={5}>
        <Heading size="xl" fontWeight="light" marginBottom={4}>
          Nombre de Potrero
        </Heading>
        <Input
          fontSize={"lg"}
          defaultValue={paddockName}
          size="2xl"
          onChangeText={(text) => {
            setPaddockName(text);
          }}
          placeholder="Ingrese nombre de potrero"
        />
      </View>
      <Heading size="xl" fontWeight="light" marginBottom={4}>
        Vertices{" "}
      </Heading>
      <VerticesList />
      <HStack
        bottom={5}
        height={70}
        width={"100%"}
        justifyContent={"space-around"}
        paddingLeft={10}
        paddingRight={10}
      >
        <AddVerticesButton />
        <SavePaddockButton />
        {create ? <></> : <DeletePaddockButton />}
      </HStack>
    </VStack>
  );
}
