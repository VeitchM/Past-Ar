import { memo, useCallback } from "react";
import { MeasurementLocalDB } from "../../../../features/localDB/types";
import { HStack, Icon, Pressable, Text, VStack } from "native-base";
import { formatDate, formatTime } from "../../../../utils/time";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export const ITEM_HEIGHT = 60;

function Item(props: {
  item: MeasurementLocalDB;
  // onPress: (item: MeasurementLocalDB) => void;
  extraData?: SetState<MeasurementLocalDB | undefined>;
}) {
  // const { item } = props;
  const onPress = () => {
    console.log("Pressed");
    console.log("Pressed", props.extraData);

    props.extraData && props.extraData(props.item);
  };
  // const onPress = useCallback(() => props.onPress(item), [item, props.onPress]);
  return (
    <Pressable onPress={onPress}>
      <HStack
        height={ITEM_HEIGHT}
        width={"100%"}
        flex={1}
        paddingX={30}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack
          width={100}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {props.item.sendStatus ? (
            <Icon as={MaterialCommunityIcons} name="upload" size="lg" />
          ) : (
            <HStack />
          )}
          <Text fontWeight={"medium"} fontSize={"xl"}>
            {props.item.height.toFixed(1)}cm
          </Text>
        </HStack>
        <VStack>
          <Text>{formatDate(props.item.timestamp)}</Text>
          <Text fontWeight={"medium"}>{formatTime(props.item.timestamp)}</Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}

// export default memo(Item);
export default Item;
