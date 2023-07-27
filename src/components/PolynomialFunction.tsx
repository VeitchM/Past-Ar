import { HStack, ScrollView, Text } from "native-base"

export default function PolynomialFunction(props: { coeficients: number[] }) {
    return (
        <ScrollView horizontal>
            {props.coeficients?.map((coeficient, index) => {
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
            })}
        </ScrollView>
    )
}