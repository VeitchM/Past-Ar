import { useBackgroundPermissions } from "expo-location";
import { Button, FlatList, Heading, Modal, Text } from "native-base";
import { useEffect, useState } from "react";
import TS from "../../../TS";
import BaseModal from "../../components/BaseModal";

/** It renders a modal if location always is not activated and redirects the user to activate it */
export default function LocationPermissionManager() {
  const [status, request] = useBackgroundPermissions();
  const [open, setOpen] = useState(true);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!status || !status.granted) {
      setOpen(true);
      // request().then((response) => {
      //   console.log("Permission response: " + response);
      // });
    }
    console.log("PermissionStatus: " + status);
  }, [status]);

  return (
    <BaseModal
      title={TS.t("location_permissions_required")}
      setShowModal={setOpen}
      showModal={open}
      customBody={<Text>{TS.t("location_always_permission_required")}</Text>}
    >
      <>
        <Button
          // _text={{ color: "white" }}
          size="lg"
          colorScheme="danger"
          onPress={() => {
            setOpen(false);
          }}
        >
          {TS.t("exit")}
        </Button>
        <Button
          // _text={{ color: "white" }}
          size="lg"
          isLoading={waiting}
          disabled={waiting}
          onPress={() => {
            setWaiting(true);
            request()
              .then((response) => {
                console.log("Permission response: " + response);
                setOpen(false);
              })
              .finally(() => {
                setWaiting(false);
              });
          }}
        >
          {TS.t("configure")}
        </Button>
      </>
    </BaseModal>
  );
}
