import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

//=========== Components ========================================
import { Button, ScrollView, Text, View } from "native-base";

import {
  setCalibrationModeOff,
  setCalibrationModeOn,
} from "../../features/store/measurementSlice";

//======= Navigation Props =========================
import { PropsCalibrationMeasurement } from "./Stack.types";

import {
  useTypedDispatch,
  useTypedSelector,
} from "../../features/store/storeHooks";

import React from "react";
import { getCalibrationsMeasurements } from "../../features/localDB/calibrations";
import { MeasurementLocalDB } from "../../features/localDB/types";

type CustomMeasurement = MeasurementLocalDB & { ID: number };

function CalibrationMeasurement({
  navigation,
  route,
}: PropsCalibrationMeasurement) {
  const SPACE_BETWEEN_TEXT = 5;
  const [measurements, setMeasurements] = useState<CustomMeasurement[]>([]);

  const dispatch = useTypedDispatch();
  const lastMeasurement = useTypedSelector(
    (state) => state.measurement.lastMeasurement,
  );

  async function fetchMeasurements() {
    const measurements = await getCalibrationsMeasurements(
      route.params.calibrationID,
    );
    setMeasurements(measurements.reverse());
  }

  useEffect(() => {
    fetchMeasurements();
  }, [lastMeasurement]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setCalibrationModeOn(route.params.calibrationID));

      return () => {
        dispatch(setCalibrationModeOff());
      }; //Unsubscribe
    }, []),
  );

  const last = measurements.length > 0 ? measurements[0] : null;

  return (
    <View
      style={{ flex: 1, flexDirection: "column", marginBottom: 20 }}
      width="full"
    >
      <View
        width="full"
        backgroundColor="muted.50"
        style={{ paddingHorizontal: 30 }}
      >
        <Text marginY={SPACE_BETWEEN_TEXT} fontSize="lg" fontWeight="bold">
          Presione el boton del pasturometro para realizar medicion
        </Text>
        <View style={{ height: 5 }} />
        <Text marginY={SPACE_BETWEEN_TEXT} fontSize="lg" fontWeight="bold">
          Anote el numero en pantalla para posteriormente asociarlo al peso de
          pasto seco de la medicion
        </Text>
      </View>
      <ScrollView
        style={{
          marginVertical: 50,
        }}
        width="1/2"
      >
        {measurements.map((measurement) => (
          <View
            key={measurement.timestamp}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text fontSize="2xl">{measurement.ID}</Text>
            <View
              style={{
                backgroundColor: "#dddddd",
                marginTop: 5,
                marginLeft: 5,
                borderRadius: 4,
                alignSelf: "flex-start",
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 5,
                paddingRight: 5,
                width: 120,
              }}
            >
              <Text fontSize="2xl">{measurement.height.toFixed(1)} cm</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Button>Enviar Calibración</Button>
    </View>
  );
}

export default CalibrationMeasurement;
