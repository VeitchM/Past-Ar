//=========== Components ========================================
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  Text,
  View,
} from "native-base";

//======= Navigation Prop
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTypedDispatch } from "../../features/store/storeHooks";
import { useEffect, useMemo, useState } from "react";
import PolynomialFunction from "../../components/PolynomialFunction";
import {
  calibrationExists,
  insertCalibrationFromFunction,
} from "../../features/localDB/calibrations";
import { addNotification } from "../../features/store/notificationSlice";
import { StackParamList } from "./Stack.types";
import TS from "../../../TS";
import { setUpdateCalibration } from "../../features/store/filterSlice";
type Props = NativeStackScreenProps<
  StackParamList,
  "CreateFunctionCalibration"
>;

function CreateFunctionCalibration({ navigation, route }: Props) {
  const SPACE_BETWEEN_TEXT = 5;

  const dispatch = useTypedDispatch();

  const [functionDefinition, setFunctionDefinition] = useState<string>();
  const [valid, setValid] = useState(false);
  const [coeficients, setCoeficients] = useState<number[]>();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const coeficients = functionDefinition
      ?.split(",")
      .map((number) => Number(number));
    setCoeficients(coeficients);
    setValid(!coeficients?.some((number) => isNaN(number)));
  }, [functionDefinition]);

  const validForCreatingCalibration = useMemo(() => {
    return valid && coeficients && coeficients.length > 1;
  }, [coeficients, valid]);

  //======== Function ===================================================
  async function createCalibration() {
    if (valid) {
      try {
        setIsCreating(true);

        const exists = await calibrationExists(route.params.name);
        if (!exists && coeficients) {
          await insertCalibrationFromFunction(
            route.params.name,
            coeficients.toString()
          );
          dispatch(setUpdateCalibration({update:true}))
        }
        setIsCreating(false);
        navigation.navigate("CalibrationsList");
      } catch (e) {
        console.log("Error creating calibration", e);
        dispatch(
          addNotification({
            title: "La calibracion ya existe",
            status: "warning",
          })
        );
        //TODO mostrar error notificacion
        console.error(e);

        setIsCreating(false);
      }
    }
  }

  return (
    <View
      bg="white"
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ minHeight: 300, flex: 0.2 }}>
        <Text fontSize="lg">{TS.t("calibrations")}</Text>
        <Heading marginBottom={2}>{route.params.name}</Heading>
        <Heading size="md" fontWeight="regular">
          {TS.t("enter_polynomial_coefficients")}
        </Heading>
        <FormControl isInvalid={!valid} maxWidth="350px" width="350px">
          <Input
            // keyboardType='numeric'
            fontSize={functionDefinition ? "xl" : "lg"}
            value={functionDefinition}
            size="2xl"
            _invalid={{ color: "error.400" }}
            onChangeText={setFunctionDefinition}
          />
          <FormControl.ErrorMessage>
            {TS.t("enter_a_valid_polynomial")}{" "}
          </FormControl.ErrorMessage>
        </FormControl>

        {validForCreatingCalibration && coeficients ? (
          <PolynomialFunction coeficients={coeficients} />
        ) : null}

        <Button
          marginTop={3}
          isDisabled={!validForCreatingCalibration}
          onPress={createCalibration}
        >
          {TS.t("create_calibration")}
        </Button>
      </View>

      {/* <Flex flex={1}  width='100%' bg='black'>
              <Text>lalalal</Text>
            </Flex> */}
      <View
        width="100%"
        bg="muted.50"
        flex={1}
        borderTopRadius="3xl"
        shadow={3}
      >
        <Box flexDirection="column" margin={10} justifyContent="space-between">
          <Text marginY={SPACE_BETWEEN_TEXT} fontSize="lg" fontWeight="bold">
            {TS.t("use_dot_for_decimals") + " "}
          </Text>
          <View style={{ height: 5 }} />
          <Heading textAlign="center">{TS.t("example")}</Heading>
          <Text textAlign="center" fontSize="lg" fontWeight="bold">
            Y=3+5.5X+6.1X^2-0.0043X^3
          </Text>
          <Heading textAlign="center" marginTop={SPACE_BETWEEN_TEXT}>
            {TS.t("will_be")}
          </Heading>

          <Text textAlign="center" fontSize="lg" fontWeight="bold">
            3,5.5,6.1,-0.0043
          </Text>
        </Box>
      </View>
    </View>
  );
}

export default CreateFunctionCalibration;
