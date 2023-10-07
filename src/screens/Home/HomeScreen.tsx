import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// TODO put in a document, and ask
// Screen sizes
// MOTO e(low tier phone) 2020 720 x 1520 pixels Supported but seems too long
// MOTO e 2014 1st gen 540 x 960 Not supported for now
// MOTO e 3rd gen 2016 720 x 1280 Not supported for now, use the same ratio as above 16/9
// Standard 1080*1920 Supported and Looks Good and is 16/9

import {
  View,
  Text,
  StatusBar,
  Button,
  Box,
  Badge,
  useTheme,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Heading,
  Divider,
  Center,
  Modal,
  FormControl,
  Input,
  FlatList,
  HStack,
  VStack,
  Spacer,
  ScrollView,
} from "native-base";
import { ReactNode, useEffect, useState } from "react";
import { ColorValue, TouchableOpacity, Image, Dimensions } from "react-native";
import RoundedContainer from "../../components/RoundedContainer";
import { disconnectFromDevice } from "../../features/ble/ble";
import {
  useTypedDispatch,
  useTypedSelector,
} from "../../features/store/storeHooks";
import DevicesModal from "../../components/DevicesModal";
import BatteryLevel from "../../components/Battery";
import { LastMeasurement } from "./components/LastMeasurement";
import ConnectDeviceButton from "../../components/ConnectDevice";
import Pasturometer from "../../components/Pasturometer";
import { themeNavigation } from "../../theme";
import { setConnectedDevice } from "../../features/store/bleSlice";
import MeasurementsList from "./components/ListMeasurements/ListMeasurements";

//TODO add modal of device, where you can set the height

export default function HomeScreen(props: any) {
  const bleConnectionState = useTypedSelector(
    (state) => state.ble.connectionState
  );
  const dispatch = useTypedDispatch();
  //Not used yet, but will be needed in the future
  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return <HeaderLeft />;
      },
      headerShown: true,
      headerStyle: {
        backgroundColor: "#18181b",
      },
    });
  }, []);

  const HeaderLeft = () => {
    return (
      <View alignItems={"flex-start"}>
        <Image
          style={{ width: 150, height: 64, justifyContent:'flex-end', marginTop:10 }}
          
        
          source={require("../../../assets/logo-small-white-text.png")}
        />

        <View
          backgroundColor={themeNavigation.colors.primary}
          height={5}
          width={1000}
        />
      </View>
    );
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="black"
        barStyle="light-content"
      />
      <VStack
        alignItems="center"
        flex={1}
        backgroundColor={"white"}
        paddingY={5}
        paddingX={10}
      >
        <LastMeasurement />

        <BatteryLevel />
        <View height={4} />

        {bleConnectionState == "connected" ? (
          <Pasturometer />
        ) : (
          <>
            <ConnectDeviceButton />
          </>
        )}
        <View height={5} />
        <MeasurementsList />
      </VStack>
    </>
  );
}
