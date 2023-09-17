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

//==== Navigation ==============================================

const LIST_SIZE = 200;

export default function MeasurementsList() {
  //Value represents id in database
  const [measurements, setMeasurements] = useState<MeasurementLocalDB[]>();

  // const [selectedCalibration, setSelectedCalibration] =
  //   useState<CalibrationLocalDBExtended>();
  // const [showInfoModal, setShowInfoModal] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const lastMeasurement = useTypedSelector(state=>state.measurement.lastMeasurement)
  
  const refreshList = useCallback(() => {
    getNLastMeasurements(LIST_SIZE).then((measurements) => {
      setMeasurements(measurements);
    });
  }, []);

  useEffect(()=>{
    console.log("refreshedListMeasurements");
    
    refreshList()
  },[lastMeasurement])

  // useFocusEffect(refreshList);

  // function onDelete(ID: number) {
  //   deleteCalibration(ID).then(() => {
  //     refreshList();
  //   });
  // }
 function onPress(item:MeasurementLocalDB){
  console.log("Pressed Item");
  

 }


  return (
    <>
      {/* <DeleteCalibrationModal
        setShowModal={setShowDeleteModal}
        info={selectedCalibration}
        showModal={showDeleteModal}
        onDelete={onDelete}
      />
      <InfoCalibrationModal
        setShowModal={setShowInfoModal}
        info={selectedCalibration}
        showModal={showInfoModal}
      /> */}

      <VStack alignItems="center" flex={1} >
        {measurements ? (
          <FlatList
            style={{borderRadius:20, backgroundColor:'red'}}
            width="100%"
            data={measurements}
            renderItem={({ item }) => <Item item={item} onPress={onPress} />}
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
        style={{ height: 60, flex: 1, paddingHorizontal: 30 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack>
          {/* I Could use a condition in just the icon name, but with cloud it will be a ternary */}
          {/* {item.fromFunction != 1 && (
            <Icon
              marginRight={2}
              alignSelf="center"
              size="xl"
              as={MaterialCommunityIcons}
              name="ruler"
            />
          )}
          {item.fromMeasurement != 1 && (
            <Icon
              marginRight={2}
              alignSelf="center"
              size="xl"
              as={MaterialCommunityIcons}
              name="function-variant"
            />
          )} */}

          <Heading>{item.height}</Heading>
        </HStack>
      </HStack>
      <Divider />
    </Pressable>
  );
}
