

import { View, useTheme } from 'native-base';

import { ColorValue } from 'react-native';



type RingProps = {
    size?: number;
    height?: number;
    borderWidth?: number;
    borderColor?: ColorValue;
    children?: any
}

export const RingCircle = ({ size = 200, height, borderWidth = 4, borderColor, children = {} }: RingProps) => {
    const theme = useTheme();
    //borderColor = borderColor || theme.colors.primary 
    borderColor = borderColor || theme.colors.muted[300]
    console.log(borderColor);

    return (
        <View style={{
            width: size,
            height: height || size,
            borderRadius: size / 2,
            borderWidth: borderWidth,
            borderColor: borderColor,


        }}>
            {children}
        </View>
    )
}