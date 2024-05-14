import { Button, Heading, Modal, Text } from "native-base";

import TS from "../../TS";

export default function BaseModal(props: {
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
          {props.lines && (
            <>
              <Heading fontWeight="light" size="md">
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
            </>
          )}
          {props.customBody}
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>{props.children}</Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
