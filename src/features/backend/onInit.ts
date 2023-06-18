import { getUserData } from "../localDB/backend";
import { setSignIn, setTokens, setUser } from "../store/backendSlice";
import store from "../store/store";


/** It loads from the localDB to the redux on init the user data and tokens */
export async function onInit() {
    const userData = await getUserData()
    console.log('User data on Init', userData);

    if (userData && (userData?.tokens?.refreshExpirationTimestamp! > Date.now()) )
    {
    store.dispatch(setTokens(userData.tokens))
        store.dispatch(setUser(userData.user))
        store.dispatch(setSignIn(!!userData.signedIn))
    }
}


