import { extendTheme } from 'native-base';
const customTheme = {
    colors: {
        primary: {
            //300: '#d97706'// 'muted.300'
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
        }
    }
};
const theme = extendTheme(customTheme);

export default theme