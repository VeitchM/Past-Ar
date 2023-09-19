import { useCallback, useEffect, useState } from "react";
import { ListRenderItem } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

//==== Icons ==================================================
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  // deleteMeasurement,
  getNLastMeasurements,
} from "../../../../features/localDB/measurements";
import { useTypedSelector } from "../../../../features/store/storeHooks";
import { formatDate, formatTime } from "../../../../utils/time";
import TS from "../../../../../TS";
import MeasurementModal from "./MeasurementModal";

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

  const refreshList = useCallback(() => {
    console.log("RefreshList");
    
    getNLastMeasurements(LIST_SIZE).then((measurements) => {
      setMeasurements(measurements);
    });
  }, []);

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
    //delete then
    setTimeout(() => {
      refreshList();
    });
  }

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
            renderItem={({ item }) => (
              <Item
                item={item}
                onPress={(item) => setSelectedMeasurement(item)}
              />
            )}
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

function Item(props: {
  item: MeasurementLocalDB;
  onPress: (item: MeasurementLocalDB) => void;
}) {
  const { item, onPress } = props;
  return (
    <Pressable onPress={() => onPress(item)}>
      <HStack
        style={{ height: 60, width: "100%", flex: 1, paddingHorizontal: 30 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack
          width={100}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {item.sendStatus ? (
            <Icon as={MaterialCommunityIcons} name="upload" size="lg" />
          ) : (
            <HStack />
          )}
          <Text fontWeight={"medium"} fontSize={"xl"}>
            {item.height.toFixed(1)}cm
          </Text>
        </HStack>
        <VStack>
          <Text>{formatDate(item.timestamp)}</Text>
          <Text fontWeight={"medium"}>{formatTime(item.timestamp)}</Text>
        </VStack>
      </HStack>
      <Divider />
    </Pressable>
  );
}
