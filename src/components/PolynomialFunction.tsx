import { ScrollView, Text } from "native-base";

export default function PolynomialFunction({
  coeficients,
}: {
  coeficients: number[];
}) {
  return (
    <ScrollView horizontal>
      <Text fontSize="2xl">
        {coeficients.every((c) => !c)
          ? "Calibración incompleta"
          : `${coeficients[0].toFixed(2)}X ${
              coeficients[1] > 0 ? "+" : "-"
            } ${Math.abs(coeficients[1]).toFixed(2)}`}
      </Text>
      {/* {props.coeficients?.map((coeficient, index) => {
                return coeficient != 0 ?
                    <HStack key={index}>
                        {index == 0 || 0 > coeficient ?
                            null
                            :
                            <Text fontSize='2xl'>+</Text>
                        }
                        <Text fontSize='2xl'>
                            {coeficient.toFixed(2)}
                            {index == 0 ? '' : 'X'}
                        </Text>
                        <Text fontSize='sm'>
                            {index <= 1 ? '' : index}
                        </Text >
                    </HStack>
                    :
                    null
            })} */}
    </ScrollView>
  );
}
