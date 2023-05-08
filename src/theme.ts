import { extendTheme } from 'native-base';
const customTheme = {
    colors: {
        // primary: {
        //     //300: '#d97706'// 'muted.300'
        // },
        buttonColorScheme:{
            50: '#E3F2F9',
            100: '#C5E4F3',
            200: '#A2D4EC',
            300: '#7AC1E4',
            400: '#47A9DA',
            500: '#0088CC',
            600: 'black', // base Color
            700: 'yellow',
            800: 'yellow', // pressed
            900: '#003F5E'


        }
    },
    components: {
        Text:{
            baseStyle:{
                color: 'muted.400'
            }
        },
        Heading:{
            baseStyle:{
                color: 'muted.400',
                alignText:'center'
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
        // Button: {
        //     baseStyle:{
        //         // backgroundColor:'muted.300',
        //         // shadow: 2

        //     }
        // }
    }
};
const theme = extendTheme(customTheme);

export default theme