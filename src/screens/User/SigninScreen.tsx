import {
  Box,
  Center,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
} from "native-base";
import { useState } from "react";
import { signin } from "../../features/backend/backend";
import TS from "../../../TS";

export default function SigninScreen() {
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Center w="100%" bg="white" flex={1}>
      <Box
        flex={0.8}
        maxHeight="500px"
        justifyContent="space-between"
        safeArea
        p="2"
        py="0"
        w="90%"
        maxW="330"
      >
        <VStack>
          <Heading size="lg" color="coolGray.800">
            {TS.t("user_welcome")}
          </Heading>
          <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
            {TS.t("user_require_login")}
          </Heading>

          <VStack space={3} mt="5">
            {/* <VStack> */}

            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input
                value={email}
                keyboardType="email-address"
                onChangeText={setEmail}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>{TS.t("user_pass")}</FormControl.Label>
              <Input
                type="password"
                value={password}
                onChangeText={setPassword}
              />
            </FormControl>
          </VStack>
        </VStack>

        <VStack mt={10}>
          <Button
            mt="2"
            isDisabled={!email || !password}
            isLoading={isLoading}
            onPress={() => {
              setIsLoading(true);
              signin(email!, password!).then(() => {
                setIsLoading(false);
              });
            }}
          >
            {TS.t("user_login")}
          </Button>
          <HStack mt="6" justifyContent="center"></HStack>
        </VStack>
      </Box>
      <VStack flex={0.06} />
    </Center>
  );
}
