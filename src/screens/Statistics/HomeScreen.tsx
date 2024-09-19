import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "./ScreenStack";
import {
  Box,
  Divider,
  Heading,
  Icon,
  ScrollView,
  Select,
  View,
} from "native-base";
import { Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useCallback, useEffect, useState } from "react";
import { LocationObject } from "expo-location";
import { Measurement } from "../../features/store/types";
import { calculateByHeight } from "../../features/statistics/WeightCalculus";
import { FontAwesome5 } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  CalibrationLocalDB,
  SectorLocalDB,
} from "../../features/localDB/types";
import FormatUtils from "../../features/utils/FormatUtils";
import PolyHelper from "../../features/utils/GeometricHelper";

import { getCalibrations } from "../../features/localDB/calibrations";
import {
  getMeasurements,
  getMeasurementsBetween,
} from "../../features/localDB/measurements";
import { themeNavigation } from "../../theme";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import {
  useTypedDispatch,
  useTypedSelector,
} from "../../features/store/storeHooks";
import { getSectorByID } from "../../features/localDB/sectors";
import { getPaddockByID } from "../../features/localDB/paddocks";
import { LatLng } from "react-native-maps";
import TS from "../../../TS";
import { setUpdateCalibration } from "../../features/store/filterSlice";

const screenWidth = Dimensions.get("window").width;

type Props = NativeStackScreenProps<StackParamList, "StatisticsHome">;

