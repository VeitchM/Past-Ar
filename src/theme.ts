import { extendTheme } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
const theme = extendTheme({
    colors: {
        // primary: {
        //     //300: '#d97706'// 'muted.300'
        // },
        buttonColors: {
            50: '#d4d4d8',
            100: '#d4d4d8',
            200: '#d4d4d8',
            300: '#d4d4d8',
            400: '#d4d4d8',
            500: '#d4d4d8',
            600: '#E9E8E8', // base Color
            700: '#d4d4d8',
            800: '#71717a', // pressed
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

                backgroundColor: 'muted.100',
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
                colorScheme: 'buttonColors',
                _text: {
                    color: 'buttonColors.900',
                    fontWeight: '900',
                    fontSize: 20
                }

            }
        },


        Select: {
            baseStyle: {

                borderRadius: 'lg',
                borderWidth: 0,
                shadow: 2,
                bg: 'buttonColors.600'

            },
            defaultProps: {
                colorScheme: 'buttonColors',
                fontSize: 'lg',
                color: 'buttonColors.900',
                fontWeight:'bold'
              

            },
        },




    },

    // Button: {
    //     baseStyle:{
    //         // backgroundColor:'muted.300',
    //         // shadow: 2

    //     }
    // }

})

export default theme