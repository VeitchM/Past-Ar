import { persistUserData } from "../localDB/user";
import { Tokens, TokensResponse, User, setSignIn, setTokens, setUser } from "../store/backendSlice";
import { addNotification } from "../store/notificationSlice";
import store from "../store/store";
import { mobileAPI } from "./config";
import { getErrorLabel } from "./constants";
import { signout } from "./signout";
import { createPayload } from "./utils";
import jwtDecode from "jwt-decode";






export async function signin(email: string, password: string) {
    return fetch(`${mobileAPI}/auth/login`,
        createPayload('POST',
            { email: email, password: password }
        )).then(async (res) => {
            const resObject = await res.json()
            console.log(resObject);
            if (resObject.code) {
                console.error(resObject.message);
                store.dispatch(addNotification({ title: getErrorLabel(resObject.code), status: 'error' }))

            }
            else {
                signedIn(resObject)
                // store.dispatch()
            }


        })
        .catch(error => {
            console.error(error);

            store.dispatch(addNotification({ title: getErrorLabel('FAILED_CONNECTION'), status: 'error' }))
        })



}


/** It sets the redux with the proper info once the user signin, it also persists the user info and tokens
 * 
 * @params res : it should be a successful server response, not an error response
 * 
*/
function signedIn(res: TokensResponse) {

    const tokens = tokensFromBackendToStore(res)
    const userData = getUserData(tokens.accessToken!)

    store.dispatch(setTokens(tokens))
    store.dispatch(setUser(userData))
    store.dispatch(setSignIn(true))



    persistUserData({ ...tokens, ...userData, signedIn: true })

    console.log('Signed in',new Date());
    

    // getUserDatafromDB().then(res => console.log('From database', res))


    /** TODO should i refresh token on background, or log in each time it the token roots */

    setTimeout(() => {

        refreshToken()

    }, res.expires_in * 800)

}

/** Get user info from the provided token
 * @returns  User info
 */
function getUserData(token: string) {

    //Get locally without authentication, with https it shouldn't be possible to have a MitM attack
    const { id, firstName, lastName, email, roles, groupUid }: User = jwtDecode(token)
    return { id, firstName, lastName, email, roles, groupUid }


}


export function refreshToken() {
    //TODO replace recursion to setInterval, and loged out should unsubscribe from that

    const backendState = store.getState().backend
    console.log('Refresh token sent for refresh token API:');
    console.log(backendState.tokens?.refreshToken);


    if (backendState.signIn) {
        fetch(`${mobileAPI}/auth/refreshToken`,
            createPayload('POST', { refresh_token: '' + backendState.tokens?.refreshToken }))
            .then(async (res) => {
                const resObject = await res.json()
                // console.log('Refresh token from server', resObject);

                //TODO should do this recursive call, which is cut when signin is set to false
                if (store.getState().backend.signIn) {
                    if (!resObject.code) {
                        signedIn(resObject)
                    }
                    else {
                        if (store.getState().backend.tokens?.refreshExpirationTimestamp! < Date.now() ){
                            setTimeout(() => {
                                console.error('Failed refresh Token, retrying');
                                console.log('Tokens' , store.getState().backend.tokens);
                                
    
                                refreshToken()
                            }, 2000);
                        }
                        else{
                            console.error('Refresh token not active');
                            signout()
                            
                        }
                    }
                }
                else{
                    console.log('Loged out');
                    
                }

            })
    }



}

/** It translate the tokens given by the backend to the ones saved on the store */
function tokensFromBackendToStore(serverTokens: TokensResponse): Tokens {

    return {
        refreshToken: serverTokens.refresh_token,
        accessToken: serverTokens.access_token,
        expirationTimestamp: Date.now() + serverTokens.expires_in * 1000,
        refreshExpirationTimestamp: Date.now() + serverTokens.refresh_expires_in * 1000
    }

}