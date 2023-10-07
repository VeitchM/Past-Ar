import { memo, useCallback } from "react";
import { MeasurementLocalDB } from "../../../../features/localDB/types";
import { HStack, Icon, Pressable, Text, VStack } from "native-base";
import { formatDate, formatTime } from "../../../../utils/time";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const ITEM_HEIGHT = 60;


function Item(props: {
    item: MeasurementLocalDB;
    onPress: (item: MeasurementLocalDB) => void;
  }) {
    const { item } = props;
    const onPress = useCallback(()=>props.onPress(item),[item,props.onPress])
    return (
      <Pressable onPress={onPress}>
        <HStack
          style={{
            height: ITEM_HEIGHT,
            width: "100%",
            flex: 1,
            paddingHorizontal: 30,
          }}
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack
            width={100}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {item.sendStatus ? (
              <Icon as={MaterialCommunityIcons} name="upload" size="lg" />
            ) : (
              <HStack />
            )}
            <Text fontWeight={"medium"} fontSize={"xl"}>
              {item.height.toFixed(1)}cm
            </Text>
          </HStack>
          <VStack>
            <Text>{formatDate(item.timestamp)}</Text>
            <Text fontWeight={"medium"}>{formatTime(item.timestamp)}</Text>
          </VStack>
        </HStack>
      </Pressable>
    );
  }
  
  export default memo(Item)