import { getUserData } from "../localDB/session";
import { setSignIn, setTokens, setUser } from "../store/backendSlice";
import store from "../store/store";
import { refreshToken } from "./session";


/** It loads from the localDB to the redux on init the user data and tokens */
export async function onInit() {
    try{

        const userData = await getUserData()
        console.log('User data on Init', userData);
        
        if (userData && (userData?.tokens?.refreshExpirationTimestamp! > Date.now())) {
            store.dispatch(setTokens(userData.tokens))
            store.dispatch(setUser(userData.user))
            store.dispatch(setSignIn(!!userData.signedIn))
            refreshToken()
            
        }
    }
    catch(e){
        console.error('Error on Init User',e);
        
    }

}


