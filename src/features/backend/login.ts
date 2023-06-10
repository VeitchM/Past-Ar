import { Tokens, TokensResponse, User, setSignIn, setTokens, setUser } from "../store/backendSlice";
import { addNotification } from "../store/notificationSlice";
import store from "../store/store";
import { mobileAPI } from "./config";
import { getErrorLabel } from "./constants";
import { createPayload } from "./utils";
import jwtDecode from "jwt-decode";






export async function login(email: string, password: string) {
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
                logedIn(resObject)
                // store.dispatch()
            }


        })
        .catch(error => {
            console.error(error);

            store.dispatch(addNotification({ title: getErrorLabel('FAILED_CONNECTION'), status: 'error' }))
        })



}


/** It sets the redux with the proper info once the user signin, it also start
 * 
*/
function logedIn(res: TokensResponse) {

    store.dispatch(setTokens(res))
    console.log('Tokens', store.getState().backend.tokens)
    store.dispatch(setUser(getUserInfo(res.access_token!)))
    store.dispatch(setSignIn(true))

    /** TODO should i refresh token on background, or log in each time it the token roots */
    refreshToken()

    setTimeout(() => {

    }, res.expires_in * 500)

}

/** Get user info from the provided token
 * @returns  User info
 */
function getUserInfo(token: string) {
    // Get from server
    // It works but is unnecessary
    // fetch(`${mobileAPI}/auth/verifyToken`,
    //     createPayload('GET')).then(async (res) => {
    //         const resObject = await res.json()
    //         console.log('Returns from server',resObject);

    //     })


    //Get locally without authentication, with https it shouldn't be possible to have a MitM attack
    const { id, firstName, lastName, email, roles, groupUid }: User = jwtDecode(token)
    return { id, firstName, lastName, email, roles, groupUid }


}


function refreshToken() {
    const backendState = store.getState().backend
    console.log('Refresh token sent for refresh token API:');
    console.log(backendState.tokens?.refreshToken );

    
    if (backendState.signIn) {
        fetch(`${mobileAPI}/auth/refreshToken`,
            createPayload('POST', { refresh_token: 'Bearer '+backendState.tokens?.refreshToken }))
            .then(async (res) => {
                const resObject = await res.json()
                console.log('Refresh token from server', resObject);
                //logedIn(resObject)
            })
    }



}