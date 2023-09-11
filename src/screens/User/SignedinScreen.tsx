import { Box, Center, Heading, VStack, FormControl, Link, Input, Button, HStack, Text, Divider } from "native-base";
import { useTypedSelector } from "../../features/store/storeHooks";
import { synchronize, } from "../../features/backend/synchronize";
import { timePassedString } from "../../utils/time";
import { useEffect, useState } from "react";
import { signout } from "../../features/backend/session";

export default function signedinScreen() {
  const userData = useTypedSelector(state => state.backend.user)
  const lastSync = useTypedSelector(state => state.backend.lastSync)

  const [lastSyncLabel, setLastSyncLabel] = useState('Sin sincronizar')

  const textColor = 'coolGray.500'


  useEffect(() => {
    if (lastSync) {

      setLastSyncLabel(timePassedString(lastSync))
      const interval = setInterval(() => {
        setLastSyncLabel(timePassedString(lastSync))
      }, 20000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [lastSync])



  return (


    <Center w="100%" bg='white' flex={1}>
      <Box flex={0.8} maxHeight='500px'
        justifyContent='space-between'
        safeArea p="2" py="0" w="90%" maxW="330"
      // backgroundColor={'blue.200'}
      >


        <VStack>
          <Heading
            size="lg"
            color={textColor}
          >
            Bienvenido
          </Heading>
          <Heading
            size="2xl"
            color={textColor}
          >
            {userData?.firstName} {userData?.lastName}
          </Heading>
        </VStack>

        <VStack bgColor='warmGray.50' marginX={-5} padding={5} rounded={10}>
          <Text fontSize='lg' color={textColor} marginBottom='-6px'>Email</Text>
          <Text fontSize='2xl' color={textColor} fontWeight='normal'>{userData?.email}</Text>

          <Divider marginY={4} />
          <Text fontSize='lg' color={textColor} marginBottom='-6px'>Roles</Text>
          <Text fontSize='2xl' color={textColor} fontWeight='normal'>{userData?.roles.toString()}</Text>

        </VStack>

        <VStack>
          <Text fontSize='lg' marginBottom='-6px'>Última Sincronización</Text>
          <Text fontSize='2xl' fontWeight='normal'>{lastSyncLabel}</Text>
        </VStack>
        {/* TODO DELETE LATER */}
        <Button
          // TODO show a modal before signing out
          colorScheme='info'
          onPress={() => synchronize(true)}
          marginTop={4} marginBottom={4}
        >
          Sincronizar
        </Button>
        <Button
          // TODO show a modal before signing out
          colorScheme='danger'
          onPress={signout}
        >
          Cerrar sesion
        </Button>


      </Box>

    </Center>
  )
};