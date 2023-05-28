import { Box, Center, Heading, VStack, FormControl, Link, Input, Button, HStack, Text } from "native-base";
import { useTypedDispatch } from "../../features/store/storeHooks";
import { addNotification } from "../../features/store/notificationSlice";

export default function LoginScreen() {


const dispatch = useTypedDispatch()

  return (
    <Center w="100%" bg='white' flex={1}>
      {/* <VStack justifyContent=> */}

      <Box flex={0.8} maxHeight='500px' justifyContent='space-between'
        safeArea p="2" py="0" w="90%" maxW="290">
        <VStack>

          <Heading
            size="lg"
            color="coolGray.800" >
            Bienvenido
          </Heading>
          <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
            Ingrese para continuar!
          </Heading>

          <VStack space={3} mt="5">
            {/* <VStack> */}
            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl>
              <FormControl.Label>Contraseña</FormControl.Label>
              <Input type="password" />
              <Link _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500"
              }} alignSelf="flex-end" mt="1">
                Olvido su contraseña?
              </Link>
            </FormControl>
          </VStack>
          {/* </VStack> */}
        </VStack>

        <VStack mt={10}>

          <Button mt="2"
          onPress={()=>{dispatch(addNotification({title:'No se ha podido conectar con el servidor',status:'error'}))}}
          
          >
            Ingresar
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
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
            </Link>
          </HStack>
        </VStack>
      </Box>
      {/* </VStack> */}
      <VStack flex={0.06} />
    </Center>
  )
};