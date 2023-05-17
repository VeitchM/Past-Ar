

import { Box,View, useTheme } from 'native-base';
import { ColorType } from 'native-base/lib/typescript/components/types';

import {ColorValue, StyleProp, ViewProps } from 'react-native';



type RingProps = {
    size?: number;
    height?: number;
    borderWidth?: number;
    borderColor?: ColorType;
    children?: any;
    borderRadius?:number;
    style?:StyleProp<ViewProps>
}

 const RoundedContainer = ({borderRadius, size = 200, height, borderWidth = 2, borderColor,style, children = {} }: RingProps) => {
    
    console.log('borderColor ',borderColor);
    
   const  theme = useTheme()
    //borderColor = borderColor || theme.colors.primary 
    borderColor = borderColor || 'muted.300'
    console.log('borderColor2 ',borderColor);

    console.log(borderColor);
    const styleSpread = style ? style : {}
   

    return (
        <View borderColor={borderColor} style={{
            width: size,
            height: height || size,
            borderWidth: borderWidth,
            // borderLeftColor: 'green',
            // borderColor: 'green.300',
            // justifyContent: 'center',
            // alignContent:'center',
            borderRadius: borderRadius || size/2,
            ...styleSpread as Object

        }}>
            {children}
        </View>
    )
}

export default RoundedContainer