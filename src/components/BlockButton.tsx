import { Button, Heading } from "native-base";
import { StyleProp, TextStyle } from "react-native";

export type Props = {
    onPress?: () => void, 
    text?: string,
    height?: number,
    leftIcon ?: JSX.Element,
    rightIcon ?: JSX.Element,
    icon?: JSX.Element,
    textStyle?: StyleProp<TextStyle>
    isDisabled?:boolean
}

export default function BlockButton(props:Props) {

    return (
        <Button isDisabled={props.isDisabled} leftIcon={props.leftIcon} rightIcon={props.rightIcon} onPress={props.onPress} 
        style={{ shadowColor: 'transparent', 
        height: props.height || 70 ,
        alignItems:'center',
        // alignSelf:'center'

        
    }}

         borderRadius={0} variant='outline' borderWidth={0.25} colorScheme='muted'
          >
            {props.icon}
            <Heading   style={props.textStyle}
               // props.textStyle} 
                size='md'>{props.text}</Heading>
                
        </Button>
    )
}
