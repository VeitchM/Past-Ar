import { extendTheme } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
export const themeNative = extendTheme({
    colors: {
        primary: {
            "50": "#a4f5c8",
            "100": "#86edb5",
            "200": "#6be3a1",
            "300": "#52d88e",
            "400": "#33d17a",
            "500": "#33bb70",
            "600": "#34a466",
            "700": "#348e5d",
            "800": "#337953",
            "900": "#316548"
        }
        ,
        //     //300: '#d97706'// 'muted.300'
        // },
        buttonColors: {
            50: '#d4d4d8',
            100: '#d4d4d8',
            200: '#d4d4d8',
            300: '#d4d4d8',
            400: '#d4d4d8',
            500: '#d4d4d8',

            600: '#F5F1F1', // base Color

            // 600: '#E9E8E8', // base Color
            700: '#d4d4d8',
            800: '#71717a', // pressed
            // 800: '#E9E8E8', // pressed
            900: '#8E8E93'


        }
    },
    components: {
        Text: {
            baseStyle: {
                color: 'muted.400'
            }
        },
        Heading: {
            baseStyle: {
                color: 'muted.400',
                alignText: 'center'
            }
        },
        Container: {
            baseStyle: {

                // backgroundColor: 'muted.100',
                //colorScheme: 'primary',
                padding: 10,
                margin: 10,
                borderRadius: '3xl',
                shadow: 2
            }
        },
        View: {
            baseStyle: {
                alignItems: 'center', justifyContent: 'center'
            }
        },
        Button: {
            baseStyle: {
                borderRadius: '2xl',
                shadow: 2,
                // colorScheme:'red',
                // color:'black.500'
                // minWidth:200

            },

            defaultProps: {
                // colorScheme: 'buttonColors',
                size: 'lg',
                _text: {
                    // color: 'buttonColors.900',
                    fontWeight: '900',
                    fontSize: 20
                }

            },
            _disabled:{
                variant:'subtle'
            }
        },


        Select: {
            baseStyle: {

                borderRadius: 'lg',
                borderWidth: 0,
                // shadow: 2,
                bg: 'muted.100'
                // bg: 'primary.100'
                // colorScheme:'primary'

            },
            defaultProps: {
                // colorScheme: 'buttonColors',
                fontSize: 'lg',
                placeholderTextColor: 'muted.400',
                color: 'muted.500',
                // color: 'buttonColors.900',
                fontColor: 'white',
                fontWeight: 'bold'


            },
        },

        Input:{
            defaultProps:{
                variant:'filled',
                bg:'muted.100',
                borderRadius:15, 
                size : 'xl' 
            }
        }



    },

    // Button: {
    //     baseStyle:{
    //         // backgroundColor:'muted.300',
    //         // shadow: 2

    //     }
    // }

})





import {DefaultTheme } from '@react-navigation/native';

export const themeNavigation = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: themeNative.colors.primary[500],
  },
};
