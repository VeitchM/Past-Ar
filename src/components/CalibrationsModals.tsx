import { useEffect, useState } from "react";
import { DeviceSerializable } from "../features/store/types";
import {
  useTypedDispatch,
  useTypedSelector,
} from "../features/store/storeHooks";
import {
  connectToDevice,
  scanForPeripherals,
  stopScanningForPeripherals,
} from "../features/ble/ble";
import {
  Button,
  FlatList,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { SafeAreaView } from "react-native";
import { setTryingToConnect } from "../features/store/bleSlice";

import { MaterialIcons } from "@expo/vector-icons";
import {
  CalibrationLocalDBExtended,
  CalibrationsFromMeasurementsLocalDB,
} from "../features/localDB/types";
import PolynomialFunction from "./PolynomialFunction";
import CalibrationsMeasurements from "./CalibrationMeasurements";
import { addNotification } from "../features/store/notificationSlice";
import {
  calibrationExists,
  insertCalibrationFromMeasurements,
} from "../features/localDB/calibrations";
import { pushNotification } from "../features/pushNotification";
import TS from "../../TS";
import { setUpdateCalibration } from "../features/store/filterSlice";

/** A modal which explain that if accepted a calibration from measurement will be created */
export function NewCalibrationModal(props: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  calibrationName?: string;
  onCreateGoTo?: () => void;
}) {
  // ====== Hooks =======================================================

  const dispatch = useTypedDispatch();

  const [isCreating, setIsCreating] = useState(false);

  //======= Functions ====================================================

  async function createCalibration() {
    if (props.calibrationName) {
      try {
        setIsCreating(true);

        const exists = await calibrationExists(props.calibrationName);
        if (!exists) {
          await insertCalibrationFromMeasurements(props.calibrationName);
          dispatch(setUpdateCalibration({ update: true }));
        } else {
          pushNotification(TS.t("name_already_exists"), "error");
          console.log("Name already exists");
        }
        props.setShowModal(false);
        setIsCreating(false);
        props.onCreateGoTo && props.onCreateGoTo();
      } catch (e) {
        console.log("Error creating calibration", e);
        props.setShowModal(false);
        setIsCreating(false);
      }
    }
  }

  return (
    <BaseModal
      title={TS.t("create_calibration")}
      showModal={props.showModal}
      calibrationName={props.calibrationName}
      setShowModal={props.setShowModal}
      lines={[TS.t("calibration_ask_create"), TS.t("calibration_info_create")]}
    >
      <>
        <Button
          _text={{ color: "white" }}
          size="lg"
          colorScheme="danger"
          onPress={() => {
            props.setShowModal(false);
          }}
        >
          {TS.t("cancel")}
        </Button>
        <Button
          isLoading={isCreating}
          _text={{ color: "white" }}
          size="lg"
          colorScheme="primary"
          onPress={createCalibration}
        >
          {TS.t("create")}
        </Button>
      </>
    </BaseModal>
  );
}

type PropsInfoModal = {
  info?: CalibrationLocalDBExtended | CalibrationsFromMeasurementsLocalDB;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};
type PropsDeleteModal = { onDelete: (id: number) => void } & PropsInfoModal;

export function DeleteCalibrationModal(props: PropsDeleteModal) {
  return (
    <BaseModal
      title={TS.t("delete_calibration")}
      calibrationName={props.info?.name}
      showModal={props.showModal}
      setShowModal={props.setShowModal}
      lines={[
        `${TS.t("if_delete_calibration")}`,
        // `Hagalo si esta seguro que asi lo quiere`,
      ]}
    >
      <>
        <Button
          _text={{ color: "white" }}
          size="lg"
          colorScheme="info"
          onPress={() => {
            props.setShowModal(false);
          }}
        >
          {TS.t("cancel")}
        </Button>
        <Button
          leftIcon={<Icon as={MaterialIcons} name="delete" />}
          _text={{ color: "white" }}
          size="lg"
          colorScheme="danger"
          onPress={() => {
            props.setShowModal(false);
            props.info?.ID && props.onDelete(props.info?.ID);
          }}
        >
          {TS.t("delete")}
        </Button>
      </>
    </BaseModal>
  );
}

//TODO move to other place, where it makes  sense, such a types file
export enum CalibrationTypesEnum {
  fromMeasurements,
  fromFunction,
  fromCloud,
}
export const calibrationTypesNames = [
  TS.t("cal_from_measurements"),
  TS.t("cal_from_function"),
  " descargada",
];

export function InfoCalibrationModal(props: PropsInfoModal) {
  // TODO: solución temporal para indicar calibraciones estándar.
  // En el futuro, cambiar la API Web para que devuelva si una cal. es estándar.
  const type = [1, 2, 3, 4, 5].includes(props.info?.ID || -1)
    ? "Estándar"
    : TS.t("cal_from_measurements");
  return (
    <BaseModal
      title={TS.t("calibration")}
      calibrationName={props.info?.name}
      showModal={props.showModal}
      setShowModal={props.setShowModal}
      lines={[type]}
      customBody={
        <>
          {props.info?.function ? (
            <PolynomialFunction
              coeficients={props.info?.function
                .split(`,`)
                .map((number) => Number(number))}
            />
          ) : (
            props.info?.ID && (
              <CalibrationsMeasurements calibrationID={props.info?.ID} />
            )
          )}
        </>
      }
    >
      <Button
        _text={{ color: "white" }}
        size="lg"
        colorScheme="info"
        onPress={() => {
          props.setShowModal(false);
        }}
      >
        {TS.t("understood")}
      </Button>
    </BaseModal>
  );
}

//----------------------------------------------------------------------------------------------

function BaseModal(props: {
  title: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  calibrationName?: string;
  customBody?: JSX.Element;
  lines?: string[];
  children: JSX.Element;
}) {
  return (
    <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        {/*  For some reason this makes all Explode <Modal.CloseButton /> */}
        <Modal.Header
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading>{props.title}</Heading>
          {/* <Modal.CloseButton /> */}
        </Modal.Header>
        <Modal.Body style={{ marginLeft: 10 }}>
          {/* It throws warning to Flatlist  */}

          <Heading fontWeight="light" size="md">
            {" "}
            {TS.t("name")}
          </Heading>
          <Heading size="2xl">{props.calibrationName}</Heading>
          {props.lines?.map((line) => {
            return (
              <Text key={line} marginTop="20px" fontSize="lg">
                {line}
              </Text>
            );
          })}
          {props.customBody}
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>{props.children}</Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
