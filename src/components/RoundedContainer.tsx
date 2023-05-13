

import { View, useTheme } from 'native-base';

import { ColorValue, StyleProp, ViewProps } from 'react-native';



type RingProps = {
    size?: number;
    height?: number;
    borderWidth?: number;
    borderColor?: ColorValue;
    children?: any;
    borderRadius?:number;
    style?:StyleProp<ViewProps>
}

 const RoundedContainer = ({borderRadius, size = 200, height, borderWidth = 4, borderColor,style, children = {} }: RingProps) => {
    const theme = useTheme();
    //borderColor = borderColor || theme.colors.primary 
    borderColor = borderColor || theme.colors.muted[300]
    console.log(borderColor);
    const styleSpread = style ? style : {}
   

    return (
        <View style={{
            width: size,
            height: height || size,
            borderWidth: borderWidth,
            borderColor: borderColor,
            borderRadius: borderRadius || size/2,
            ...styleSpread

        }}>
            {children}
        </View>
    )
}

export default RoundedContainer