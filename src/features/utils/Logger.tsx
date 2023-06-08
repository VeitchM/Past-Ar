import { logger } from "react-native-logs";

var log = logger.createLogger({
    levels: {
        info: 0, warn: 1, error: 2, debug: 3, cinfo: 4
    },
    transportOptions: {
        colors: {
            info: "blueBright",
            warn: "yellowBright",
            error: "redBright",
            debug: "white",
            cinfo: "white"
        },
    },
});
type printable = Object | string | number;
export type colors = ('red' | 'blue' | 'yellow' | 'green' | 'black' | 'white' | 'redBright' | 'blueBright' | 'yellowBright' | 'greenBright')
export type logTypes = ('info' | 'warn' | 'error' | 'debug' | 'cinfo');

function colorLogger(color: colors) {
    return (
        logger.createLogger({
            levels: {
                info: 0, warn: 1, error: 2, debug: 3, cinfo: 4
            },
            transportOptions: {
                colors: {
                    info: "blueBright",
                    warn: "yellowBright",
                    error: "redBright",
                    debug: "white",
                    cinfo: color.toString()
                },
            },
        })
    );
}

export function loga(data: printable,type: logTypes, color?: colors) {
    let s = data.toString();
    switch (type) {
        case 'info': log.info(s); break;
        case 'warn': log.warn(s); break;
        case 'error': log.error(s); break;
        case 'debug': log.debug(s); break;
        case 'cinfo': colorLogger(color!).cinfo(s); break;
        default: break;
    }
}

export function showAlert(title:string, data: printable){
    loga(`>>------STARTOF ${title}-------<<`,'cinfo','redBright');
    loga(data,'cinfo','blueBright');
    loga(`>>-------ENDOF ${title}--------<<`,'cinfo','redBright');
}

export function showXmas(title:string, data: printable){
    loga(`>>------STARTOF ${title}-------<<`,'cinfo','red');
    loga(data,'cinfo','greenBright');
    loga(`>>-------ENDOF ${title}--------<<`,'cinfo','greenBright');
}