export default function PaddockScreen(props: Props) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [weight, setWeight] = useState(0);
  const [selectedCalibration, setSelectedCalibration] = useState(-1);
  const [calibrations, setCalibrations] = useState<CalibrationLocalDB[]>([]);
  const filterState = useTypedSelector((state) => state.filter);
  const paddockList = useTypedSelector((state) => state.paddock.paddocks);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    readCalibrations();
  }, [filterState]);

  useFocusEffect(
    useCallback(() => {
      readCalibrations();
      readMeasurements();
    }, [filterState]),
  );

  const readMeasurements = async (
    updateFilter?: boolean,
    calibration?: number,
  ) => {
    let _from = new Date();
    _from.setDate(_from.getDate() - 2);
    let _until = new Date();
    _until.setDate(_until.getDate() + 2);
    let f = filterState.from_stats;
    let u = filterState.until_stats;
    if (f == undefined || u == undefined) {
      f = _from.getTime();
      u = _until.getTime();
    }
    if (!!filterState.filteredSector) {
      let tmpSector = await getSectorByID(filterState.filteredSector);
      if (tmpSector.start_date > f) f = tmpSector.start_date;
      if (tmpSector.finish_date < u) u = tmpSector.finish_date;
    }
    let mes: Measurement[] = (await getMeasurementsBetween(f, u)).rows._array;
    let all: Measurement[] = (await getMeasurements()).rows._array;
    if (filterState.filteredPaddock != undefined) {
      let foundedPaddock = await getPaddockByID(filterState.filteredPaddock);
      let vertices: LatLng[] = JSON.parse(foundedPaddock.vertices_list!);

      let points = mes.map((m) => {
        return { latitude: m.latitude, longitude: m.longitude };
      });
      let results = PolyHelper.getPointsInsidePoly(points, vertices);
      mes = mes.filter((m) => {
        return results.some((r) => {
          return m.latitude == r.latitude;
        });
      });
    }
    setMeasurements(mes);

    if (calibration) {
      const weight = await calculateByHeight(
        parseFloat(meanHeight(mes)),
        calibration,
      );
      setWeight(weight);
    } else if (selectedCalibration)
      setWeight(
        await calculateByHeight(
          parseFloat(meanHeight(mes)),
          selectedCalibration,
        ),
      );
  };

  const readCalibrations = () => {
    getCalibrations().then((calibrations) => {
      if (calibrations) setCalibrations(calibrations);
    });
    if (filterState.updateCalibrations) {
      dispatch(setUpdateCalibration({ update: false }));
    }
  };

  const meanHeight = (_measurements: Measurement[]) => {
    let sum = 0;
    _measurements.forEach((e) => {
      sum += e.height;
    });
    return sum != 0 ? (sum / (_measurements.length * 1.0)).toFixed(3) : "0.0";
  };

  const FilterButton = () => {
    return (
      <View
        rounded={"full"}
        style={{
          flex: 1,
          position: "absolute",
          bottom: 15,
          right: 15,
          padding: 0,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.dispatch(
              CommonActions.navigate({
                name: "FiltersScreen",
                params: {
                  paddockId: 1,
                  paddockList: paddockList.map((p) => {
                    return { name: p.name, id: p.ID };
                  }),
                },
              }),
            );
          }}
        >
          <View
            flexDirection={"row"}
            rounded={"full"}
            background={"#ffa726"}
            height={70}
            width={70}
            borderWidth={4}
            borderColor={"#fff"}
            padding={4}
          >
            <Icon
              color={"#fff"}
              as={FontAwesome5}
              name={"filter"}
              size={"2xl"}
              marginTop={1}
            ></Icon>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const MainScreen = () => {
    return (
      <ScrollView flex={1} contentContainerStyle={{ alignItems: "center" }}>
        <Box
          shadow={3}
          justifyContent="space-evenly"
          marginTop={15}
          alignItems={"center"}
          backgroundColor={"#7a7b87"}
          rounded={"lg"}
          height={220}
          width={"95%"}
          borderWidth={1}
          borderColor={"coolGray.200"}
        >
          <Heading size="lg" marginTop={2} marginBottom={2} color={"#fff"}>
            {TS.t("stats_measures")}
          </Heading>
          {measurements.length == 0 ? (
            <>
              <Heading size="lg" marginBottom={2}>
                {TS.t("stats_no_records")}
              </Heading>
            </>
          ) : (
            <LineChart
              data={{
                labels: measurements.map((e, i) => {
                  return i + 1 + "";
                }),
                datasets: [
                  {
                    data: measurements.map((e) => {
                      return e.height;
                    }),
                  },
                ],
              }}
              width={screenWidth * 0.9} // from react-native
              height={170}
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
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
        </Box>
        <Box
          shadow={3}
          justifyContent="space-evenly"
          marginTop={2}
          alignItems={"center"}
          backgroundColor={"#fff"}
          rounded={"lg"}
          height={90}
          width={"95%"}
          borderWidth={1}
          borderColor={"coolGray.200"}
        >
          <>
            <Heading size="lg">
              {TS.t("stats_from") +
                FormatUtils.formatBasicDate(new Date(filterState.from_stats))}
            </Heading>
            <Divider />
            <Heading size="lg">
              {TS.t("stats_until") +
                FormatUtils.formatBasicDate(new Date(filterState.until_stats))}
            </Heading>
          </>
        </Box>
        <View margin={2} />
        <Box
          shadow={3}
          paddingTop={3}
          paddingBottom={3}
          justifyContent="space-evenly"
          alignItems={"center"}
          backgroundColor={"#fff"}
          rounded={"lg"}
          width={"95%"}
          borderWidth={1}
          borderColor={"coolGray.200"}
        >
          <Box
            justifyContent="space-evenly"
            alignItems={"center"}
            backgroundColor={"#fff"}
            rounded={"lg"}
            height={90}
            width={"95%"}
            borderWidth={1}
            borderColor={"coolGray.200"}
          >
            {measurements.length > 0 ? (
              <>
                <Heading color={"trueGray.300"} size="lg" marginTop={3}>
                  {TS.t("stats_mean_height")}
                </Heading>
                <Divider marginTop={3} />
                <Heading size="3xl" marginBottom={2}>
                  {meanHeight(measurements)}
                </Heading>
              </>
            ) : (
              <>
                <Heading color={"trueGray.300"} size="lg" marginTop={3}>
                  {TS.t("stats_mean_height")}
                </Heading>
                <Divider marginTop={3} />
                <Heading size="lg" marginBottom={2}>
                  {TS.t("stats_no_records")}
                </Heading>
              </>
            )}
          </Box>

          <Box
            justifyContent="space-evenly"
            marginTop={2}
            alignItems={"center"}
            backgroundColor={"#fff"}
            rounded={"lg"}
            height={90}
            width={"95%"}
            borderWidth={1}
            borderColor={"coolGray.200"}
          >
            {measurements.length > 0 ? (
              <>
                <Heading color={"trueGray.300"} size="lg" marginTop={3}>
                  {TS.t("stats_measures")}
                </Heading>
                <Divider marginTop={3} />
                <Heading size="3xl" marginBottom={2}>
                  {measurements.length}
                </Heading>
              </>
            ) : (
              <>
                <Heading color={"trueGray.300"} size="lg" marginTop={3}>
                  {TS.t("stats_measures")}
                </Heading>
                <Divider marginTop={3} />
                <Heading size="lg" marginBottom={2}>
                  {TS.t("stats_no_records")}
                </Heading>
              </>
            )}
          </Box>
        </Box>
        <View margin={2} />
        <Box
          shadow={3}
          paddingTop={3}
          paddingBottom={3}
          justifyContent="space-evenly"
          alignItems={"center"}
          backgroundColor={"#fff"}
          rounded={"lg"}
          width={"95%"}
          borderWidth={1}
          borderColor={"coolGray.200"}
        >
          <Select
            width={screenWidth}
            placeholderTextColor={"#fff"}
            borderColor={themeNavigation.colors.primary}
            color={"#fff"}
            backgroundColor={themeNavigation.colors.primary}
            borderWidth={0}
            selectedValue={selectedCalibration + ""}
            onValueChange={(itemValue) => {
              setSelectedCalibration(Number.parseInt(itemValue));
              readMeasurements(false, Number.parseInt(itemValue));
            }}
            placeholder={TS.t("stats_choose_calibration")}
          >
            {calibrations.map((calibration) => {
              return (
                <Select.Item
                  key={calibration.ID}
                  label={calibration.name}
                  value={calibration.ID.toString()}
                />
              );
            })}
          </Select>
          <Box
            justifyContent="space-evenly"
            marginTop={2}
            alignItems={"center"}
            backgroundColor={"#fff"}
            rounded={"lg"}
            height={90}
            width={"95%"}
            borderWidth={1}
            borderColor={"coolGray.200"}
          >
            {measurements.length > 0 ? (
              <>
                <Heading color={"trueGray.300"} size="lg" marginTop={3}>
                  {TS.t("stats_mean_weight")}
                </Heading>
                <Divider marginTop={3} />
                <Heading
                  size={selectedCalibration >= 0 ? "3xl" : "lg"}
                  marginBottom={2}
                  marginRight={5}
                >
                  {selectedCalibration >= 0
                    ? weight.toFixed(1)
                    : TS.t("stats_error_choose_cal")}
                </Heading>
              </>
            ) : (
              <>
                <Heading color={"trueGray.300"} size="lg" marginTop={3}>
                  {TS.t("stats_mean_weight")}
                </Heading>
                <Divider marginTop={3} />
                <Heading size="lg" marginBottom={2}>
                  {TS.t("stats_no_records")}
                </Heading>
              </>
            )}
          </Box>
        </Box>
        <View height={25} />
        <View
          rounded={"full"}
          height={5}
          width={5}
          backgroundColor={"trueGray.300"}
          marginBottom={2}
        />
        <View
          rounded={"full"}
          height={2}
          width={2}
          backgroundColor={"trueGray.300"}
          marginBottom={10}
        />
      </ScrollView>
    );
  };

  return (
    <>
      {/* Why?? */}
      <MainScreen />
      <FilterButton />
      {/* <RefreshButton /> */}
    </>
  );
}
