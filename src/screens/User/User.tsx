import LoginScreen from "./LoginScreen"

//TODO ASK TOBIAS for getting UserInfo is only with verify token? Looks alike
//NO ASK HERNAN guardar la contrasena en texto plano en el sql de la aplicacion?
// Hay virus en android?
// en texto plano porque se envia en texto plano en el back
// NO ASK TOBIAS si guardo el refresh token no debo guardar la contrasena, no
// ASk TOBIAS cuanto dura el refresh tokenld

export default function UserScreen(){
    return (<LoginScreen/>)
}