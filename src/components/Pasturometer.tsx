import {
  Button,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { disconnectFromDevice } from "../features/ble/ble";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useTypedDispatch,
  useTypedSelector,
} from "../features/store/storeHooks";
import { StyleSheet } from "react-native";

import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { persistDevice } from "../features/localDB/device";
import { setConnectedDevice } from "../features/store/bleSlice";
import TS from "../../TS";
import { DeviceSerializable } from "../features/store/types";

export default function Pasturometer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ModalPasturometer setShow={setShowModal} show={showModal} />
      <Button
        onPress={() => setShowModal(true)}
        size="lg"
        w="280"
        rightIcon={
          <Icon
            alignSelf="center"
            as={MaterialCommunityIcons}
            name="wrench"
            size={30}
          />
        }

        // colorScheme='amber'
      >
        {/* TODO ver cuando cambia */}
        {TS.t("pasturometer")}
      </Button>
    </>
  );
}

//TODO verify error

function ModalPasturometer(props: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const store = useTypedSelector((state) => state.ble);

  const [alias, setAlias] = useState(store.connectedDevice?.alias || "");
  // const [plateWidth, setPlateWidth] = useState(
  //   store.connectedDevice?.baseHeight?.toString() || ""
  // );
  const [errorPlateWidth, setErrorPlateWidth] = useState(false);

  const dispatch = useTypedDispatch();

  console.log({ devices: store.connectedDevice });

  // useEffect(() => {
  //   setErrorPlateWidth(isNaN(Number(plateWidth)));
  // }, [plateWidth]);

  return (
    <Modal isOpen={props.show} onClose={() => props.setShow(false)}>
      <Modal.Content maxWidth="400px">
        {/*  For some reason this makes all Explode <Modal.CloseButton /> */}

        <Modal.Header
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size="md">{TS.t("pasturometer")}</Heading>
        </Modal.Header>
        <VStack m="5">
          <HStack style={{ justifyContent: "space-between" }}>
            <Heading size="md">{TS.t("alias")}</Heading>
            <Icon as={Feather} name="edit-2" size={5} />
          </HStack>
          <Input
            variant="unstyled"
            bg="transparent"
            // onPress={() => console.log('Pressed')}
            // textAlign='start'
            value={alias}
            onChangeText={setAlias}
            textAlign="left"
            fontWeight="normal"
            marginTop={-4}
            color="muted.400"
            borderRadius={0}
            style={styles.input}
          />

          <Heading size="md">{TS.t("name")}</Heading>
          <Text style={styles.text}>{store.connectedDevice?.name}</Text>
          <Heading size="md">{TS.t("MAC")}</Heading>
          <Text style={styles.text}>{store.connectedDevice?.id}</Text>

          {/* <HStack style={{ justifyContent: "space-between" }}>
            <Heading
              color={errorPlateWidth ? "error.400" : undefined}
              size="md"
            >
              {TS.t("base_height")}
            </Heading>
            <Icon as={Feather} name="edit-2" size={5} />
          </HStack>
          <Input
            variant="unstyled"
            bg="transparent"
            // onPress={() => console.log('Pressed')}
            value={plateWidth}
            onChangeText={setPlateWidth}
            // textAlign='start'
            textAlign="left"
            fontWeight="normal"
            marginTop={-4}
            color="muted.400"
            keyboardType="decimal-pad"
            borderRadius={0}
            isInvalid={errorPlateWidth}
            style={styles.input}
          /> */}

          <Button
            onPress={() => disconnectFromDevice()}
            size="lg"
            my="5"
            colorScheme="amber"
            leftIcon={
              <Icon as={MaterialCommunityIcons} name="connection" size="2xl" />
            }
          >
            {/* TODO ver cuando cambia */}
            {TS.t("disconnect")}
          </Button>
        </VStack>

        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              _text={{ color: "white" }}
              size="lg"
              colorScheme="danger"
              onPress={() => {
                props.setShow(false);
              }}
              rightIcon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="exit-to-app"
                  size="xl"
                />
              }
            >
              {TS.t("exit")}
            </Button>
            <Button
              _text={{ color: "white" }}
              size="lg"
              colorScheme="info"
              isDisabled={!!store.connectedDevice && errorPlateWidth}
              onPress={() => {
                props.setShow(false);
                const device = store.connectedDevice;
                if (device && !errorPlateWidth) {
                  const newDevice: DeviceSerializable = {
                    id: device.id,
                    name: device.name,
                    alias: alias,
                    model: device.model,
                  };
                  persistDevice(newDevice);
                  dispatch(setConnectedDevice(newDevice));
                }
              }}
              rightIcon={<Icon as={Entypo} name="save" size="xl" />}
            >
              {TS.t("save")}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

const styles = StyleSheet.create({
  text: { marginTop: -5, marginBottom: 10, fontSize: 18 },
  input: { marginLeft: -13, fontSize: 18 },
});

const inputProps = { bg: "transparent", textAlign: "flex-start" };
