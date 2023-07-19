import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "../localDB/session";
import { setLastSync, setSignIn, setTokens, setUser } from "../store/backendSlice";
import store from "../store/store";
import { onInitSessionRoutine, refreshToken } from "./session";


/** It loads from the localDB to the redux on init the user data and tokens */
export async function onInit() {
    try {

        const userData = await getUserData()
        const tokens = userData?.tokens
        console.log('User data on Init', userData);

        if (tokens && (tokens.refreshExpiresIn! + tokens.timestamp! > Date.now())) {
            store.dispatch(setTokens(userData.tokens))
            store.dispatch(setUser(userData.user))
            store.dispatch(setSignIn(!!userData.signedIn))
            onInitSessionRoutine()

        }

        const lastSync = await AsyncStorage.getItem("lastSync")
        if(lastSync){
            const timestamp = Number(lastSync)
            isNaN(timestamp) || store.dispatch(setLastSync(timestamp))
        }




    }
    catch (e) {
        console.error('Error on Init User', e);

    }

}


