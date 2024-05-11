import { useCallback, useEffect, useState } from "react";
import { ListRenderItem, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

//==== Icons ==================================================
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { FlashList } from "@shopify/flash-list";

//==== Components ===========================================
import { Heading, VStack, Divider, Spinner, useTheme } from "native-base";
// import {
//   DeleteCalibrationModal,
//   InfoCalibrationModal,
// } from "../../components/CalibrationsModals";

//==== LocalDB ==========================================
import { MeasurementLocalDB } from "../../../../features/localDB/types";
import {
  deleteMeasurement,
  getNLastMeasurements,
} from "../../../../features/localDB/measurements";
import { useTypedSelector } from "../../../../features/store/storeHooks";
import TS from "../../../../../TS";
import MeasurementModal from "./MeasurementModal";
import Item, { ITEM_HEIGHT } from "./ListItemMeasurement";
//==== Navigation ==============================================

const LIST_SIZE = 50;

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export default function MeasurementsList() {
  //Value represents id in database
  const theme = useTheme();
  const [measurements, setMeasurements] = useState<MeasurementLocalDB[]>();
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<MeasurementLocalDB>();

  const lastMeasurement = useTypedSelector(
    (state) => state.measurement.lastMeasurement
  );

  const refreshList = useCallback(() => {
    console.log("RefreshList");
    getNLastMeasurements(LIST_SIZE).then((measurements) => {
      setMeasurements(measurements);
    });
  }, [setMeasurements]);

  useEffect(() => {
    console.log("refreshedListMeasurements");
    setTimeout(() => {
      refreshList();
    },100);
  }, [lastMeasurement]);

  const onDelete = useCallback(() => {
    if (selectedMeasurement)
      deleteMeasurement(selectedMeasurement).then(() => {
        setSelectedMeasurement(undefined);
        refreshList();
      });
  }, [selectedMeasurement]);

  return measurements ? (
    measurements.length > 0 ? (
      <VStack alignItems="center" flex={1} width="100%">
        <MeasurementModal
          onDelete={onDelete}
          setMeasurement={setSelectedMeasurement}
          measurement={selectedMeasurement}
        />
        <Heading paddingBottom={2}>{TS.t("last_measurements")}</Heading>
        <View
          style={{
            borderRadius: 30,
            overflow: "hidden",
            width: "100%",
            // width: 280,
            // height:100,
            flex: 1,
// backgroundColor:"red",
            borderColor: theme.colors.muted[300],
            borderWidth: 2,
          }}
        >
          <FlashList
          
            extraData={setSelectedMeasurement}
            data={measurements}
            estimatedItemSize={ITEM_HEIGHT}
            renderItem={Item}
            ItemSeparatorComponent={ListDivider}
          />
        </View>
      </VStack>
    ) : null
  ) : (
    <VStack alignItems="center" width="100%" flex={1}>
      <Spinner size={90} />
    </VStack>
  );
}

const ListDivider = () => <Divider width={"85%"} alignSelf={"center"} />;
