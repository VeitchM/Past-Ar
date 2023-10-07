import { useCallback, useEffect, useState } from "react";
import { ListRenderItem } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

//==== Icons ==================================================
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

//==== Components ===========================================
import {
  Heading,
  HStack,
  VStack,
  FlatList,
  IconButton,
  Divider,
  Icon,
  Pressable,
  Spinner,
  Text,
} from "native-base";
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
import { formatDate, formatTime } from "../../../../utils/time";
import TS from "../../../../../TS";
import MeasurementModal from "./MeasurementModal";
import Item, { ITEM_HEIGHT } from "./ListItemMeasurement";
//==== Navigation ==============================================

const LIST_SIZE = 50;

export default function MeasurementsList() {
  //Value represents id in database
  const [measurements, setMeasurements] = useState<MeasurementLocalDB[]>();

  // const [selectedCalibration, setSelectedCalibration] =
  //   useState<CalibrationLocalDBExtended>();
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  console.log("Rerendered MesurementList");

  const [selectedMeasurement, setSelectedMeasurement] =
    useState<MeasurementLocalDB>();
  const lastMeasurement = useTypedSelector(
    (state) => state.measurement.lastMeasurement
  );

  const refreshList = () => {
    console.log("RefreshList");

    getNLastMeasurements(LIST_SIZE).then((measurements) => {
      setMeasurements(measurements);
    });
  };

  useEffect(() => {
    console.log("refreshedListMeasurements");
    setTimeout(() => {
      refreshList();
    });
  }, [lastMeasurement]);

  function onPress(item: MeasurementLocalDB) {
    console.log("Pressed Item");
  }

  function onDelete() {
    if (selectedMeasurement)
      deleteMeasurement(selectedMeasurement).then(() => {
        setSelectedMeasurement(undefined);
        refreshList();
      });
  }

  //Optimization
  const renderItem = useCallback(
    ({ item }: { item: MeasurementLocalDB }) => (
      <Item item={item} onPress={(item) => setSelectedMeasurement(item)} />
    ),
    []
  );

  return (
    <>
      <VStack alignItems="center" width="100%" flex={1}>
        <MeasurementModal
          onDelete={onDelete}
          setMeasurement={setSelectedMeasurement}
          measurement={selectedMeasurement}
        />
        <Heading paddingBottom={2}>{TS.t("last_measurements")}</Heading>
        {measurements ? (
          <FlatList
            borderRadius="2xl"
            backgroundColor={"white"}
            // shadow="3"
            width="100%"
            data={measurements}
            borderColor={"muted.300"}
            borderWidth={2}
            // updateCellsBatchingPeriod={200}
            // maxToRenderPerBatch={1}
            keyExtractor={(item) => item.ID.toString()}
            getItemLayout={(_measurements, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            renderItem={renderItem}
          />
        ) : (
          <VStack height={500} justifyContent="center">
            <Spinner size={90} />
          </VStack>
        )}
      </VStack>
    </>
  );
}
