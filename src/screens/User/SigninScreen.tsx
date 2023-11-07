import { Box, Center, Heading, VStack, FormControl, Link, Input, Button, HStack, Text } from "native-base";
import { useTypedDispatch } from "../../features/store/storeHooks";
import { addNotification } from "../../features/store/notificationSlice";
import { useEffect, useState } from "react";
import { signin } from "../../features/backend/backend";
import TS from "../../../TS";

export default function SigninScreen() {


  const dispatch = useTypedDispatch()



  const [password, setPassword] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log('Email changed', email)
  }, [email])


  return (
    <Center w="100%" bg='white' flex={1}>
      {/* <VStack justifyContent=> */}

      <Box flex={0.8} maxHeight='500px' justifyContent='space-between'
        safeArea p="2" py="0" w="90%" maxW="330">
        <VStack>

          <Heading
            size="lg"
            color="coolGray.800" >
            {TS.t("user_welcome")}
          </Heading>
          <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
            {TS.t("user_require_login")}
          </Heading>

          <VStack space={3} mt="5">
            {/* <VStack> */}


            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input value={email} keyboardType='email-address' onChangeText={setEmail} />
            </FormControl>




            <FormControl>
              <FormControl.Label>{TS.t("user_pass")}</FormControl.Label>
              <Input type="password" value={password} onChangeText={setPassword} />
              {/* <Link _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500"
              }} alignSelf="flex-end" mt="1">
                Olvido su contraseña?
              </Link> */}
            </FormControl>
          </VStack>
          {/* </VStack> */}
        </VStack>

        <VStack mt={10}>

          <Button mt="2"
            isDisabled={!email || !password}
            isLoading={isLoading}
            onPress={() => {
              setIsLoading(true)
              signin(email!, password!)
                .then(() => {
                  setIsLoading(false)
                })
            }}

          >
            {TS.t("user_login")}
          </Button>
          <HStack mt="6" justifyContent="center">
            {/* <Text fontSize="sm" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
              Soy un nuevo usuario.{"    "}
            </Text>
            <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }} href="#">
              Crear cuenta
            </Link> */}
          </HStack>
        </VStack>
      </Box>
      {/* </VStack> */}
      <VStack flex={0.06} />
    </Center>
  )
};