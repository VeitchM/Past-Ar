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
  VStack,
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
import TS from "../../../TS";
import {
  finishSector,
  getSectors,
  startSector,
} from "../../features/localDB/sectors";
import { TouchableHighlight } from "react-native-gesture-handler";
import { GenericTabsProps } from "../Tabs.types";

export default function HomeScreen(props: GenericTabsProps<"Home">) {
  const bleConnectionState = useTypedSelector(
    (state) => state.ble.connectionState
  );
  const theme = useTheme();
  const [sectoring, setSectoring] = useState(false);
  const [currentSector, setCurrentSector] = useState(-1);
  //Not used yet, but will be needed in the future
  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return <HeaderLeft />;
      },
      headerShadowVisible: true,
      headerShown: true,
    });
    showSectors();
  }, []);

  const showSectors = async () => {
    let sectors = await getSectors();
    console.log(sectors);
  };

  const HeaderLeft = () => {
    return (
      <View
        alignItems={"center"}
        paddingLeft={5}
        paddingY={2}
        height={"100%"}
        width={200}
      >
        <Image
          resizeMode="contain"
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "flex-start",
            alignSelf: "flex-start",
            marginLeft: 5,
          }}
          source={require("../../../assets/logo-text.png")}
        />
      </View>
    );
  };

  const SectorPressHandler = async () => {
    if (sectoring) {
      finishSector(currentSector, Date.now());
      setCurrentSector(-1);
    } else {
      let sId = await startSector(Date.now());
      setCurrentSector(sId);
    }
    setSectoring(!sectoring);
  };

  return (
    <>
      <VStack
        alignItems="center"
        flex={1}
        backgroundColor={"white"}
        paddingX={10}
        width={"100%"}
      >
        <View height={2} />
        <View flex={1} width={"100%"}>
          <LastMeasurement />
          {/* <BatteryLevel /> */}
          {/* <View height={2} /> */}
          <MeasurementsList />
        </View>
        <View height={3} />
        {bleConnectionState == "connected" ? (
          <Pasturometer />
        ) : (
          <ConnectDeviceButton />
        )}
        <View height={3} />
        <TouchableHighlight
          underlayColor={"#f5f5f5"}
          onPress={SectorPressHandler}
        >
          <View
            justifyContent={"flex-start"}
            backgroundColor={"muted.50"}
            paddingTop={2}
            paddingBottom={2}
            paddingLeft={45}
            height="85px"
            width={Dimensions.get("screen").width}
            flexDirection={"row"}
            borderColor={"muted.300"}
            borderWidth={0.5}
          >
            <View
              rounded={"full"}
              borderWidth={3}
              borderColor={"muted.300"}
              height={70}
              width={70}
            >
              <View
                backgroundColor={sectoring ? "red.500" : "amber.300"}
                rounded={"full"}
                height={52}
                width={52}
              ></View>
            </View>
            <View alignItems={"flex-start"}>
              <Text
                marginLeft={2}
                fontWeight={700}
                // color={"white"}
                fontSize="xl"
              >
                {sectoring ? TS.t("press_to_stop") : TS.t("press_to_record")}
              </Text>
              <Text
                marginLeft={2}
                // italic
                fontWeight={400}
                // color={"white"}
                fontSize="md"
              >
                {sectoring
                  ? TS.t("recording_sector")
                  : TS.t("not_recording_sector")}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </VStack>
    </>
  );
}
